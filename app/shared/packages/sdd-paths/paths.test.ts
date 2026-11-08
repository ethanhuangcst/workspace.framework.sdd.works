import { describe, expect, it } from "vitest";
import pathMap from "./paths.json";
import {
  getPathsVersion,
  resolve,
  resolveTemplates,
  validatePathTemplate,
  type PathRoots,
} from "./resolver";

const OS_KEYS = new Set(["default", "darwin", "linux", "win32"]);
const CLIENTS = [
  "cursor",
  "codebuddy",
  "trae",
  "trae-cn",
  "claude",
  "cline",
  "codex",
  "copilot",
  "gemini",
  "kiro",
  "continue",
  "windsurf",
  "opencode",
] as const;

describe("paths.json table validation", () => {
  it("should_have_version_and_clients", () => {
    expect(pathMap.version).toBeGreaterThanOrEqual(3);
    expect(Object.keys(pathMap.clients).sort()).toEqual([...CLIENTS].sort());
  });

  it("should_have_default_and_artifact_fields_for_every_client", () => {
    for (const [client, entry] of Object.entries(pathMap.clients)) {
      expect(entry.default, `${client} missing default`).toBeDefined();
      expect(entry.default.skills).toBeTruthy();
      expect(entry.default.rules).toBeTruthy();
      expect(entry.default.agents).toBeTruthy();
      expect(entry.default.workflows).toBeTruthy();
      expect(entry.default.other).toBeTruthy();
    }
  });

  it("should_keep_templates_under_home_without_escape", () => {
    for (const [client, entry] of Object.entries(pathMap.clients)) {
      for (const [osKey, roots] of Object.entries(entry)) {
        if (!OS_KEYS.has(osKey)) continue;
        for (const [kind, p] of Object.entries(roots as Record<string, string>)) {
          expect(validatePathTemplate(p), `${client}/${osKey}/${kind}`).toBeNull();
          expect(p.includes(".."), `${client}/${osKey}/${kind}`).toBe(false);
          expect(
            p.endsWith("/") || p.endsWith("\\"),
            `${client}/${osKey}/${kind} trailing slash`,
          ).toBe(true);
        }
      }
      for (const [i, roots] of ((entry as { compat?: PathRoots[] }).compat ?? []).entries()) {
        for (const [kind, p] of Object.entries(roots)) {
          expect(
            validatePathTemplate(p as string),
            `${client}/compat/${i}/${kind}`,
          ).toBeNull();
        }
      }
    }
  });

  it("should_use_Rules_casing_for_codebuddy", () => {
    expect(pathMap.clients.codebuddy.default.rules).toContain("Rules");
  });
});

describe("resolve", () => {
  it("should_resolve_cursor_darwin_under_home", () => {
    const result = resolve("cursor", "darwin", undefined, {
      home: "/Users/dev",
      userProfile: "/Users/dev",
    });
    expect(result).toMatchObject({
      skills: "/Users/dev/.cursor/skills/",
      rules: "/Users/dev/.cursor/rules/",
      agents: "/Users/dev/.cursor/agents/",
      workflows: "/Users/dev/.cursor/workflows/",
      other: "/Users/dev/.cursor/sdd/",
    });
    if (!("code" in result)) {
      expect(result.compat[0]?.skills).toBe("/Users/dev/.claude/skills/");
    }
  });

  it("should_resolve_first_class_clients_on_darwin", () => {
    const home = { home: "/Users/dev", userProfile: "/Users/dev" };
    expect(resolve("cline", "darwin", undefined, home)).toMatchObject({
      skills: "/Users/dev/.cline/skills/",
    });
    expect(resolve("codex", "darwin", undefined, home)).toMatchObject({
      skills: "/Users/dev/.agents/skills/",
    });
    expect(resolve("copilot", "darwin", undefined, home)).toMatchObject({
      other: "/Users/dev/.copilot/",
    });
    expect(resolve("gemini", "darwin", undefined, home)).toMatchObject({
      skills: "/Users/dev/.gemini/skills/",
    });
    expect(resolve("kiro", "darwin", undefined, home)).toMatchObject({
      rules: "/Users/dev/.kiro/steering/",
    });
    expect(resolve("continue", "darwin", undefined, home)).toMatchObject({
      skills: "/Users/dev/.continue/skills/",
    });
    expect(resolve("windsurf", "darwin", undefined, home)).toMatchObject({
      rules: "/Users/dev/.windsurf/rules/",
    });
    expect(resolve("opencode", "darwin", undefined, home)).toMatchObject({
      skills: "/Users/dev/.config/opencode/skills/",
    });
  });

  it("should_resolve_first_class_clients_on_win32", () => {
    const home = { home: "C:\\Users\\dev", userProfile: "C:\\Users\\dev" };
    for (const client of ["cline", "codex", "copilot", "gemini", "kiro", "continue", "windsurf", "opencode"] as const) {
      const result = resolve(client, "win32", undefined, home);
      expect("code" in result, client).toBe(false);
      if (!("code" in result)) {
        expect(result.skills.toLowerCase()).toContain("users\\dev");
      }
    }
  });

  it("should_resolve_first_class_clients_on_linux", () => {
    const home = { home: "/home/dev", userProfile: "/home/dev" };
    for (const client of ["cline", "codex", "copilot", "gemini", "kiro", "continue", "windsurf", "opencode"] as const) {
      const result = resolve(client, "linux", undefined, home);
      expect("code" in result, client).toBe(false);
      if (!("code" in result)) {
        expect(result.skills.startsWith("/home/dev")).toBe(true);
      }
    }
  });

  it("should_resolve_codebuddy_trae_and_claude", () => {
    const home = { home: "/Users/dev", userProfile: "/Users/dev" };
    const codebuddy = resolve("codebuddy", "darwin", undefined, home);
    const trae = resolve("trae", "darwin", undefined, home);
    const traeCn = resolve("trae-cn", "darwin", undefined, home);
    const claude = resolve("claude", "darwin", undefined, home);
    expect(codebuddy).toMatchObject({
      skills: "/Users/dev/.codebuddy/skills/",
      rules: "/Users/dev/.codebuddy/Rules/",
    });
    expect(trae).toMatchObject({ skills: "/Users/dev/.trae/skills/" });
    expect(traeCn).toMatchObject({ skills: "/Users/dev/.trae-cn/skills/" });
    if (!("code" in traeCn)) {
      expect(traeCn.compat[0]?.skills).toBe("/Users/dev/.trae/skills/");
    }
    expect(claude).toMatchObject({ skills: "/Users/dev/.claude/skills/" });
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

describe("resolveTemplates", () => {
  it("should_return_unexpanded_cursor_templates", () => {
    const result = resolveTemplates("cursor", "darwin");
    expect(result).toMatchObject({
      skills: "~/.cursor/skills/",
      rules: "~/.cursor/rules/",
      agents: "~/.cursor/agents/",
      workflows: "~/.cursor/workflows/",
      other: "~/.cursor/sdd/",
    });
  });

  it("should_return_client_unknown_when_missing", () => {
    expect(resolveTemplates("unknown-cli", "darwin")).toEqual({
      code: "client_unknown",
      client: "unknown-cli",
    });
  });
});
