import { test, expect } from "@playwright/test";

test("DivyaArpan homepage loads successfully", async ({ page }) => {
  const consoleErrors: string[] = [];

  page.on("console", (message) => {
    const text = message.text();

    if (
      message.type() === "error" &&
      !text.includes("/_next/webpack-hmr") &&
      !text.includes("WebSocket connection")
    ) {
      consoleErrors.push(text);
    }
  });

  page.on("pageerror", (error) => {
    consoleErrors.push(error.message);
  });

  await page.goto("/");

  await expect(page).toHaveTitle(/DivyaArpan/i);

  await expect(
    page.getByRole("navigation")
  ).toBeVisible();

  await expect(
    page.getByRole("heading").first()
  ).toBeVisible();

  expect(consoleErrors).toEqual([]);
});
