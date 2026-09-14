import { afterEach, describe, expect, it } from "vitest";
import {
  KeysEncryptionError,
  decryptKeyValue,
  encryptKeyValue,
  resolveEncryptionKey,
} from "./keys-crypto";
import { createKeySchema, keyFieldErrorKey } from "./keys";

const FIXTURE_HEX =
  "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

describe("keys-crypto", () => {
  afterEach(() => {
    delete process.env.KEYS_ENCRYPTION_KEY;
  });

  it("should_round_trip_plaintext_when_hex_key_configured", () => {
    const cipher = encryptKeyValue("sk-secret-value", FIXTURE_HEX);
    expect(cipher.startsWith("v1:")).toBe(true);
    expect(decryptKeyValue(cipher, FIXTURE_HEX)).toBe("sk-secret-value");
  });

  it("should_reject_missing_encryption_key", () => {
    expect(() => resolveEncryptionKey(undefined)).toThrow(KeysEncryptionError);
    expect(() => encryptKeyValue("x", "")).toThrow(/not configured/);
  });

  it("should_reject_tampered_ciphertext", () => {
    const cipher = encryptKeyValue("hello", FIXTURE_HEX);
    const parts = cipher.split(":");
    parts[3] = Buffer.from("tampered").toString("base64url");
    expect(() => decryptKeyValue(parts.join(":"), FIXTURE_HEX)).toThrow();
  });
});

describe("createKeySchema", () => {
  it("should_accept_english_key_name", () => {
    const parsed = createKeySchema.safeParse({
      name: "cursor-prod",
      description: "Anthropic",
      value: "sk-test",
    });
    expect(parsed.success).toBe(true);
  });

  it("should_reject_non_english_key_name", () => {
    const parsed = createKeySchema.safeParse({
      name: "密钥",
      description: "",
      value: "sk-test",
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(keyFieldErrorKey(parsed.error.issues[0])).toBe(
        "errors.key_name_invalid",
      );
    }
  });

  it("should_reject_chinese_in_key_value", () => {
    const parsed = createKeySchema.safeParse({
      name: "cursor-prod",
      description: "",
      value: "sk-密钥",
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(keyFieldErrorKey(parsed.error.issues[0])).toBe(
        "errors.key_value_no_chinese",
      );
    }
  });

  it("should_reject_name_starting_with_digit", () => {
    const parsed = createKeySchema.safeParse({
      name: "1bad",
      value: "x",
    });
    expect(parsed.success).toBe(false);
  });
});
