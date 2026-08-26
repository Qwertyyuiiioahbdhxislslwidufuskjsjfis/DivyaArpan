import { expect, test } from "@playwright/test";

test("pooja listing opens detail, temple and booking routes", async ({ page }) => {
  await page.goto("/poojas");

  const poojaLink = page.locator('a[href^="/poojas/"]').first();
  await expect(poojaLink).toBeVisible();
  await expect(poojaLink).toHaveAttribute("href", /\/poojas\/\d+$/);
  const poojaHref = await poojaLink.getAttribute("href");
  await page.goto(poojaHref!);

  await expect(page).toHaveURL(/\/poojas\/\d+$/);
  await expect(page.getByRole("heading", { name: /Service details/ })).toBeVisible();

  const templeLink = page.locator('a[href^="/temples/"]').first();
  await expect(templeLink).toBeVisible();
  const templeHref = await templeLink.getAttribute("href");
  await page.goto(templeHref!);
  await expect(page).toHaveURL(/\/temples\/[^/]+$/);

  await page.goBack();
  const bookingLink = page.locator('a[href^="/booking?temple="]').first();
  await expect(bookingLink).toBeVisible();
  const bookingHref = await bookingLink.getAttribute("href");
  await page.goto(bookingHref!, { waitUntil: "domcontentloaded" });

  await expect(page).toHaveURL(/\/booking\?temple=.*pooja=/);
  await expect(page.getByRole("heading").first()).toBeVisible();
});
