import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const portalCss = readFileSync(join(process.cwd(), "src/styles/portal.css"), "utf8");

function ruleBlock(css: string, selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(
    new RegExp(`${escaped}\\s*(?:,[^{]+)?\\{([\\s\\S]*?)\\}`),
  );
  expect(match).not.toBeNull();
  return match![1];
}

describe("guide horizontal overflow (WA-14 / AC27)", () => {
  it("should_clip_document_horizontal_overflow", () => {
    const htmlBlock = ruleBlock(portalCss, "html");
    expect(htmlBlock).toMatch(/overflow-x:\s*clip/);
  });

  it("should_contain_guide_column_and_learn_embed", () => {
    expect(ruleBlock(portalCss, ".guide-shell .home-main")).toMatch(/min-width:\s*0/);
    expect(ruleBlock(portalCss, ".guide-shell .guide")).toMatch(/min-width:\s*0/);
    expect(ruleBlock(portalCss, ".guide-sticky")).toMatch(/overflow-x:\s*clip/);
    const frame = ruleBlock(portalCss, ".learn-embed-frame");
    expect(frame).toMatch(/max-width:\s*100%/);
    expect(frame).toMatch(/display:\s*block/);
  });

  it("should_allow_secret_input_to_shrink_below_32rem", () => {
    const input = ruleBlock(portalCss, ".secret-row-grid .input-box");
    expect(input).toMatch(/min-width:\s*0/);
    expect(input).toMatch(/max-width:\s*32rem/);
    expect(input).not.toMatch(/min-width:\s*32rem/);
    expect(input).not.toMatch(/flex:\s*0\s+0\s+32rem/);
  });
});
