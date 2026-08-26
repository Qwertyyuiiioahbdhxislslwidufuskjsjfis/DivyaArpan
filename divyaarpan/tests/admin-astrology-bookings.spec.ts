import { expect, test, type Page } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../app/lib/auth";

const prisma = new PrismaClient();
const password = "DivyaArpanAdminTestPassword!2026";
const email = `astrology-admin-${Date.now()}@divyaarpan.test`;
const bookingId = `DA-AST-ADMIN-${Date.now()}`;

async function login(page: Page) {
  const response = await page.request.post("/api/auth/login", {
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({ email, password }),
  });
  expect(response.ok()).toBeTruthy();
}

test.beforeAll(async () => {
  await prisma.user.create({
    data: {
      name: "Astrology Admin Test",
      email,
      phone: "9200000001",
      passwordHash: await hashPassword(password),
      role: "ADMIN",
    },
  });
  await prisma.astrologyBooking.create({
    data: {
      bookingId,
      service: "Career & Business Guidance",
      consultationMode: "VIDEO_CALL",
      name: "Admin Astrology Customer",
      mobile: "+919200000002",
      email: "customer-astrology@divyaarpan.test",
      birthDate: "1992-03-11",
      birthTime: "07:25",
      birthPlace: "Pune, Maharashtra",
      preferredDate: "2099-12-30",
      preferredTime: "10:30",
      question: "Please review my career transition and provide practical guidance.",
      amount: 150100,
    },
  });
});

test.afterAll(async () => {
  await prisma.astrologyBooking.deleteMany({ where: { bookingId } });
  await prisma.authSession.deleteMany({ where: { user: { email } } });
  await prisma.user.deleteMany({ where: { email } });
  await prisma.$disconnect();
});

test("non-admin users cannot update astrology consultation status", async ({ page }) => {
  const response = await page.request.put(`/api/astrology-bookings/${bookingId}/status`, {
    data: { status: "Confirmed" },
  });
  expect(response.status()).toBe(403);
});

test("admin can review and update astrology consultation status", async ({ page }) => {
  await login(page);
  await page.goto("/admin/astrology-bookings");

  await expect(page.getByRole("heading", { name: "Astrology Consultations" })).toBeVisible();
  await expect(page.getByText(bookingId)).toBeVisible();
  await expect(page.getByText("Admin Astrology Customer")).toBeVisible();
  await expect(page.getByText("Career & Business Guidance")).toBeVisible();
  await expect(page.getByText("₹1,501")).toBeVisible();
  await expect(page.getByText("Payment: PENDING")).toBeVisible();

  const statusResponse = page.waitForResponse(
    (response) => response.url().endsWith(`/api/astrology-bookings/${bookingId}/status`) && response.request().method() === "PUT"
  );
  await page.locator("select").selectOption("Confirmed");
  await page.getByRole("button", { name: "Update Status" }).click();
  expect((await statusResponse).ok()).toBeTruthy();
  await expect(page.locator("select")).toHaveValue("Confirmed");

  const saved = await prisma.astrologyBooking.findUnique({ where: { bookingId } });
  expect(saved?.status).toBe("Confirmed");
  expect(saved?.confirmedAt).not.toBeNull();
});

test("admin status API rejects invalid backward transitions", async ({ page }) => {
  await login(page);
  const response = await page.request.put(`/api/astrology-bookings/${bookingId}/status`, {
    data: { status: "Payment Pending" },
  });
  expect(response.status()).toBe(409);
});
