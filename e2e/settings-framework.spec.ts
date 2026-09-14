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

  test("should_save_fixture_url_and_show_framework_tree", async ({ page }) => {
    test.setTimeout(60_000);
    await loginAsSeedAdmin(page);
    await page.goto("/admin/settings");
    await page
      .getByTestId("settings-url")
      .fill("https://github.com/fixture/sdd-framework");
    await page.getByTestId("settings-save").click();
    await expect(page.getByText(/verified and saved|已验证|已驗證/i)).toBeVisible();

    await page.goto("/admin/framework");
    await expect(page.getByTestId("framework-tree")).toBeVisible();
    await expect(page.getByTestId("framework-source")).toContainText(
      "github.com/fixture/sdd-framework",
    );
    await expect(page.getByTestId("framework-tree")).toContainText("skills/");
  });
});
