import { readFileSync } from "node:fs";
import { type NextRequest, NextResponse } from "next/server";
import { resolveCachedVersion } from "@/core/sync/cache";
import {
  contentTypeForPackPath,
  isValidRelativePackPath,
  loadLitePackFilesFromUnpacked,
  resolveUnpackedFilePath,
} from "@/core/seeds/lite-pack-files";

function requestedVersion(request: NextRequest): string | undefined {
  const raw = request.nextUrl.searchParams.get("version")?.trim();
  if (!raw || raw === "latest") return undefined;
  return raw;
}

export async function GET(request: NextRequest) {
  const pathParam = request.nextUrl.searchParams.get("path")?.trim() ?? "";
  if (!isValidRelativePackPath(pathParam)) {
    return NextResponse.json(
      {
        error: {
          code: "path_invalid",
          message: "Path must be a relative pack file under skills/ or rules/.",
        },
      },
      { status: 400 },
    );
  }

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

  const abs = resolveUnpackedFilePath(
    resolved.unpackedPath,
    pathParam,
    loaded.files,
  );
  if (!abs) {
    return NextResponse.json(
      {
        error: {
          code: "path_not_allowed",
          message: "Path is not in the lite install allow-list.",
        },
      },
      { status: 404 },
    );
  }

  const body = readFileSync(abs);
  return new Response(body, {
    headers: {
      "Content-Type": contentTypeForPackPath(pathParam),
    },
  });
}
