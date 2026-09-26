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

const SECRET_COPY = {
  en: {
    hint: "Enter the name of the secret, example: sdd-trial-googlemaps",
    button: "Get secret",
  },
  "zh-Hans": {
    hint: "输入要获得的密钥名称，例如：sdd-trial-googlemaps",
    button: "获取密钥",
  },
  "zh-Hant": {
    hint: "輸入要取得的密鑰名稱，例如：sdd-trial-googlemaps",
    button: "獲取密鑰",
  },
} as const;

test.describe("MCP instructions", () => {
  test("should_show_guide_and_agents_roster", async ({ page }) => {
    await page.goto("/instructions");

    await expect(page.getByTestId("instructions-guide")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /Install framework\.sdd\.works|MCP instructions/i,
    );
    await expect(page.getByTestId("guide-back-home")).toHaveCount(0);

    const roster = page.getByTestId("guide-agents");
    await expect(roster).toBeVisible();

    const names = roster.locator(".agent-roster-name");
    await expect(names).toHaveCount(AGENT_NAMES.length);

    for (let i = 0; i < AGENT_NAMES.length; i += 1) {
      await expect(names.nth(i)).toHaveText(AGENT_NAMES[i]!);
    }
  });

  test("should_switch_features_tab_and_be_hit_target", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const featuresTab = page.getByTestId("guide-tab-features");
    await expect(featuresTab).toBeVisible();
    await expect(page.getByTestId("panel-features")).toBeHidden();

    const box = await featuresTab.boundingBox();
    expect(box).toBeTruthy();
    const hit = await page.evaluate(
      ({ x, y }) => {
        const el = document.elementFromPoint(x, y);
        return el
          ? {
              testId: (el as HTMLElement).dataset?.testid ?? null,
              tag: el.tagName,
              text: (el.textContent ?? "").trim().slice(0, 40),
            }
          : null;
      },
      { x: box!.x + box!.width / 2, y: box!.y + box!.height / 2 },
    );
    expect(hit?.testId).toBe("guide-tab-features");

    await featuresTab.click();
    await expect(page).toHaveURL(/tab=features/);
    await expect(featuresTab).toHaveAttribute("aria-selected", "true");
    await expect(page.getByTestId("panel-features")).toBeVisible();
    await expect(
      page.getByTestId("panel-features").locator(".feature-name", { hasText: "ethan" }),
    ).toBeVisible();

    await page.getByTestId("guide-tab-setup").click();
    await expect(page.getByTestId("panel-features")).toBeHidden();
  });

  test("should_show_secret_form_on_setup_with_locale_strings", async ({
    page,
  }) => {
    await page.goto("/instructions");
    await page.waitForLoadState("networkidle");

    const tools = page.locator("#tools");
    const secret = page.getByTestId("secret-lookup");
    await expect(secret).toBeVisible();
    await expect(page.locator("#setup-secret")).toBeVisible();

    const toolsBox = await tools.boundingBox();
    const secretBox = await secret.boundingBox();
    expect(toolsBox).not.toBeNull();
    expect(secretBox).not.toBeNull();
    expect(secretBox!.y).toBeGreaterThan(toolsBox!.y);

    await expect(page.getByTestId("secret-name")).toHaveAttribute(
      "placeholder",
      SECRET_COPY.en.hint,
    );
    await expect(page.getByTestId("secret-get")).toHaveText(
      SECRET_COPY.en.button,
    );

    await page.getByRole("button", { name: "简", exact: true }).click();
    await expect(page.getByTestId("secret-name")).toHaveAttribute(
      "placeholder",
      SECRET_COPY["zh-Hans"].hint,
    );
    await expect(page.getByTestId("secret-get")).toHaveText(
      SECRET_COPY["zh-Hans"].button,
    );

    await page.getByRole("button", { name: "繁", exact: true }).click();
    await expect(page.getByTestId("secret-name")).toHaveAttribute(
      "placeholder",
      SECRET_COPY["zh-Hant"].hint,
    );
    await expect(page.getByTestId("secret-get")).toHaveText(
      SECRET_COPY["zh-Hant"].button,
    );

    await page.getByTestId("guide-tab-features").click();
    await expect(page.getByTestId("secret-lookup")).toBeHidden();
    await expect(
      page.getByTestId("panel-features").locator("[data-testid='secret-lookup']"),
    ).toHaveCount(0);
  });

  test("should_stay_on_setup_and_show_not_found_for_unknown_secret", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId("guide-tab-setup")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.getByTestId("secret-name").fill("add-trail-googlemaps");
    await page.getByTestId("secret-get").click();

    await expect(page).not.toHaveURL(/tab=features/);
    await expect(page.getByTestId("guide-tab-setup")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(page.getByTestId("secret-lookup")).toBeVisible();
    await expect(page.getByTestId("secret-error")).toBeVisible();
    await expect(page.getByTestId("secret-error")).toContainText(
      /No secret with that name/i,
    );
    await expect(page.getByTestId("secret-result")).toHaveCount(0);

    const metrics = await page.evaluate(() => {
      const input = document.querySelector(
        "[data-testid='secret-name']",
      ) as HTMLElement | null;
      const button = document.querySelector(
        "[data-testid='secret-get']",
      ) as HTMLElement | null;
      const form = document.querySelector(
        "[data-testid='secret-lookup']",
      ) as HTMLElement | null;
      const error = document.querySelector(
        "[data-testid='secret-error']",
      ) as HTMLElement | null;
      if (!input || !button || !form || !error) return null;
      const ir = input.getBoundingClientRect();
      const br = button.getBoundingClientRect();
      const fr = form.getBoundingClientRect();
      const er = error.getBoundingClientRect();
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
      return {
        inputRem: ir.width / rem,
        rightDelta: Math.abs(br.right - er.right),
        gapRem: (er.top - fr.bottom) / rem,
      };
    });
    expect(metrics).not.toBeNull();
    expect(metrics!.inputRem).toBeGreaterThan(31.5);
    expect(metrics!.inputRem).toBeLessThan(32.5);
    expect(metrics!.rightDelta).toBeLessThan(2);
    expect(metrics!.gapRem).toBeGreaterThan(1.1);
    expect(metrics!.gapRem).toBeLessThan(1.4);
  });
});
