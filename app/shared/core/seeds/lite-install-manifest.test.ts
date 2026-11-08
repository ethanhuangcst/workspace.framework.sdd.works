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
import {
  EXPECTED_LITE_RULES,
  EXPECTED_LITE_SKILLS,
  LITE_PACK_ALLOWLIST_FILENAME,
  validateLiteInstallManifest,
} from "./lite-install-manifest";

const seedRoot = join(process.cwd(), "pack.framework.sdd.works");
const manifestPath = join(seedRoot, LITE_PACK_ALLOWLIST_FILENAME);

const tempDirs: string[] = [];

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

function trackTempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), "lite-manifest-"));
  tempDirs.push(dir);
  return dir;
}

describe("CE-LITE-01 — agreed skill and rule paths", () => {
  it("should_pass_when_authoring_manifest_matches_design_and_files_exist", () => {
    const raw = readFileSync(manifestPath, "utf8");
    const doc = JSON.parse(raw) as unknown;

    const result = validateLiteInstallManifest(doc, {
      seedRoot,
      checkFilesExist: true,
      requireExactLists: true,
    });

    expect(result).toEqual({ ok: true });

    const record = doc as { skills: string[]; rules: string[] };
    expect(record.skills).toEqual([...EXPECTED_LITE_SKILLS]);
    expect(record.rules).toEqual([...EXPECTED_LITE_RULES]);
  });
});

describe("CE-LITE-02 — reject invalid allow-list paths", () => {
  it("should_fail_when_skill_path_does_not_start_with_skills", () => {
    const result = validateLiteInstallManifest(
      {
        skills: ["foo.md"],
        rules: [...EXPECTED_LITE_RULES],
      },
      { seedRoot, requireExactLists: false },
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((e) => e.includes("skills/"))).toBe(true);
    }
  });

  it("should_fail_when_skills_includes_disallowed_sdd_folder", () => {
    const skills = [...EXPECTED_LITE_SKILLS];
    skills.push("skills/sdd-plan-sprint/SKILL.md");
    skills.sort((a, b) => a.localeCompare(b));

    const result = validateLiteInstallManifest(
      { skills, rules: [...EXPECTED_LITE_RULES] },
      { seedRoot, requireExactLists: false },
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((e) => e.includes("sdd-plan-sprint"))).toBe(
        true,
      );
    }
  });

  it("should_fail_when_rules_includes_sdd_prefixed_file", () => {
    const result = validateLiteInstallManifest(
      {
        skills: [...EXPECTED_LITE_SKILLS],
        rules: ["rules/sdd-dod.mdc"],
      },
      { seedRoot, requireExactLists: false },
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((e) => e.includes("sdd-dod"))).toBe(true);
    }
  });

  it("should_fail_when_manifest_has_extra_top_level_key", () => {
    const result = validateLiteInstallManifest(
      {
        skills: [...EXPECTED_LITE_SKILLS],
        rules: [...EXPECTED_LITE_RULES],
        version: 1,
      },
      { seedRoot, requireExactLists: true },
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((e) => e.includes("version"))).toBe(true);
    }
  });

  it("should_fail_when_skills_list_is_unsorted", () => {
    const skills = [...EXPECTED_LITE_SKILLS].reverse();
    const result = validateLiteInstallManifest(
      { skills, rules: [...EXPECTED_LITE_RULES] },
      { seedRoot, requireExactLists: false },
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((e) => e.includes("sorted"))).toBe(true);
    }
  });

  it("should_fail_when_required_seed_file_is_missing_on_disk", () => {
    const dir = trackTempDir();
    const rel = "skills/ai-architect/SKILL.md";
    mkdirSync(join(dir, "skills/ai-architect"), { recursive: true });
    writeFileSync(join(dir, rel), "# stub\n");

    const skills = [...EXPECTED_LITE_SKILLS];
    const result = validateLiteInstallManifest(
      { skills, rules: [...EXPECTED_LITE_RULES] },
      {
        seedRoot: dir,
        checkFilesExist: true,
        requireExactLists: true,
      },
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((e) => e.includes("missing seed file"))).toBe(
        true,
      );
    }
  });
});
