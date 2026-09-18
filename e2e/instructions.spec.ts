import { test, expect } from "@playwright/test";

const AGENT_NAMES = [
  "Claude Code",
  "Codex",
  "Cursor",
  "CodeBuddy CN / CodeBuddy / WorkBuddy CN",
  "TraeCode CN / TRAE",
  "GitHub Copilot",
  "AWS Kiro",
] as const;

test.describe("MCP instructions", () => {
  test("should_show_guide_back_home_and_agents_roster", async ({ page }) => {
    await page.goto("/instructions");

    await expect(page.getByTestId("instructions-guide")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /Install framework\.sdd\.works|MCP instructions/i,
    );

    await page.getByTestId("guide-back-home").click();
    await expect(page).toHaveURL("/");

    await page.goto("/instructions");
    const roster = page.getByTestId("guide-agents");
    await expect(roster).toBeVisible();

    const names = roster.locator(".agent-roster-name");
    await expect(names).toHaveCount(AGENT_NAMES.length);

    for (let i = 0; i < AGENT_NAMES.length; i += 1) {
      await expect(names.nth(i)).toHaveText(AGENT_NAMES[i]!);
    }
  });
});
