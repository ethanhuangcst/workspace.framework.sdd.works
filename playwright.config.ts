import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  globalSetup: "./e2e/global-setup.ts",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3040",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3040",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      ...process.env,
      DATABASE_URL:
        process.env.DATABASE_URL ??
        "postgresql://framework_sdd:framework_sdd@localhost:5435/framework_sdd",
      SESSION_SECRET:
        process.env.SESSION_SECRET ?? "ci-session-secret-at-least-16",
      PUBLIC_BASE_URL: process.env.PUBLIC_BASE_URL ?? "http://localhost:3040",
      E2E_RESET_FILE: process.env.E2E_RESET_FILE ?? "/tmp/sdd-reset-url.txt",
      E2E_INVITE_FILE:
        process.env.E2E_INVITE_FILE ?? "/tmp/sdd-invite-url.txt",
    },
  },
});
