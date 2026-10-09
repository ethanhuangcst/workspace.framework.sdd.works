import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const WORKFLOW = join(process.cwd(), ".github", "workflows", "release.yml");

const RELEASE_ASSETS = [
  "dist/sdd-mcp-darwin-arm64",
  "dist/sdd-mcp-darwin-x64",
  "dist/sdd-mcp-linux-arm64",
  "dist/sdd-mcp-linux-x64",
  "dist/sdd-mcp-windows-x64.exe",
] as const;

describe("feature-80 github release workflow", () => {
  it("should_upload_five_sdd_mcp_assets_on_v_tag", () => {
    const yaml = readFileSync(WORKFLOW, "utf8");

    expect(yaml).toContain('tags:');
    expect(yaml).toMatch(/-\s+"v\*"/);
    expect(yaml).toContain("npm run mcp:build");

    for (const asset of RELEASE_ASSETS) {
      expect(yaml).toContain(asset);
    }
  });
});
