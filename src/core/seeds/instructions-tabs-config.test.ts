import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  INSTRUCTIONS_TABS_PACK_RELATIVE,
  resolveInstructionsTabLabel,
  validateInstructionsTabsConfig,
} from "./instructions-tabs-config";

const packRoot = join(process.cwd(), "pack.framework.sdd.works");
const bundledConfigPath = join(
  process.cwd(),
  "src/content/.instructions-tabs.json",
);
const packConfigPath = join(packRoot, INSTRUCTIONS_TABS_PACK_RELATIVE);

function baseValidDoc(): Record<string, unknown> {
  return {
    version: 1,
    tabs: [
      {
        type: "code",
        id: "setup",
        labels: {
          en: "Setup",
          "zh-Hans": "安装",
          "zh-Hant": "安裝",
        },
        queryParam: "setup",
        panelTestId: "panel-setup",
      },
      {
        type: "content",
        id: "features",
        labels: {
          en: "Features",
          "zh-Hans": "功能",
          "zh-Hant": "功能",
        },
        queryParam: "features",
        panelTestId: "panel-features",
        paths: {
          en: "content/features/features.en.md",
        },
      },
    ],
  };
}

describe("CE-TABS-01 — default bundled config", () => {
  it("should_pass_when_bundled_json_matches_pack_tree", () => {
    const raw = readFileSync(bundledConfigPath, "utf8");
    const doc = JSON.parse(raw) as unknown;

    const result = validateInstructionsTabsConfig(doc, {
      contentRoot: packRoot,
      codeAllowlist: ["setup"],
      checkFilesExist: true,
    });

    expect(result).toEqual({ ok: true });

    const record = doc as { tabs: { id: string }[] };
    expect(record.tabs.map((t) => t.id)).toEqual([
      "setup",
      "features",
      "scrum-in-sdd",
      "knowledge",
      "learn-scrum-in-sdd",
    ]);
  });

  it("should_pass_when_pack_repo_copy_exists_and_matches_bundled", () => {
    const bundled = readFileSync(bundledConfigPath, "utf8");
    const packCopy = readFileSync(packConfigPath, "utf8");
    expect(packCopy).toBe(bundled);

    const doc = JSON.parse(packCopy) as unknown;
    const result = validateInstructionsTabsConfig(doc, {
      contentRoot: packRoot,
      codeAllowlist: ["setup"],
    });
    expect(result).toEqual({ ok: true });
  });
});

describe("CE-TABS-02 — reject invalid config", () => {
  it("should_fail_when_version_is_not_1", () => {
    const doc = { ...baseValidDoc(), version: 2 };
    const result = validateInstructionsTabsConfig(doc, {
      contentRoot: packRoot,
      checkFilesExist: false,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((e) => e.includes("version"))).toBe(true);
    }
  });

  it("should_fail_when_tabs_is_empty", () => {
    const doc = { version: 1, tabs: [] };
    const result = validateInstructionsTabsConfig(doc, {
      contentRoot: packRoot,
      checkFilesExist: false,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toContain("tabs must not be empty");
    }
  });

  it("should_fail_when_id_or_queryParam_duplicates", () => {
    const doc = baseValidDoc();
    const tabs = doc.tabs as Record<string, unknown>[];
    tabs.push({ ...tabs[1], id: "features-2" });
    const result = validateInstructionsTabsConfig(doc, {
      contentRoot: packRoot,
      checkFilesExist: false,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((e) => e.includes("duplicate queryParam"))).toBe(
        true,
      );
    }
  });

  it("should_fail_when_code_id_not_in_allowlist", () => {
    const doc = baseValidDoc();
    const tabs = doc.tabs as Record<string, unknown>[];
    tabs[0] = { ...tabs[0], id: "unknown-panel" };
    const result = validateInstructionsTabsConfig(doc, {
      contentRoot: packRoot,
      codeAllowlist: ["setup"],
      checkFilesExist: false,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((e) => e.includes("allowlist"))).toBe(true);
    }
  });

  it("should_fail_when_content_tab_missing_paths_en", () => {
    const doc = baseValidDoc();
    const tabs = doc.tabs as Record<string, unknown>[];
    tabs[1] = {
      ...tabs[1],
      paths: { "zh-Hans": "content/features/features.zh-Hans.md" },
    };
    const result = validateInstructionsTabsConfig(doc, {
      contentRoot: packRoot,
      checkFilesExist: false,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((e) => e.includes("paths.en"))).toBe(true);
    }
  });

  it("should_fail_when_path_contains_traversal", () => {
    const doc = baseValidDoc();
    const tabs = doc.tabs as Record<string, unknown>[];
    tabs[1] = {
      ...tabs[1],
      paths: { en: "content/features/../../etc/passwd" },
    };
    const result = validateInstructionsTabsConfig(doc, {
      contentRoot: packRoot,
      checkFilesExist: false,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((e) => e.includes("unsafe") || e.includes(".."))).toBe(
        true,
      );
    }
  });

  it("should_fail_when_embed_host_is_not_allowlisted", () => {
    const doc = baseValidDoc();
    (doc.tabs as unknown[]).push({
      type: "embedded_external_page",
      id: "learn-scrum-in-sdd",
      labels: { en: "Learn Scrum in SDD" },
      queryParam: "learn-scrum-in-sdd",
      panelTestId: "panel-learn-scrum",
      urls: { en: "https://example.com/learn/" },
    });
    const result = validateInstructionsTabsConfig(doc, {
      contentRoot: packRoot,
      checkFilesExist: false,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((e) => e.includes("example.com"))).toBe(true);
    }
  });

  it("should_fail_when_labelKey_is_present", () => {
    const doc = baseValidDoc();
    const tabs = doc.tabs as Record<string, unknown>[];
    tabs[0] = { ...tabs[0], labelKey: "admin.guide.tab_setup" };
    const result = validateInstructionsTabsConfig(doc, {
      contentRoot: packRoot,
      checkFilesExist: false,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((e) => e.includes("labelKey"))).toBe(true);
    }
  });

  it("should_fail_when_labels_en_is_missing", () => {
    const doc = baseValidDoc();
    const tabs = doc.tabs as Record<string, unknown>[];
    tabs[0] = {
      ...tabs[0],
      labels: { "zh-Hans": "安装" },
    };
    const result = validateInstructionsTabsConfig(doc, {
      contentRoot: packRoot,
      checkFilesExist: false,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((e) => e.includes("labels.en"))).toBe(true);
    }
  });

  it("should_fail_when_labels_en_is_empty", () => {
    const doc = baseValidDoc();
    const tabs = doc.tabs as Record<string, unknown>[];
    tabs[0] = {
      ...tabs[0],
      labels: { en: "   " },
    };
    const result = validateInstructionsTabsConfig(doc, {
      contentRoot: packRoot,
      checkFilesExist: false,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((e) => e.includes("labels.en"))).toBe(true);
    }
  });
});

describe("resolveInstructionsTabLabel", () => {
  it("should_use_locale_label_when_present", () => {
    expect(
      resolveInstructionsTabLabel(
        { en: "Setup", "zh-Hans": "安装", "zh-Hant": "安裝" },
        "zh-Hans",
      ),
    ).toBe("安装");
  });

  it("should_fall_back_to_en_when_locale_absent", () => {
    expect(
      resolveInstructionsTabLabel({ en: "Setup", "zh-Hans": "安装" }, "zh-Hant"),
    ).toBe("Setup");
  });
});
