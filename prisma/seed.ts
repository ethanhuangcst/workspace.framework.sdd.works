import { loadEnvConfig } from "@next/env";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/auth/password";

loadEnvConfig(process.cwd());

const prisma = new PrismaClient();

const DEFAULT_EMAIL = "me@ethanhuang.com";
const DEFAULT_USERNAME = "admin";
const DEFAULT_NAME = "Admin";

async function main() {
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL =
      "postgresql://framework_sdd:framework_sdd@localhost:5435/framework_sdd";
  }

  const email = (
    process.env.ADMIN_SEED_EMAIL?.trim() || DEFAULT_EMAIL
  ).toLowerCase();
  const username =
    process.env.ADMIN_SEED_USERNAME?.trim() || DEFAULT_USERNAME;
  const password = process.env.ADMIN_SEED_PASSWORD?.trim() ?? "";

  if (!password) {
    throw new Error(
      "ADMIN_SEED_PASSWORD is required for seed (set in .env.local / Portainer).",
    );
  }

  const passwordHash = await hashPassword(password);

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing?.passwordHash) {
    // Keep an existing non-empty hash (WA-12 / Web-portal-09).
    await prisma.admin.update({
      where: { email },
      data: {
        username,
        name: DEFAULT_NAME,
        status: "ACTIVE",
      },
    });
  } else {
    await prisma.admin.upsert({
      where: { email },
      update: {
        username,
        name: DEFAULT_NAME,
        passwordHash,
        status: "ACTIVE",
      },
      create: {
        email,
        username,
        name: DEFAULT_NAME,
        passwordHash,
        status: "ACTIVE",
      },
    });
  }

  await prisma.setting.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton", githubUrl: null },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
