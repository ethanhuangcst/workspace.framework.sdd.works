import { join } from "node:path";

export const MANIFEST_FILENAME = "manifest.json";
export const PACKAGE_TAR_FILENAME = "pkg.tar.gz";

export function getPackageCacheDir(): string {
  return (
    process.env.SDD_PACKAGE_CACHE_DIR?.trim() ||
    join(process.cwd(), ".data", "sdd-packages")
  );
}

export function manifestPath(): string {
  return join(getPackageCacheDir(), MANIFEST_FILENAME);
}

export function commitDir(commitSha: string): string {
  return join(getPackageCacheDir(), commitSha);
}

export function packageTarPath(commitSha: string): string {
  return join(commitDir(commitSha), PACKAGE_TAR_FILENAME);
}

export function unpackedDir(commitSha: string): string {
  return join(commitDir(commitSha), "unpacked");
}
