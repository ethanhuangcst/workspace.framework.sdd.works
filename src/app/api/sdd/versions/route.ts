import { NextResponse } from "next/server";
import { getPathsVersion } from "@sdd/paths";
import { getCachedManifest } from "@/core/sync/cache";

export async function GET() {
  const manifest = getCachedManifest();
  if (!manifest) {
    return NextResponse.json(
      { error: { code: "sync_pending", message: "Package sync has not run yet." } },
      { status: 409 },
    );
  }

  return NextResponse.json({
    versions: manifest.versions,
    inventory: manifest.inventory,
    paths_version: getPathsVersion(),
    latestCommit: manifest.latestCommit,
    latestVersion: manifest.latestVersion,
    syncedAt: manifest.syncedAt,
  });
}
