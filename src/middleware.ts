import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  isLocale,
  resolveLocale,
  SDD_LOCALE_COOKIE,
  SDD_LOCALE_COOKIE_MAX_AGE,
} from "@/lib/locale";

const CANONICAL_HOST = "sdd.works";
const LEGACY_HOSTS = new Set(["framework.sdd.works", "www.sdd.works"]);

/** Old WordPress front page on the apex (browser may still open this path). */
function isLegacyWordpressHome(pathname: string): boolean {
  return pathname === "/en/home-en" || pathname === "/en/home-en/";
}

function applyLocaleCookie(request: NextRequest, response: NextResponse): void {
  const raw = request.cookies.get(SDD_LOCALE_COOKIE)?.value;
  if (isLocale(raw)) {
    return;
  }
  const locale = resolveLocale({
    cookie: raw,
    acceptLanguage: request.headers.get("accept-language"),
  });
  response.cookies.set(SDD_LOCALE_COOKIE, locale, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SDD_LOCALE_COOKIE_MAX_AGE,
  });
}

/** ADR-127: legacy hostnames and the old WordPress home path → canonical portal. */
export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase();
  const pathname = request.nextUrl.pathname;
  // Keep /api on the request host so GitHub webhook POST and package GETs are not 301'd.
  if (host && LEGACY_HOSTS.has(host) && !pathname.startsWith("/api")) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = CANONICAL_HOST;
    return NextResponse.redirect(url, 301);
  }

  if (isLegacyWordpressHome(pathname)) {
    const url = new URL(`https://${CANONICAL_HOST}/instructions`);
    url.search = request.nextUrl.search;
    return NextResponse.redirect(url, 301);
  }

  const response = NextResponse.next();
  applyLocaleCookie(request, response);
  return response;
}

export const config = {
  matcher: "/:path*",
};
