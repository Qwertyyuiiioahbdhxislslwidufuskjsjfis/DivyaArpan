import { expect, test, type Page } from "@playwright/test";
import { createHash, randomBytes } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { createSession, hashPassword } from "../app/lib/auth";
import { findEligiblePandits } from "../lib/matching-engine/filters";
import { dispatchBookingOffers } from "../lib/matching-engine/dispatcher";

const prisma = new PrismaClient();
const password = "PanditTestPassword!2026";
const createdUserIds: number[] = [];
const createdBookingIds: number[] = [];
const createdNotificationIds: number[] = [];

async function createPandit(label: string, options: { verified?: boolean; active?: boolean; availability?: boolean } = {}) {
  const user = await prisma.user.create({
    data: {
      name: `Pandit ${label}`,
      email: `pandit-${label}-${Date.now()}@test.local`,
      phone: `98${Math.floor(10000000 + Math.random() * 89999999)}`,
      passwordHash: await hashPassword(password),
      role: "PANDIT",
      pandit: {
        create: {
          panditCode: `TEST-${label}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
          name: `Pandit ${label}`,
          mobile: `97${Math.floor(10000000 + Math.random() * 89999999)}`,
          email: `pandit-${label}-${Date.now()}@profile.test`,
          city: "Mumbai",
          state: "Maharashtra",
          address: "Test address",
          pincode: "400001",
          verificationStatus: options.verified === false ? "PENDING" : "VERIFIED",
          isActive: options.active !== false,
          isOnline: true,
          languages: { create: { language: "Hindi" } },
          services: { create: { serviceName: "Ganesh Pooja", isActive: true } },
          serviceAreas: { create: { city: "Mumbai", area: "Fort", pincode: "400001" } },
          availability: options.availability ? { create: { dayOfWeek: 2, startTime: "09:00", endTime: "12:00", isAvailable: true } } : undefined,
        },
      },
    },
    include: { pandit: true },
  });
  createdUserIds.push(user.id);
  if (!user.pandit) throw new Error("Pandit fixture failed.");
  return { user, pandit: user.pandit, session: await createSession(user.id) };
}

async function createBooking(panditId?: number, status = "SEARCHING", paymentStatus = "PENDING") {
  const booking = await prisma.panditBooking.create({
    data: {
      bookingId: `TEST-PANDIT-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      service: "Ganesh Pooja", city: "Mumbai", address: "Fort, Mumbai", language: "Hindi",
      date: "2099-12-29", time: "10:00", devoteeName: "Fixture Devotee", mobile: "9876543210",
      panditId, panditName: panditId ? "Assigned Pandit" : null, status: status as never,
      paymentStatus: paymentStatus as never, amount: 150000, samagriRequired: true,
    },
  });
  createdBookingIds.push(booking.id);
  return booking;
}

async function useSession(page: Page, sessionId: string) {
  await page.context().addCookies([{ name: "divyaarpan_session", value: sessionId, url: "http://127.0.0.1:3000" }]);
}

test.afterAll(async () => {
  await prisma.panditNotification.deleteMany({ where: { bookingId: { in: createdBookingIds } } });
  await prisma.panditBookingOffer.deleteMany({ where: { bookingId: { in: createdBookingIds } } });
  await prisma.panditBookingStatusHistory.deleteMany({ where: { bookingId: { in: createdBookingIds } } });
  await prisma.panditBooking.deleteMany({ where: { id: { in: createdBookingIds } } });
  await prisma.authSession.deleteMany({ where: { userId: { in: createdUserIds } } });
  await prisma.loginIdRecoveryToken.deleteMany({ where: { userId: { in: createdUserIds } } });
  await prisma.panditDocument.deleteMany({ where: { pandit: { userId: { in: createdUserIds } } } });
  await prisma.pandit.deleteMany({ where: { userId: { in: createdUserIds } } });
  await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
  await prisma.$disconnect();
});

test("Pandit profile and notifications are session-owned", async ({ page }) => {
  const owner = await createPandit("OWNER");
  const other = await createPandit("OTHER");
  const notification = await prisma.panditNotification.create({ data: { panditId: other.pandit.id, type: "TEST", title: "Other", message: "Private", eventKey: `test-other-${Date.now()}` } });
  createdNotificationIds.push(notification.id);
  await useSession(page, owner.session.sessionId);
  const profile = await page.request.get("/api/pandit/profile");
  expect(profile.ok()).toBeTruthy();
  expect((await profile.json()).pandit.id).toBe(owner.pandit.id);
  const notificationUpdate = await page.request.patch("/api/pandit/notifications", { data: { notificationId: notification.id } });
  expect(notificationUpdate.status()).toBe(404);
  expect((await prisma.panditNotification.findUniqueOrThrow({ where: { id: notification.id } })).isRead).toBeFalsy();
});

test("unauthenticated Pandit APIs are rejected", async ({ page }) => {
  expect((await page.request.get("/api/pandit/profile")).status()).toBe(401);
  expect((await page.request.get("/api/pandit/notifications")).status()).toBe(401);
});

test("legacy KYC labels remain approval-compatible and document views require ownership", async ({ page }) => {
  const pandit = await createPandit("KYC", { verified: false });
  const admin = await prisma.user.create({ data: { name: "Admin", email: `admin-${Date.now()}@test.local`, passwordHash: await hashPassword(password), role: "ADMIN" } });
  createdUserIds.push(admin.id);
  const documentTypes = ["Government Photo ID", "PAN Card", "Address Proof"];
  for (const documentType of documentTypes) await prisma.panditDocument.create({ data: { panditId: pandit.pandit.id, documentType, documentUrl: "private://missing.png" } });
  const adminSession = await createSession(admin.id);
  await useSession(page, adminSession.sessionId);
  expect((await page.request.patch(`/api/pandits/${pandit.pandit.id}/approve`)).status()).toBe(400);
  const documents = await prisma.panditDocument.findMany({ where: { panditId: pandit.pandit.id } });
  for (const document of documents) await page.request.patch(`/api/pandits/${pandit.pandit.id}/documents/${document.id}`, { data: { isVerified: true } });
  expect((await page.request.patch(`/api/pandits/${pandit.pandit.id}/approve`)).status()).toBe(200);
  const outsider = await createPandit("KYCOUT");
  await useSession(page, outsider.session.sessionId);
  expect((await page.request.get(`/api/pandits/${pandit.pandit.id}/documents/${documents[0].id}/view`)).status()).toBe(404);
});

test("offers accept once, reject expiry and block inactive Pandits", async ({ page }) => {
  const pandit = await createPandit("OFFER");
  const booking = await createBooking();
  const offer = await prisma.panditBookingOffer.create({ data: { bookingId: booking.id, panditId: pandit.pandit.id, expiresAt: new Date(Date.now() + 60_000) } });
  await useSession(page, pandit.session.sessionId);
  expect((await page.request.post(`/api/pandit/offers/${offer.id}/accept`)).status()).toBe(200);
  const second = await page.request.post(`/api/pandit/offers/${offer.id}/accept`);
  expect(second.status()).toBeGreaterThanOrEqual(400);
  const expiredBooking = await createBooking();
  const expired = await prisma.panditBookingOffer.create({ data: { bookingId: expiredBooking.id, panditId: pandit.pandit.id, expiresAt: new Date(Date.now() - 1_000) } });
  expect((await page.request.post(`/api/pandit/offers/${expired.id}/accept`)).status()).toBe(409);
  const inactive = await createPandit("INACTIVE", { active: false });
  const inactiveBooking = await createBooking();
  const inactiveOffer = await prisma.panditBookingOffer.create({ data: { bookingId: inactiveBooking.id, panditId: inactive.pandit.id, expiresAt: new Date(Date.now() + 60_000) } });
  await useSession(page, inactive.session.sessionId);
  expect((await page.request.post(`/api/pandit/offers/${inactiveOffer.id}/accept`)).status()).toBe(403);
});

test("lifecycle rejects cross-Pandit and invalid transitions, and records completion time", async ({ page }) => {
  const owner = await createPandit("LIFEOWN");
  const other = await createPandit("LIFEOTH");
  const booking = await createBooking(owner.pandit.id, "CONFIRMED", "PAID");
  await useSession(page, other.session.sessionId);
  expect((await page.request.put(`/api/pandit-bookings/${booking.bookingId}/status`, { data: { status: "COMPLETED" } })).status()).toBe(403);
  await useSession(page, owner.session.sessionId);
  expect((await page.request.put(`/api/pandit-bookings/${booking.bookingId}/status`, { data: { status: "COMPLETED" } })).status()).toBe(409);
  expect((await page.request.put(`/api/pandit-bookings/${booking.bookingId}/status`, { data: { status: "PANDIT_ON_THE_WAY" } })).status()).toBe(200);
  expect((await page.request.put(`/api/pandit-bookings/${booking.bookingId}/status`, { data: { status: "IN_PROGRESS" } })).status()).toBe(200);
  expect((await page.request.put(`/api/pandit-bookings/${booking.bookingId}/status`, { data: { status: "COMPLETED" } })).status()).toBe(200);
  expect((await prisma.panditBooking.findUniqueOrThrow({ where: { id: booking.id } })).completedAt).not.toBeNull();
});

test("matching respects eligibility, location, pincode, schedule, and default availability", async () => {
  const available = await createPandit("MATCHDEFAULT");
  const scheduled = await createPandit("MATCHSCHEDULE", { availability: true });
  const inactive = await createPandit("MATCHINACTIVE", { active: false });
  const matches = await findEligiblePandits({ bookingId: -1, city: "Mumbai", pincode: "400001", service: "Ganesh Pooja", language: "Hindi", bookingType: "SCHEDULED", date: "2099-12-29", time: "10:00" });
  expect(matches.map((pandit) => pandit.id)).toEqual(expect.arrayContaining([available.pandit.id, scheduled.pandit.id]));
  expect(matches.map((pandit) => pandit.id)).not.toContain(inactive.pandit.id);
  const wrongPincode = await findEligiblePandits({ bookingId: -1, city: "Mumbai", pincode: "400099", service: "Ganesh Pooja", language: "Hindi", bookingType: "SCHEDULED", date: "2099-12-29", time: "10:00" });
  expect(wrongPincode.map((pandit) => pandit.id)).not.toContain(available.pandit.id);
  const outsideSchedule = await findEligiblePandits({ bookingId: -1, city: "Mumbai", pincode: "400001", service: "Ganesh Pooja", language: "Hindi", bookingType: "SCHEDULED", date: "2099-12-29", time: "14:00" });
  expect(outsideSchedule.map((pandit) => pandit.id)).not.toContain(scheduled.pandit.id);
});

test("failed payment stays retryable and notifications are idempotent", async ({ page }) => {
  const pandit = await createPandit("PAYMENT");
  const booking = await createBooking(pandit.pandit.id, "AWAITING_PAYMENT");
  const customer = await prisma.user.create({ data: { name: "Customer", email: `customer-${Date.now()}@test.local`, passwordHash: await hashPassword(password), role: "DEVOTEE", devotee: { create: { name: "Customer", mobile: `96${Math.floor(10000000 + Math.random() * 89999999)}` } } } });
  createdUserIds.push(customer.id);
  const devotee = await prisma.devotee.findUniqueOrThrow({ where: { userId: customer.id } });
  await prisma.panditBooking.update({ where: { id: booking.id }, data: { devoteeId: devotee.id } });
  const customerSession = await createSession(customer.id);
  await useSession(page, customerSession.sessionId);
  expect((await page.request.post("/api/payments/failed", { data: { bookingId: booking.bookingId } })).ok()).toBeTruthy();
  const saved = await prisma.panditBooking.findUniqueOrThrow({ where: { id: booking.id } });
  expect(saved.paymentStatus).toBe("FAILED"); expect(saved.status).toBe("AWAITING_PAYMENT");
  await dispatchBookingOffers(booking.id, [pandit.pandit as never]);
  await dispatchBookingOffers(booking.id, [pandit.pandit as never]);
  expect(await prisma.panditNotification.count({ where: { panditId: pandit.pandit.id, bookingId: booking.id, type: "BOOKING_OFFER" } })).toBeLessThanOrEqual(1);
});

test("login-ID recovery is generic and stores no raw token", async ({ page }) => {
  const pandit = await createPandit("RECOVERY");
  const unknown = await page.request.post("/api/auth/forgot-login-id", { data: { identifier: "unknown@test.local" } });
  const known = await page.request.post("/api/auth/forgot-login-id", { data: { identifier: pandit.user.email } });
  expect(await known.json()).toEqual(await unknown.json());
  const body = await (await page.request.post("/api/auth/forgot-login-id", { data: { identifier: pandit.user.email } })).json();
  expect(JSON.stringify(body)).not.toContain("token"); expect(JSON.stringify(body)).not.toContain("TEST-");
  const tokens = await prisma.loginIdRecoveryToken.findMany({ where: { userId: pandit.user.id } });
  expect(tokens.length).toBeGreaterThan(0); expect(tokens.every((token) => token.tokenHash.length === 64)).toBeTruthy();
});

test("Pandit profile updates are session-owned and availability is persisted", async ({ page }) => {
  const owner = await createPandit("PROFILE");
  const other = await createPandit("PROFILEOTHER");
  await useSession(page, owner.session.sessionId);
  const response = await page.request.patch("/api/pandit/profile", {
    data: {
      panditId: other.pandit.id,
      name: "Updated Profile",
      mobile: owner.pandit.mobile,
      address: "Updated address",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      experienceYears: 12,
      bio: "Updated profile bio",
      languages: ["Hindi", "Marathi"],
      services: ["Ganesh Pooja"],
      serviceAreas: [{ city: "Mumbai", area: "Bandra", pincode: "400050", serviceRadiusKm: 15 }],
      availability: [{ dayOfWeek: 1, startTime: "09:00", endTime: "17:00", isAvailable: true }],
    },
  });
  expect(response.ok()).toBeTruthy();
  const saved = await prisma.pandit.findUniqueOrThrow({ where: { id: owner.pandit.id }, include: { availability: true, serviceAreas: true } });
  expect(saved.name).toBe("Updated Profile");
  expect(saved.serviceAreas[0].city).toBe("Mumbai");
  expect(saved.availability[0].dayOfWeek).toBe(1);
  expect((await prisma.pandit.findUniqueOrThrow({ where: { id: other.pandit.id } })).name).toBe("Pandit PROFILEOTHER");
});

test("Pandit can reject an offer only with a reason", async ({ page }) => {
  const pandit = await createPandit("REJECT");
  const booking = await createBooking();
  const offer = await prisma.panditBookingOffer.create({ data: { bookingId: booking.id, panditId: pandit.pandit.id, expiresAt: new Date(Date.now() + 60_000) } });
  await useSession(page, pandit.session.sessionId);
  expect((await page.request.post(`/api/pandit-bookings/offers/${offer.id}/reject`, { data: { reason: " " } })).status()).toBe(400);
  expect((await page.request.post(`/api/pandit-bookings/offers/${offer.id}/reject`, { data: { reason: "Not available for this time" } })).ok()).toBeTruthy();
  const saved = await prisma.panditBookingOffer.findUniqueOrThrow({ where: { id: offer.id } });
  expect(saved.status).toBe("DECLINED");
  expect(saved.rejectionReason).toBe("Not available for this time");
});

test("competing Pandits have only one successful acceptance", async ({ browser }) => {
  const first = await createPandit("RACE1");
  const second = await createPandit("RACE2");
  const booking = await createBooking();
  const firstOffer = await prisma.panditBookingOffer.create({ data: { bookingId: booking.id, panditId: first.pandit.id, expiresAt: new Date(Date.now() + 60_000) } });
  const secondOffer = await prisma.panditBookingOffer.create({ data: { bookingId: booking.id, panditId: second.pandit.id, expiresAt: new Date(Date.now() + 60_000) } });
  const firstPage = await browser.newPage();
  const secondPage = await browser.newPage();
  await useSession(firstPage, first.session.sessionId);
  await useSession(secondPage, second.session.sessionId);
  const results = await Promise.all([
    firstPage.request.post(`/api/pandit/offers/${firstOffer.id}/accept`),
    secondPage.request.post(`/api/pandit/offers/${secondOffer.id}/accept`),
  ]);
  expect(results.filter((result) => result.ok())).toHaveLength(1);
  const saved = await prisma.panditBooking.findUniqueOrThrow({ where: { id: booking.id } });
  expect([first.pandit.id, second.pandit.id]).toContain(saved.panditId);
  await firstPage.close();
  await secondPage.close();
});

test("cancelled booking cannot be progressed by its assigned Pandit", async ({ page }) => {
  const pandit = await createPandit("CANCELLED");
  const booking = await createBooking(pandit.pandit.id, "CANCELLED", "PENDING");
  await useSession(page, pandit.session.sessionId);
  expect((await page.request.put(`/api/pandit-bookings/${booking.bookingId}/status`, { data: { status: "COMPLETED" } })).status()).toBe(409);
});

test("login status handling preserves pending review and blocks suspended accounts", async ({ page }) => {
  const pending = await createPandit("PENDINGLOGIN", { verified: false });
  const pendingLogin = await page.request.post("/api/auth/login", { data: { loginId: pending.user.email, password } });
  expect(pendingLogin.status()).toBe(403);
  expect((await pendingLogin.json()).pendingApproval).toBeTruthy();
  const suspended = await createPandit("SUSPENDEDLOGIN");
  await prisma.pandit.update({ where: { id: suspended.pandit.id }, data: { verificationStatus: "SUSPENDED" } });
  const suspendedLogin = await page.request.post("/api/auth/login", { data: { loginId: suspended.user.email, password } });
  expect(suspendedLogin.status()).toBe(403);
  expect((await suspendedLogin.json()).error).toBe("Invalid Login ID or password.");
});

test("recovery throttling remains generic and does not expose secrets", async ({ page }) => {
  const pandit = await createPandit("THROTTLE");
  const before = await prisma.loginIdRecoveryToken.count({ where: { userId: pandit.user.id } });
  const responses = [];
  for (let attempt = 0; attempt < 6; attempt += 1) {
    responses.push(await page.request.post("/api/auth/forgot-login-id", { headers: { "x-forwarded-for": "198.51.100.42" }, data: { identifier: pandit.user.email } }));
  }
  for (const response of responses) {
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toEqual({ success: true, message: "If an account matches the provided information, recovery instructions will be sent." });
  }
  const after = await prisma.loginIdRecoveryToken.count({ where: { userId: pandit.user.id } });
  expect(after - before).toBeLessThanOrEqual(5);
});

test("protected Pandit portal smoke routes load", async ({ page }) => {
  const pandit = await createPandit("SMOKE");
  await useSession(page, pandit.session.sessionId);
  for (const route of ["/pandit/dashboard", "/pandit/profile", "/pandit/notifications", "/pandit/bookings"]) {
    const response = await page.goto(route, { waitUntil: "commit" });
    expect(response?.status(), `${route} should load`).toBeLessThan(400);
    await expect(page.locator("body")).toBeVisible();
  }
});

test("Pandit registration creates a pending account and secure canonical KYC upload", async ({ page }) => {
  const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const email = `registration-${suffix}@test.local`;
  const mobile = `95${String(Math.floor(10000000 + Math.random() * 89999999))}`;
  const response = await page.request.post("/api/auth/pandit-register", {
    data: {
      name: "Registration Fixture",
      email,
      mobile,
      password,
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      address: "Registration address",
      pincode: "400001",
      experienceYears: 5,
      languages: ["Hindi"],
      services: ["Ganesh Pooja"],
      serviceAreas: [{ city: "Mumbai", area: "Fort", pincode: "400001", serviceRadiusKm: 10 }],
      documents: [],
    },
  });
  expect(response.status()).toBe(201);
  const registeredUser = await prisma.user.findUniqueOrThrow({ where: { email }, include: { pandit: true } });
  createdUserIds.push(registeredUser.id);
  expect(registeredUser.pandit?.verificationStatus).toBe("PENDING");
  const session = await createSession(registeredUser.id);
  await useSession(page, session.sessionId);
  const upload = await page.request.post("/api/pandit/documents/upload", {
    multipart: {
      file: { name: "id.png", mimeType: "image/png", buffer: Buffer.from("fixture") },
      documentType: "Government Photo ID",
      documentNumber: "ID-123",
    },
  });
  expect(upload.status()).toBe(201);
  const document = await prisma.panditDocument.findFirstOrThrow({ where: { panditId: registeredUser.pandit!.id } });
  expect(document.documentType).toBe("GOVERNMENT_ID");
  expect(document.documentUrl.startsWith("private://")).toBeTruthy();
  const replacement = await page.request.post("/api/pandit/documents/upload", {
    multipart: {
      file: { name: "id-2.png", mimeType: "image/png", buffer: Buffer.from("fixture-2") },
      documentType: "GOVERNMENT_ID",
      documentNumber: "ID-456",
    },
  });
  expect(replacement.status()).toBe(201);
  expect(await prisma.panditDocument.count({ where: { panditId: registeredUser.pandit!.id, documentType: "GOVERNMENT_ID" } })).toBe(1);
});

test("password reset tokens are one-time and expired tokens are rejected", async ({ page }) => {
  const pandit = await createPandit("RESET");
  const rawToken = randomBytes(32).toString("hex");
  await prisma.passwordResetToken.create({ data: { userId: pandit.user.id, tokenHash: createHash("sha256").update(rawToken).digest("hex"), expiresAt: new Date(Date.now() + 60_000) } });
  const reset = await page.request.post("/api/auth/reset-password", { data: { token: rawToken, password: "NewPanditPassword!2026" } });
  expect(reset.ok()).toBeTruthy();
  expect((await page.request.post("/api/auth/reset-password", { data: { token: rawToken, password: "AnotherPassword!2026" } })).status()).toBe(400);
  const expiredToken = randomBytes(32).toString("hex");
  await prisma.passwordResetToken.create({ data: { userId: pandit.user.id, tokenHash: createHash("sha256").update(expiredToken).digest("hex"), expiresAt: new Date(Date.now() - 60_000) } });
  expect((await page.request.post("/api/auth/reset-password", { data: { token: expiredToken, password: "AnotherPassword!2026" } })).status()).toBe(400);
});

test("mobile protected Pandit routes remain usable", async ({ page }) => {
  const pandit = await createPandit("MOBILE");
  await useSession(page, pandit.session.sessionId);
  await page.setViewportSize({ width: 375, height: 812 });
  for (const route of ["/pandit/dashboard", "/pandit/profile", "/pandit/notifications", "/pandit/bookings"]) {
    const response = await page.goto(route, { waitUntil: "commit" });
    expect(response?.status(), `${route} should load on mobile`).toBeLessThan(400);
    await expect(page.locator("body")).toBeVisible();
  }
});
