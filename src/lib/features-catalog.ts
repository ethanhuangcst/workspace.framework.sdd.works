import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { marked, Renderer, type Tokens } from "marked";
import type { Locale } from "@/i18n/t";
import { resolveCachedVersion } from "@/core/sync/cache";

const PACKAGE_DIR = join(process.cwd(), "src", "content", "features");

const EM_DASH = " — ";

export type FeaturesCatalogSource = "cache" | "package";

export type FeaturesCatalogResult = {
  locale: Locale;
  sourceLocale: Locale;
  source: FeaturesCatalogSource;
  html: string;
};

function fileNameFor(locale: Locale): string {
  return `features.${locale}.md`;
}

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatListItemText(text: string): string {
  const sep = text.indexOf(EM_DASH);
  if (sep <= 0) return escapeHtml(text);
  const name = text.slice(0, sep).trim();
  const desc = text.slice(sep + EM_DASH.length).trim();
  if (!name || !desc) return escapeHtml(text);
  return `<span class="feature-name">${escapeHtml(name)}</span><span class="feature-desc">${escapeHtml(desc)}</span>`;
}

function createRenderer(): Renderer {
  const renderer = new Renderer();
  renderer.html = () => "";
  renderer.link = ({ href, text }: Tokens.Link) => {
    if (!href || href.toLowerCase().startsWith("javascript:")) {
      return escapeHtml(text);
    }
    return `<a href="${escapeHtml(href)}">${escapeHtml(text)}</a>`;
  };
  renderer.listitem = (item: Tokens.ListItem) => {
    const raw = item.text?.trim() ?? "";
    const body = formatListItemText(raw);
    return `<li>${body}</li>\n`;
  };
  return renderer;
}

export function renderFeaturesMarkdown(markdown: string): string {
  const html = marked.parse(markdown, {
    async: false,
    renderer: createRenderer(),
    gfm: true,
  }) as string;
  return html.replace(/<\/?script\b[^>]*>/gi, "");
}

/**
 * Read features.{locale}.md from a directory. Missing locale falls back to English
 * in that same directory. Returns null when English is also missing.
 */
export function readMarkdownFromDir(
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
  source: FeaturesCatalogSource,
): FeaturesCatalogResult | null {
  const loaded = readMarkdownFromDir(dir, locale);
  if (!loaded) return null;
  return {
    locale,
    sourceLocale: loaded.sourceLocale,
    source,
    html: renderFeaturesMarkdown(loaded.markdown),
  };
}

/**
 * Prefer the latest sync unpack; fall back to package files under src/content/features.
 * Locale fallback stays inside the chosen source. A failed sync that leaves the previous
 * unpack in place still resolves as source "cache".
 */
export function readFeaturesCatalog(locale: Locale): FeaturesCatalogResult {
  const resolved = resolveCachedVersion();
  if (!("code" in resolved)) {
    const fromCache = resultFromDir(resolved.unpackedPath, locale, "cache");
    if (fromCache) return fromCache;
  }

  const fromPackage = resultFromDir(PACKAGE_DIR, locale, "package");
  if (!fromPackage) {
    throw new Error("features.en.md is missing from src/content/features");
  }
  return fromPackage;
}

/** @deprecated Use readFeaturesCatalog — package-only spike helper kept for callers. */
export function readPackageFeaturesCatalog(locale: Locale): FeaturesCatalogResult {
  return readFeaturesCatalog(locale);
}

/** Test helper: resolve a directory other than the default package folder. */
export function readFeaturesFromDir(
  dir: string,
  locale: Locale,
  source: FeaturesCatalogSource = "package",
): FeaturesCatalogResult {
  const result = resultFromDir(dir, locale, source);
  if (!result) {
    throw new Error("features.en.md is missing");
  }
  return result;
}
