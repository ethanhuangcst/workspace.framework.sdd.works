import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/auth/password";

const E2E_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? "Sprint1Pass!";

export default async function globalSetup() {
  process.env.DATABASE_URL ??=
    "postgresql://framework_sdd:framework_sdd@localhost:5435/framework_sdd";
  process.env.SESSION_SECRET ??= "ci-session-secret-at-least-16";

  const db = new PrismaClient();
  const passwordHash = await hashPassword(E2E_PASSWORD);
  await db.admin.upsert({
    where: { email: "me@ethanhuang.com" },
    update: { passwordHash, status: "ACTIVE" },
    create: {
      email: "me@ethanhuang.com",
      username: "admin",
      name: "Admin",
      passwordHash,
      status: "ACTIVE",
    },
  });
  await db.$disconnect();
}
