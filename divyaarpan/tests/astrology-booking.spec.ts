import crypto from "node:crypto";
import { expect, test, type Page } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../app/lib/auth";

const prisma = new PrismaClient();
const password = "DivyaArpanTestPassword!2026";

async function createDevotee(suffix: string) {
  const email = `astrology-${suffix}@divyaarpan.test`;
  const user = await prisma.user.create({
    data: {
      name: `Astrology Devotee ${suffix}`,
      email,
      phone: `910000${suffix.padStart(4, "0")}`,
      passwordHash: await hashPassword(password),
      role: "DEVOTEE",
      devotee: {
        create: {
          name: `Astrology Devotee ${suffix}`,
          mobile: `910000${suffix.padStart(4, "0")}`,
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

async function login(page: Page, email: string) {
  const response = await page.request.post("/api/auth/login", {
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({ email, password }),
  });
  expect(response.ok()).toBeTruthy();
}

function bookingPayload() {
  return {
    serviceCode: "CAREER",
    consultationMode: "VIDEO_CALL",
    name: "Astrology Test Devotee",
    email: `booking-${Date.now()}@divyaarpan.test`,
    mobile: "+919876543210",
    birthDate: "1992-03-11",
    birthTime: "07:25",
    birthPlace: "Pune, Maharashtra",
    preferredDate: "2099-12-30",
    preferredTime: "10:30",
    question: "I need detailed guidance for career growth, upcoming transitions, and remedies.",
  };
}

function paymentSignature(orderId: string, paymentId: string) {
  return crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
}

async function createPersistedBooking(devoteeId: number, overrides: { amount?: number; paymentStatus?: string; paymentId?: string; paymentOrderId?: string } = {}) {
  return prisma.astrologyBooking.create({
    data: {
      bookingId: `DA-AST-${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 900 + 100)}`,
      service: "Career & Business Guidance",
      consultationMode: "PHONE_CALL",
      name: "Astrology Fixture Customer",
      mobile: "+919000000001",
      email: `fixture-${Date.now()}@divyaarpan.test`,
      birthDate: "1990-01-01",
      birthTime: "08:00",
      birthPlace: "Delhi",
      preferredDate: "2099-11-20",
      preferredTime: "09:45",
      question: "Need guidance on career direction and upcoming professional decisions.",
      amount: overrides.amount ?? 150100,
      paymentStatus: overrides.paymentStatus ?? "PENDING",
      paymentId: overrides.paymentId,
      paymentOrderId: overrides.paymentOrderId,
      status: overrides.paymentStatus === "PAID" ? "Confirmed" : "Payment Pending",
      devoteeId,
    },
  });
}

test.afterAll(async () => {
  await prisma.authSession.deleteMany({
    where: { user: { email: { endsWith: "@divyaarpan.test" } } },
  });
  await prisma.astrologyBooking.deleteMany({
    where: { email: { endsWith: "@divyaarpan.test" } },
  });
  await prisma.devotee.deleteMany({
    where: { email: { endsWith: "@divyaarpan.test" } },
  });
  await prisma.user.deleteMany({
    where: { email: { endsWith: "@divyaarpan.test" } },
  });
  await prisma.$disconnect();
});

test("unauthenticated users are blocked from astrology booking creation", async ({ page }) => {
  const response = await page.request.post("/api/astrology-bookings", {
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify(bookingPayload()),
  });

  expect(response.status()).toBe(401);
});

test("devotee can create and view own astrology booking", async ({ page }) => {
  const devotee = await createDevotee("2001");
  await login(page, devotee.user.email);

  const createResponse = await page.request.post("/api/astrology-bookings", {
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify(bookingPayload()),
  });

  expect(createResponse.status()).toBe(201);
  const createBody = await createResponse.json();
  expect(createBody.success).toBeTruthy();

  const bookingId: string = createBody.booking.bookingId;
  const dbBooking = await prisma.astrologyBooking.findUnique({ where: { bookingId } });
  expect(dbBooking).not.toBeNull();
  expect(dbBooking?.service).toBe("Career & Business Guidance");

  const ownBookingResponse = await page.request.get(`/api/astrology-bookings/${bookingId}`);
  expect(ownBookingResponse.ok()).toBeTruthy();

  const myBookingsResponse = await page.request.get("/api/my-bookings");
  expect(myBookingsResponse.ok()).toBeTruthy();
  const myBookings = await myBookingsResponse.json();
  const inMyList = (myBookings.bookings.astrology as Array<{ bookingId: string }>).some((booking) => booking.bookingId === bookingId);
  expect(inMyList).toBeTruthy();
});

test("devotee cannot fetch another devotee's astrology booking", async ({ page }) => {
  const owner = await createDevotee("2002");
  const other = await createDevotee("2003");

  const created = await prisma.astrologyBooking.create({
    data: {
      bookingId: `DA-AST-${Date.now().toString().slice(-8)}999`,
      service: "Career & Business Guidance",
      consultationMode: "PHONE_CALL",
      name: "Other Devotee",
      mobile: "+919000000001",
      email: "other-astrology@divyaarpan.test",
      birthDate: "1990-01-01",
      birthTime: "08:00",
      birthPlace: "Delhi",
      preferredDate: "2099-11-20",
      preferredTime: "09:45",
      question: "Need guidance on relationship compatibility and next year planning.",
      amount: 210000,
      devoteeId: other.devotee.id,
    },
  });

  await login(page, owner.user.email);
  const response = await page.request.get(`/api/astrology-bookings/${created.bookingId}`);
  expect(response.status()).toBe(404);
});

test("unauthenticated visitors see astrology booking login gate", async ({ page }) => {
  await page.goto("/astrology/booking");
  await expect(page.getByRole("heading", { name: "Sign in to book astrology consultation" })).toBeVisible();
});

test("Astrology API rejects malformed and past preferred dates", async ({ page }) => {
  const devotee = await createDevotee("2004");
  await login(page, devotee.user.email);

  for (const preferredDate of ["2099-02-30", "2020-01-01"]) {
    const response = await page.request.post("/api/astrology-bookings", {
      headers: { "Content-Type": "application/json" },
      data: { ...bookingPayload(), preferredDate },
    });
    expect(response.status()).toBe(400);
  }
});

test("Astrology success page does not reveal an unpaid booking", async ({ page }) => {
  const devotee = await createDevotee("2005");
  await login(page, devotee.user.email);
  const booking = await createPersistedBooking(devotee.devotee.id);

  await page.goto(`/astrology/payment/success?bookingId=${booking.bookingId}`);
  await expect(page.getByText("Consultation payment is not confirmed")).toBeVisible();
  await expect(page.getByText(booking.bookingId)).toHaveCount(0);
});

test("Astrology payment rejects an invalid persisted amount", async ({ page }) => {
  const devotee = await createDevotee("2006");
  await login(page, devotee.user.email);
  const booking = await createPersistedBooking(devotee.devotee.id, { amount: 0 });

  const response = await page.request.post("/api/payments/create-order", {
    data: { type: "astrology", bookingId: booking.bookingId },
  });
  expect(response.status()).toBe(400);
  expect((await response.json()).error).toContain("Invalid astrology booking amount");
});

test("Astrology already-paid verification is idempotent and cannot be replaced", async ({ page }) => {
  const devotee = await createDevotee("2007");
  await login(page, devotee.user.email);
  const booking = await createPersistedBooking(devotee.devotee.id, {
    paymentStatus: "PAID",
    paymentId: "pay_astrology_existing",
    paymentOrderId: "order_astrology_existing",
  });

  const repeated = await page.request.post("/api/payments/verify", {
    data: {
      type: "astrology",
      bookingId: booking.bookingId,
      razorpay_order_id: "order_astrology_existing",
      razorpay_payment_id: "pay_astrology_existing",
      razorpay_signature: paymentSignature("order_astrology_existing", "pay_astrology_existing"),
    },
  });
  expect(repeated.ok()).toBeTruthy();
  expect((await repeated.json()).message).toBe("Payment was already verified.");

  const replacement = await page.request.post("/api/payments/verify", {
    data: {
      type: "astrology",
      bookingId: booking.bookingId,
      razorpay_order_id: "order_astrology_existing",
      razorpay_payment_id: "pay_astrology_replacement",
      razorpay_signature: paymentSignature("order_astrology_existing", "pay_astrology_replacement"),
    },
  });
  expect(replacement.status()).toBe(409);
});
