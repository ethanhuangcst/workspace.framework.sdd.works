import { existsSync } from "node:fs";
import { join } from "node:path";

export const BUNDLED_COMMIT_SHA = "bundled";
export const BUNDLED_VERSION = "bundled";

export type BundledPackRef = {
  unpackedPath: string;
  version: string;
  commitSha: string;
};

/** Bundled fallback pack shipped in the server repo (ADR-131). */
export function bundledPackDir(cwd = process.cwd()): string {
  return join(cwd, "pack.framework.sdd.works");
}

function bundledPackLooksPresent(dir: string): boolean {
  if (existsSync(join(dir, "skills"))) return true;
  if (existsSync(join(dir, "skill"))) return true;
  if (existsSync(join(dir, "rules"))) return true;
  return false;
}

/** Read the bundled pack when the sync cache is empty or refused. */
export function readBundledPack(cwd = process.cwd()): BundledPackRef | null {
  const unpackedPath = bundledPackDir(cwd);
  if (!bundledPackLooksPresent(unpackedPath)) return null;
  return {
    unpackedPath,
    version: BUNDLED_VERSION,
    commitSha: BUNDLED_COMMIT_SHA,
  };
}
