import { createReadStream, existsSync } from "node:fs";
import type { ReadStream } from "node:fs";
import {
  readPackageManifest,
  type PackageManifest,
  type VersionEntry,
} from "./manifest";
import {
  commitDir,
  packageTarPath,
  unpackedDir,
} from "./paths";

export type CachedPackageRef = {
  version: string;
  commitSha: string;
  tarPath: string;
  unpackedPath: string;
  syncedAt: string;
};

export const CACHE_STALE_MINUTES = 30;

export function getCachedManifest(): PackageManifest | null {
  return readPackageManifest();
}

export function resolveCachedVersion(
  requested?: string,
): CachedPackageRef | { code: "sync_pending" } | { code: "version_not_found" } {
  const manifest = readPackageManifest();
  if (!manifest) {
    return { code: "sync_pending" };
  }

  const trimmed = requested?.trim();
  const version =
    !trimmed || trimmed === "latest" ? manifest.latestVersion : trimmed;

  let commitSha: string | undefined;
  if (version === manifest.latestVersion) {
    commitSha = manifest.latestCommit;
  } else {
    const entry = manifest.versions.find((v) => v.id === version);
    if (!entry?.commitSha) {
      return { code: "version_not_found" };
    }
    commitSha = entry.commitSha;
  }

  if (!commitSha || !existsSync(commitDir(commitSha))) {
    return { code: "version_not_found" };
  }

  const tarPath = packageTarPath(commitSha);
  if (!existsSync(tarPath)) {
    return { code: "version_not_found" };
  }

  return {
    version,
    commitSha,
    tarPath,
    unpackedPath: unpackedDir(commitSha),
    syncedAt: manifest.syncedAt,
  };
}

export function openCachedPackageTar(
  requested?: string,
):
  | { stream: ReadStream; commitSha: string; version: string }
  | { code: "sync_pending" }
  | { code: "version_not_found" } {
  const resolved = resolveCachedVersion(requested);
  if ("code" in resolved) return resolved;
  return {
    stream: createReadStream(resolved.tarPath),
    commitSha: resolved.commitSha,
    version: resolved.version,
  };
}

export function listCachedVersions(): VersionEntry[] {
  const manifest = readPackageManifest();
  return manifest?.versions ?? [];
}
