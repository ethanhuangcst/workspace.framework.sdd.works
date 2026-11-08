import { test, expect } from "@playwright/test";
import { readFile, unlink } from "node:fs/promises";
import { PrismaClient } from "@prisma/client";

const ADMIN_EMAIL =
  process.env.E2E_ADMIN_EMAIL ?? "e2e-admin@ethanhuang.com";
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? "Sprint1Pass!";

async function loginAsSeedAdmin(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.locator('input[name="email"]').fill(ADMIN_EMAIL);
  await page.locator('input[name="password"]').fill(ADMIN_PASSWORD);
  await page.getByTestId("login-submit").click();
  await page.waitForURL("**/admin/keys");
}

test.describe("admin accounts invite", () => {
  test("should_invite_accept_list_and_delete_other_admin", async ({ page }) => {
    test.setTimeout(60_000);
    const db = new PrismaClient();
    const seedEmail = (
      process.env.ADMIN_SEED_EMAIL ?? "me@ethanhuang.com"
    )
      .trim()
      .toLowerCase();
    // Keep the operator seed admin. A blanket delete of every non-E2E
    // address removed me@ethanhuang.com and made reset skip Resend.
    await db.admin.deleteMany({
      where: {
        AND: [{ email: { not: ADMIN_EMAIL } }, { email: { not: seedEmail } }],
      },
    });
    await db.inviteToken.deleteMany({});
    await db.$disconnect();

    const capture =
      process.env.E2E_INVITE_FILE ?? "/tmp/sdd-invite-url.txt";
    try {
      await unlink(capture);
    } catch {
      /* ignore missing */
    }

    const inviteEmail = `e2e-invite-${Date.now()}@example.com`;
    const username = `e2e${Date.now()}`;

    await loginAsSeedAdmin(page);
    await page.goto("/admin/accounts");
    await expect(page.getByTestId("users-table")).toBeVisible();

    await page.getByTestId("invite-email").fill(inviteEmail);
    await page.getByTestId("invite-submit").click();
    await expect(page.getByTestId("users-tip")).toBeVisible();
    await expect(page.getByTestId("users-table")).toContainText(inviteEmail);

    const url = (await readFile(capture, "utf8")).trim();
    expect(url).toContain("/accept-invite?token=");

    await page.goto(url);
    await expect(page.getByTestId("invite-email-context")).toContainText(
      inviteEmail,
    );
    await page.getByTestId("accept-invite-name").fill("E2E Invitee");
    await page.getByTestId("accept-invite-username").fill(username);
    await page.getByTestId("accept-invite-password").fill("InvitePass1!");
    await page.getByTestId("accept-invite-confirm").fill("InvitePass1!");
    await page.getByTestId("accept-invite-submit").click();
    await expect(page.getByTestId("accept-invite-done")).toBeVisible();

    // Seed admin session is still valid; list/delete as the inviter.
    await page.goto("/admin/accounts");
    await expect(page.getByTestId("users-table")).toContainText(inviteEmail);
    await expect(page.getByTestId("users-table")).toContainText("E2E Invitee");

    const row = page.locator(`[data-testid^="user-row-"]`).filter({
      hasText: inviteEmail,
    });
    await row.getByTestId("delete-admin").click();
    await expect(page.getByTestId("confirm-delete-user")).toBeVisible();
    const deleteWait = page.waitForResponse(
      (res) =>
        res.url().includes("/api/admin/users/") &&
        res.request().method() === "DELETE",
    );
    await page.getByTestId("confirm-delete-user").click();
    const deleteRes = await deleteWait;
    expect(deleteRes.ok()).toBeTruthy();
    await expect(page.getByTestId("users-table")).not.toContainText(
      inviteEmail,
    );

    const seedRow = page.locator(`[data-testid^="user-row-"]`).filter({
      hasText: ADMIN_EMAIL,
    });
    await expect(seedRow.getByTestId("delete-admin")).toHaveCount(0);
  });

  test("should_show_expired_invite_callout", async ({ page }) => {
    await page.goto("/accept-invite?token=not-a-real-token");
    await expect(page.getByTestId("accept-invite-expired")).toBeVisible();
  });
});
