import { expect, test } from "@playwright/test";

test("temple listing opens a temple detail and pooja booking", async ({ page }) => {
  await page.goto("/temples");

  const templeLink = page.locator('a[href^="/temples/"]').first();
  await expect(templeLink).toBeVisible();
  await templeLink.click();

  await expect(page).toHaveURL(/\/temples\/[^/]+$/);
  await expect(page.getByRole("heading", { name: /Poojas at/ })).toBeVisible();

  const bookingLink = page.locator('a[href^="/booking?temple="]').first();
  await expect(bookingLink).toBeVisible();
  await bookingLink.click();

  await expect(page).toHaveURL(/\/booking\?temple=.*pooja=/);
  await expect(page.getByRole("heading").first()).toBeVisible();
});
