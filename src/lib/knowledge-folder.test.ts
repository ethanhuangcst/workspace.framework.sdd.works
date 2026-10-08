import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import {
  MANIFEST_FILENAME,
  packageTarPath,
  unpackedDir,
} from "@/core/sync/paths";
import {
  resolveKnowledgeArticle,
  resolveKnowledgeFolderListing,
  validateKnowledgeIndex,
} from "./knowledge-folder";

const cacheDirs: string[] = [];
const originalCacheDir = process.env.SDD_PACKAGE_CACHE_DIR;

function seedKnowledgeCache(unpackedFiles: Record<string, string>): void {
  const dir = mkdtempSync(join(tmpdir(), "knowledge-cache-"));
  cacheDirs.push(dir);
  process.env.SDD_PACKAGE_CACHE_DIR = dir;
  const sha = "sha-knowledge";
  const unpacked = unpackedDir(sha);
  mkdirSync(unpacked, { recursive: true });
  writeFileSync(packageTarPath(sha), "fake");
  for (const [name, body] of Object.entries(unpackedFiles)) {
    const path = join(unpacked, name);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, body);
  }
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
  while (cacheDirs.length > 0) {
    const dir = cacheDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
  if (originalCacheDir === undefined) {
    delete process.env.SDD_PACKAGE_CACHE_DIR;
  } else {
    process.env.SDD_PACKAGE_CACHE_DIR = originalCacheDir;
  }
});

describe("validateKnowledgeIndex", () => {
  it("should_reject_file_entry_without_open", () => {
    const result = validateKnowledgeIndex({
      version: 1,
      entries: [
        {
          kind: "file",
          id: "doc-a",
          labels: { en: "Doc A" },
          paths: { en: "a.en.md" },
        },
      ],
    });
    expect(result.ok).toBe(false);
  });

  it("should_reject_duplicate_entry_ids", () => {
    const result = validateKnowledgeIndex({
      version: 1,
      entries: [
        {
          kind: "file",
          id: "dup",
          labels: { en: "One" },
          paths: { en: "one.en.md" },
          open: "same_tab",
        },
        {
          kind: "file",
          id: "dup",
          labels: { en: "Two" },
          paths: { en: "two.en.md" },
          open: "new_tab",
        },
      ],
    });
    expect(result.ok).toBe(false);
  });
});

describe("resolveKnowledgeFolderListing", () => {
  it("should_use_bundled_index_when_cache_index_is_invalid", () => {
    seedKnowledgeCache({
      "content/knowledge/.index.json": JSON.stringify({
        version: 1,
        entries: [],
      }),
    });
    const result = resolveKnowledgeFolderListing(
      "content/knowledge",
      [],
      "en",
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.listing.entries.map((e) => e.id)).toContain(
        "invoke-agents",
      );
    }
  });

  it("should_list_root_entries_from_bundled_seed", () => {
    const result = resolveKnowledgeFolderListing(
      "content/knowledge",
      [],
      "en",
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.listing.folderTitle).toBe("Knowledge");
    expect(result.listing.entries.map((e) => e.id)).toEqual([
      "invoke-agents",
      "call-skills",
    ]);
  });
});

describe("resolveKnowledgeArticle", () => {
  it("should_render_same_tab_markdown_for_root_entry", () => {
    const result = resolveKnowledgeArticle(
      "content/knowledge",
      [],
      "invoke-agents",
      "en",
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.article.html).toContain("custom agent");
  });

  it("should_fail_for_unknown_doc_id", () => {
    const result = resolveKnowledgeArticle(
      "content/knowledge",
      [],
      "missing-doc",
      "en",
    );
    expect(result.ok).toBe(false);
  });
});
