import { EMBED_PAGE_HOST_ALLOWLIST } from "@/lib/embed-page-host-allowlist";

/** postMessage payload type from sdd.works learn-embedded (ADR-114). */
export const LEARN_EMBED_HEIGHT_MESSAGE_TYPE = "sdd-learn-embed-height";

export const LEARN_EMBED_FALLBACK_TIMEOUT_MS = 2000;

export const LEARN_EMBED_FALLBACK_MAX_PX = 720;

export const LEARN_EMBED_FALLBACK_VH_RATIO = 0.9;

/** Extra pixels above width-based 3×3 grid estimate when capping postMessage height. */
export const LEARN_EMBED_HEIGHT_SLACK_PX = 16;

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

/** Cap oversized embed scrollHeight so empty space below the tile grid is not framed. */
export function resolveLearnEmbedFrameHeightPx(
  heightPx: number,
  iframeWidthPx: number,
): number {
  const posted = Math.ceil(heightPx);
  if (!Number.isFinite(iframeWidthPx) || iframeWidthPx <= 0) {
    return Math.min(posted, LEARN_EMBED_FALLBACK_MAX_PX);
  }
  const gridCap =
    estimateLearnEmbedGridHeightPx(iframeWidthPx) + LEARN_EMBED_HEIGHT_SLACK_PX;
  return Math.min(posted, gridCap);
}

export function computeLearnEmbedFallbackHeightPx(viewportHeight: number): number {
  return Math.min(
    Math.round(viewportHeight * LEARN_EMBED_FALLBACK_VH_RATIO),
    LEARN_EMBED_FALLBACK_MAX_PX,
  );
}

/** sdd.works learn-embedded portfolio tiles (500×375 PNGs, 3×3 grid). */
export const LEARN_EMBED_GRID_ROWS = 3;
export const LEARN_EMBED_GRID_COLS = 3;
export const LEARN_EMBED_TILE_WIDTH_PX = 500;
export const LEARN_EMBED_TILE_HEIGHT_PX = 375;

export function estimateLearnEmbedGridHeightPx(iframeWidthPx: number): number {
  if (!Number.isFinite(iframeWidthPx) || iframeWidthPx <= 0) {
    return computeLearnEmbedFallbackHeightPx(
      typeof window !== "undefined" ? window.innerHeight : 800,
    );
  }
  const columnWidth = iframeWidthPx / LEARN_EMBED_GRID_COLS;
  const rowHeight =
    columnWidth * (LEARN_EMBED_TILE_HEIGHT_PX / LEARN_EMBED_TILE_WIDTH_PX);
  return Math.ceil(rowHeight * LEARN_EMBED_GRID_ROWS);
}
