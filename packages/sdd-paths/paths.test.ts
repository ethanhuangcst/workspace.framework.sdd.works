import { describe, expect, it } from "vitest";
import pathMap from "./paths.json";
import { getPathsVersion, resolve, validatePathTemplate } from "./resolver";

describe("paths.json table validation", () => {
  it("should_have_version_and_clients", () => {
    expect(pathMap.version).toBeGreaterThanOrEqual(1);
    expect(Object.keys(pathMap.clients).length).toBeGreaterThan(0);
  });

  it("should_have_default_for_every_client", () => {
    for (const [client, entry] of Object.entries(pathMap.clients)) {
      expect(entry.default, `${client} missing default`).toBeDefined();
      expect(entry.default.skills).toBeTruthy();
      expect(entry.default.rules).toBeTruthy();
      expect(entry.default.other).toBeTruthy();
    }
  });

  it("should_keep_templates_under_home_without_escape", () => {
    for (const [client, entry] of Object.entries(pathMap.clients)) {
      for (const [osKey, roots] of Object.entries(entry)) {
        for (const [kind, p] of Object.entries(roots as Record<string, string>)) {
          expect(
            validatePathTemplate(p),
            `${client}/${osKey}/${kind}`,
          ).toBeNull();
          expect(p.includes(".."), `${client}/${osKey}/${kind}`).toBe(false);
          const okSlash =
            p.endsWith("/") || p.endsWith("\\");
          expect(okSlash, `${client}/${osKey}/${kind} trailing slash`).toBe(
            true,
          );
        }
      }
    }
  });
});

describe("resolve", () => {
  it("should_resolve_cursor_darwin_under_home", () => {
    const result = resolve("cursor", "darwin", undefined, {
      home: "/Users/dev",
      userProfile: "/Users/dev",
    });
    expect(result).toEqual({
      skills: "/Users/dev/.cursor/skills/",
      rules: "/Users/dev/.cursor/rules/",
      other: "/Users/dev/.cursor/sdd/",
    });
  });

  it("should_resolve_cursor_win32_under_userprofile", () => {
    const result = resolve("cursor", "win32", undefined, {
      home: "C:\\Users\\dev",
      userProfile: "C:\\Users\\dev",
    });
    expect("code" in result).toBe(false);
    if (!("code" in result)) {
      expect(result.skills.toLowerCase()).toContain("\\.cursor\\skills\\");
    }
  });

  it("should_prefer_explicit_overrides", () => {
    const result = resolve(
      "cursor",
      "darwin",
      { skills: "~/.custom/skills/" },
      { home: "/Users/dev", userProfile: "/Users/dev" },
    );
    expect(result).toMatchObject({
      skills: "/Users/dev/.custom/skills/",
    });
  });

  it("should_return_client_unknown_when_missing", () => {
    const result = resolve("unknown-cli", "darwin");
    expect(result).toEqual({ code: "client_unknown", client: "unknown-cli" });
  });

  it("should_reject_path_escape_in_override", () => {
    const result = resolve(
      "cursor",
      "darwin",
      { skills: "~/.cursor/../etc/" },
      { home: "/Users/dev", userProfile: "/Users/dev" },
    );
    expect(result).toMatchObject({ code: "path_rejected" });
  });

  it("should_expose_paths_version", () => {
    expect(getPathsVersion()).toBe(pathMap.version);
  });
});
