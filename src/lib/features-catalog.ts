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

/** GitHub-style slug of heading plain text (ADR-109). */
function githubHeadingSlug(plain: string): string {
  return plain
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

function nextHeadingId(
  plain: string,
  counts: Map<string, number>,
): string {
  const base = githubHeadingSlug(plain) || "section";
  const used = counts.get(base) ?? 0;
  counts.set(base, used + 1);
  return used === 0 ? base : `${base}-${used}`;
}

function createRenderer(
  splitEmDash: boolean,
  headingIds: Map<string, number>,
): Renderer {
  const renderer = new Renderer();
  renderer.html = () => "";
  renderer.link = ({ href, text }: Tokens.Link) => {
    if (!href || href.toLowerCase().startsWith("javascript:")) {
      return escapeHtml(text);
    }
    return `<a href="${escapeHtml(href)}">${escapeHtml(text)}</a>`;
  };
  renderer.heading = function ({ tokens, depth, text }: Tokens.Heading) {
    const plain = (text ?? "").replace(/\*+/g, "").trim();
    const id = nextHeadingId(plain, headingIds);
    const body = this.parser.parseInline(tokens);
    return `<h${depth} id="${escapeHtml(id)}">${body}</h${depth}>\n`;
  };
  renderer.listitem = function (item: Tokens.ListItem) {
    if (splitEmDash) {
      const raw = item.text?.trim() ?? "";
      return `<li>${formatListItemText(raw)}</li>\n`;
    }
    const body = this.parser.parse(item.tokens);
    return `<li>${body}</li>\n`;
  };
  return renderer;
}

/** Wrap GFM tables so content-tab CSS scopes cells (ADR-123). */
export function wrapGuideContentTables(html: string): string {
  if (!html.includes("<table>")) return html;
  return html
    .replaceAll("<table>", '<div class="content-table"><table>')
    .replaceAll("</table>", "</table></div>");
}

function renderMarkdown(markdown: string, splitEmDash: boolean): string {
  const headingIds = new Map<string, number>();
  const html = marked.parse(markdown, {
    async: false,
    renderer: createRenderer(splitEmDash, headingIds),
    gfm: true,
  }) as string;
  const safe = html.replace(/<\/?script\b[^>]*>/gi, "");
  return wrapGuideContentTables(safe);
}

export function renderFeaturesMarkdown(markdown: string): string {
  return renderMarkdown(markdown, true);
}

/** Portal markdown without the Features em-dash name/description split. */
export function renderPortalMarkdown(markdown: string): string {
  return renderMarkdown(markdown, false);
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
 * Prefer the latest sync unpack at content/features; fall back to src/content/features.
 * Locale fallback stays inside the chosen source. A failed sync that leaves the previous
 * unpack in place still resolves as source "cache". Unpack-root features.*.md is ignored
 * ([ADR-071](../../specs/adr/ADR-071-portal-content-paths.md)).
 */
export function readFeaturesCatalog(locale: Locale): FeaturesCatalogResult {
  const resolved = resolveCachedVersion();
  if (!("code" in resolved)) {
    const cacheDir = join(resolved.unpackedPath, "content", "features");
    const fromCache = resultFromDir(cacheDir, locale, "cache");
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
