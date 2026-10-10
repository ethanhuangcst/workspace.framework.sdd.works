import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CANONICAL_PUBLIC_ORIGIN } from "@/mcp/public-origin";
import {
  MANUAL_CLIENTS,
  MANUAL_MCP_SAMPLE_TEMPLATE,
  fillManualOrigin,
  getManualCommand,
  getManualMcpSample,
} from "./setup-manual";

describe("setup-manual", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("should_build_mcp_sample_with_origin_and_no_command_field", () => {
    vi.stubEnv("NODE_ENV", "production");
    const sample = getManualMcpSample();
    expect(sample).toContain(`${CANONICAL_PUBLIC_ORIGIN}/mcp`);
    expect(sample).not.toMatch(/"command"/);
    expect(JSON.parse(sample).mcpServers["framework.sdd.works"]).toEqual({
      url: `${CANONICAL_PUBLIC_ORIGIN}/mcp`,
    });
  });

  it("should_list_five_clients_in_order", () => {
    expect(MANUAL_CLIENTS.map((c) => c.id)).toEqual([
      "claude",
      "codex",
      "cursor",
      "codebuddy-cn",
      "trae-cn",
    ]);
    expect(MANUAL_CLIENTS[0]?.type).toBe("command");
    expect(MANUAL_CLIENTS[2]?.type).toBe("paste");
  });

  it("should_substitute_origin_in_command_templates", () => {
    vi.stubEnv("NODE_ENV", "production");
    const claude = MANUAL_CLIENTS.find((c) => c.id === "claude");
    expect(claude?.type).toBe("command");
    if (claude?.type !== "command") return;
    expect(getManualCommand(claude.command)).toBe(
      `claude mcp add --transport http --scope user framework.sdd.works ${CANONICAL_PUBLIC_ORIGIN}/mcp`,
    );
  });

  it("should_match_prompt_md_url_commands_and_paths", () => {
    const promptPath = join(
      process.cwd(),
      "public",
      "agent-setup",
      "prompt.md",
    );
    const prompt = readFileSync(promptPath, "utf8");
    const origin = CANONICAL_PUBLIC_ORIGIN;

    expect(prompt).toContain(`"url": "${origin}/mcp"`);
    expect(prompt).toContain(
      `claude mcp add --transport http --scope user framework.sdd.works ${origin}/mcp`,
    );
    expect(prompt).toContain(
      `codex mcp add framework.sdd.works --url ${origin}/mcp`,
    );
    expect(prompt).toContain("Merge under `mcpServers` in `~/.cursor/mcp.json`");
    expect(prompt).toContain("Merge under `mcpServers` in `~/.codebuddy/mcp.json`");
    expect(prompt).toContain(
      "Merge under `mcpServers` in `~/Library/Application Support/Trae CN/User/mcp.json`",
    );

    const sample = fillManualOrigin(MANUAL_MCP_SAMPLE_TEMPLATE, origin);
    expect(prompt).toContain(`${origin}/mcp`);
    expect(sample).toContain(`${origin}/mcp`);

    for (const client of MANUAL_CLIENTS) {
      if (client.type === "command") {
        expect(prompt).toContain(fillManualOrigin(client.command, origin));
      } else {
        expect(prompt).toContain(client.path);
      }
    }
  });
});
