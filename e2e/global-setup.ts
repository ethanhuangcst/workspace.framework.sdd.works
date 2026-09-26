import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/auth/password";

const E2E_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? "Sprint1Pass!";
const E2E_EMAIL =
  process.env.E2E_ADMIN_EMAIL ?? "e2e-admin@ethanhuang.com";

export default async function globalSetup() {
  process.env.DATABASE_URL ??=
    "postgresql://framework_sdd:framework_sdd@localhost:5435/framework_sdd";
  process.env.SESSION_SECRET ??= "ci-session-secret-at-least-16";

  const db = new PrismaClient();
  const passwordHash = await hashPassword(E2E_PASSWORD);

  // Fixture account for Playwright. Never overwrite me@ethanhuang.com.
  await db.admin.upsert({
    where: { email: E2E_EMAIL },
    update: { passwordHash, status: "ACTIVE" },
    create: {
      email: E2E_EMAIL,
      username: "e2eadmin",
      name: "E2E Admin",
      passwordHash,
      status: "ACTIVE",
    },
  });

  // Unit tests and local dev may leave rows encrypted with another KEYS_ENCRYPTION_KEY.
  await db.key.deleteMany({});
  await db.inviteToken.deleteMany({});
  await db.resetToken.deleteMany({});
  await db.setting.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", githubUrl: null },
    update: { githubUrl: null },
  });

  await db.$disconnect();
}
