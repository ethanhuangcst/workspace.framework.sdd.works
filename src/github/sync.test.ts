import { afterEach, describe, expect, it } from "vitest";
import {
  clearFrameworkTreeCache,
  createFixtureGitHubPort,
  fetchRepoTreeCached,
  flatPathsToTree,
  getGitHubPort,
  setGitHubPortForTests,
} from "./sync";

describe("flatPathsToTree", () => {
  it("should_nest_dirs_and_files", () => {
    const tree = flatPathsToTree([
      { path: "skills", type: "tree" },
      { path: "skills/tdd/SKILL.md", type: "blob" },
      { path: "rules/dod.mdc", type: "blob" },
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

  it("should_use_fixture_when_GITHUB_FIXTURE_set", async () => {
    process.env.GITHUB_FIXTURE = "1";
    const port = getGitHubPort();
    expect(await port.checkRepoAccessible("fixture", "sdd-framework")).toBe(
      true,
    );
    expect(await port.checkRepoAccessible("fixture", "missing")).toBe(false);
    const tree = await port.fetchRepoTree("fixture", "sdd-framework");
    expect(tree.some((n) => n.name === "skills/")).toBe(true);
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
