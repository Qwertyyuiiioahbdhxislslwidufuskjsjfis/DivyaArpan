import { defineConfig, devices } from "@playwright/test";

const testDatabaseUrl = process.env.TEST_DATABASE_URL;

if (!testDatabaseUrl || !/^postgres(?:ql)?:\/\/(?:[^@]+@)?(?:127\.0\.0\.1|localhost)(?::\d+)?\//.test(testDatabaseUrl)) {
  throw new Error("TEST_DATABASE_URL must point to an isolated local PostgreSQL database before Playwright tests can run.");
}

process.env.DATABASE_URL = testDatabaseUrl;

export default defineConfig({
  testDir: "./tests",

  fullyParallel: false,

  timeout: 60_000,

  expect: {
    timeout: 7_000,
  },

  reporter: [
    ["line"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],

  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      DATABASE_URL: testDatabaseUrl,
      SHADOW_DATABASE_URL: testDatabaseUrl,
      NODE_ENV: "test",
    },
  },
});
