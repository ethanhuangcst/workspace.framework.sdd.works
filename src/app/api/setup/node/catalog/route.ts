import { NextResponse } from "next/server";
import { loadNodeSetupCatalog } from "@/mcp/node-setup-catalog";

export async function GET() {
  try {
    const catalog = loadNodeSetupCatalog();
    return NextResponse.json(catalog);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid node setup catalog";
    return NextResponse.json(
      { error: { code: "catalog_invalid", message } },
      { status: 422 },
    );
  }
}
