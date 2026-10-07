import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  EXPECTED_LITE_RULES,
  EXPECTED_LITE_SKILLS,
} from "./lite-install-manifest";
import {
  LITE_INSTALL_RECEIPT_FILENAME,
  planLiteInstallReceipt,
  validateLiteInstallReceipt,
  type LiteInstallReceipt,
  type LiteInstallServerList,
} from "./lite-install-receipt";

const examplePath = join(
  process.cwd(),
  "pack.framework.sdd.works",
  LITE_INSTALL_RECEIPT_FILENAME,
);

const fullLiteFiles = [...EXPECTED_LITE_SKILLS, ...EXPECTED_LITE_RULES].sort(
  (a, b) => a.localeCompare(b),
);

function serverList(
  overrides: Partial<LiteInstallServerList> = {},
): LiteInstallServerList {
  return {
    package_version: "1.0.0",
    package_commit: "abc123",
    files: [...fullLiteFiles],
    ...overrides,
  };
}

function receipt(
  overrides: Partial<LiteInstallReceipt> = {},
): LiteInstallReceipt {
  return {
    schema_version: 1,
    package_version: "1.0.0",
    package_commit: "abc123",
    installed_at: "2026-10-07T12:00:00.000Z",
    files: [...fullLiteFiles],
    ...overrides,
  };
}

describe("CE-LITE-03 — receipt shape", () => {
  it("should_pass_when_example_json_matches_schema", () => {
    const raw = readFileSync(examplePath, "utf8");
    const doc = JSON.parse(raw) as unknown;

    const result = validateLiteInstallReceipt(doc);

    expect(result).toEqual({ ok: true });
    const record = doc as LiteInstallReceipt;
    expect(record.schema_version).toBe(1);
    expect(record.files).toEqual(fullLiteFiles);
  });

  it("should_fail_when_pack_complete_is_present", () => {
    const doc = {
      ...receipt(),
      pack_complete: true,
    };

    const result = validateLiteInstallReceipt(doc);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((e) => e.includes("pack_complete"))).toBe(
        true,
      );
    }
  });

  it("should_fail_when_files_includes_agents_path", () => {
    const doc = receipt({
      files: ["agents/ethan.md", ...fullLiteFiles],
    });

    const result = validateLiteInstallReceipt(doc);

    expect(result.ok).toBe(false);
  });
});

describe("CE-LITE-04 — merge plan", () => {
  it("should_return_already_up_to_date_when_receipt_and_disk_match_server_list", () => {
    const prev = receipt();
    const next = serverList();
    const onDisk = new Set(fullLiteFiles);

    const result = planLiteInstallReceipt(prev, next, onDisk);

    expect(result).toEqual({
      kind: "already_up_to_date",
    });
  });

  it("should_list_deletes_for_paths_removed_from_server_list", () => {
    const prev = receipt({
      files: [
        "skills/old-name/SKILL.md",
        "skills/fullstack-engineer/SKILL.md",
        "rules/friendly-language.mdc",
      ],
    });
    const next = serverList({
      files: [
        "skills/fullstack-engineer/SKILL.md",
        "rules/friendly-language.mdc",
      ],
    });
    const onDisk = new Set(next.files);

    const result = planLiteInstallReceipt(prev, next, onDisk);

    expect(result.kind).toBe("plan");
    if (result.kind === "plan") {
      expect(result.deletes).toEqual(["skills/old-name/SKILL.md"]);
      expect(result.downloads).toEqual(
        [...next.files].sort((a, b) => a.localeCompare(b)),
      );
      expect(result.writeReceipt).toBe(true);
    }
  });

  it("should_not_authorize_receipt_write_when_a_next_path_is_missing_on_disk", () => {
    const next = serverList({
      files: ["skills/fullstack-engineer/SKILL.md", "rules/friendly-language.mdc"],
    });
    const onDisk = new Set(["skills/fullstack-engineer/SKILL.md"]);

    const result = planLiteInstallReceipt(null, next, onDisk);

    expect(result.kind).toBe("plan");
    if (result.kind === "plan") {
      expect(result.writeReceipt).toBe(false);
    }
  });

  it("should_keep_previous_receipt_implied_when_writeReceipt_is_false", () => {
    const prev = receipt({ package_version: "0.9.0" });
    const next = serverList({ package_version: "1.0.0" });
    const onDisk = new Set(["skills/fullstack-engineer/SKILL.md"]);

    const result = planLiteInstallReceipt(prev, next, onDisk);

    expect(result.kind).toBe("plan");
    if (result.kind === "plan") {
      expect(result.writeReceipt).toBe(false);
    }
  });
});
