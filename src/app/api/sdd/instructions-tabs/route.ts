import { NextRequest, NextResponse } from "next/server";
import { isLocale } from "@/lib/locale";
import { resolveInstructionsTabs } from "@/lib/instructions-tabs";
import type { Locale } from "@/i18n/t";

function parseLocale(raw: string | null): Locale {
  if (isLocale(raw)) return raw;
  return "en";
}

export async function GET(request: NextRequest) {
  const locale = parseLocale(request.nextUrl.searchParams.get("locale"));
  const result = resolveInstructionsTabs(locale);
  return NextResponse.json(result);
}
