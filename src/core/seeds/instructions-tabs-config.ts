import { existsSync, statSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import { EMBED_PAGE_HOST_ALLOWLIST } from "@/lib/embed-page-host-allowlist";

/** Pack path after sync (relative to unpack root). Spec-seeds-16. */
export const INSTRUCTIONS_TABS_PACK_RELATIVE = "content/.instructions-tabs.json";

export const DEFAULT_CODE_TAB_ALLOWLIST: readonly string[] = ["setup"];

export { EMBED_PAGE_HOST_ALLOWLIST };

const TAB_TYPES = new Set(["code", "content", "embedded_external_page"]);
const KNOWN_PATH_LOCALES = new Set(["en", "zh-Hans", "zh-Hant"]);

export type ValidateInstructionsTabsConfigOptions = {
  contentRoot: string;
  codeAllowlist?: readonly string[];
  checkFilesExist?: boolean;
};

export type ValidateInstructionsTabsConfigResult =
  | { ok: true }
  | { ok: false; errors: string[] };

export function isValidInstructionsContentPath(path: string): boolean {
  if (!path || path.includes("\0")) return false;
  if (path.startsWith("/") || path.includes("\\")) return false;
  if (path.includes("..")) return false;
  const segments = path.split("/");
  if (segments.some((s) => s === "" || s === "." || s === "..")) return false;
  return true;
}

function pathInsideRoot(contentRoot: string, relativePath: string): boolean {
  if (!isValidInstructionsContentPath(relativePath)) return false;
  const abs = resolve(contentRoot, relativePath);
  const rootResolved = resolve(contentRoot);
  return abs === rootResolved || abs.startsWith(rootResolved + sep);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function embedUrlError(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return "is not a valid URL";
  }
  if (parsed.protocol !== "https:") return "must use https";
  if (parsed.username || parsed.password) return "must not include userinfo";
  const host = parsed.hostname.toLowerCase();
  if (!EMBED_PAGE_HOST_ALLOWLIST.includes(host)) {
    return `host is not allowlisted: ${host}`;
  }
  return null;
}

export function validateInstructionsTabsConfig(
  input: unknown,
  options: ValidateInstructionsTabsConfigOptions,
): ValidateInstructionsTabsConfigResult {
  const errors: string[] = [];
  const codeAllowlist =
    options.codeAllowlist ?? DEFAULT_CODE_TAB_ALLOWLIST;
  const checkFilesExist = options.checkFilesExist ?? true;

  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, errors: ["config must be a JSON object"] };
  }

  const record = input as Record<string, unknown>;

  if (record.version !== 1) {
    errors.push("version must be 1");
  }

  const tabsRaw = record.tabs;
  if (!Array.isArray(tabsRaw)) {
    errors.push("tabs must be an array");
    return errors.length > 0 ? { ok: false, errors } : { ok: true };
  }

  if (tabsRaw.length === 0) {
    errors.push("tabs must not be empty");
  }

  const seenIds = new Set<string>();
  const seenQueryParams = new Set<string>();

  for (let i = 0; i < tabsRaw.length; i += 1) {
    const tabRaw = tabsRaw[i];
    const prefix = `tabs[${i}]`;

    if (tabRaw === null || typeof tabRaw !== "object" || Array.isArray(tabRaw)) {
      errors.push(`${prefix} must be an object`);
      continue;
    }

    const tab = tabRaw as Record<string, unknown>;
    const type = tab.type;

    if (typeof type !== "string" || !TAB_TYPES.has(type)) {
      errors.push(`${prefix}.type must be code or content`);
      continue;
    }

    for (const field of [
      "id",
      "labelKey",
      "queryParam",
      "panelTestId",
    ] as const) {
      if (!isNonEmptyString(tab[field])) {
        errors.push(`${prefix}.${field} must be a non-empty string`);
      }
    }

    const id = tab.id;
    if (isNonEmptyString(id)) {
      if (seenIds.has(id)) {
        errors.push(`duplicate tab id: ${id}`);
      } else {
        seenIds.add(id);
      }
    }

    const queryParam = tab.queryParam;
    if (isNonEmptyString(queryParam)) {
      if (seenQueryParams.has(queryParam)) {
        errors.push(`duplicate queryParam: ${queryParam}`);
      } else {
        seenQueryParams.add(queryParam);
      }
    }

    if (type === "code") {
      const codeId = tab.id;
      if (isNonEmptyString(codeId) && !codeAllowlist.includes(codeId)) {
        errors.push(`${prefix}.id is not in code tab allowlist: ${codeId}`);
      }
      if (tab.paths !== undefined) {
        errors.push(`${prefix} code tab must not include paths`);
      }
    }

    if (type === "embedded_external_page") {
      const urlsRaw = tab.urls;
      if (
        urlsRaw === null ||
        typeof urlsRaw !== "object" ||
        Array.isArray(urlsRaw)
      ) {
        errors.push(`${prefix}.urls must be an object`);
        continue;
      }
      const urls = urlsRaw as Record<string, unknown>;
      if (!isNonEmptyString(urls.en)) {
        errors.push(`${prefix}.urls.en is required`);
      }
      for (const [locale, url] of Object.entries(urls)) {
        if (!KNOWN_PATH_LOCALES.has(locale)) {
          errors.push(`${prefix}.urls unknown locale key: ${locale}`);
          continue;
        }
        if (!isNonEmptyString(url)) {
          errors.push(`${prefix}.urls.${locale} must be a non-empty string`);
          continue;
        }
        const urlError = embedUrlError(url);
        if (urlError) {
          errors.push(`${prefix}.urls.${locale} ${urlError}`);
        }
      }
      if (tab.paths !== undefined) {
        errors.push(`${prefix} embedded_external_page must not include paths`);
      }
    }

    if (type === "content") {
      const pathsRaw = tab.paths;
      if (
        pathsRaw === null ||
        typeof pathsRaw !== "object" ||
        Array.isArray(pathsRaw)
      ) {
        errors.push(`${prefix}.paths must be an object`);
        continue;
      }

      const paths = pathsRaw as Record<string, unknown>;
      if (!isNonEmptyString(paths.en)) {
        errors.push(`${prefix}.paths.en is required`);
      }

      for (const [locale, relPath] of Object.entries(paths)) {
        if (!KNOWN_PATH_LOCALES.has(locale)) {
          errors.push(`${prefix}.paths unknown locale key: ${locale}`);
          continue;
        }
        if (typeof relPath !== "string" || relPath.trim().length === 0) {
          errors.push(`${prefix}.paths.${locale} must be a non-empty string`);
          continue;
        }
        if (!pathInsideRoot(options.contentRoot, relPath)) {
          errors.push(`${prefix}.paths.${locale} is unsafe or invalid: ${relPath}`);
          continue;
        }
        if (checkFilesExist && locale === "en") {
          const abs = join(options.contentRoot, relPath);
          if (!existsSync(abs)) {
            errors.push(`missing content file: ${relPath}`);
          } else if (!statSync(abs).isFile()) {
            errors.push(`content path is not a file: ${relPath}`);
          }
        }
      }
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true };
}

export type InstructionsTabCode = {
  type: "code";
  id: string;
  labelKey: string;
  queryParam: string;
  panelTestId: string;
};

export type InstructionsTabContent = {
  type: "content";
  id: string;
  labelKey: string;
  queryParam: string;
  panelTestId: string;
  paths: Record<string, string>;
};

export type InstructionsTabEmbed = {
  type: "embedded_external_page";
  id: string;
  labelKey: string;
  queryParam: string;
  panelTestId: string;
  urls: Record<string, string>;
};

export type InstructionsTab =
  | InstructionsTabCode
  | InstructionsTabContent
  | InstructionsTabEmbed;

export type InstructionsTabsDocument = {
  version: 1;
  tabs: InstructionsTab[];
};

/** Use only after `validateInstructionsTabsConfig` returns ok. */
export function asInstructionsTabsDocument(
  input: unknown,
): InstructionsTabsDocument {
  const record = input as InstructionsTabsDocument;
  return { version: 1, tabs: record.tabs };
}
