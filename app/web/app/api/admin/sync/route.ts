import { NextResponse } from "next/server";
import { requireAdminApi } from "@shared/auth/require-admin-api";
import { syncFrameworkRepo } from "@shared/core/sync/sync-job";
import { clearListVersionsCache } from "@shared/core/tools/list-versions";

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  let force = false;
  try {
    const body = (await request.json()) as { force?: boolean };
    force = body.force === true;
  } catch {
    /* empty body is ok */
  }

  const result = await syncFrameworkRepo({ force });
  clearListVersionsCache();

  if ("code" in result) {
    return NextResponse.json(
      { error: { code: result.code, message: result.message } },
      { status: 502 },
    );
  }

  return NextResponse.json(result);
}
