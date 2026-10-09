import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/** Commit ids from `createFixtureGitHubPort` when the ref is a semver tag. */
export function isFixturePortCommitSha(commitSha: string): boolean {
  return /^sha-v\d+\.\d+\.\d+$/.test(commitSha);
}

/** The six stub files written by `createFixtureGitHubPort.materializePackage`. */
export function isFixtureStubUnpacked(unpackedPath: string): boolean {
  const checks: Array<[string, RegExp]> = [
    ["skills/tdd/SKILL.md", /^# tdd /],
    ["skills/atdd/SKILL.md", /^# atdd /],
    ["rules/sdd-dod.mdc", /^# dod/],
    ["agents/code-reviewer.md", /^# reviewer/],
    ["workflows/new-feature.md", /^# workflow/],
  ];
  for (const [rel, pattern] of checks) {
    const abs = join(unpackedPath, rel);
    if (!existsSync(abs)) return false;
    if (!pattern.test(readFileSync(abs, "utf8"))) return false;
  }
  return true;
}

export function isRefusedFixturePack(
  commitSha: string,
  unpackedPath: string,
): boolean {
  return (
    isFixturePortCommitSha(commitSha) ||
    isFixtureStubUnpacked(unpackedPath)
  );
}
