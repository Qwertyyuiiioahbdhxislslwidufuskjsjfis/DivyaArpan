import crypto from "node:crypto";
import { expect, test, type Page } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { loadEnvConfig } from "@next/env";
import { createSession, hashPassword } from "../app/lib/auth";

loadEnvConfig(process.cwd());

const prisma = new PrismaClient();
const createdBookingIds: string[] = [];
const createdUserIds: number[] = [];
const paymentSecret = process.env.RAZORPAY_KEY_SECRET || "";

function bookingId(label: string) {
  const id = `PAYMENT-TEST-${label}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  createdBookingIds.push(id);
  return id;
}

async function createBooking(overrides: { paymentStatus?: string; paymentId?: string; paymentOrderId?: string } = {}) {
  return prisma.booking.create({
    data: {
      bookingId: bookingId("BOOKING"),
      temple: "Payment Test Temple",
      pooja: "Payment Test Pooja",
      price: "₹501",
      duration: "30 Minutes",
      name: "Payment Test Customer",
      mobile: "9999999999",
      email: "payment-test@divyaarpan.test",
      date: "2099-12-30",
      time: "10:00",
      devotees: 1,
      status: overrides.paymentStatus === "PAID" ? "Confirmed" : "Payment Pending",
      paymentStatus: overrides.paymentStatus || "PENDING",
      paymentId: overrides.paymentId,
      paymentOrderId: overrides.paymentOrderId,
    },
  });
}

async function createOwner() {
  const user = await prisma.user.create({
    data: {
      name: "Payment Test Owner",
      email: `payment-owner-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@divyaarpan.test`,
      phone: `98${Math.floor(10000000 + Math.random() * 89999999)}`,
      passwordHash: await hashPassword("PaymentTestPassword!2026"),
      role: "DEVOTEE",
      devotee: {
        create: {
          name: "Payment Test Owner",
          mobile: `97${Math.floor(10000000 + Math.random() * 89999999)}`,
          email: `payment-devotee-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@divyaarpan.test`,
        },
      },
    },
    include: { devotee: true },
  });
  createdUserIds.push(user.id);
  if (!user.devotee) throw new Error("Payment test devotee was not created.");
  return { user, devotee: user.devotee, session: await createSession(user.id) };
}

async function createAdminSession() {
  const user = await prisma.user.create({
    data: {
      name: "Payment Test Admin",
      email: `payment-admin-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@divyaarpan.test`,
      phone: `96${Math.floor(10000000 + Math.random() * 89999999)}`,
      passwordHash: await hashPassword("PaymentTestPassword!2026"),
      role: "ADMIN",
    },
  });
  createdUserIds.push(user.id);
  return createSession(user.id);
}

function signature(orderId: string, paymentId: string) {
  return crypto.createHmac("sha256", paymentSecret).update(`${orderId}|${paymentId}`).digest("hex");
}

test.afterAll(async () => {
  await prisma.booking.deleteMany({ where: { bookingId: { in: createdBookingIds } } });
  await prisma.authSession.deleteMany({ where: { userId: { in: createdUserIds } } });
  await prisma.devotee.deleteMany({ where: { userId: { in: createdUserIds } } });
  await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
  await prisma.$disconnect();
});

async function addBookingCookie(page: Page, bookingId: string) {
  await page.context().addCookies([{ name: "divyaarpan_guest_booking", value: bookingId, url: "http://127.0.0.1:3000" }]);
}

test("checkout displays the booking amount with one currency symbol", async ({ page }) => {
  const booking = await createBooking();
  await addBookingCookie(page, booking.bookingId);
  await page.goto(`/checkout?bookingId=${booking.bookingId}`);
  await expect(page.getByText("₹501", { exact: true })).toBeVisible();
  await expect(page.getByText("₹₹501", { exact: true })).toHaveCount(0);
});

test("already-paid booking does not create another payment order", async ({ page }) => {
  const booking = await createBooking({ paymentStatus: "PAID", paymentId: "pay_existing", paymentOrderId: "order_existing" });
  await addBookingCookie(page, booking.bookingId);
  const response = await page.request.post("/api/payments/create-order", { data: { bookingId: booking.bookingId, type: "temple" } });
  expect(response.status()).toBe(400);
  expect((await response.json()).error).toContain("already been paid");
});

test("unpaid booking reuses its existing payment order", async ({ page }) => {
  const booking = await createBooking({ paymentOrderId: "order_existing_unpaid" });
  await addBookingCookie(page, booking.bookingId);
  const response = await page.request.post("/api/payments/create-order", { data: { bookingId: booking.bookingId, type: "temple" } });
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.reused).toBeTruthy();
  expect(body.order.id).toBe("order_existing_unpaid");
});

test("payment verification rejects mismatched order and invalid signature", async ({ page }) => {
  const booking = await createBooking({ paymentOrderId: "order_payment_test" });
  await addBookingCookie(page, booking.bookingId);

  const mismatch = await page.request.post("/api/payments/verify", {
    data: { bookingId: booking.bookingId, type: "temple", razorpay_order_id: "order_wrong", razorpay_payment_id: "pay_test", razorpay_signature: "bad" },
  });
  expect(mismatch.status()).toBe(400);
  expect((await mismatch.json()).error).toContain("does not match");

  const invalidSignature = await page.request.post("/api/payments/verify", {
    data: { bookingId: booking.bookingId, type: "temple", razorpay_order_id: "order_payment_test", razorpay_payment_id: "pay_test", razorpay_signature: "bad" },
  });
  expect(invalidSignature.status()).toBe(400);
  expect((await invalidSignature.json()).error).toContain("verification failed");
});

test("repeated valid verification of a paid booking is idempotent", async ({ page }) => {
  const booking = await createBooking({ paymentStatus: "PAID", paymentId: "pay_existing", paymentOrderId: "order_existing" });
  await addBookingCookie(page, booking.bookingId);
  const response = await page.request.post("/api/payments/verify", {
    data: { bookingId: booking.bookingId, type: "temple", razorpay_order_id: "order_existing", razorpay_payment_id: "pay_existing", razorpay_signature: signature("order_existing", "pay_existing") },
  });
  expect(response.ok()).toBeTruthy();
  expect((await response.json()).message).toBe("Payment was already verified.");
  const saved = await prisma.booking.findUniqueOrThrow({ where: { bookingId: booking.bookingId } });
  expect(saved.paymentId).toBe("pay_existing");
  expect(saved.paymentStatus).toBe("PAID");
});

test("unpaid success page does not claim payment confirmation", async ({ page }) => {
  const booking = await createBooking();
  await addBookingCookie(page, booking.bookingId);
  await page.goto(`/success?bookingId=${booking.bookingId}`);
  await expect(page.getByRole("heading", { name: "Your Pooja booking is received" })).toBeVisible();
  await expect(page.getByText("Payment Confirmed", { exact: true })).toHaveCount(0);
});

test("guest cookie can create an order even with an unrelated session", async ({ page }) => {
  const session = await createAdminSession();
  const booking = await createBooking({ paymentOrderId: "order_guest_session" });
  await page.context().addCookies([
    { name: "divyaarpan_session", value: session.sessionId, url: "http://127.0.0.1:3000" },
    { name: "divyaarpan_guest_booking", value: booking.bookingId, url: "http://127.0.0.1:3000" },
  ]);
  const response = await page.request.post("/api/payments/create-order", { data: { bookingId: booking.bookingId, type: "temple" } });
  expect(response.ok()).toBeTruthy();
  expect((await response.json()).order.id).toBe("order_guest_session");
});

test("guest cookie for a different booking is rejected", async ({ page }) => {
  const authorizedBooking = await createBooking({ paymentOrderId: "order_authorized" });
  const otherBooking = await createBooking({ paymentOrderId: "order_other" });
  await addBookingCookie(page, authorizedBooking.bookingId);
  const response = await page.request.post("/api/payments/create-order", { data: { bookingId: otherBooking.bookingId, type: "temple" } });
  expect(response.status()).toBe(404);
});

test("booking ID alone cannot create a payment order", async ({ page }) => {
  const booking = await createBooking({ paymentOrderId: "order_without_cookie" });
  const response = await page.request.post("/api/payments/create-order", { data: { bookingId: booking.bookingId, type: "temple" } });
  expect(response.status()).toBe(404);
});

test("authenticated devotee owner can reuse their payment order", async ({ page }) => {
  const owner = await createOwner();
  const booking = await createBooking({ paymentOrderId: "order_authenticated_owner" });
  await prisma.booking.update({ where: { bookingId: booking.bookingId }, data: { devoteeId: owner.devotee.id } });
  await page.context().addCookies([{ name: "divyaarpan_session", value: owner.session.sessionId, url: "http://127.0.0.1:3000" }]);
  const response = await page.request.post("/api/payments/create-order", { data: { bookingId: booking.bookingId, type: "temple" } });
  expect(response.ok()).toBeTruthy();
  expect((await response.json()).order.id).toBe("order_authenticated_owner");
});
