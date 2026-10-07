import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const portalCss = readFileSync(join(process.cwd(), "src/styles/portal.css"), "utf8");

function ruleBlock(css: string, selector: string): string {
  const needle = `\n${selector} {`;
  const start = css.indexOf(needle);
  expect(start).toBeGreaterThanOrEqual(0);
  const open = css.indexOf("{", start);
  const close = css.indexOf("}", open);
  return css.slice(open + 1, close);
}

describe("Learn embed spacing and codeblock tokens (ADR-117)", () => {
  it("should_space_iframe_to_fallback_at_15px", () => {
    const block = ruleBlock(portalCss, ".learn-embed-fallback");
    expect(block).toMatch(/margin:\s*15px\s+0\s+0/);
  });

  it("should_space_fallback_to_secret_at_45px", () => {
    const block = ruleBlock(portalCss, ".learn-embed-secret");
    expect(block).toMatch(/margin:\s*45px\s+0\s+0/);
  });

  it("should_use_global_codeblock_tokens", () => {
    const block = ruleBlock(portalCss, ".codeblock");
    expect(block).toMatch(/border:\s*1\.5px\s+solid\s+var\(--line-strong\)/);
    expect(block).toMatch(/border-radius:\s*0/);
    expect(block).toMatch(/background:\s*var\(--fill\)/);
  });

  it("should_box_secret_result_value_with_input_border", () => {
    const boxedStart = portalCss.indexOf("/* Boxed control");
    const boxedEnd = portalCss.indexOf("/* Table", boxedStart);
    const boxed = portalCss.slice(boxedStart, boxedEnd);
    expect(boxed).toContain("pre.input-box.secret-result-value");
    expect(boxed).toMatch(/border:\s*1\.5px\s+solid\s+var\(--line-strong\)/);
    expect(boxed).toMatch(/background:\s*var\(--fill\)/);
  });

  it("should_define_learn_embed_skeleton_grid", () => {
    const block = ruleBlock(portalCss, ".learn-embed-skeleton");
    expect(block).toMatch(
      /grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/,
    );
    expect(block).toMatch(/pointer-events:\s*none/);
  });

  it("should_align_secret_result_row_with_lookup_grid", () => {
    const grid = ruleBlock(portalCss, ".secret-row-grid");
    expect(grid).toMatch(/grid-template-columns:\s*minmax\(0,\s*32rem\)\s+6\.75rem/);
    const value = ruleBlock(portalCss, ".secret-result-value");
    expect(value).toMatch(/line-height:\s*1\.25/);
    const btn = ruleBlock(portalCss, ".secret-row-grid .btn.secret-action-btn");
    expect(btn).toMatch(/width:\s*6\.75rem/);
    expect(btn).toMatch(/height:\s*2\.125rem/);
  });
});
