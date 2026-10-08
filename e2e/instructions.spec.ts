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
      /Built on Harness\. Ready for Scrum|MCP instructions/i,
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

  test("should_browse_knowledge_folder_and_open_same_tab_article", async ({
    page,
  }) => {
    await page.goto("/?tab=knowledge");
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId("panel-knowledge")).toBeVisible();
    await expect(page.getByTestId("knowledge-list")).toBeVisible();
    await expect(page.getByTestId("knowledge-folder-archived")).toBeVisible();

    await page.getByTestId("knowledge-folder-archived").click();
    await expect(page).toHaveURL(/tab=knowledge&path=archived/);
    await expect(page.getByTestId("knowledge-file-invoke-agent-trae")).toBeVisible();

    await page.getByTestId("knowledge-file-invoke-agent-trae").click();
    await expect(page).toHaveURL(/doc=invoke-agent-trae/);
    await expect(page.getByTestId("knowledge-article-body")).toBeVisible();
    await expect(page.getByTestId("knowledge-list")).toBeHidden();

    await page.getByTestId("knowledge-back").click();
    await expect(page).toHaveURL(/tab=knowledge/);
    await expect(page).toHaveURL(/path=archived/);
    expect(page.url()).not.toContain("doc=");
    await expect(page.getByTestId("knowledge-list")).toBeVisible();
  });

  test("should_open_scrum_in_sdd_tab_after_features", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const featuresTab = page.getByTestId("guide-tab-features");
    const scrumTab = page.getByTestId("guide-tab-scrum");
    await expect(scrumTab).toBeVisible();
    await expect(scrumTab).toHaveText("Scrum in SDD");
    await expect(page.getByTestId("panel-scrum")).toBeHidden();

    const featuresBox = await featuresTab.boundingBox();
    const scrumBox = await scrumTab.boundingBox();
    expect(featuresBox).toBeTruthy();
    expect(scrumBox).toBeTruthy();
    expect(scrumBox!.x).toBeGreaterThan(featuresBox!.x);

    await scrumTab.click();
    await expect(page).toHaveURL(/tab=scrum-in-sdd/);
    await expect(scrumTab).toHaveAttribute("aria-selected", "true");
    await expect(page.getByTestId("panel-scrum")).toBeVisible();
    await expect(page.getByTestId("scrum-body")).toContainText(/Scrum in SDD/i);
    await expect(page.getByTestId("secret-lookup")).toBeHidden();
    await expect(
      page.getByTestId("panel-scrum").locator("[data-testid='secret-lookup']"),
    ).toHaveCount(0);
    await expect(
      page.getByTestId("scrum-body").locator(".feature-name"),
    ).toHaveCount(0);
  });

  test("should_show_secret_form_on_learn_tab_with_locale_strings", async ({
    page,
  }) => {
    await page.goto("/instructions?tab=learn-scrum-in-sdd");
    await page.waitForLoadState("networkidle");

    const iframe = page.getByTestId("learn-scrum-iframe");
    const secret = page.getByTestId("secret-lookup");
    await expect(secret).toBeVisible();
    await expect(page.locator("#learn-secret")).toBeVisible();
    await expect(page.locator("#setup-secret")).toHaveCount(0);

    const iframeBox = await iframe.boundingBox();
    const secretBox = await secret.boundingBox();
    expect(iframeBox).not.toBeNull();
    expect(secretBox).not.toBeNull();
    expect(secretBox!.y).toBeGreaterThan(iframeBox!.y);

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

  test("should_stay_on_learn_tab_and_show_not_found_for_unknown_secret", async ({
    page,
  }) => {
    await page.goto("/?tab=learn-scrum-in-sdd");
    await page.waitForLoadState("networkidle");

    await expect(page.getByTestId("guide-tab-learn-scrum")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.getByTestId("secret-name").fill("add-trail-googlemaps");
    await page.getByTestId("secret-get").click();

    await expect(page).not.toHaveURL(/tab=features/);
    await expect(page.getByTestId("guide-tab-learn-scrum")).toHaveAttribute(
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

  for (const { width, paths } of [
    { width: 375, paths: ["/", "/instructions", "/?tab=learn-scrum-in-sdd"] },
    { width: 768, paths: ["/", "/?tab=learn-scrum-in-sdd"] },
    { width: 1280, paths: ["/", "/?tab=learn-scrum-in-sdd"] },
  ]) {
    for (const path of paths) {
      test(`should_not_scroll_page_horizontally_at_${width}px_on_${path.replace(/\//g, "_") || "root"}`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.goto(path);
        await page.waitForLoadState("networkidle");
        await expect(page.getByTestId("instructions-guide")).toBeVisible();

        const overflow = await page.evaluate(() => {
          const root = document.documentElement;
          return root.scrollWidth - root.clientWidth;
        });
        expect(overflow).toBeLessThanOrEqual(1);
      });
    }
  }
});
