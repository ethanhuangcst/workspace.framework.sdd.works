import { NextResponse } from "next/server";
import { isLocale } from "@/lib/locale";
import type { Locale } from "@/i18n/t";
import {
  parseKnowledgePathParam,
  resolveKnowledgeArticle,
  resolveKnowledgeFolderListing,
} from "@/lib/knowledge-folder";
import { isValidInstructionsContentPath } from "@/core/seeds/instructions-tabs-config";

function parseLocale(raw: string | null): Locale {
  if (isLocale(raw)) return raw;
  return "en";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const locale = parseLocale(url.searchParams.get("locale"));
  const rootPath = url.searchParams.get("rootPath") ?? "";
  const pathParam = url.searchParams.get("path") ?? undefined;
  const doc = url.searchParams.get("doc") ?? undefined;

  if (!isValidInstructionsContentPath(rootPath)) {
    return NextResponse.json(
      { ok: false, error: "invalid rootPath" },
      { status: 400 },
    );
  }

  const segments = parseKnowledgePathParam(pathParam);

  if (doc?.trim()) {
    const article = resolveKnowledgeArticle(
      rootPath,
      segments,
      doc.trim(),
      locale,
    );
    if (!article.ok) {
      return NextResponse.json(
        { ok: false, error: article.error },
        { status: 404 },
      );
    }
    return NextResponse.json({
      ok: true,
      locale,
      rootPath,
      path: segments.join("/"),
      doc: doc.trim(),
      article: article.article,
    });
  }

  const listing = resolveKnowledgeFolderListing(rootPath, segments, locale);
  if (!listing.ok) {
    return NextResponse.json(
      { ok: false, error: listing.error },
      { status: 404 },
    );
  }

  return NextResponse.json({
    ok: true,
    locale,
    rootPath,
    path: segments.join("/"),
    listing: listing.listing,
  });
}
