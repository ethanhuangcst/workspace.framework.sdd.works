import { NextResponse } from "next/server";
import { requireAdminApi } from "@/auth/require-admin-api";
import { buildTreeFromUnpacked } from "@/core/sync/cache-tree";
import { readPackageManifest } from "@/core/sync/manifest";
import { unpackedDir } from "@/core/sync/paths";
import { db } from "@/lib/db";
import { parseGithubRepoUrl } from "@/lib/settings";

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const row = await db.setting.findUnique({ where: { id: "singleton" } });
  const url = row?.githubUrl?.trim() ?? "";
  if (!url) {
    return NextResponse.json({ empty: true });
  }

  const parsed = parseGithubRepoUrl(url);
  if (!parsed) {
    return NextResponse.json({
      empty: false,
      source: url,
      error: { key: "admin.framework.sync_error" },
    });
  }

  const manifest = readPackageManifest();
  if (!manifest?.latestCommit) {
    return NextResponse.json({
      empty: false,
      source: parsed.display,
      tree: [],
      cache_missing: true,
    });
  }

  const unpackedPath = unpackedDir(manifest.latestCommit);
  const tree = buildTreeFromUnpacked(unpackedPath);

  return NextResponse.json({
    empty: false,
    source: parsed.display,
    tree,
    commitSha: manifest.latestCommit,
    syncedAt: manifest.syncedAt,
  });
}
