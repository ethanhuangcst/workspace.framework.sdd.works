import { describe, expect, it } from "vitest";
import { parseGithubRepoUrl, updateSettingsSchema } from "./settings";

describe("parseGithubRepoUrl", () => {
  it("should_parse_canonical_https_github_url", () => {
    const parsed = parseGithubRepoUrl("https://github.com/org/sdd-framework");
    expect(parsed).toEqual({
      owner: "org",
      repo: "sdd-framework",
      canonicalUrl: "https://github.com/org/sdd-framework",
      display: "github.com/org/sdd-framework",
    });
  });

  it("should_accept_git_suffix_and_trailing_slash", () => {
    const parsed = parseGithubRepoUrl(
      "https://github.com/fixture/sdd-framework.git/",
    );
    expect(parsed?.owner).toBe("fixture");
    expect(parsed?.repo).toBe("sdd-framework");
  });

  it("should_reject_non_github_host", () => {
    expect(parseGithubRepoUrl("https://gitlab.com/org/repo")).toBeNull();
  });

  it("should_reject_missing_repo_segment", () => {
    expect(parseGithubRepoUrl("https://github.com/org")).toBeNull();
  });

  it("should_reject_http", () => {
    expect(parseGithubRepoUrl("http://github.com/org/repo")).toBeNull();
  });
});

describe("updateSettingsSchema", () => {
  it("should_require_url", () => {
    expect(updateSettingsSchema.safeParse({ url: "" }).success).toBe(false);
    expect(
      updateSettingsSchema.safeParse({
        url: "https://github.com/a/b",
      }).success,
    ).toBe(true);
  });
});
