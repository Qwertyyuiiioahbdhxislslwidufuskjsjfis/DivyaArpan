import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../app/lib/auth";

const prisma = new PrismaClient();
const password = "DivyaArpanTestPassword!2026";
const createdBookingIds = new Set<string>();

function futureBookingDate(days = 7) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

async function createDevotee(suffix: string) {
  const email = `devotee-${suffix}@divyaarpan.test`;
  const user = await prisma.user.create({
    data: {
      name: `Test Devotee ${suffix}`,
      email,
      phone: `900000${suffix.padStart(4, "0")}`,
      passwordHash: await hashPassword(password),
      role: "DEVOTEE",
      devotee: {
        create: {
          name: `Test Devotee ${suffix}`,
          mobile: `900000${suffix.padStart(4, "0")}`,
          email,
          city: "Mumbai",
          state: "Maharashtra",
        },
      },
    },
    include: { devotee: true },
  });

  if (!user.devotee) throw new Error("Test devotee profile was not created.");
  return { user, devotee: user.devotee };
}

async function createTempleBooking(devoteeId: number, bookingId: string) {
  const booking = await prisma.booking.create({
    data: {
      bookingId,
      devoteeId,
      temple: "Test Temple",
      pooja: "Test Pooja",
      price: "₹501",
      duration: "30 Minutes",
      name: "Test Devotee",
      mobile: "9000000001",
      email: "test@example.com",
      date: futureBookingDate(),
      time: "10:00",
      devotees: 1,
      sankalp: "Test sankalp",
      status: "Payment Pending",
    },
  });
  createdBookingIds.add(booking.bookingId);
  return booking;
}

async function createFutureTempleBooking(devoteeId: number, bookingId: string) {
  const booking = await prisma.booking.create({
    data: {
      bookingId,
      devoteeId,
      temple: "Future Test Temple",
      pooja: "Future Test Pooja",
      price: "₹501",
      duration: "30 Minutes",
      name: "Test Devotee",
      mobile: "9000000001",
      email: "test@example.com",
      date: "2099-12-31",
      time: "10:00",
      devotees: 1,
      status: "Payment Pending",
    },
  });
  createdBookingIds.add(booking.bookingId);
  return booking;
}

async function login(page: Page, email: string) {
  const response = await page.request.post("/api/auth/login", {
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({ email, password }),
  });
  expect(response.ok()).toBeTruthy();
}

test.afterAll(async () => {
  await prisma.authSession.deleteMany({
    where: { user: { email: { endsWith: "@divyaarpan.test" } } },
  });
  await prisma.booking.deleteMany({ where: { bookingId: { in: [...createdBookingIds] } } });
  await prisma.panditBooking.deleteMany({
    where: { bookingId: { startsWith: "TEST-DEVOTEE-" } },
  });
  await prisma.devotee.deleteMany({
    where: { email: { endsWith: "@divyaarpan.test" } },
  });
  await prisma.user.deleteMany({
    where: { email: { endsWith: "@divyaarpan.test" } },
  });
  await prisma.pooja.deleteMany({
    where: { name: { startsWith: "Security Test Pooja" } },
  });
  await prisma.temple.deleteMany({
    where: { slug: { startsWith: "security-test-temple-" } },
  });
  await prisma.$disconnect();
});

test("logged-in devotee sees only their database bookings and account", async ({ page }) => {
  const owner = await createDevotee("1001");
  await createTempleBooking(owner.devotee.id, "TEST-DEVOTEE-OWNED");

  await login(page, owner.user.email);
  await page.goto("/my-bookings");

  await expect(page.getByRole("heading", { name: "My Bookings" })).toBeVisible({ timeout: 30000 });
  await expect(page.getByText("Test Devotee 1001").first()).toBeVisible();
  await expect(page.getByText("TEST-DEVOTEE-OWNED")).toBeVisible();
  await expect(page.getByText("Test Temple")).toBeVisible();
});

test("devotee with no bookings sees the empty state", async ({ page }) => {
  const devotee = await createDevotee("1002");

  await login(page, devotee.user.email);
  await page.goto("/my-bookings");

  await expect(page.getByRole("heading", { name: "No Bookings Yet" })).toBeVisible();
});

