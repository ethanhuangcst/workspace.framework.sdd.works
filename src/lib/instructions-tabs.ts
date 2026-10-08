import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Locale } from "@/i18n/t";
import { resolveCachedVersion } from "@/core/sync/cache";
import {
  DEFAULT_CODE_TAB_ALLOWLIST,
  INSTRUCTIONS_TABS_PACK_RELATIVE,
  asInstructionsTabsDocument,
  resolveInstructionsTabLabel,
  validateInstructionsTabsConfig,
  type InstructionsTab,
  type InstructionsTabsDocument,
} from "@/core/seeds/instructions-tabs-config";
import {
  renderFeaturesMarkdown,
  renderPortalMarkdown,
} from "@/lib/features-catalog";

const BUNDLED_CONFIG_PATH = join(
  process.cwd(),
  "src",
  "content",
  ".instructions-tabs.json",
);

/** Deployed app content, then pack authoring tree for local dev. */
const PACKAGE_CONTENT_ROOTS = [
  join(process.cwd(), "src"),
  join(process.cwd(), "pack.framework.sdd.works"),
] as const;

export type InstructionsTabsConfigSource = "cache" | "bundled";

export type ContentMarkdownSource = "cache" | "package";

export type ResolvedInstructionsTab = {
  type: "code" | "content" | "embedded_external_page";
  id: string;
  label: string;
  queryParam: string;
  panelTestId: string;
  html?: string;
  embedUrl?: string;
  sourceLocale?: Locale;
  contentSource?: ContentMarkdownSource;
};

export type InstructionsTabsResult = {
  version: 1;
  source: InstructionsTabsConfigSource;
  locale: Locale;
  tabs: ResolvedInstructionsTab[];
};

function readJsonFile(path: string): unknown | null {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8")) as unknown;
  } catch {
    return null;
  }
}

function validateConfigAtRoot(
  doc: unknown,
  contentRoot: string,
  checkFilesExist: boolean,
): boolean {
  const result = validateInstructionsTabsConfig(doc, {
    contentRoot,
    codeAllowlist: DEFAULT_CODE_TAB_ALLOWLIST,
    checkFilesExist,
  });
  return result.ok;
}

function loadBundledConfigDocument(): InstructionsTabsDocument {
  const doc = readJsonFile(BUNDLED_CONFIG_PATH);
  if (doc === null || !validateConfigAtRoot(doc, process.cwd(), false)) {
    throw new Error(
      "Bundled instructions tabs config is missing or invalid at src/content/.instructions-tabs.json",
    );
  }
  return asInstructionsTabsDocument(doc);
}

export function resolveInstructionsTabsConfig(): {
  document: InstructionsTabsDocument;
  source: InstructionsTabsConfigSource;
} {
  const resolved = resolveCachedVersion();
  if (!("code" in resolved)) {
    const cachePath = join(
      resolved.unpackedPath,
      INSTRUCTIONS_TABS_PACK_RELATIVE,
    );
    const cacheDoc = readJsonFile(cachePath);
    if (
      cacheDoc !== null &&
      validateConfigAtRoot(cacheDoc, resolved.unpackedPath, true)
    ) {
      return {
        document: asInstructionsTabsDocument(cacheDoc),
        source: "cache",
      };
    }
  }

  return {
    document: loadBundledConfigDocument(),
    source: "bundled",
  };
}

function readMarkdownFromCache(
  relPath: string,
  unpackedPath: string,
): { markdown: string; contentSource: "cache" } | null {
  const cacheFile = join(unpackedPath, relPath);
  if (!existsSync(cacheFile)) return null;
  return {
    markdown: readFileSync(cacheFile, "utf8"),
    contentSource: "cache",
  };
}

function readMarkdownFromPackage(
  relPath: string,
): { markdown: string; contentSource: "package" } | null {
  for (const root of PACKAGE_CONTENT_ROOTS) {
    const packageFile = join(root, relPath);
    if (!existsSync(packageFile)) continue;
    return {
      markdown: readFileSync(packageFile, "utf8"),
      contentSource: "package",
    };
  }
  return null;
}

function renderContentMarkdown(markdown: string, relPath: string): string {
  if (relPath.includes("content/features/")) {
    return renderFeaturesMarkdown(markdown);
  }
  const html = renderPortalMarkdown(markdown);
  return html
    .replaceAll("<table>", '<div class="content-table"><table>')
    .replaceAll("</table>", "</table></div>");
}

function resolveContentTab(
  tab: Extract<InstructionsTab, { type: "content" }>,
  locale: Locale,
  unpackedPath: string | null,
): Pick<
  ResolvedInstructionsTab,
  "html" | "sourceLocale" | "contentSource"
> {
  const paths = tab.paths;

  if (unpackedPath) {
    const preferredPath = paths[locale];
    if (preferredPath) {
      const fromCache = readMarkdownFromCache(preferredPath, unpackedPath);
      if (fromCache) {
        return {
          html: renderContentMarkdown(fromCache.markdown, preferredPath),
          sourceLocale: locale,
          contentSource: fromCache.contentSource,
        };
      }
    }

    const enPath = paths.en;
    const fromCacheEn = readMarkdownFromCache(enPath, unpackedPath);
    if (fromCacheEn) {
      return {
        html: renderContentMarkdown(fromCacheEn.markdown, enPath),
        sourceLocale: "en",
        contentSource: fromCacheEn.contentSource,
      };
    }
  }

  const preferredPath = paths[locale];
  if (preferredPath) {
    const fromPackage = readMarkdownFromPackage(preferredPath);
    if (fromPackage) {
      return {
        html: renderContentMarkdown(fromPackage.markdown, preferredPath),
        sourceLocale: locale,
        contentSource: fromPackage.contentSource,
      };
    }
  }

  const enPath = paths.en;
  const fromPackageEn = readMarkdownFromPackage(enPath);
  if (!fromPackageEn) {
    throw new Error(`Missing markdown for instructions tab ${tab.id}`);
  }

  return {
    html: renderContentMarkdown(fromPackageEn.markdown, enPath),
    sourceLocale: "en",
    contentSource: fromPackageEn.contentSource,
  };
}

export function resolveInstructionsTabs(locale: Locale): InstructionsTabsResult {
  const { document, source } = resolveInstructionsTabsConfig();
  const resolved = resolveCachedVersion();
  const unpackedPath =
    "code" in resolved ? null : resolved.unpackedPath;

  const tabs: ResolvedInstructionsTab[] = document.tabs.map((tab) => {
    const base = {
      type: tab.type,
      id: tab.id,
      label: resolveInstructionsTabLabel(tab.labels, locale),
      queryParam: tab.queryParam,
      panelTestId: tab.panelTestId,
    };

    if (tab.type === "code") {
      return base;
    }

    if (tab.type === "embedded_external_page") {
      const embedUrl = tab.urls[locale] ?? tab.urls.en;
      return {
        ...base,
        embedUrl,
        sourceLocale: tab.urls[locale] ? locale : "en",
      };
    }

    const content = resolveContentTab(tab, locale, unpackedPath);
    return { ...base, ...content };
  });

  return {
    version: 1,
    source,
    locale,
    tabs,
  };
}
