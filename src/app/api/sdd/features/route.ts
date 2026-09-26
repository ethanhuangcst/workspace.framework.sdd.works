import { NextRequest, NextResponse } from "next/server";
import { isLocale } from "@/lib/locale";
import { readFeaturesCatalog } from "@/lib/features-catalog";
import type { Locale } from "@/i18n/t";

function parseLocale(raw: string | null): Locale {
  if (isLocale(raw)) return raw;
  return "en";
}

export async function GET(request: NextRequest) {
  const locale = parseLocale(request.nextUrl.searchParams.get("locale"));
  const catalog = readFeaturesCatalog(locale);
  return NextResponse.json({
    locale: catalog.locale,
    sourceLocale: catalog.sourceLocale,
    source: catalog.source,
    html: catalog.html,
  });
}
