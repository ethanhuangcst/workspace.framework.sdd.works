import type { NextRequest } from "next/server";

export function litePackApiOrigin(request: NextRequest): string {
  const base = process.env.PUBLIC_BASE_URL?.trim();
  if (base) return base.replace(/\/$/, "");
  return new URL(request.url).origin;
}

export function buildLiteFileDownloadUrl(
  origin: string,
  relativePath: string,
  version: string,
  latestVersion: string,
): string {
  const url = new URL(`${origin}/api/sdd/lite/file`);
  url.searchParams.set("path", relativePath);
  if (version !== latestVersion) {
    url.searchParams.set("version", version);
  }
  return url.toString();
}
