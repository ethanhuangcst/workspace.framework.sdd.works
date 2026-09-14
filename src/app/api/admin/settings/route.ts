import { NextRequest, NextResponse } from "next/server";
import { assertCsrf } from "@/auth/csrf";
import { requireAdminApi } from "@/auth/require-admin-api";
import {
  checkRepoAccessible,
  clearFrameworkTreeCache,
  GitHubConfigError,
} from "@/github/sync";
import { db } from "@/lib/db";
import { parseGithubRepoUrl, updateSettingsSchema } from "@/lib/settings";

const SINGLETON_ID = "singleton";

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const row = await db.setting.findUnique({ where: { id: SINGLETON_ID } });
  return NextResponse.json({
    url: row?.githubUrl ?? "",
    updatedAt: row?.updatedAt?.toISOString() ?? null,
  });
}

export async function PUT(request: NextRequest) {
  if (!assertCsrf(request)) {
    return NextResponse.json({ error: { key: "errors.csrf" } }, { status: 403 });
  }

  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { error: { key: "errors.invalid_input" } },
      { status: 400 },
    );
  }

  const parsed = updateSettingsSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { key: "errors.settings_url_invalid" } },
      { status: 400 },
    );
  }

  const repo = parseGithubRepoUrl(parsed.data.url);
  if (!repo) {
    return NextResponse.json(
      { error: { key: "errors.settings_url_invalid" } },
      { status: 400 },
    );
  }

  let reachable: boolean;
  try {
    reachable = await checkRepoAccessible(repo.owner, repo.repo);
  } catch (error) {
    if (error instanceof GitHubConfigError) {
      return NextResponse.json(
        { error: { key: "errors.settings_url_unreachable" } },
        { status: 502 },
      );
    }
    throw error;
  }

  if (!reachable) {
    return NextResponse.json(
      { error: { key: "errors.settings_url_unreachable" } },
      { status: 422 },
    );
  }

  const row = await db.setting.upsert({
    where: { id: SINGLETON_ID },
    create: {
      id: SINGLETON_ID,
      githubUrl: repo.canonicalUrl,
      updatedBy: auth.admin.id,
    },
    update: {
      githubUrl: repo.canonicalUrl,
      updatedBy: auth.admin.id,
    },
  });

  clearFrameworkTreeCache();

  return NextResponse.json({
    url: row.githubUrl,
    updatedAt: row.updatedAt.toISOString(),
  });
}
