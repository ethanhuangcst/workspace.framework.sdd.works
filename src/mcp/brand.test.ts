import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  getMcpBrandIcons,
  getMcpMarkDataUri,
  resolveMcpMarkPath,
} from "./brand";

describe("getMcpBrandIcons", () => {
  it("should_resolve_square_mark_from_module_assets", () => {
    const path = resolveMcpMarkPath();
    expect(existsSync(path)).toBe(true);
  });

  it("should_return_https_icon_first_and_png_data_uri_fallback", () => {
    const icons = getMcpBrandIcons();
    expect(icons.length).toBeGreaterThanOrEqual(2);
    expect(icons[0]?.src).toMatch(/^https?:\/\/.+\/sdd-mark\.png$/);
    expect(icons[0]?.mimeType).toBe("image/png");
    expect(icons[0]?.sizes).toEqual(["128x128", "48x48"]);
    expect(icons[1]?.src.startsWith("data:image/png;base64,")).toBe(true);
    expect(icons.some((icon) => icon.src.includes("sdd-logo"))).toBe(false);
  });

  it("should_build_data_uri_from_embedded_fallback", () => {
    const dataUri = getMcpMarkDataUri();
    expect(dataUri?.startsWith("data:image/png;base64,")).toBe(true);
  });
});
