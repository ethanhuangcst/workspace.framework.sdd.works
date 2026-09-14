import { describe, expect, it } from "vitest";
import { formatDate, formatNumber, getLocaleFromCookieValue } from "./locale";

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
