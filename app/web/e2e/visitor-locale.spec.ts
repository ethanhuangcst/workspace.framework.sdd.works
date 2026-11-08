import { expect, test, type Browser, type Page } from "@playwright/test";

const BASE = "http://localhost:3040";

async function openGuide(
  browser: Browser,
  acceptLanguage: string,
  cookie?: string,
): Promise<{ page: Page; close: () => Promise<void> }> {
  const context = await browser.newContext();
  // Chromium replaces Accept-Language with its own locale. Force the header on every request.
  await context.route("**/*", async (route) => {
    const headers = {
      ...route.request().headers(),
      "accept-language": acceptLanguage,
    };
    await route.continue({ headers });
  });
  if (cookie) {
    await context.addCookies([
      { name: "sdd_locale", value: cookie, url: BASE },
    ]);
  }
  const page = await context.newPage();
  await page.goto("/instructions?tab=learn-scrum-in-sdd");
  await page.waitForLoadState("networkidle");
  await expect(page.getByTestId("secret-get")).toBeVisible();
  return {
    page,
    close: () => context.close(),
  };
}

test.describe("visitor locale from Accept-Language", () => {
  test.setTimeout(60_000);
  test("should_open_zh_Hans_when_browser_asks_zh_CN", async ({ browser }) => {
    const { page, close } = await openGuide(
      browser,
      "zh-CN,zh;q=0.9,en;q=0.8",
    );
    try {
      await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
      await expect(page.getByRole("button", { name: "简", exact: true })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      await expect(page.getByTestId("secret-get")).toHaveText("获取密钥");
      const cookies = await page.context().cookies();
      expect(cookies.find((c) => c.name === "sdd_locale")?.value).toBe("zh-Hans");
    } finally {
      await close();
    }
  });

  test("should_open_zh_Hant_when_browser_asks_zh_TW", async ({ browser }) => {
    const { page, close } = await openGuide(browser, "zh-TW,zh;q=0.9,en;q=0.8");
    try {
      await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hant");
      await expect(page.getByRole("button", { name: "繁", exact: true })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      await expect(page.getByTestId("secret-get")).toHaveText("獲取密鑰");
      const cookies = await page.context().cookies();
      expect(cookies.find((c) => c.name === "sdd_locale")?.value).toBe("zh-Hant");
    } finally {
      await close();
    }
  });

  test("should_prefer_higher_q_traditional_over_simplified", async ({ browser }) => {
    const { page, close } = await openGuide(
      browser,
      "zh-CN;q=0.8, zh-TW;q=0.9",
    );
    try {
      await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hant");
      const cookies = await page.context().cookies();
      expect(cookies.find((c) => c.name === "sdd_locale")?.value).toBe("zh-Hant");
    } finally {
      await close();
    }
  });

  test("should_open_en_when_browser_asks_en_or_ja", async ({ browser }) => {
    const english = await openGuide(browser, "en-US,en;q=0.9");
    try {
      await expect(english.page.locator("html")).toHaveAttribute("lang", "en");
      await expect(
        english.page.getByRole("button", { name: "EN", exact: true }),
      ).toHaveAttribute("aria-pressed", "true");
      await expect(english.page.getByTestId("secret-get")).toHaveText("Get secret");
    } finally {
      await english.close();
    }

    const japanese = await openGuide(browser, "ja,en;q=0.5");
    try {
      await expect(japanese.page.locator("html")).toHaveAttribute("lang", "en");
      const cookies = await japanese.page.context().cookies();
      expect(cookies.find((c) => c.name === "sdd_locale")?.value).toBe("en");
    } finally {
      await japanese.close();
    }
  });

  test("should_keep_saved_locale_when_browser_language_differs", async ({
    browser,
  }) => {
    const { page, close } = await openGuide(browser, "zh-CN", "zh-Hant");
    try {
      await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hant");
      await expect(page.getByRole("button", { name: "繁", exact: true })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      const cookies = await page.context().cookies();
      expect(cookies.find((c) => c.name === "sdd_locale")?.value).toBe("zh-Hant");
    } finally {
      await close();
    }
  });

  test("should_replace_invalid_cookie_from_browser_language", async ({
    browser,
  }) => {
    const { page, close } = await openGuide(browser, "zh-HK", "nope");
    try {
      await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hant");
      const cookies = await page.context().cookies();
      expect(cookies.find((c) => c.name === "sdd_locale")?.value).toBe("zh-Hant");
    } finally {
      await close();
    }
  });

  test("should_let_switcher_replace_saved_locale", async ({ browser }) => {
    const { page, close } = await openGuide(browser, "en-US", "en");
    try {
      await page.getByRole("button", { name: "简", exact: true }).click();
      await page.waitForLoadState("networkidle");
      await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
      await expect(page.getByTestId("secret-get")).toHaveText("获取密钥");
      const cookies = await page.context().cookies();
      expect(cookies.find((c) => c.name === "sdd_locale")?.value).toBe("zh-Hans");
    } finally {
      await close();
    }
  });

  test("should_keep_features_api_en_without_locale_query", async ({ request }) => {
    const res = await request.get("/api/sdd/features", {
      headers: { "Accept-Language": "zh-CN" },
    });
    expect(res.ok()).toBe(true);
    const body = (await res.json()) as { locale: string };
    expect(body.locale).toBe("en");
  });
});
