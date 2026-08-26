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

test("DEBUG booking button execution", async ({ page }) => {
  const events: string[] = [];

  page.on("console", (message) => {
    events.push(`CONSOLE ${message.type()}: ${message.text()}`);
  });

  page.on("pageerror", (error) => {
    events.push(`PAGEERROR: ${error.message}`);
  });

  page.on("request", (request) => {
    if (request.url().includes("/api/")) {
      events.push(
        `REQUEST ${request.method()} ${request.url()}`
      );
    }
  });

  page.on("response", (response) => {
    if (response.url().includes("/api/")) {
      events.push(
        `RESPONSE ${response.status()} ${response.url()}`
      );
    }
  });

  await page.goto("/booking");

  // Select Temple
  const selects = page.locator("select");

  await expect(selects).toHaveCount(2);

  await selects.nth(0).selectOption({ index: 1 });
  await selects.nth(1).selectOption({ index: 1 });

  // Fill all booking fields
  await page.locator('input[type="date"]').fill(futureBookingDate());
  await page.locator('input[type="time"]').fill("10:00");
  await page.locator('input[type="number"]').fill("1");

  await page.locator('input[type="text"]').fill(
    "DivyaArpan Audit Test"
  );

  await page.locator('input[type="tel"]').fill(
    "9999999999"
  );

  await page.locator('input[type="email"]').fill(
    "audit@divyaarpan.test"
  );

  await page.locator("textarea").fill(
    "AUDIT TEST - Temporary booking"
  );

  const button = page.getByRole("button", {
    name: /Continue to Checkout/i,
  });

  await expect(button).toBeVisible();

  console.log("===== BEFORE CLICK =====");
  console.log("URL:", page.url());
  console.log("Button:", await button.innerText());
  console.log(
    "Disabled:",
    await button.isDisabled()
  );

  const checkoutNavigation = page.waitForURL(/\/checkout\?bookingId=/, { timeout: 30000 });
  await button.click();
  await checkoutNavigation;
  createdBookingIds.push(new URL(page.url()).searchParams.get("bookingId")!);

  console.log("===== AFTER CLICK =====");
  console.log("URL:", page.url());

  console.log("===== EVENTS =====");

  for (const event of events) {
    console.log(event);
  }

  expect(events.some((event) =>
    event.includes("DIVYAARPAN: saveBooking() CALLED")
  )).toBeTruthy();
});
