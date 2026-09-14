import { NextResponse } from "next/server";
import { requireAdminApi } from "@/auth/require-admin-api";
import {
  fetchRepoTreeCached,
  GitHubConfigError,
  GitHubSyncError,
} from "@/github/sync";
import { db } from "@/lib/db";
import { parseGithubRepoUrl } from "@/lib/settings";

const SLOW_MS = 3_000;

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

  try {
    const { tree, durationMs, fromCache } = await fetchRepoTreeCached(
      parsed.owner,
      parsed.repo,
    );
    return NextResponse.json({
      empty: false,
      source: parsed.display,
      tree,
      slow: !fromCache && durationMs >= SLOW_MS,
    });
  } catch (error) {
    if (
      error instanceof GitHubSyncError ||
      error instanceof GitHubConfigError
    ) {
      return NextResponse.json({
        empty: false,
        source: parsed.display,
        error: { key: "admin.framework.sync_error" },
      });
    }
    throw error;
  }
}