test("devotee cannot access another devotee booking", async ({ page }) => {
  const owner = await createDevotee("1003");
  const other = await createDevotee("1004");
  const booking = await createTempleBooking(other.devotee.id, "TEST-DEVOTEE-PRIVATE");

  await login(page, owner.user.email);
  const response = await page.request.get(`/api/bookings/${booking.bookingId}`);

  expect(response.status()).toBe(404);
});

test("unauthenticated user cannot access database-backed booking history", async ({ page }) => {
  const response = await page.request.get("/api/my-bookings");
  expect(response.status()).toBe(401);

  await page.goto("/my-bookings");
  await expect(page.getByRole("heading", { name: "Sign in to view your bookings" })).toBeVisible();
});

test("devotee can reschedule and cancel their future temple booking", async ({ page }) => {
  const devotee = await createDevotee("1005");
  const booking = await createFutureTempleBooking(devotee.devotee.id, "TEST-DEVOTEE-MANAGE");

  await login(page, devotee.user.email);
  const reschedule = await page.request.patch(`/api/bookings/${booking.bookingId}`, {
    data: { action: "reschedule", date: "2099-12-30", time: "14:30" },
  });
  expect(reschedule.ok()).toBeTruthy();
  expect((await reschedule.json()).booking.date).toBe("2099-12-30");

  const cancel = await page.request.patch(`/api/bookings/${booking.bookingId}`, {
    data: { action: "cancel" },
  });
  expect(cancel.ok()).toBeTruthy();
  expect((await cancel.json()).booking.status).toBe("Cancelled");
});

test("booking API ignores client price and booking ID and uses the database catalog", async ({ page }) => {
  const owner = await createDevotee("1006");
  const temple = await prisma.temple.create({
    data: {
      slug: `security-test-temple-${Date.now()}`,
      name: "Security Test Temple",
      city: "Mumbai",
      state: "Maharashtra",
      address: "Security Test Address",
      description: "Security test temple",
      openingTime: "05:00 AM",
      closingTime: "10:00 PM",
      mapUrl: "https://maps.example.test/security",
      featuredImage: "/images/temples/test.jpg",
      poojas: {
        create: {
          name: "Security Test Pooja",
          description: "Security test pooja",
          duration: "45 Minutes",
          price: "1501",
          image: "",
          isActive: true,
        },
      },
    },
    include: { poojas: true },
  });
  const pooja = temple?.poojas[0];
  if (!temple || !pooja) throw new Error("Test requires an active temple pooja.");

  await login(page, owner.user.email);
  const response = await page.request.post("/api/bookings", {
    data: {
      bookingId: "CLIENT-CONTROLLED-ID",
      templeId: temple.id,
      poojaId: pooja.id,
      price: "₹1",
      duration: "1 minute",
      temple: "Fake Temple",
      pooja: "Fake Pooja",
      name: owner.devotee.name,
      mobile: owner.devotee.mobile,
      email: owner.user.email,
      date: "2099-12-30",
      time: "14:30",
      devotees: "1",
    },
  });

  expect(response.status()).toBe(201);
  const body = await response.json();
  createdBookingIds.add(body.booking.bookingId);
  expect(body.booking.bookingId).not.toBe("CLIENT-CONTROLLED-ID");
  expect(body.booking.temple).toBe(temple.name);
  expect(body.booking.pooja).toBe(pooja.name);
  expect(body.booking.price).toBe(`₹${pooja.price}`);
  expect(body.booking.duration).toBe(pooja.duration);
});

test("devotee cannot create a payment order for another devotee's temple booking", async ({ page }) => {
  const owner = await createDevotee("1007");
  const other = await createDevotee("1008");
  const booking = await createTempleBooking(other.devotee.id, "TEST-DEVOTEE-PAYMENT-OWNER");

  await login(page, owner.user.email);
  const response = await page.request.post("/api/payments/create-order", {
    data: { bookingId: booking.bookingId, type: "temple" },
  });

  expect(response.status()).toBe(404);
});
