import { test, expect } from "@playwright/test";

const routes = [
  { name: "Home", path: "/" },
  { name: "Temples", path: "/temples" },
  { name: "Poojas", path: "/poojas" },
  { name: "Astrology", path: "/astrology" },
  { name: "Store", path: "/store" },
  { name: "Donate", path: "/donate" },
  { name: "Contact", path: "/contact" },
  { name: "Book My Pandit", path: "/book-my-pandit" },
];

for (const route of routes) {
  test(`${route.name} page loads`, async ({ page }) => {
    const response = await page.goto(route.path);

    expect(response?.status(), `${route.path} returned bad status`).toBeLessThan(400);

    await expect(page.locator("body")).toBeVisible();

    await expect(page.getByRole("heading").first()).toBeVisible();
  });
}
