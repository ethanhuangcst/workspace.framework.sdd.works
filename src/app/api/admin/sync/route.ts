import { NextResponse } from "next/server";
import { requireAdminApi } from "@/auth/require-admin-api";
import { syncFrameworkRepo } from "@/core/sync/sync-job";
import { clearListVersionsCache } from "@/core/tools/list-versions";

export async function POST() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const result = await syncFrameworkRepo();
  clearListVersionsCache();

  if ("code" in result) {
    return NextResponse.json(
      { error: { code: result.code, message: result.message } },
      { status: 502 },
    );
  }

  return NextResponse.json(result);
}
