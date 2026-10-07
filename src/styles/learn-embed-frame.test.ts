import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const portalCss = readFileSync(join(process.cwd(), "src/styles/portal.css"), "utf8");

function frameBlock(css: string): string {
  const start = css.indexOf(".learn-embed-frame {");
  expect(start).toBeGreaterThanOrEqual(0);
  const open = css.indexOf("{", start);
  const close = css.indexOf("}", open);
  return css.slice(open + 1, close);
}

describe("learn-embed-frame CSS (ADR-112)", () => {
  it("should_use_square_frame_with_no_border_and_no_viewport_min_height", () => {
    const block = frameBlock(portalCss);
    expect(block).toMatch(/aspect-ratio:\s*1\s*\/\s*1/);
    expect(block).toMatch(/border:\s*0/);
    expect(block).toMatch(/width:\s*100%/);
    expect(block).toMatch(/height:\s*auto/);
    expect(block).not.toContain("min(72vh");
    expect(portalCss).not.toMatch(
      /\.learn-spike\s+\.learn-embed-frame\s*\{[^}]*min-height/,
    );
  });
});
