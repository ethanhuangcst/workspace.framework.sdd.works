import { afterAll, describe, expect, it } from "vitest";
import { PrismaClient } from "@prisma/client";

const hasDb = Boolean(process.env.DATABASE_URL);

describe.skipIf(!hasDb)("prisma admin persistence", () => {
  const db = new PrismaClient();

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should_read_seeded_admin", async () => {
    const admin = await db.admin.findUnique({
      where: { email: "me@ethanhuang.com" },
    });
    expect(admin?.username).toBe("admin");
    expect(admin?.status).toBe("ACTIVE");
  });
});
