import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { Locale } from "@/i18n/t";
import { resolveCachedVersion } from "@/core/sync/cache";
import { renderPortalMarkdown } from "@/lib/features-catalog";

const PACKAGE_DIR = join(process.cwd(), "src", "content", "scrum-in-sdd");

export type ScrumInSddSource = "cache" | "package";

export type ScrumInSddResult = {
  locale: Locale;
  sourceLocale: Locale;
  source: ScrumInSddSource;
  html: string;
};

function fileNameFor(locale: Locale): string {
  return `scrum-in-sdd.${locale}.md`;
}

/**
 * Read scrum-in-sdd.{locale}.md from a directory. Missing locale falls back to English
 * in that same directory. Returns null when English is also missing.
 */
export function readScrumMarkdownFromDir(
  dir: string,
  locale: Locale,
): { markdown: string; sourceLocale: Locale } | null {
  const preferredPath = join(dir, fileNameFor(locale));
  if (existsSync(preferredPath)) {
    return {
      markdown: readFileSync(preferredPath, "utf8"),
      sourceLocale: locale,
    };
  }
  const englishPath = join(dir, fileNameFor("en"));
  if (!existsSync(englishPath)) return null;
  return {
    markdown: readFileSync(englishPath, "utf8"),
    sourceLocale: "en",
  };
}

function resultFromDir(
  dir: string,
  locale: Locale,
  source: ScrumInSddSource,
): ScrumInSddResult | null {
  const loaded = readScrumMarkdownFromDir(dir, locale);
  if (!loaded) return null;
  return {
    locale,
    sourceLocale: loaded.sourceLocale,
    source,
    html: renderPortalMarkdown(loaded.markdown),
  };
}

/**
 * Prefer the latest sync unpack at content/scrum-in-sdd; fall back to
 * src/content/scrum-in-sdd. Locale fallback stays inside the chosen source.
 * ([ADR-071](../../specs/adr/ADR-071-portal-content-paths.md)).
 */
export function readScrumInSddCatalog(locale: Locale): ScrumInSddResult {
  const resolved = resolveCachedVersion();
  if (!("code" in resolved)) {
    const cacheDir = join(resolved.unpackedPath, "content", "scrum-in-sdd");
    const fromCache = resultFromDir(cacheDir, locale, "cache");
    if (fromCache) return fromCache;
  }

  const fromPackage = resultFromDir(PACKAGE_DIR, locale, "package");
  if (!fromPackage) {
    throw new Error(
      "scrum-in-sdd.en.md is missing from src/content/scrum-in-sdd",
    );
  }
  return fromPackage;
}
