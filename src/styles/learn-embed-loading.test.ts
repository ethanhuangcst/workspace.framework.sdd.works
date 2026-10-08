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

describe("learn embed loading (ADR-120 / WA-17)", () => {
  it("should_center_loading_indicator_above_skeleton", () => {
    const block = ruleBlock(portalCss, ".learn-embed-loading-indicator");
    expect(block).toMatch(/z-index:\s*2/);
    expect(block).toMatch(/align-items:\s*center/);
    expect(block).toMatch(/justify-content:\s*center/);
  });

  it("should_hide_iframe_paint_while_loading", () => {
    const block = ruleBlock(portalCss, ".learn-embed-frame--loading");
    expect(block).toMatch(/visibility:\s*hidden/);
  });

  it("should_pulse_skeleton_background_not_cell_opacity", () => {
    expect(portalCss).toMatch(
      /@keyframes learn-embed-skeleton-pulse[\s\S]*background-color:\s*var\(--fill\)/,
    );
    expect(portalCss).not.toMatch(
      /@keyframes learn-embed-skeleton-pulse[\s\S]*opacity:\s*0\.55/,
    );
  });
});
