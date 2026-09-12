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
