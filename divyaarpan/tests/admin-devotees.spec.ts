import { expect, test, type Page } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../app/lib/auth";

const prisma = new PrismaClient();
const password = "DivyaArpanDevoteeAdminTest!2026";
const adminEmail = `devotee-admin-${Date.now()}@divyaarpan.test`;
const devoteeEmail = `managed-devotee-${Date.now()}@divyaarpan.test`;

async function login(page: Page, email: string) {
  const response = await page.request.post("/api/auth/login", {
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({ email, password }),
  });
  expect(response.ok()).toBeTruthy();
}

test.beforeAll(async () => {
  await prisma.user.create({
    data: {
      name: "Devotee Management Admin",
      email: adminEmail,
      phone: "9300000001",
      passwordHash: await hashPassword(password),
      role: "ADMIN",
    },
  });
  await prisma.user.create({
    data: {
      name: "Managed Devotee",
      email: devoteeEmail,
      phone: "9300000002",
      passwordHash: await hashPassword(password),
      role: "DEVOTEE",
      devotee: {
        create: {
          name: "Managed Devotee",
          email: devoteeEmail,
          mobile: "9300000002",
          city: "Pune",
          state: "Maharashtra",
        },
      },
    },
  });
});

test.afterAll(async () => {
  await prisma.authSession.deleteMany({ where: { user: { email: { in: [adminEmail, devoteeEmail] } } } });
  await prisma.devotee.deleteMany({ where: { email: devoteeEmail } });
  await prisma.user.deleteMany({ where: { email: { in: [adminEmail, devoteeEmail] } } });
  await prisma.$disconnect();
});

test("devotee management API requires admin authorization", async ({ page }) => {
  const response = await page.request.get("/api/devotees");
  expect(response.status()).toBe(403);
});

test("admin can search, filter and update a devotee profile", async ({ page }) => {
  await login(page, adminEmail);
  const devotee = await prisma.devotee.findUniqueOrThrow({ where: { email: devoteeEmail } });

  await page.goto("/admin/devotees");
  await expect(page.getByRole("heading", { name: "Manage Devotees" })).toBeVisible();
  const managedDevoteeRow = page.getByRole("row", { name: /Managed Devotee/ });
  await expect(managedDevoteeRow).toBeVisible();
  await expect(managedDevoteeRow.getByText("0 total")).toBeVisible();

  await page.getByLabel("Search devotees").fill("Pune");
  await expect(page.getByText("Managed Devotee")).toBeVisible();
  await page.getByLabel("Account status").selectOption("inactive");
  await expect(page.getByRole("heading", { name: "No devotees found" })).toBeVisible();
  await page.getByLabel("Account status").selectOption("all");
  const profileHref = await page.getByRole("link", { name: "View profile" }).getAttribute("href");
  expect(profileHref).toMatch(/^\/admin\/devotees\/\d+$/);
  await page.goto(profileHref!);

  await expect(page.getByRole("heading", { name: "Devotee Profile" })).toBeVisible({ timeout: 30000 });
  await page.getByLabel("City").fill("Mumbai");
  await page.getByLabel("Account is active").uncheck();
  await page.getByRole("button", { name: "Save profile" }).click();
  await expect(page.getByRole("status")).toContainText("updated successfully");

  const saved = await prisma.devotee.findUniqueOrThrow({ where: { id: devotee.id }, include: { user: true } });
  expect(saved.city).toBe("Mumbai");
  expect(saved.isActive).toBe(false);
  expect(saved.user?.phone).toBe("9300000002");
});
