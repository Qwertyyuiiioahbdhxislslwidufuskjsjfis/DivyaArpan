import { expect, test } from "@playwright/test";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

test.afterAll(async () => {
  await prisma.contactSubmission.deleteMany({
    where: { email: { endsWith: "@divyaarpan.test" } },
  });
  await prisma.$disconnect();
});

test("contact form validates and persists submissions", async ({ page }) => {
  const email = `contact-${Date.now()}@divyaarpan.test`;

  await page.goto("/contact");

  await page.getByRole("button", { name: "Send Message" }).click();
  await expect(page.getByLabel("Name")).toHaveJSProperty("validationMessage", "Please fill out this field.");

  await page.getByLabel("Name").fill("DivyaArpan Contact Test");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Contact Number").fill("+919876543210");
  await page.getByLabel("Message").fill("I need help with booking a temple pooja this week.");

  const submission = page.waitForResponse(
    (response) => response.url().endsWith("/api/contact") && response.request().method() === "POST"
  );
  await page.getByRole("button", { name: "Send Message" }).click();
  const submissionResponse = await submission;
  expect(submissionResponse.ok()).toBeTruthy();

  await expect(page.getByText("Thank you. We have received your message and will contact you soon.")).toBeVisible();

  const saved = await prisma.contactSubmission.findFirst({ where: { email } });
  expect(saved).not.toBeNull();
  expect(saved?.name).toBe("DivyaArpan Contact Test");
});
