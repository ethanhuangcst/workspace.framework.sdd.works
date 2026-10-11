import { NextRequest, NextResponse } from "next/server";
import {
  loadNodeSetupCatalog,
  recommendNpmRegistry,
} from "@/mcp/node-setup-catalog";

export async function GET(request: NextRequest) {
  try {
    const catalog = loadNodeSetupCatalog();
    const country = request.headers.get("CF-IPCountry");
    const recommendation = recommendNpmRegistry(catalog, country);
    return NextResponse.json({
      ...catalog,
      ...recommendation,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid node setup catalog";
    return NextResponse.json(
      { error: { code: "catalog_invalid", message } },
      { status: 422 },
    );
  }
}
