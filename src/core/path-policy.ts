import {
  isUnderHome,
  validatePathTemplate,
  type PathError,
} from "@sdd/paths";

export { isUnderHome, validatePathTemplate };

const FORBIDDEN_PREFIXES = ["/", "/etc", "/usr", "/bin", "/sbin"];

export function validateExpandedPath(
  expanded: string,
  home: string,
  userProfile: string,
): PathError | null {
  if (expanded.includes("..")) {
    return { code: "path_rejected", reason: "path_escape", raw: expanded };
  }
  const normalized = expanded.replace(/\\/g, "/");
  if (
    FORBIDDEN_PREFIXES.some(
      (prefix) =>
        prefix !== "/" &&
        (normalized === prefix || normalized.startsWith(`${prefix}/`)),
    )
  ) {
    return { code: "path_rejected", reason: "forbidden_root", raw: expanded };
  }
  if (!isUnderHome(expanded, home, userProfile)) {
    return { code: "path_rejected", reason: "not_under_home", raw: expanded };
  }
  return null;
}
