import { type NextRequest, NextResponse } from "next/server";
import { parseToolJson } from "@/core/tools/errors";
import { installFrameworkHttp } from "@/core/tools/install-http";
import type { InstallLedger } from "@/core/tools/install-plan";

type Body = {
  version?: string;
  client?: string;
  os?: string;
  force?: boolean;
  accepted_root?: string;
  inventory?: {
    ledger: InstallLedger | null;
    missing?: string[];
  };
};

export async function POST(request: NextRequest) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json(
      { error: { code: "invalid_input", message: "Expected a JSON body." } },
      { status: 400 },
    );
  }
  if (!body.inventory) {
    return NextResponse.json(
      { error: { code: "invalid_input", message: "inventory is required." } },
      { status: 400 },
    );
  }
  const result = await installFrameworkHttp(
    {
      version: body.version,
      client: body.client,
      os: body.os,
      force: body.force,
      inventory: {
        ledger: body.inventory.ledger ?? null,
        missing: body.inventory.missing ?? [],
      },
      accepted_root: body.accepted_root,
    },
    { channel: "http", skipLlm: true },
  );
  const json = parseToolJson<unknown>(result);
  return NextResponse.json(json, { status: result.isError ? 409 : 200 });
}
