import { describe, expect, it } from "vitest";
import {
  isUnderHome,
  validateExpandedPath,
  validatePathTemplate,
} from "./path-policy";

describe("path-policy", () => {
  it("should_accept_allow_listed_home_templates", () => {
    expect(validatePathTemplate("~/.cursor/skills/")).toBeNull();
    expect(validatePathTemplate("%USERPROFILE%\\.cursor\\skills\\")).toBeNull();
  });

  it("should_reject_escape_and_non_home_templates", () => {
    expect(validatePathTemplate("~/.cursor/../etc/")).toMatchObject({
      code: "path_rejected",
    });
    expect(validatePathTemplate("/etc/passwd")).toMatchObject({
      code: "path_rejected",
    });
  });

  it("should_accept_expanded_paths_under_home", () => {
    expect(
      validateExpandedPath("/Users/dev/.cursor/skills/", "/Users/dev", "/Users/dev"),
    ).toBeNull();
    expect(isUnderHome("/Users/dev/.cursor/skills/", "/Users/dev", "/Users/dev")).toBe(
      true,
    );
  });

  it("should_reject_etc_and_escape_after_expand", () => {
    expect(
      validateExpandedPath("/etc/passwd", "/Users/dev", "/Users/dev"),
    ).toMatchObject({ code: "path_rejected" });
    expect(
      validateExpandedPath("/Users/dev/.cursor/../etc/", "/Users/dev", "/Users/dev"),
    ).toMatchObject({ code: "path_rejected" });
  });
});
