import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { MANIFEST_FILENAME, packageTarPath, unpackedDir } from "@/core/sync/paths";
import {
  postProcessAdminNoteHtml,
  readAdminNote,
  renderAdminNoteMarkdown,
} from "./admin-note";

const dirs: string[] = [];
const originalCacheDir = process.env.SDD_PACKAGE_CACHE_DIR;

function track(dir: string): string {
  dirs.push(dir);
  return dir;
}

function seedCache(adminNoteBody: string): void {
  const dir = track(mkdtempSync(join(tmpdir(), "admin-note-cache-")));
  process.env.SDD_PACKAGE_CACHE_DIR = dir;
  const sha = "sha-admin-note";
  const unpacked = unpackedDir(sha);
  mkdirSync(join(unpacked, "content"), { recursive: true });
  writeFileSync(join(unpacked, "content", ".admin-note.md"), adminNoteBody);
  writeFileSync(packageTarPath(sha), "fake-tarball");
  writeFileSync(
    join(dir, MANIFEST_FILENAME),
    JSON.stringify({
      latestCommit: sha,
      latestVersion: "v1",
      versions: [{ id: "v1", commitSha: sha }],
      inventory: { skills: [], rules: [], agents: [], workflows: [], other: [] },
      syncedAt: "2026-01-01T00:00:00.000Z",
    }),
  );
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

describe("renderAdminNoteMarkdown", () => {
  it("should_render_tables_with_content_table_class", () => {
    const html = renderAdminNoteMarkdown(
      "## Section\n\n| Col | Val |\n| --- | --- |\n| a | b |\n",
    );
    expect(html).toContain("content-table");
  });

  it("should_strip_script_tags", () => {
    const html = renderAdminNoteMarkdown(
      "Safe\n<script>alert(1)</script>\n",
    );
    expect(html.toLowerCase()).not.toContain("<script");
  });

  it("should_map_json_fence_to_codeblock_file", () => {
    const html = renderAdminNoteMarkdown(
      "```json\n{\n  \"version\": 1\n}\n```\n",
    );
    expect(html).toContain('class="codeblock codeblock--file"');
    expect(html).toContain('class="codeblock-tag">json</span>');
    expect(html).toContain('<pre class="codeblock-text mono">{');
    expect(html).toMatch(/\n\s{2}(&quot;|"version")/);
  });
});

describe("postProcessAdminNoteHtml", () => {
  it("should_preserve_pre_inner_whitespace", () => {
    const inner = '{\n  "a": 1\n}';
    const html = postProcessAdminNoteHtml(
      `<pre><code class="language-json">${inner}</code></pre>`,
    );
    expect(html).toContain(`<pre class="codeblock-text mono">${inner}</pre>`);
  });
});

describe("readAdminNote", () => {
  it("should_prefer_cache_over_package", () => {
    seedCache("# Cache-only title\n\nFrom cache.\n");
    const result = readAdminNote();
    expect(result?.source).toBe("cache");
    expect(result?.html).toContain("Cache-only title");
  });

  it("should_fall_back_to_package_when_cache_file_missing", () => {
    const dir = track(mkdtempSync(join(tmpdir(), "admin-note-empty-cache-")));
    process.env.SDD_PACKAGE_CACHE_DIR = dir;
    const sha = "sha-no-note";
    mkdirSync(unpackedDir(sha), { recursive: true });
    writeFileSync(packageTarPath(sha), "fake-tarball");
    writeFileSync(
      join(dir, MANIFEST_FILENAME),
      JSON.stringify({
        latestCommit: sha,
        latestVersion: "v1",
        versions: [{ id: "v1", commitSha: sha }],
        inventory: { skills: [], rules: [], agents: [], workflows: [], other: [] },
        syncedAt: "2026-01-01T00:00:00.000Z",
      }),
    );

    const result = readAdminNote();
    expect(result?.source).toBe("package");
    const bundled = readFileSync(
      join(process.cwd(), "src/content/.admin-note.md"),
      "utf8",
    );
    expect(bundled).toContain("Notes to the admin");
    expect(result?.html).toContain("Notes to the admin");
  });
});
