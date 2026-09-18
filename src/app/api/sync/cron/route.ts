import { NextResponse } from "next/server";
import { runScheduledSync } from "@/core/sync/run-scheduled-sync";

function readCronSecret(request: Request): string | null {
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) {
    return auth.slice("Bearer ".length).trim() || null;
  }
  return request.headers.get("x-cron-secret")?.trim() ?? null;
}

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { error: { code: "cron_not_configured", message: "CRON_SECRET unset" } },
      { status: 503 },
    );
  }

  const provided = readCronSecret(request);
  if (!provided || provided !== secret) {
    return NextResponse.json(
      { error: { code: "unauthorized", message: "Invalid cron secret" } },
      { status: 401 },
    );
  }

  const result = await runScheduledSync();
  if ("skipped" in result) {
    return NextResponse.json(result);
  }
  if ("code" in result) {
    return NextResponse.json(
      { error: { code: result.code, message: result.message } },
      { status: 502 },
    );
  }
  return NextResponse.json(result);
}
