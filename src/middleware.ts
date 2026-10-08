import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const CANONICAL_HOST = "sdd.works";
const LEGACY_HOSTS = new Set(["framework.sdd.works", "www.sdd.works"]);

/** Old WordPress front page on the apex (browser may still open this path). */
function isLegacyWordpressHome(pathname: string): boolean {
  return pathname === "/en/home-en" || pathname === "/en/home-en/";
}

/** ADR-127: legacy hostnames and the old WordPress home path → canonical portal. */
export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase();
  if (host && LEGACY_HOSTS.has(host)) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = CANONICAL_HOST;
    return NextResponse.redirect(url, 301);
  }

  if (isLegacyWordpressHome(request.nextUrl.pathname)) {
    const url = new URL(`https://${CANONICAL_HOST}/instructions`);
    url.search = request.nextUrl.search;
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
