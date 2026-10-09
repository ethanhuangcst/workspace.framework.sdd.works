import { afterEach, describe, expect, it } from "vitest";
import {
  clearFrameworkTreeCache,
  createFixtureGitHubPort,
  fetchRepoTreeCached,
  flatPathsToTree,
  getGitHubPort,
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
    const nodeEnv = process.env.NODE_ENV;
    const token = process.env.GITHUB_TOKEN;
    process.env.GITHUB_FIXTURE = "1";
    process.env.NODE_ENV = "production";
    delete process.env.GITHUB_TOKEN;
    try {
      expect(() => getGitHubPortForRepo("fixture")).toThrow(/GITHUB_TOKEN/);
    } finally {
      if (nodeEnv === undefined) delete process.env.NODE_ENV;
      else process.env.NODE_ENV = nodeEnv;
      if (token === undefined) delete process.env.GITHUB_TOKEN;
      else process.env.GITHUB_TOKEN = token;
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
