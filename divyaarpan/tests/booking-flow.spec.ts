import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const createdBookingIds: string[] = [];

test.afterAll(async () => {
  await prisma.booking.deleteMany({ where: { bookingId: { in: createdBookingIds } } });
  await prisma.$disconnect();
});

function futureBookingDate() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().slice(0, 10);
}

test("DivyaArpan complete Pooja booking flow", async ({ page }) => {
  const errors: string[] = [];

  page.on("pageerror", (error) => {
    errors.push(error.message);
  });

  page.on("console", (message) => {
    const text = message.text();

    if (
      message.type() === "error" &&
      !text.includes("/_next/webpack-hmr") &&
      !text.includes("WebSocket connection")
    ) {
      errors.push(text);
    }
  });

  await page.goto("/booking");

  // Temple
  const selects = page.locator("select");
  await expect(selects).toHaveCount(2);

  await selects.nth(0).selectOption({
    index: 1,
  });

  // Pooja
  await selects.nth(1).selectOption({
    index: 1,
  });

  // Date
  const date = page.locator('input[type="date"]');
  await expect(date).toBeVisible();

  const bookingDate = futureBookingDate();
  await date.fill(bookingDate);

  // Time
  const time = page.locator('input[type="time"]');
  await expect(time).toBeVisible();

  await time.fill("10:00");

  // Devotees
  const devotees = page.locator('input[type="number"]');
  await expect(devotees).toBeVisible();

  await devotees.fill("1");

  // Name
  await page.locator('input[type="text"]').fill(
    "DivyaArpan Audit Test"
  );

  // Mobile
  await page.locator('input[type="tel"]').fill(
    "9999999999"
  );

  // Email
  await page.locator('input[type="email"]').fill(
    "audit@divyaarpan.test"
  );

  // Sankalp
  await page.locator("textarea").fill(
    "AUDIT TEST - Temporary booking"
  );

  // Verify CTA
  const submit = page.getByRole("button", {
    name: /Continue to Checkout/i,
  });

  await expect(submit).toBeVisible();

  // Capture the actual API request
  const bookingRequestPromise = page.waitForRequest(
    (request) =>
      request.url().endsWith("/api/bookings") &&
      request.method() === "POST",
    { timeout: 10000 }
  );
  await submit.click();

  const bookingRequest =
    await bookingRequestPromise;

  const requestBody =
    bookingRequest.postDataJSON();

  console.log(
    "===== BOOKING API PAYLOAD ====="
  );

  console.log(
    JSON.stringify(requestBody, null, 2)
  );

  expect(requestBody.name).toBe(
    "DivyaArpan Audit Test"
  );

  expect(requestBody.mobile).toBe(
    "9999999999"
  );

  expect(requestBody.date).toBe(
    bookingDate
  );

  expect(requestBody.time).toBe(
    "10:00"
  );

  expect(requestBody.devotees).toBe("1");

  console.log(
    "===== FINAL URL ====="
  );

  await expect(page).toHaveURL(/\/checkout\?bookingId=/, {
    timeout: 30000,
  });
  createdBookingIds.push(new URL(page.url()).searchParams.get("bookingId")!);

  console.log(page.url());

  expect(errors).toEqual([]);
});
