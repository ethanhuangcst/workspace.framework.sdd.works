import { describe, expect, it } from "vitest";
import { loadNodeSetupCatalog } from "./node-setup-catalog";

describe("node-setup-catalog", () => {
  it("should_load_https_downloads_and_registries", () => {
    const catalog = loadNodeSetupCatalog();
    expect(catalog.version).toBe(1);
    expect(catalog.node_lts).toMatch(/^\d+\.\d+\.\d+$/);
    expect(catalog.downloads["darwin-arm64"]).toMatch(/^https:\/\//);
    expect(catalog.downloads["darwin-x64"]).toMatch(/^https:\/\//);
    expect(catalog.downloads["win32-x64"]).toMatch(/^https:\/\//);
    expect(catalog.npm_registries.default).toBe("https://registry.npmjs.org");
    expect(catalog.npm_registries.cn_hk).toBe(
      "https://registry.npmmirror.com",
    );
  });
});
