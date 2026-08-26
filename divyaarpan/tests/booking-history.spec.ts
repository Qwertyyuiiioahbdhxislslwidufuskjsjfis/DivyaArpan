import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../app/lib/auth";

const prisma = new PrismaClient();
const password = "DivyaArpanTestPassword!2026";

async function createDevotee(suffix: string) {
  const email = `history-${suffix}@divyaarpan.test`;
  const mobile = `911111${suffix.padStart(4, "0")}`;

  const user = await prisma.user.create({
    data: {
      name: `History Devotee ${suffix}`,
      email,
      phone: mobile,
      passwordHash: await hashPassword(password),
      role: "DEVOTEE",
      devotee: {
        create: {
          name: `History Devotee ${suffix}`,
          mobile,
          email,
          city: "Mumbai",
          state: "Maharashtra",
        },
      },
    },
    include: { devotee: true },
  });

  if (!user.devotee) throw new Error("Devotee profile was not created.");
  return { user, devotee: user.devotee };
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
  await prisma.booking.deleteMany({
    where: { bookingId: { startsWith: "TEST-HISTORY-" } },
  });
  await prisma.devotee.deleteMany({
    where: { email: { endsWith: "@divyaarpan.test" } },
  });
  await prisma.user.deleteMany({
    where: { email: { endsWith: "@divyaarpan.test" } },
  });
  await prisma.$disconnect();
});

test("customer booking shows persisted status history entries", async ({ page }) => {
  const owner = await createDevotee("2001");
  const bookingId = `TEST-HISTORY-${Date.now()}`;

  await login(page, owner.user.email);

  const createBooking = await page.request.post("/api/bookings", {
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({
      bookingId,
      temple: "History Temple",
      pooja: "History Pooja",
      poojaMode: "DEVOTEE_PRESENT",
      price: "₹501",
      duration: "30 Minutes",
      name: owner.user.name,
      mobile: owner.devotee.mobile,
      email: owner.user.email,
      date: "2099-10-11",
      time: "11:00",
      devotees: "1",
      sankalp: "History test booking",
    }),
  });
  expect(createBooking.ok()).toBeTruthy();

  const cancelBooking = await page.request.patch(`/api/bookings/${bookingId}`, {
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({ action: "cancel" }),
  });
  expect(cancelBooking.ok()).toBeTruthy();

  await page.goto("/my-bookings");

  await expect(page.getByText(bookingId)).toBeVisible();
  await expect(page.getByText("Status history")).toBeVisible();
  await expect(page.getByText(/Created as Payment Pending/)).toBeVisible();
  await expect(page.getByText(/Payment Pending → Cancelled/)).toBeVisible();
});
