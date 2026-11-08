import { describe, expect, it } from "vitest";
import {
  loadNodeSetupCatalog,
  recommendNpmRegistry,
} from "./node-setup-catalog";

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
    expect(catalog.npm_registry_policy.mirror_regions).toEqual([
      "CN",
      "HK",
      "MO",
    ]);
  });

  it("should_recommend_mirror_for_cn_hk_mo", () => {
    const catalog = loadNodeSetupCatalog();
    for (const code of ["CN", "HK", "MO", "cn", "hk"]) {
      const rec = recommendNpmRegistry(catalog, code);
      expect(rec.recommended_npm_registry).toBe("mirror");
      expect(rec.recommended_registry_url).toBe(
        "https://registry.npmmirror.com",
      );
      expect(rec.detected_country).toBe(code.toUpperCase());
    }
  });

  it("should_recommend_default_for_us", () => {
    const catalog = loadNodeSetupCatalog();
    const rec = recommendNpmRegistry(catalog, "US");
    expect(rec.recommended_npm_registry).toBe("default");
    expect(rec.recommended_registry_url).toBe("https://registry.npmjs.org");
    expect(rec.detected_country).toBe("US");
  });

  it("should_recommend_default_when_country_missing_or_invalid", () => {
    const catalog = loadNodeSetupCatalog();
    for (const header of [null, undefined, "", "  ", "USA", "1"]) {
      const rec = recommendNpmRegistry(catalog, header);
      expect(rec.recommended_npm_registry).toBe("default");
      expect(rec.recommended_registry_url).toBe("https://registry.npmjs.org");
      expect(rec.detected_country).toBe("unknown");
    }
  });
});
