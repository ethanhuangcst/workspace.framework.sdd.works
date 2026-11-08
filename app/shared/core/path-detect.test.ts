import { afterEach, describe, expect, it } from "vitest";
import {
  clearPathDetectCache,
  detectClient,
  resolveClientPaths,
} from "./path-detect";

afterEach(() => {
  clearPathDetectCache();
});

describe("detectClient", () => {
  it("should_map_cursor_and_claude_aliases", () => {
    expect(detectClient("cursor")).toBe("cursor");
    expect(detectClient("Cursor")).toBe("cursor");
    expect(detectClient("claude-code")).toBe("claude");
    expect(detectClient("Claude Code")).toBe("claude");
  });

  it("should_map_trae_and_codebuddy", () => {
    expect(detectClient("trae")).toBe("trae");
    expect(detectClient("trae-cn")).toBe("trae-cn");
    expect(detectClient("TRAE CN")).toBe("trae-cn");
    expect(detectClient("codebuddy")).toBe("codebuddy");
  });

  it("should_return_null_for_unknown", () => {
    expect(detectClient("unknown-cli-xyz")).toBeNull();
  });
});

describe("resolveClientPaths", () => {
  const home = "/Users/dev";

  it("should_resolve_cursor_from_seed", async () => {
    const result = await resolveClientPaths("cursor", {
      home,
      userProfile: home,
      os: "darwin",
      env: { HOME: home },
      skipLlm: true,
    });
    expect(result).toMatchObject({
      source: "seed",
      primary: { skills: "/Users/dev/.cursor/skills/" },
    });
    if (!("code" in result)) {
      expect(result.compat[0]?.skills).toBe("/Users/dev/.claude/skills/");
    }
  });

  it("should_honor_CLAUDE_CONFIG_DIR", async () => {
    const result = await resolveClientPaths("claude", {
      home,
      userProfile: home,
      os: "darwin",
      env: { HOME: home, CLAUDE_CONFIG_DIR: "/Users/dev/custom-claude" },
      skipLlm: true,
    });
    expect(result).toMatchObject({
      source: "env",
      primary: { skills: "/Users/dev/custom-claude/skills/" },
    });
  });

  it("should_honor_CODEX_HOME", async () => {
    const result = await resolveClientPaths("codex", {
      home,
      userProfile: home,
      os: "darwin",
      env: { HOME: home, CODEX_HOME: "/Users/dev/custom-codex" },
      skipLlm: true,
    });
    expect(result).toMatchObject({ source: "env" });
    if (!("code" in result)) {
      expect(result.primary.skills).toContain("/Users/dev/custom-codex");
    }
  });

  it("should_honor_CLINE_DATA_DIR_when_CLINE_DIR_unset", async () => {
    const result = await resolveClientPaths("cline", {
      home,
      userProfile: home,
      os: "darwin",
      env: { HOME: home, CLINE_DATA_DIR: "/Users/dev/custom-cline/data" },
      skipLlm: true,
    });
    expect(result).toMatchObject({
      source: "env",
      primary: { skills: "/Users/dev/custom-cline/skills/" },
    });
  });

  it("should_honor_COPILOT_CUSTOM_INSTRUCTIONS_DIRS", async () => {
    const result = await resolveClientPaths("copilot", {
      home,
      userProfile: home,
      os: "darwin",
      env: {
        HOME: home,
        COPILOT_CUSTOM_INSTRUCTIONS_DIRS: "/Users/dev/custom-copilot/instructions",
      },
      skipLlm: true,
    });
    expect(result).toMatchObject({ source: "env" });
    if (!("code" in result)) {
      expect(result.primary.skills).toBe("/Users/dev/custom-copilot/skills/");
      expect(result.primary.other).toBe("/Users/dev/custom-copilot/instructions/");
    }
  });

  it("should_honor_XDG_DATA_HOME_for_opencode", async () => {
    const linuxHome = "/home/dev";
    const result = await resolveClientPaths("opencode", {
      home: linuxHome,
      userProfile: linuxHome,
      os: "linux",
      env: {
        HOME: linuxHome,
        USERPROFILE: linuxHome,
        XDG_DATA_HOME: `${linuxHome}/.local/share`,
      },
      skipLlm: true,
    });
    expect(result).toMatchObject({
      source: "env",
      primary: { skills: "/home/dev/.local/share/opencode/skills/" },
    });
  });

  it("should_honor_CLINE_DIR_and_KIRO_HOME", async () => {
    const cline = await resolveClientPaths("cline", {
      home,
      userProfile: home,
      os: "darwin",
      env: { HOME: home, CLINE_DIR: "/Users/dev/custom-cline" },
      skipLlm: true,
    });
    const kiro = await resolveClientPaths("kiro", {
      home,
      userProfile: home,
      os: "darwin",
      env: { HOME: home, KIRO_HOME: "/Users/dev/custom-kiro" },
      skipLlm: true,
    });
    expect(cline).toMatchObject({
      source: "env",
      primary: { skills: "/Users/dev/custom-cline/skills/" },
    });
    expect(kiro).toMatchObject({
      source: "env",
      primary: { skills: "/Users/dev/custom-kiro/skills/" },
    });
  });

  it("should_use_config_when_skillsRoot_present", async () => {
    const result = await resolveClientPaths("cursor", {
      home,
      userProfile: home,
      os: "darwin",
      env: { HOME: home },
      readFile: (p) =>
        p.endsWith("mcp.json")
          ? JSON.stringify({ skillsRoot: "~/.custom-cursor/skills/" })
          : null,
      skipLlm: true,
    });
    expect(result).toMatchObject({ source: "config" });
    if (!("code" in result)) {
      expect(result.primary.skills).toContain(".custom-cursor/skills");
    }
  });

  it("should_fall_through_to_seed_when_config_has_no_path", async () => {
    const result = await resolveClientPaths("cursor", {
      home,
      userProfile: home,
      os: "darwin",
      env: { HOME: home },
      readFile: () => JSON.stringify({ mcpServers: {} }),
      skipLlm: true,
    });
    expect(result).toMatchObject({ source: "seed" });
  });

  it("should_use_llm_when_seed_unknown_and_llm_succeeds", async () => {
    const result = await resolveClientPaths("mystery", {
      home,
      userProfile: home,
      os: "darwin",
      env: { HOME: home },
      llmPort: {
        complete: async () =>
          JSON.stringify({
            skillsRoot: "~/.mystery/skills/",
            rulesRoot: "~/.mystery/rules/",
            agentsRoot: "~/.mystery/agents/",
            workflowsRoot: "~/.mystery/workflows/",
            confidence: 0.9,
          }),
      },
    });
    expect(result).toMatchObject({
      source: "llm",
      primary: { skills: "/Users/dev/.mystery/skills/" },
    });
  });

  it("should_return_client_unknown_when_unmapped_and_llm_fails", async () => {
    const result = await resolveClientPaths("unknown-cli-xyz", {
      home,
      userProfile: home,
      os: "darwin",
      env: { HOME: home },
      llmPort: {
        complete: async () => "not-json",
      },
    });
    expect(result).toMatchObject({
      code: "client_unknown",
      client: "unknown-cli-xyz",
    });
  });
});
