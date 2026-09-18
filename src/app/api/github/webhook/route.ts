import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { clearListVersionsCache } from "@/core/tools/list-versions";
import { syncFrameworkRepo } from "@/core/sync/sync-job";

function verifyGithubSignature(
  secret: string,
  body: string,
  signature: string | null,
): boolean {
  if (!signature?.startsWith("sha256=")) return false;
  const digest = createHmac("sha256", secret).update(body).digest("hex");
  const expected = `sha256=${digest}`;
  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

function shouldSync(event: string): boolean {
  return event === "push" || event === "release";
}

export async function POST(request: Request) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { error: { code: "webhook_not_configured", message: "Webhook secret unset" } },
      { status: 401 },
    );
  }

  const signature = request.headers.get("x-hub-signature-256");
  const body = await request.text();
  if (!verifyGithubSignature(secret, body, signature)) {
    return NextResponse.json(
      { error: { code: "invalid_signature", message: "Invalid webhook signature" } },
      { status: 401 },
    );
  }

  let payload: { action?: string };
  try {
    payload = JSON.parse(body) as { action?: string };
  } catch {
    return NextResponse.json({ status: "ignored", reason: "invalid_json" });
  }

  const event = request.headers.get("x-github-event") ?? "";
  if (!shouldSync(event)) {
    return NextResponse.json({ status: "ignored", event });
  }

  if (event === "release" && payload.action && payload.action !== "published") {
    return NextResponse.json({ status: "ignored", event, action: payload.action });
  }

  try {
    const result = await syncFrameworkRepo();
    clearListVersionsCache();
    if ("code" in result) {
      console.error("[sdd-sync] webhook sync failed:", result.message);
      return NextResponse.json({ status: "sync_error", message: result.message });
    }
    return NextResponse.json({ status: result.status, commitSha: result.commitSha });
  } catch (error) {
    const message = error instanceof Error ? error.message : "webhook sync failed";
    console.error("[sdd-sync] webhook sync error:", message);
    return NextResponse.json({ status: "sync_error", message });
  }
}
