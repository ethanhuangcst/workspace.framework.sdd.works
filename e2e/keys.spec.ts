import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";

const ADMIN_EMAIL = process.env.ADMIN_SEED_EMAIL ?? "me@ethanhuang.com";
const ADMIN_PASSWORD =
  process.env.E2E_ADMIN_PASSWORD ??
  process.env.ADMIN_SEED_PASSWORD ??
  "Sprint1Pass!";

async function loginAsSeedAdmin(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.locator('input[name="email"]').fill(ADMIN_EMAIL);
  await page.locator('input[name="password"]').fill(ADMIN_PASSWORD);
  await page.getByTestId("login-submit").click();
  await page.waitForURL("**/admin/keys");
}

test.describe("admin keys CRUD", () => {
  test("should_reject_key_name_starting_with_digit", async ({ page }) => {
    await loginAsSeedAdmin(page);
    await page.getByTestId("issue-key").click();
    await page.waitForURL("**/admin/keys/new");
    await page.getByTestId("key-name").fill("1");
    await page.getByTestId("key-description").fill("2");
    await page.getByTestId("key-value").fill("3");
    await page.getByTestId("key-create-submit").click();
    await expect(page.getByTestId("key-form-error")).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/keys\/new/);
  });

  test("should_reject_chinese_in_key_value", async ({ page }) => {
    await loginAsSeedAdmin(page);
    await page.getByTestId("issue-key").click();
    await page.waitForURL("**/admin/keys/new");
    await page.getByTestId("key-name").fill("valid_name");
    await page.getByTestId("key-value").fill("sk-中文");
    await page.getByTestId("key-create-submit").click();
    await expect(page.getByTestId("key-value-error")).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/keys\/new/);
  });

  test("should_create_list_edit_and_delete_key", async ({ page }) => {
    test.setTimeout(60_000);
    const db = new PrismaClient();
    await db.key.deleteMany({});
    await db.$disconnect();

    const name = `e2e_key_${Date.now()}`;
    const value = `sk-e2e-${Date.now()}`;

    await loginAsSeedAdmin(page);
    await expect(page.getByTestId("issue-key")).toBeVisible();

    await page.getByTestId("issue-key").click();
    await page.waitForURL("**/admin/keys/new");
    await page.getByTestId("key-name").fill(name);
    await page.getByTestId("key-description").fill("E2E key");
    await page.getByTestId("key-value").fill(value);
    await page.getByTestId("key-create-submit").click();
    await page.waitForURL(/\/admin\/keys(\?|$)/);
    await expect(page.getByTestId("keys-table")).toContainText(name);
    await expect(page.getByTestId("keys-table")).toContainText(value);
    await expect(page.getByTestId("keys-table")).toContainText("E2E key");

    const row = page.getByTestId(`key-row-${name}`);
    await row.locator('a[href*="/admin/keys/"]').first().click();
    await page.waitForURL(/\/admin\/keys\/[^/]+$/);
    await page.getByTestId("key-description").fill("E2E key updated");
    await page.getByTestId("key-edit-submit").click();
    await page.waitForURL(/\/admin\/keys(\?|$)/);
    await expect(page.getByTestId(`key-row-${name}`)).toContainText(
      "E2E key updated",
    );

    await page
      .getByTestId(`key-row-${name}`)
      .locator('a[href*="confirm=delete"]')
      .click();
    await expect(page.getByTestId("key-delete-confirm")).toBeVisible();
    await page.getByTestId("key-delete-confirm").click();
    await page.waitForURL(/\/admin\/keys$/);
    await expect(page.getByTestId(`key-row-${name}`)).toHaveCount(0);
    await expect(page.getByText(/No keys yet|还没有|還沒有/i)).toBeVisible();
  });
});
