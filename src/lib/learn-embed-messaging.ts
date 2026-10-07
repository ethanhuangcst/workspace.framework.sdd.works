import { EMBED_PAGE_HOST_ALLOWLIST } from "@/lib/embed-page-host-allowlist";

/** postMessage payload type from sdd.works learn-embedded (ADR-114). */
export const LEARN_EMBED_HEIGHT_MESSAGE_TYPE = "sdd-learn-embed-height";

export const LEARN_EMBED_FALLBACK_TIMEOUT_MS = 2000;

export const LEARN_EMBED_FALLBACK_MAX_PX = 720;

export const LEARN_EMBED_FALLBACK_VH_RATIO = 0.9;

export function isAllowedLearnEmbedMessageOrigin(origin: string): boolean {
  try {
    const host = new URL(origin).hostname;
    return EMBED_PAGE_HOST_ALLOWLIST.includes(host);
  } catch {
    return false;
  }
}

export function parseLearnEmbedHeightMessage(data: unknown): number | null {
  if (typeof data !== "object" || data === null) return null;
  const record = data as Record<string, unknown>;
  if (record.type !== LEARN_EMBED_HEIGHT_MESSAGE_TYPE) return null;
  const height = record.height;
  if (typeof height !== "number" || !Number.isFinite(height) || height <= 0) {
    return null;
  }
  return Math.ceil(height);
}

export function computeLearnEmbedFallbackHeightPx(viewportHeight: number): number {
  return Math.min(
    Math.round(viewportHeight * LEARN_EMBED_FALLBACK_VH_RATIO),
    LEARN_EMBED_FALLBACK_MAX_PX,
  );
}

/** Interim height until sdd.works posts scrollHeight (3×3 tiles ~430×400). */
export const LEARN_EMBED_GRID_ROWS = 3;

export function estimateLearnEmbedGridHeightPx(iframeWidthPx: number): number {
  if (!Number.isFinite(iframeWidthPx) || iframeWidthPx <= 0) {
    return computeLearnEmbedFallbackHeightPx(
      typeof window !== "undefined" ? window.innerHeight : 800,
    );
  }
  const columnWidth = iframeWidthPx / 3;
  const rowHeight = columnWidth * (400 / 430);
  return Math.ceil(rowHeight * LEARN_EMBED_GRID_ROWS);
}
