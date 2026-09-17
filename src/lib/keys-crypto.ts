import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGO = "aes-256-gcm";
const IV_LEN = 12;
const KEY_LEN = 32;
const PREFIX = "v1";

export class KeysEncryptionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "KeysEncryptionError";
  }
}

/** Resolve a 32-byte key from KEYS_ENCRYPTION_KEY (64-char hex or 32-byte base64). */
export function resolveEncryptionKey(
  raw: string | undefined = process.env.KEYS_ENCRYPTION_KEY,
): Buffer {
  if (!raw || !raw.trim()) {
    throw new KeysEncryptionError("KEYS_ENCRYPTION_KEY is not configured");
  }
  const value = raw.trim();
  if (/^[0-9a-fA-F]{64}$/.test(value)) {
    return Buffer.from(value, "hex");
  }
  try {
    const buf = Buffer.from(value, "base64");
    if (buf.length === KEY_LEN) return buf;
  } catch {
    /* fall through */
  }
  throw new KeysEncryptionError(
    "KEYS_ENCRYPTION_KEY must be 64 hex chars or 32-byte base64",
  );
}

/**
 * Encrypt plaintext for DB storage.
 * Format: `v1:<iv_b64>:<tag_b64>:<ciphertext_b64>`
 */
export function encryptKeyValue(
  plaintext: string,
  keyMaterial?: string,
): string {
  const key = resolveEncryptionKey(keyMaterial);
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return [
    PREFIX,
    iv.toString("base64url"),
    tag.toString("base64url"),
    encrypted.toString("base64url"),
  ].join(":");
}

export function decryptKeyValue(
  stored: string,
  keyMaterial?: string,
): string {
  const key = resolveEncryptionKey(keyMaterial);
  const parts = stored.split(":");
  if (parts.length !== 4 || parts[0] !== PREFIX) {
    throw new KeysEncryptionError("Invalid encrypted key payload");
  }
  const [, ivB64, tagB64, dataB64] = parts;
  const iv = Buffer.from(ivB64, "base64url");
  const tag = Buffer.from(tagB64, "base64url");
  const data = Buffer.from(dataB64, "base64url");
  try {
    const decipher = createDecipheriv(ALGO, key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(data), decipher.final()]).toString(
      "utf8",
    );
  } catch {
    throw new KeysEncryptionError(
      "Unable to decrypt key value — KEYS_ENCRYPTION_KEY may not match the key used at write time",
    );
  }
}
