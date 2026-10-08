import { describe, expect, it } from "vitest";
import {
  resolveKnowledgeArticle,
  resolveKnowledgeFolderListing,
  validateKnowledgeIndex,
} from "./knowledge-folder";

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
  it("should_list_root_entries_from_bundled_seed", () => {
    const result = resolveKnowledgeFolderListing(
      "content/knowledge",
      [],
      "en",
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.listing.folderTitle).toBeNull();
    expect(result.listing.entries.map((e) => e.id)).toEqual([
      "invoke-agents",
      "call-skills",
      "archived",
    ]);
  });

  it("should_list_archived_subfolder_with_title", () => {
    const result = resolveKnowledgeFolderListing(
      "content/knowledge",
      ["archived"],
      "en",
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.listing.folderTitle).toBe("Archived");
    expect(result.listing.entries.some((e) => e.id === "invoke-agent-trae")).toBe(
      true,
    );
  });
});

describe("resolveKnowledgeArticle", () => {
  it("should_render_same_tab_markdown_for_archived_entry", () => {
    const result = resolveKnowledgeArticle(
      "content/knowledge",
      ["archived"],
      "invoke-agent-trae",
      "en",
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.article.html).toContain("internal_page_folder");
  });

  it("should_fail_for_unknown_doc_id", () => {
    const result = resolveKnowledgeArticle(
      "content/knowledge",
      ["archived"],
      "missing-doc",
      "en",
    );
    expect(result.ok).toBe(false);
  });
});
