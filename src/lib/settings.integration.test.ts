import { afterAll, afterEach, describe, expect, it } from "vitest";
import { PrismaClient } from "@prisma/client";
import {
  checkRepoAccessible,
  clearFrameworkTreeCache,
  createFixtureGitHubPort,
  setGitHubPortForTests,
} from "@/github/sync";
import { parseGithubRepoUrl } from "@/lib/settings";

const hasDb = Boolean(process.env.DATABASE_URL);

describe.skipIf(!hasDb)("settings githubUrl persistence", () => {
  const db = new PrismaClient();

  afterEach(() => {
    setGitHubPortForTests(null);
    clearFrameworkTreeCache();
  });

  afterAll(async () => {
    await db.setting.upsert({
      where: { id: "singleton" },
      create: { id: "singleton", githubUrl: null },
      update: { githubUrl: null },
    });
    await db.$disconnect();
  });

  it("should_persist_only_when_fixture_repo_reachable", async () => {
    setGitHubPortForTests(createFixtureGitHubPort());

    const before = await db.setting.findUnique({ where: { id: "singleton" } });
    const previous = before?.githubUrl ?? null;

    const bad = parseGithubRepoUrl("https://github.com/fixture/missing");
    expect(bad).not.toBeNull();
    expect(await checkRepoAccessible(bad!.owner, bad!.repo)).toBe(false);

    await db.setting.upsert({
      where: { id: "singleton" },
      create: { id: "singleton", githubUrl: previous },
      update: { githubUrl: previous },
    });

    const good = parseGithubRepoUrl(
      "https://github.com/fixture/sdd-framework",
    )!;
    expect(await checkRepoAccessible(good.owner, good.repo)).toBe(true);

    await db.setting.upsert({
      where: { id: "singleton" },
      create: { id: "singleton", githubUrl: good.canonicalUrl },
      update: { githubUrl: good.canonicalUrl },
    });

    const saved = await db.setting.findUniqueOrThrow({
      where: { id: "singleton" },
    });
    expect(saved.githubUrl).toBe("https://github.com/fixture/sdd-framework");
  });
});
