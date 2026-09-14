import { afterAll, describe, expect, it } from "vitest";
import { PrismaClient } from "@prisma/client";
import { encryptKeyValue, decryptKeyValue } from "@/lib/keys-crypto";

const hasDb = Boolean(process.env.DATABASE_URL);
const FIXTURE =
  process.env.KEYS_ENCRYPTION_KEY ??
  "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

describe.skipIf(!hasDb)("key store persistence", () => {
  const db = new PrismaClient();

  afterAll(async () => {
    await db.key.deleteMany({
      where: { keyName: { startsWith: "it_key_" } },
    });
    await db.$disconnect();
  });

  it("should_create_list_update_and_delete_encrypted_key", async () => {
    process.env.KEYS_ENCRYPTION_KEY = FIXTURE;
    const name = `it_key_${Date.now()}`;
    const created = await db.key.create({
      data: {
        keyName: name,
        keyDescription: "integration",
        keyValue: encryptKeyValue("plain-secret", FIXTURE),
      },
    });
    expect(created.keyValue.startsWith("v1:")).toBe(true);
    expect(decryptKeyValue(created.keyValue, FIXTURE)).toBe("plain-secret");

    const listed = await db.key.findUniqueOrThrow({
      where: { keyId: created.keyId },
    });
    expect(listed.keyName).toBe(name);

    const updated = await db.key.update({
      where: { keyId: created.keyId },
      data: {
        keyName: `${name}_b`,
        keyValue: encryptKeyValue("plain-secret-2", FIXTURE),
      },
    });
    expect(decryptKeyValue(updated.keyValue, FIXTURE)).toBe("plain-secret-2");

    await db.key.delete({ where: { keyId: created.keyId } });
    const gone = await db.key.findUnique({ where: { keyId: created.keyId } });
    expect(gone).toBeNull();
  });
});
