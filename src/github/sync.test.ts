import { afterEach, describe, expect, it } from "vitest";
import {
  clearFrameworkTreeCache,
  createFixtureGitHubPort,
  fetchRepoTreeCached,
  flatPathsToTree,
  getGitHubPortForRepo,
  setGitHubPortForTests,
} from "./sync";

describe("flatPathsToTree", () => {
  it("should_nest_dirs_and_files", () => {
    const tree = flatPathsToTree([
      { path: "skills", type: "tree" },
      { path: "skills/tdd/SKILL.md", type: "blob" },
      { path: "rules/sdd-dod.mdc", type: "blob" },
    ]);
    expect(tree[0].name).toBe("rules/");
    expect(tree[1].name).toBe("skills/");
    const skills = tree.find((n) => n.name === "skills/");
    expect(skills?.children?.[0].name).toBe("tdd/");
  });
});

describe("fixture GitHub port", () => {
  afterEach(() => {
    setGitHubPortForTests(null);
    clearFrameworkTreeCache();
    delete process.env.GITHUB_FIXTURE;
  });

  it("should_ignore_GITHUB_FIXTURE_and_a_fixture_owner", () => {
    const env = process.env as Record<string, string | undefined>;
    const nodeEnv = env.NODE_ENV;
    const token = env.GITHUB_TOKEN;
    env.GITHUB_FIXTURE = "1";
    env.NODE_ENV = "production";
    delete env.GITHUB_TOKEN;
    try {
      expect(() => getGitHubPortForRepo("fixture")).toThrow(/GITHUB_TOKEN/);
    } finally {
      if (nodeEnv === undefined) delete env.NODE_ENV;
      else env.NODE_ENV = nodeEnv;
      if (token === undefined) delete env.GITHUB_TOKEN;
      else env.GITHUB_TOKEN = token;
    }
  });

  it("should_use_fixture_port_in_dev_when_GITHUB_FIXTURE_set", async () => {
    const env = process.env as Record<string, string | undefined>;
    const nodeEnv = env.NODE_ENV;
    env.GITHUB_FIXTURE = "1";
    env.NODE_ENV = "development";
    try {
      const port = getGitHubPortForRepo("fixture");
      const reachable = await port.checkRepoAccessible("fixture", "sdd-framework");
      expect(reachable).toBe(true);
    } finally {
      if (nodeEnv === undefined) delete env.NODE_ENV;
      else env.NODE_ENV = nodeEnv;
      delete env.GITHUB_FIXTURE;
    }
  });

  it("should_cache_tree_for_ttl", async () => {
    setGitHubPortForTests(createFixtureGitHubPort());
    const first = await fetchRepoTreeCached("fixture", "sdd-framework", 1_000);
    expect(first.fromCache).toBe(false);
    const second = await fetchRepoTreeCached(
      "fixture",
      "sdd-framework",
      1_000 + 5_000,
    );
    expect(second.fromCache).toBe(true);
    const third = await fetchRepoTreeCached(
      "fixture",
      "sdd-framework",
      1_000 + 31_000,
    );
    expect(third.fromCache).toBe(false);
  });
});
