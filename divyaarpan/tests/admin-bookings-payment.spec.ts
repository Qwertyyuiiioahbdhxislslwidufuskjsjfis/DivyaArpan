import { expect, test, type Page } from "@playwright/test";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const password = "AdminBookingPaymentTest!2026";
const email = `admin-booking-${Date.now()}@divyaarpan.test`;
const createdBookingIds: string[] = [];

async function createBooking(paymentStatus = "PENDING") {
  const bookingId = `TEST-PAYMENT-ADMIN-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  createdBookingIds.push(bookingId);
  return prisma.booking.create({
    data: {
      bookingId,
      temple: "Payment Visibility Temple",
      pooja: "Payment Visibility Pooja",
      price: "₹501",
      duration: "30 Minutes",
      name: "Payment Visibility Customer",
      mobile: "9999999999",
      email: "payment-visibility@divyaarpan.test",
      date: "2099-12-30",
      time: "10:00",
      devotees: 1,
      status: paymentStatus === "PAID" ? "Confirmed" : "Payment Pending",
      paymentStatus,
      paymentOrderId: paymentStatus === "PENDING" ? null : "order_visibility",
      paymentId: paymentStatus === "PENDING" ? null : "pay_visibility",
    },
  });
}

async function login(page: Page) {
  const response = await page.request.post("/api/auth/login", {
    data: { email, password },
  });
  expect(response.ok()).toBeTruthy();
}

test.beforeAll(async () => {
  const { hashPassword } = await import("../app/lib/auth");
  await prisma.user.create({
    data: {
      name: "Admin Booking Payment Test",
      email,
      phone: "9888888888",
      passwordHash: await hashPassword(password),
      role: "ADMIN",
    },
  });
});

test.afterAll(async () => {
  await prisma.booking.deleteMany({ where: { bookingId: { in: createdBookingIds } } });
  await prisma.authSession.deleteMany({ where: { user: { email } } });
  await prisma.user.deleteMany({ where: { email } });
  await prisma.$disconnect();
});

test("pending booking remains visible in Admin with payment details", async ({ page }) => {
  const booking = await createBooking();
  await login(page);
  await page.goto("/admin/bookings");

  const bookingCard = page.locator("div.bg-white.rounded-2xl").filter({ hasText: booking.bookingId });
  await expect(bookingCard).toBeVisible();
  await expect(bookingCard.getByText("Payment Pending", { exact: true }).first()).toBeVisible();
  await expect(bookingCard.getByText("Payment: Pending", { exact: true })).toBeVisible();
  await expect(bookingCard.getByText("Order: Not created", { exact: true })).toBeVisible();
  await expect(bookingCard.getByRole("link", { name: "View Booking" })).toHaveAttribute("href", `/checkout?bookingId=${booking.bookingId}`);
});

test("guest owner can resume an unpaid booking and another cookie cannot", async ({ page }) => {
  const booking = await createBooking();
  await page.context().addCookies([{ name: "divyaarpan_guest_booking", value: booking.bookingId, url: "http://127.0.0.1:3000" }]);
  await page.goto(`/payment?bookingId=${booking.bookingId}`);
  await expect(page.getByRole("heading", { name: "Secure Payment" })).toBeVisible();

  const otherBooking = await createBooking();
  const response = await page.request.get(`/api/bookings/${otherBooking.bookingId}`);
  expect(response.status()).toBe(404);
});

test("invalid payment verification preserves the unpaid booking", async ({ page }) => {
  const booking = await createBooking();
  await page.context().addCookies([{ name: "divyaarpan_guest_booking", value: booking.bookingId, url: "http://127.0.0.1:3000" }]);
  const response = await page.request.post("/api/payments/verify", {
    data: {
      bookingId: booking.bookingId,
      type: "temple",
      razorpay_order_id: "order_missing",
      razorpay_payment_id: "pay_failed",
      razorpay_signature: "invalid",
    },
  });
  expect(response.status()).toBe(400);
  const saved = await prisma.booking.findUniqueOrThrow({ where: { bookingId: booking.bookingId } });
  expect(saved.paymentStatus).toBe("PENDING");
  expect(saved.status).toBe("Payment Pending");
});
