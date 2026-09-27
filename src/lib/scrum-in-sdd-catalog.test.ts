import {
  mkdirSync,
  mkdtempSync,
  writeFileSync,
  rmSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { renderPortalMarkdown } from "./features-catalog";
import { readScrumInSddCatalog } from "./scrum-in-sdd-catalog";
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
  const dir = track(mkdtempSync(join(tmpdir(), "scrum-cache-")));
  process.env.SDD_PACKAGE_CACHE_DIR = dir;
  const sha = "sha-scrum";
  const unpacked = unpackedDir(sha);
  mkdirSync(unpacked, { recursive: true });
  writeFileSync(packageTarPath(sha), "fake-tarball");
  for (const [name, body] of Object.entries(files)) {
    const path = join(unpacked, name);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, body);
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

describe("renderPortalMarkdown", () => {
  it("should_render_bold_inside_list_items", () => {
    const html = renderPortalMarkdown(
      "- **Part I** summarizes the 2020 Scrum Guide.\n",
    );
    expect(html).toContain("<strong>Part I</strong>");
    expect(html).not.toContain("**");
  });

  it("should_keep_em_dash_line_as_one_text_node", () => {
    const html = renderPortalMarkdown(
      "- KEEP — classic Scrum roles stay.\n",
    );
    expect(html).not.toContain('class="feature-name"');
    expect(html).not.toContain('class="feature-desc"');
    expect(html).toContain("KEEP — classic Scrum roles stay.");
  });

  it("should_escape_raw_html_and_drop_script", () => {
    const html = renderPortalMarkdown(
      "- item <script>alert(1)</script>\n\n<script>x</script>\n",
    );
    expect(html).not.toContain("<script>");
    expect(html).toContain("item");
  });

  it("should_drop_javascript_links", () => {
    const html = renderPortalMarkdown("[go](javascript:alert(1))\n");
    expect(html).not.toContain("javascript:");
    expect(html).toContain("go");
  });
});

describe("readScrumInSddCatalog", () => {
  it("should_use_cache_english_when_present", () => {
    seedCache({
      "content/scrum-in-sdd/scrum-in-sdd.en.md":
        "# Scrum in SDD\n\nCache English body.\n",
    });
    const result = readScrumInSddCatalog("en");
    expect(result.source).toBe("cache");
    expect(result.sourceLocale).toBe("en");
    expect(result.html).toContain("Cache English body");
  });

  it("should_use_cache_chinese_when_present", () => {
    seedCache({
      "content/scrum-in-sdd/scrum-in-sdd.en.md": "# Scrum in SDD\n\nEnglish.\n",
      "content/scrum-in-sdd/scrum-in-sdd.zh-Hans.md":
        "# Scrum in SDD\n\n缓存简体。\n",
    });
    const result = readScrumInSddCatalog("zh-Hans");
    expect(result.source).toBe("cache");
    expect(result.sourceLocale).toBe("zh-Hans");
    expect(result.html).toContain("缓存简体");
  });

  it("should_use_cache_english_when_cache_chinese_missing", () => {
    seedCache({
      "content/scrum-in-sdd/scrum-in-sdd.en.md":
        "# Scrum in SDD\n\nCache fallback English.\n",
    });
    const result = readScrumInSddCatalog("zh-Hant");
    expect(result.source).toBe("cache");
    expect(result.sourceLocale).toBe("en");
    expect(result.html).toContain("Cache fallback English");
  });

  it("should_use_package_when_cache_missing", () => {
    process.env.SDD_PACKAGE_CACHE_DIR = track(
      mkdtempSync(join(tmpdir(), "scrum-empty-")),
    );
    const result = readScrumInSddCatalog("en");
    expect(result.source).toBe("package");
    expect(result.sourceLocale).toBe("en");
    expect(result.html).toContain("Scrum in SDD");
  });

  it("should_use_package_when_cache_has_no_english_file", () => {
    seedCache({
      "content/scrum-in-sdd/scrum-in-sdd.zh-Hans.md":
        "# Scrum in SDD\n\nOnly Chinese.\n",
    });
    const result = readScrumInSddCatalog("en");
    expect(result.source).toBe("package");
    expect(result.html).toContain("Scrum in SDD");
  });

  it("should_ignore_scrum_files_at_unpack_root", () => {
    seedCache({
      "scrum-in-sdd.en.md": "# Root\n\nRoot only.\n",
    });
    const result = readScrumInSddCatalog("en");
    expect(result.source).toBe("package");
    expect(result.html).not.toContain("Root only");
  });

  it("should_not_split_em_dash_in_scrum_html", () => {
    seedCache({
      "content/scrum-in-sdd/scrum-in-sdd.en.md":
        "# Scrum in SDD\n\n- KEEP — classic roles stay.\n",
    });
    const result = readScrumInSddCatalog("en");
    expect(result.html).not.toContain('class="feature-name"');
    expect(result.html).toContain("KEEP — classic roles stay.");
  });
});
