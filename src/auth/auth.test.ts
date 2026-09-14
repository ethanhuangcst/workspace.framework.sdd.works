import { describe, expect, it } from "vitest";
import { t } from "@/i18n/t";
import { createSessionValue, readSessionValue } from "@/auth/session";
import { hashPassword, verifyPassword } from "@/auth/password";
import { checkRateLimit, resetRateLimits } from "@/auth/rate-limit";

describe("i18n t()", () => {
  it("should_resolve_from_active_locale", () => {
    expect(t("en", "admin.login.title")).toBeTruthy();
    expect(t("zh-Hans", "admin.login.title")).not.toBe("admin.login.title");
  });

  it("should_fallback_to_en_then_key_name", () => {
    expect(t("zh-Hans", "missing.key.that.does.not.exist")).toBe(
      "missing.key.that.does.not.exist",
    );
  });
});

describe("session seal", () => {
  it("should_roundtrip_session_payload", () => {
    process.env.SESSION_SECRET =
      process.env.SESSION_SECRET || "test-secret-at-least-16-chars";
    const value = createSessionValue("admin-1", 0);
    const payload = readSessionValue(value);
    expect(payload).toMatchObject({ adminId: "admin-1", v: 0 });
  });

  it("should_reject_tampered_cookie", () => {
    process.env.SESSION_SECRET =
      process.env.SESSION_SECRET || "test-secret-at-least-16-chars";
    const value = createSessionValue("admin-1", 0);
    expect(readSessionValue(value + "x")).toBeNull();
  });
});

describe("password scrypt", () => {
  it("should_verify_hashed_password", async () => {
    const hash = await hashPassword("correct-horse");
    expect(await verifyPassword("correct-horse", hash)).toBe(true);
    expect(await verifyPassword("wrong", hash)).toBe(false);
  });
});

describe("rate limit", () => {
  it("should_block_after_limit", () => {
    resetRateLimits();
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit("test:user", 5, 60_000).ok).toBe(true);
    }
    expect(checkRateLimit("test:user", 5, 60_000).ok).toBe(false);
  });
});
