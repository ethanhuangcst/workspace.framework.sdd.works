import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { PrismaClient } from "@prisma/client";
import { hashToken } from "../src/auth/token";

const ADMIN_EMAIL = process.env.ADMIN_SEED_EMAIL ?? "me@ethanhuang.com";
const ADMIN_PASSWORD =
  process.env.E2E_ADMIN_PASSWORD ??
  process.env.ADMIN_SEED_PASSWORD ??
  "Sprint1Pass!";

test.describe("public home", () => {
  test("should_show_instructions_and_login", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("admin-home-instructions")).toBeVisible();
    await expect(page.getByTestId("admin-login")).toBeVisible();
  });
});

test.describe("admin login", () => {
  test("should_send_empty_password_admin_to_set_password", async ({ page }) => {
    const unique = `empty-${Date.now()}@ethanhuang.com`;
    const db = new PrismaClient();
    await db.admin.create({
      data: {
        email: unique,
        username: `empty${Date.now()}`,
        name: "Empty Password",
        passwordHash: "",
        status: "ACTIVE",
      },
    });
    await db.$disconnect();

    await page.goto("/login");
    await page.locator('input[name="email"]').fill(unique);
    await page.locator("form").evaluate((form) => {
      (form as HTMLFormElement).noValidate = true;
    });
    await page.getByTestId("login-password").fill("");
    await page.getByTestId("login-submit").click();
    await page.waitForURL("**/set-password**");
    await expect(page.getByTestId("set-password-submit")).toBeVisible();
  });

  test("should_reject_wrong_password", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[name="email"]').fill(ADMIN_EMAIL);
    await page.locator('input[name="password"]').fill("definitely-wrong");
    await page.getByTestId("login-submit").click();
    await expect(page.getByTestId("login-error")).toBeVisible();
  });

  test("should_land_on_keys_when_credentials_correct", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[name="email"]').fill(ADMIN_EMAIL);
    await page.locator('input[name="password"]').fill(ADMIN_PASSWORD);
    await page.getByTestId("login-submit").click();
    await page.waitForURL("**/admin/keys");
    await expect(page.getByTestId("issue-key")).toBeVisible();
  });

});

test.describe("password reset", () => {
  test("should_set_password_from_reset_mail_capture", async ({ page }) => {
    const capture = process.env.E2E_RESET_FILE ?? "/tmp/sdd-reset-url.txt";
    await page.goto("/reset-password");
    await page.getByTestId("reset-email").fill(ADMIN_EMAIL);
    await page.getByTestId("reset-submit").click();
    await expect(page.locator(".callout-success")).toBeVisible();

    const url = (await readFile(capture, "utf8")).trim();
    expect(url).toContain("/set-password?token=");
    await page.goto(url);
    await page.locator('input[name="password"]').fill("Sprint1Pass!");
    await page.getByTestId("set-password-confirm").fill("Sprint1Pass!");
    await page.getByTestId("set-password-submit").click();
    await page.waitForURL("**/admin/keys");
  });

  test("should_block_expired_reset_token", async ({ page }) => {
    const db = new PrismaClient();
    const admin = await db.admin.findUniqueOrThrow({
      where: { email: ADMIN_EMAIL },
    });
    const raw = `expired-${Date.now()}`;
    await db.resetToken.create({
      data: {
        adminId: admin.id,
        tokenHash: hashToken(raw),
        expiresAt: new Date(Date.now() - 60_000),
      },
    });
    await db.$disconnect();

    await page.goto(`/set-password?token=${encodeURIComponent(raw)}`);
    await expect(page.getByTestId("set-password-expired")).toBeVisible();
  });
});
