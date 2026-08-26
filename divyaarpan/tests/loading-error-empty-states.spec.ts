import { expect, test } from "@playwright/test";

test("checkout shows a clear error when booking ID is missing", async ({ page }) => {
  await page.goto("/checkout");
  await expect(page.getByRole("heading", { name: "Booking could not be loaded" })).toBeVisible();
  await expect(page.locator("main [role=alert]")).toContainText("Booking ID is missing.");
  await expect(page.getByRole("link", { name: "Back to Temples" })).toBeVisible();
});

test("customer catalog detail routes show useful not-found states", async ({ page }) => {
  const templeResponse = await page.goto("/temples/does-not-exist");
  expect(templeResponse).not.toBeNull();
  await expect(page.getByRole("heading", { name: "Temple not found" })).toBeVisible();

  const poojaResponse = await page.goto("/poojas/999999999");
  expect(poojaResponse).not.toBeNull();
  await expect(page.getByRole("heading", { name: "Pooja not found" })).toBeVisible();
});
