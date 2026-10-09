/** Canonical public portal origin (paste sentences and smoke docs). */
export const CANONICAL_PUBLIC_ORIGIN = "https://sdd.works";

/**
 * Origin for visitor-facing paste sentences (Setup copy pill, lite/node templates).
 * Production always uses the canonical host so a wrong PUBLIC_BASE_URL cannot leak localhost.
 * Local / test keeps PUBLIC_BASE_URL (or canonical when unset).
 */
export function getVisitorPasteOrigin(): string {
  if (process.env.NODE_ENV === "production") {
    return CANONICAL_PUBLIC_ORIGIN;
  }
  return (
    process.env.PUBLIC_BASE_URL?.trim() || CANONICAL_PUBLIC_ORIGIN
  ).replace(/\/$/, "");
}
