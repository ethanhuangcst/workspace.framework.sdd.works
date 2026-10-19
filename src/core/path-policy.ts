import {
  isUnderHome,
  validatePathTemplate,
  type PathError,
} from "@sdd/paths";

export { isUnderHome, validatePathTemplate };

const FORBIDDEN_PREFIXES = ["/", "/etc", "/usr", "/bin", "/sbin"];

function rejectForbiddenSystemRoot(raw: string): PathError | null {
  const normalized = raw.replace(/\\/g, "/");
  if (
    FORBIDDEN_PREFIXES.some(
      (prefix) =>
        prefix !== "/" &&
        (normalized === prefix || normalized.startsWith(`${prefix}/`)),
    )
  ) {
    return { code: "path_rejected", reason: "forbidden_root", raw };
  }
  return null;
}

/** HTTP manual root: structural checks only; no home expansion or server-home check (MC-21). */
export function validatePortableRoot(raw: string): PathError | null {
  if (raw.includes("..")) {
    return { code: "path_rejected", reason: "path_escape", raw };
  }
  return rejectForbiddenSystemRoot(raw);
}

export function validateExpandedPath(
  expanded: string,
  home: string,
  userProfile: string,
): PathError | null {
  if (expanded.includes("..")) {
    return { code: "path_rejected", reason: "path_escape", raw: expanded };
  }
  const forbidden = rejectForbiddenSystemRoot(expanded);
  if (forbidden) return forbidden;
  if (!isUnderHome(expanded, home, userProfile)) {
    return { code: "path_rejected", reason: "not_under_home", raw: expanded };
  }
  return null;
}
