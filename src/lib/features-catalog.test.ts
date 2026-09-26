import {
  mkdirSync,
  mkdtempSync,
  writeFileSync,
  rmSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import {
  readFeaturesCatalog,
  readFeaturesFromDir,
  readPackageFeaturesCatalog,
  renderFeaturesMarkdown,
} from "./features-catalog";
import {
  MANIFEST_FILENAME,
  packageTarPath,
  unpackedDir,
} from "@/core/sync/paths";

const dirs: string[] = [];
const originalCacheDir = process.env.SDD_PACKAGE_CACHE_DIR;

function track(dir: string): string {
  dirs.push(dir);
  return dir;
}

function seedCache(files: Record<string, string>): { dir: string; sha: string } {
  const dir = track(mkdtempSync(join(tmpdir(), "features-cache-")));
  process.env.SDD_PACKAGE_CACHE_DIR = dir;
  const sha = "sha-features";
  const unpacked = unpackedDir(sha);
  mkdirSync(unpacked, { recursive: true });
  writeFileSync(packageTarPath(sha), "fake-tarball");
  for (const [name, body] of Object.entries(files)) {
    writeFileSync(join(unpacked, name), body);
  }
  writeFileSync(
    join(dir, MANIFEST_FILENAME),
    JSON.stringify({
      latestCommit: sha,
      latestVersion: "v1.0.0",
      versions: [{ id: "v1.0.0", commitSha: sha }],
      inventory: {
        skills: [],
        rules: [],
        agents: [],
        workflows: [],
        other: Object.keys(files),
      },
      syncedAt: "2026-01-01T00:00:00.000Z",
    }),
  );
  return { dir, sha };
}

afterEach(() => {
  while (dirs.length > 0) {
    const dir = dirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
  if (originalCacheDir === undefined) {
    delete process.env.SDD_PACKAGE_CACHE_DIR;
  } else {
    process.env.SDD_PACKAGE_CACHE_DIR = originalCacheDir;
  }
});

describe("renderFeaturesMarkdown", () => {
  it("should_wrap_name_and_description_when_em_dash_present", () => {
    const html = renderFeaturesMarkdown(
      "- ethan — The scrum-master agent for this service.\n",
    );
    expect(html).toContain('class="feature-name">ethan</span>');
    expect(html).toContain(
      'class="feature-desc">The scrum-master agent for this service.</span>',
    );
  });

  it("should_escape_raw_html_and_drop_script", () => {
    const html = renderFeaturesMarkdown(
      '- name — <script>alert(1)</script>\n\n<script>x</script>\n',
    );
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("should_drop_javascript_links", () => {
    const html = renderFeaturesMarkdown("[go](javascript:alert(1))\n");
    expect(html).not.toContain("javascript:");
    expect(html).toContain("go");
  });
});

describe("readFeaturesCatalog", () => {
  it("should_use_cache_english_when_present", () => {
    seedCache({
      "features.en.md": "## Features\n\n### Agents\n\n- ethan — Cache English.\n",
    });
    const result = readFeaturesCatalog("en");
    expect(result.source).toBe("cache");
    expect(result.sourceLocale).toBe("en");
    expect(result.html).toContain("Cache English");
  });

  it("should_use_cache_chinese_when_present", () => {
    seedCache({
      "features.en.md": "## Features\n\n- ethan — English only.\n",
      "features.zh-Hans.md":
        "## 功能\n\n### Agents\n\n- ethan — 缓存简体。\n",
    });
    const result = readFeaturesCatalog("zh-Hans");
    expect(result.source).toBe("cache");
    expect(result.sourceLocale).toBe("zh-Hans");
    expect(result.html).toContain("缓存简体");
  });

  it("should_use_cache_english_when_cache_chinese_missing", () => {
    seedCache({
      "features.en.md": "## Features\n\n- ethan — Cache fallback English.\n",
    });
    const result = readFeaturesCatalog("zh-Hant");
    expect(result.source).toBe("cache");
    expect(result.sourceLocale).toBe("en");
    expect(result.html).toContain("Cache fallback English");
  });

  it("should_use_package_when_cache_missing", () => {
    process.env.SDD_PACKAGE_CACHE_DIR = track(
      mkdtempSync(join(tmpdir(), "features-empty-")),
    );
    const result = readFeaturesCatalog("en");
    expect(result.source).toBe("package");
    expect(result.sourceLocale).toBe("en");
    expect(result.html).toContain('class="feature-name">ethan</span>');
  });

  it("should_use_package_when_cache_has_no_english_file", () => {
    seedCache({
      "features.zh-Hans.md": "## 功能\n\n- ethan — Only Chinese in cache.\n",
    });
    const result = readFeaturesCatalog("en");
    expect(result.source).toBe("package");
    expect(result.html).toContain('class="feature-name">ethan</span>');
  });
});

describe("readPackageFeaturesCatalog", () => {
  it("should_render_ethan_from_english_package_file", () => {
    process.env.SDD_PACKAGE_CACHE_DIR = track(
      mkdtempSync(join(tmpdir(), "features-empty-pkg-")),
    );
    const result = readPackageFeaturesCatalog("en");
    expect(result.source).toBe("package");
    expect(result.sourceLocale).toBe("en");
    expect(result.html).toContain('class="feature-name">ethan</span>');
  });

  it("should_use_english_when_zh_Hant_file_missing", () => {
    const dir = track(mkdtempSync(join(tmpdir(), "features-")));
    writeFileSync(
      join(dir, "features.en.md"),
      "## Features\n\n### Agents\n\n- ethan — English coach.\n",
    );
    const result = readFeaturesFromDir(dir, "zh-Hant");
    expect(result.sourceLocale).toBe("en");
    expect(result.html).toContain("English coach");
  });
});
