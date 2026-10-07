import { existsSync, statSync } from "node:fs";
import { basename, join } from "node:path";

/** Pack-root allow-list for lite HTTP install (sync cache + file-links API). ADR-107. */
export const LITE_PACK_ALLOWLIST_FILENAME = "lite-pack.allowlist.json";

/** @deprecated Use `LITE_PACK_ALLOWLIST_FILENAME`. */
export const LITE_INSTALL_MANIFEST_FILENAME = LITE_PACK_ALLOWLIST_FILENAME;

export const EXPECTED_LITE_SKILLS: readonly string[] = [
  "skills/ai-architect/SKILL.md",
  "skills/atdd-expert/SKILL.md",
  "skills/frontend-designer/SKILL.md",
  "skills/frontend-developer/SKILL.md",
  "skills/fullstack-engineer/SKILL.md",
  "skills/improve-prompt/SKILL.md",
  "skills/mcp-expert/SKILL.md",
  "skills/rag-expert/SKILL.md",
  "skills/sdd-build-agent/SKILL.md",
  "skills/sdd-create-rule/SKILL.md",
  "skills/sdd-create-skill/SKILL.md",
  "skills/testing-expert/SKILL.md",
];

export const EXPECTED_LITE_RULES: readonly string[] = [
  "rules/friendly-language.mdc",
];

const ALLOWED_SDD_SKILL_FOLDERS = new Set([
  "sdd-build-agent",
  "sdd-create-rule",
  "sdd-create-skill",
]);

export type ValidateLiteInstallManifestOptions = {
  seedRoot: string;
  checkFilesExist?: boolean;
  requireExactLists?: boolean;
};

export type ValidateLiteInstallManifestResult =
  | { ok: true }
  | { ok: false; errors: string[] };

function isSortedCopy(values: string[]): boolean {
  const sorted = [...values].sort((a, b) => a.localeCompare(b));
  return values.every((v, i) => v === sorted[i]);
}

function skillFolderFromPath(skillPath: string): string | null {
  if (!skillPath.startsWith("skills/")) return null;
  const rest = skillPath.slice("skills/".length);
  const slash = rest.indexOf("/");
  if (slash <= 0) return null;
  return rest.slice(0, slash);
}

export function validateLiteInstallManifest(
  input: unknown,
  options: ValidateLiteInstallManifestOptions,
): ValidateLiteInstallManifestResult {
  const errors: string[] = [];

  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, errors: ["manifest must be a JSON object"] };
  }

  const record = input as Record<string, unknown>;
  const keys = Object.keys(record);
  const allowedKeys = ["skills", "rules"];
  for (const key of keys) {
    if (!allowedKeys.includes(key)) {
      errors.push(`unexpected key: ${key}`);
    }
  }
  if (!("skills" in record)) {
    errors.push("missing key: skills");
  }
  if (!("rules" in record)) {
    errors.push("missing key: rules");
  }

  const skillsRaw = record.skills;
  const rulesRaw = record.rules;

  if (skillsRaw !== undefined && !Array.isArray(skillsRaw)) {
    errors.push("skills must be an array of strings");
  }
  if (rulesRaw !== undefined && !Array.isArray(rulesRaw)) {
    errors.push("rules must be an array of strings");
  }

  const skills: string[] = [];
  const rules: string[] = [];

  if (Array.isArray(skillsRaw)) {
    for (let i = 0; i < skillsRaw.length; i += 1) {
      if (typeof skillsRaw[i] !== "string") {
        errors.push(`skills[${i}] must be a string`);
      } else {
        skills.push(skillsRaw[i]);
      }
    }
  }

  if (Array.isArray(rulesRaw)) {
    for (let i = 0; i < rulesRaw.length; i += 1) {
      if (typeof rulesRaw[i] !== "string") {
        errors.push(`rules[${i}] must be a string`);
      } else {
        rules.push(rulesRaw[i]);
      }
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  for (const path of skills) {
    if (!path.startsWith("skills/")) {
      errors.push(`skill path must start with skills/: ${path}`);
      continue;
    }
    const folder = skillFolderFromPath(path);
    if (!folder) {
      errors.push(`invalid skill path shape: ${path}`);
      continue;
    }
    if (folder.startsWith("sdd-") && !ALLOWED_SDD_SKILL_FOLDERS.has(folder)) {
      errors.push(`disallowed sdd- skill folder: ${folder}`);
    }
  }

  for (const path of rules) {
    if (!path.startsWith("rules/")) {
      errors.push(`rule path must start with rules/: ${path}`);
      continue;
    }
    const name = basename(path);
    if (name.startsWith("sdd-")) {
      errors.push(`disallowed sdd- rule file: ${name}`);
    }
  }

  if (options.requireExactLists) {
    if (skills.length !== EXPECTED_LITE_SKILLS.length) {
      errors.push(
        `skills must have ${EXPECTED_LITE_SKILLS.length} entries, got ${skills.length}`,
      );
    } else if (!skills.every((p, i) => p === EXPECTED_LITE_SKILLS[i])) {
      errors.push("skills must match the agreed lite allow-list");
    }

    if (rules.length !== EXPECTED_LITE_RULES.length) {
      errors.push(
        `rules must have ${EXPECTED_LITE_RULES.length} entries, got ${rules.length}`,
      );
    } else if (!rules.every((p, i) => p === EXPECTED_LITE_RULES[i])) {
      errors.push("rules must match the agreed lite allow-list");
    }
  } else {
    if (!isSortedCopy(skills)) {
      errors.push("skills must be sorted");
    }
    if (!isSortedCopy(rules)) {
      errors.push("rules must be sorted");
    }
  }

  if (options.checkFilesExist) {
    for (const rel of [...skills, ...rules]) {
      const abs = join(options.seedRoot, rel);
      if (!existsSync(abs)) {
        errors.push(`missing seed file: ${rel}`);
        continue;
      }
      if (!statSync(abs).isFile()) {
        errors.push(`seed path is not a file: ${rel}`);
      }
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true };
}
