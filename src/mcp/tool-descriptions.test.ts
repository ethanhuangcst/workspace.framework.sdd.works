import { describe, expect, it } from "vitest";
import { messages } from "@/i18n/messages";
import { mcpToolDescription } from "./tool-descriptions";

const TOOLS = [
  "sdd_list_versions",
  "sdd_get_key",
  "sdd_install_framework",
  "sdd_update_framework",
] as const;

describe("mcpToolDescription", () => {
  for (const locale of ["en", "zh-Hans", "zh-Hant"] as const) {
    it(`should_resolve_all_tools_for_${locale}`, () => {
      for (const tool of TOOLS) {
        const desc = mcpToolDescription(tool, locale);
        expect(desc).toBeTruthy();
        expect(desc).not.toMatch(/^mcp\.tools\./);
        expect(desc.length).toBeGreaterThan(20);
      }
    });
  }

  it("should_fall_back_to_en_when_key_missing_in_overlay", () => {
    const key = "mcp.tools.sdd_list_versions";
    expect(messages["zh-Hans"][key]).toBeTruthy();
    expect(mcpToolDescription("sdd_list_versions", "zh-Hans")).toBe(
      messages["zh-Hans"][key],
    );
  });
});
