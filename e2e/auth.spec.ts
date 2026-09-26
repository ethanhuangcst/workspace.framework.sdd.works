import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { PrismaClient } from "@prisma/client";
import { hashToken } from "../src/auth/token";

const ADMIN_EMAIL =
  process.env.E2E_ADMIN_EMAIL ?? "e2e-admin@ethanhuang.com";
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? "Sprint1Pass!";

test.describe("public home", () => {
  test("should_show_instructions_guide_on_root", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.getByTestId("instructions-guide")).toBeVisible();
    await expect(page.getByTestId("guide-tab-setup")).toBeVisible();
    await expect(page.getByTestId("admin-home-instructions")).toHaveCount(0);
    await expect(page.getByTestId("admin-login")).toHaveCount(0);

    const footer = page.locator(".site-footer");
    await expect(footer).toBeVisible();
    const before = await footer.boundingBox();
    expect(before).toBeTruthy();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const after = await footer.boundingBox();
    expect(after).toBeTruthy();
    const viewport = page.viewportSize();
    expect(viewport).toBeTruthy();
    expect(after!.y + after!.height).toBeLessThanOrEqual(viewport!.height + 1);
    expect(Math.abs(after!.y - before!.y)).toBeLessThan(2);
  });
});

test.describe("admin login", () => {
  test("should_send_empty_password_admin_to_set_password", async ({ page }) => {
    const unique = `empty-${Date.now()}@ethanhuang.com`;
    const db = new PrismaClient();
    try {
      await db.admin.create({
        data: {
          email: unique,
          username: `empty${Date.now()}`,
          name: "Empty Password",
          passwordHash: "",
          status: "ACTIVE",
        },
      });

      await page.goto("/login");
      await page.locator('input[name="email"]').fill(unique);
      await page.locator("form").evaluate((form) => {
        (form as HTMLFormElement).noValidate = true;
      });
      await page.getByTestId("login-password").fill("");
      await page.getByTestId("login-submit").click();
      await page.waitForURL("**/set-password**");
      await expect(page.getByTestId("set-password-submit")).toBeVisible();
    } finally {
      await db.admin.deleteMany({ where: { email: unique } });
      await db.$disconnect();
    }
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

  test("should_redirect_hashed_admin_away_from_empty_set_password", async ({
    page,
  }) => {
    await page.goto("/set-password?reason=password_required");
    await page.waitForURL("**/login");
    await expect(page.getByTestId("login-submit")).toBeVisible();
  });
});

test.describe("password reset", () => {
  test("should_show_back_to_login_after_reset_mail_sent", async ({ page }) => {
    await page.goto("/reset-password");
    const urlBefore = page.url();
    await page.getByTestId("reset-email").fill(ADMIN_EMAIL);
    await page.getByTestId("reset-submit").click();
    await expect(page.locator(".callout-success")).toBeVisible();
    expect(page.url()).toMatch(/\/reset-password\/?$/);
    expect(new URL(page.url()).pathname).toBe(new URL(urlBefore).pathname);
    await expect(page.getByTestId("reset-submit")).toHaveCount(0);
    const back = page.getByTestId("reset-back-login");
    await expect(back).toBeVisible();
    await expect(back).toHaveAttribute("href", "/login");
    await back.click();
    await page.waitForURL("**/login");
  });

  test("should_set_password_from_reset_mail_capture", async ({ page, baseURL }) => {
    const capture = process.env.E2E_RESET_FILE ?? "/tmp/sdd-reset-url.txt";
    await page.goto("/reset-password");
    await page.getByTestId("reset-email").fill(ADMIN_EMAIL);
    await page.getByTestId("reset-submit").click();
    await expect(page.locator(".callout-success")).toBeVisible();

    const captured = (await readFile(capture, "utf8")).trim();
    expect(captured).toContain("/set-password?token=");
    // Prefer Playwright origin so session cookies stay on the same host
    // (capture may use 127.0.0.1 while tests use localhost).
    const path = new URL(captured).pathname + new URL(captured).search;
    await page.goto(new URL(path, baseURL).toString());
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
