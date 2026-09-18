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

async function resetSettingsUrl(url: string | null) {
  const db = new PrismaClient();
  await db.setting.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", githubUrl: url },
    update: { githubUrl: url },
  });
  await db.$disconnect();
}

test.describe("settings and framework", () => {
  test.beforeEach(async () => {
    await resetSettingsUrl(null);
  });

  test("should_show_framework_empty_when_no_url", async ({ page }) => {
    await loginAsSeedAdmin(page);
    await page.goto("/admin/framework");
    await expect(page.getByTestId("framework-empty")).toBeVisible();
    await expect(page.getByTestId("framework-to-settings")).toBeVisible();
  });

  test("should_reject_invalid_and_unreachable_without_persist", async ({
    page,
  }) => {
    await loginAsSeedAdmin(page);
    await page.goto("/admin/settings");
    await page.getByTestId("settings-url").fill("https://gitlab.com/org/repo");
    await page.getByTestId("settings-save").click();
    await expect(
      page.getByText(/valid GitHub|有效的 GitHub|有效的 GitHub/i),
    ).toBeVisible();

    await page
      .getByTestId("settings-url")
      .fill("https://github.com/fixture/missing");
    await page.getByTestId("settings-save").click();
    await expect(
      page.getByText(/could not be reached|无法访问|無法存取/i),
    ).toBeVisible();

    const db = new PrismaClient();
    const row = await db.setting.findUnique({ where: { id: "singleton" } });
    await db.$disconnect();
    expect(row?.githubUrl).toBeNull();
  });

  test("should_show_cache_missing_then_sync_fixture_tree", async ({ page }) => {
    test.setTimeout(90_000);
    await loginAsSeedAdmin(page);
    await page.goto("/admin/settings");
    await page
      .getByTestId("settings-url")
      .fill("https://github.com/fixture/sdd-framework");
    await page.getByTestId("settings-save").click();
    await expect(page.getByText(/verified and saved|已验证|已驗證/i)).toBeVisible();

    await page.goto("/admin/framework");
    await expect(page.getByTestId("framework-source")).toContainText(
      "github.com/fixture/sdd-framework",
    );

    const cacheMissing = page.getByTestId("framework-cache-missing");
    const tree = page.getByTestId("framework-tree");
    const hasCache = await tree.isVisible().catch(() => false);
    if (!hasCache) {
      await expect(cacheMissing).toBeVisible();
    }

    await page.getByTestId("framework-sync-repo").first().click();
    await expect(tree).toBeVisible({ timeout: 60_000 });
    await expect(tree).toContainText("Skills");
    await expect(tree).toContainText("tdd");
  });

  test("should_navigate_change_repo_button_to_settings", async ({ page }) => {
    test.setTimeout(90_000);
    await loginAsSeedAdmin(page);
    await page.goto("/admin/settings");
    await page
      .getByTestId("settings-url")
      .fill("https://github.com/fixture/sdd-framework");
    await page.getByTestId("settings-save").click();
    await expect(page.getByText(/verified and saved|已验证|已驗證/i)).toBeVisible();

    await page.goto("/admin/framework");
    await page.getByTestId("framework-sync-repo").click();
    await expect(page.getByTestId("framework-tree")).toBeVisible({ timeout: 60_000 });

    await page.getByTestId("framework-change-repo").click();
    await page.waitForURL("**/admin/settings");
    await expect(page.getByTestId("settings-url")).toBeVisible();
  });

  test("should_expand_and_collapse_folder_in_tree", async ({ page }) => {
    test.setTimeout(90_000);
    await loginAsSeedAdmin(page);
    await page.goto("/admin/settings");
    await page
      .getByTestId("settings-url")
      .fill("https://github.com/fixture/sdd-framework");
    await page.getByTestId("settings-save").click();
    await expect(page.getByText(/verified and saved|已验证|已驗證/i)).toBeVisible();

    await page.goto("/admin/framework");
    await page.getByTestId("framework-sync-repo").click();
    await expect(page.getByTestId("framework-tree")).toBeVisible({ timeout: 60_000 });

    const toggle = page.getByTestId("framework-tree-toggle-skills-");
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByTestId("framework-tree")).toContainText("Skills");
    await expect(page.getByTestId("framework-tree")).toContainText("tdd");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
  });
});
