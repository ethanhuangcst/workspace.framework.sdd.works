import { type NextRequest, NextResponse } from "next/server";
import { openCachedPackageTar } from "@/core/sync/cache";
import { Readable } from "node:stream";

export async function GET(request: NextRequest) {
  const version =
    new URL(request.url).searchParams.get("version")?.trim() || "latest";
  const opened = openCachedPackageTar(version);

  if ("code" in opened) {
    if (opened.code === "sync_pending") {
      return NextResponse.json(
        { error: { code: "sync_pending", message: "Package sync has not run yet." } },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: { code: "version_not_found", message: `Version ${version} is not cached.` } },
      { status: 404 },
    );
  }

  const webStream = Readable.toWeb(opened.stream) as ReadableStream;
  return new Response(webStream, {
    headers: {
      "Content-Type": "application/gzip",
      "X-SDD-Commit": opened.commitSha,
      "X-SDD-Version": opened.version,
    },
  });
}
