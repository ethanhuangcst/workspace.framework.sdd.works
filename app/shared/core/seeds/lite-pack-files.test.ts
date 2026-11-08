import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { LITE_PACK_ALLOWLIST_FILENAME } from "./lite-install-manifest";
import {
  isValidRelativePackPath,
  loadLitePackFilesFromUnpacked,
} from "./lite-pack-files";

describe("lite-pack-files", () => {
  it("should_reject_traversal_paths", () => {
    expect(isValidRelativePackPath("../x")).toBe(false);
    expect(isValidRelativePackPath("/skills/x")).toBe(false);
    expect(isValidRelativePackPath("skills\\x")).toBe(false);
  });

  it("should_load_sorted_files_from_valid_unpack", () => {
    const root = mkdtempSync(join(tmpdir(), "lite-unpack-"));
    mkdirSync(join(root, "skills/tdd"), { recursive: true });
    mkdirSync(join(root, "rules"), { recursive: true });
    writeFileSync(join(root, "skills/tdd/SKILL.md"), "# tdd\n");
    writeFileSync(join(root, "rules/friendly-language.mdc"), "# r\n");
    writeFileSync(
      join(root, LITE_PACK_ALLOWLIST_FILENAME),
      JSON.stringify({
        skills: ["skills/tdd/SKILL.md"],
        rules: ["rules/friendly-language.mdc"],
      }),
    );

    const result = loadLitePackFilesFromUnpacked(root);

    expect(result).toEqual({
      ok: true,
      files: ["rules/friendly-language.mdc", "skills/tdd/SKILL.md"],
    });
  });
});
