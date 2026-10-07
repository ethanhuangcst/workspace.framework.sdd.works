import { type NextRequest, NextResponse } from "next/server";
import { resolveCachedVersion, getCachedManifest } from "@/core/sync/cache";
import { loadLitePackFilesFromUnpacked } from "@/core/seeds/lite-pack-files";
import {
  buildLiteFileDownloadUrl,
  litePackApiOrigin,
} from "@/lib/lite-pack-api-origin";

function requestedVersion(request: NextRequest): string | undefined {
  const raw = request.nextUrl.searchParams.get("version")?.trim();
  if (!raw || raw === "latest") return undefined;
  return raw;
}

export async function GET(request: NextRequest) {
  const resolved = resolveCachedVersion(requestedVersion(request));
  if ("code" in resolved) {
    if (resolved.code === "sync_pending") {
      return NextResponse.json(
        {
          error: {
            code: "sync_pending",
            message: "Package sync has not run yet.",
          },
        },
        { status: 409 },
      );
    }
    return NextResponse.json(
      {
        error: {
          code: "version_not_found",
          message: "Requested package version is not cached.",
        },
      },
      { status: 404 },
    );
  }

  const loaded = loadLitePackFilesFromUnpacked(resolved.unpackedPath);
  if (!loaded.ok) {
    return NextResponse.json(
      { error: { code: loaded.code, message: loaded.message } },
      { status: loaded.code === "lite_manifest_invalid" ? 422 : 404 },
    );
  }

  const manifest = getCachedManifest();
  const latestVersion = manifest?.latestVersion ?? resolved.version;
  const origin = litePackApiOrigin(request);
  const downloads = loaded.files.map((path) => ({
    path,
    url: buildLiteFileDownloadUrl(
      origin,
      path,
      resolved.version,
      latestVersion,
    ),
  }));

  return NextResponse.json({
    package_version: resolved.version,
    package_commit: resolved.commitSha,
    cache_synced_at: resolved.syncedAt,
    files: loaded.files,
    downloads,
  });
}
