import { describe, expect, it } from "vitest";
import {
  formatDate,
  formatNumber,
  getLocaleFromCookieValue,
  negotiateLocale,
  resolveLocale,
} from "./locale";

describe("locale helpers", () => {
  it("should_default_to_en_when_cookie_missing", () => {
    expect(getLocaleFromCookieValue(undefined)).toBe("en");
    expect(getLocaleFromCookieValue("nope")).toBe("en");
    expect(getLocaleFromCookieValue("zh-Hans")).toBe("zh-Hans");
  });

  it("should_format_date_and_number_per_locale", () => {
    const date = new Date("2026-09-14T00:00:00Z");
    expect(formatDate("en", date)).toMatch(/2026/);
    expect(formatNumber("en", 1200)).toContain("1");
  });
});

describe("negotiateLocale", () => {
  it("should_map_simplified_chinese_tags_to_zh_Hans", () => {
    expect(negotiateLocale("zh-CN")).toBe("zh-Hans");
    expect(negotiateLocale("zh-SG")).toBe("zh-Hans");
    expect(negotiateLocale("zh-Hans")).toBe("zh-Hans");
    expect(negotiateLocale("zh")).toBe("zh-Hans");
  });

  it("should_map_traditional_chinese_tags_to_zh_Hant", () => {
    expect(negotiateLocale("zh-TW")).toBe("zh-Hant");
    expect(negotiateLocale("zh-HK")).toBe("zh-Hant");
    expect(negotiateLocale("zh-MO")).toBe("zh-Hant");
    expect(negotiateLocale("zh-Hant")).toBe("zh-Hant");
  });

  it("should_map_english_tags_to_en", () => {
    expect(negotiateLocale("en")).toBe("en");
    expect(negotiateLocale("en-US")).toBe("en");
    expect(negotiateLocale("en-GB")).toBe("en");
  });

  it("should_default_to_en_when_header_empty_or_unsupported", () => {
    expect(negotiateLocale(null)).toBe("en");
    expect(negotiateLocale(undefined)).toBe("en");
    expect(negotiateLocale("")).toBe("en");
    expect(negotiateLocale("ja")).toBe("en");
    expect(negotiateLocale("fr-FR")).toBe("en");
  });

  it("should_prefer_higher_q_value", () => {
    expect(negotiateLocale("zh-CN;q=0.8, zh-TW;q=0.9")).toBe("zh-Hant");
    expect(negotiateLocale("en;q=0.5, zh-Hans;q=0.9")).toBe("zh-Hans");
  });

  it("should_pick_first_supported_in_list_order_when_q_equal", () => {
    expect(negotiateLocale("ja, zh-HK, en")).toBe("zh-Hant");
  });
});

describe("resolveLocale", () => {
  it("should_use_valid_cookie_over_accept_language", () => {
    expect(
      resolveLocale({ cookie: "zh-Hant", acceptLanguage: "zh-CN" }),
    ).toBe("zh-Hant");
    expect(resolveLocale({ cookie: "en", acceptLanguage: "zh-TW" })).toBe(
      "en",
    );
  });

  it("should_negotiate_when_cookie_missing_or_invalid", () => {
    expect(
      resolveLocale({ cookie: undefined, acceptLanguage: "zh-HK" }),
    ).toBe("zh-Hant");
    expect(resolveLocale({ cookie: "nope", acceptLanguage: "zh-CN" })).toBe(
      "zh-Hans",
    );
  });

  it("should_default_to_en_when_cookie_and_header_absent", () => {
    expect(resolveLocale({ cookie: undefined, acceptLanguage: null })).toBe(
      "en",
    );
  });
});
