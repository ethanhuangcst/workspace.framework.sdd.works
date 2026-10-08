# ADR-118: Learn embed loading skeleton

## Status

Accepted

## Context

The Learn tab frames `https://sdd.works/en/learn-embedded/` ([ADR-110](./ADR-110-embedded-external-page-tab.md)). The remote document often takes several seconds before tiles paint. Until then the iframe area shows only `var(--surface)` with no feedback. The fallback link and Get secret block sit below the frame but the large embed region feels frozen.

Cross-origin rules prevent the portal from styling or animating content inside the iframe. Height is reserved using `estimateLearnEmbedGridHeightPx` ([ADR-114](./ADR-114-learn-embed-auto-height.md), [`learn-embed-messaging.ts`](../../src/lib/learn-embed-messaging.ts)) before the first valid `postMessage`.

## Decision

### Portal (framework.sdd.works)

1. Wrap `learn-scrum-iframe` in a host element (for example `.learn-embed-frame-host`) with `position: relative` and the same width and height as the iframe.
2. While the embed document has not fired `load` on the iframe, show a **skeleton overlay** above the iframe (not inside it):
   - **Layout:** 3×3 grid matching `LEARN_EMBED_GRID_ROWS` / `LEARN_EMBED_GRID_COLS` and the tile aspect ratio (500×375).
   - **Visual:** guide tokens only (`var(--fill)`, `var(--line-strong)` or `var(--line)` borders, square corners). Optional subtle pulse when `prefers-reduced-motion: no-preference`; static blocks when reduced motion is requested.
   - **Coverage:** overlay matches the host box; `pointer-events: none` so it does not block interaction with content below the iframe.
3. **Remove** the overlay on iframe `load`. Reset loading state when `embedUrl` changes (tab remount or locale URL change).
4. **Accessibility:** host has `aria-busy="true"` while loading; `aria-busy="false"` after load. One i18n key `admin.guide.learn_scrum_embed_loading` labels the busy region (visually hidden text or `aria-label` on the host). Test id `learn-embed-loading` on the overlay or host.
5. **Out of scope:** changing `loading="lazy"` vs eager, shortening network time on sdd.works, or skeleton inside the embed document.

### Mockup

[`13-instructions.html`](../admin-portal/ui-mockup/13-instructions.html) shows the skeleton state on the Learn panel for visual confirm before production ships.

## Rationale

A grid skeleton reserves the same mental model as the course tiles, fits the existing height estimate, and satisfies loading feedback guidance for multi-second waits without hiding the fallback link or Get secret.

## Consequences

- New i18n key in `en`, `zh-Hans`, and `zh-Hant`.
- [`LearnScrumEmbedPanel.tsx`](../../src/components/features/LearnScrumEmbedPanel.tsx) gains loading state and markup; [`portal.css`](../../src/styles/portal.css) gains skeleton rules.
- AC32 in [`app-stories.md`](../admin-portal/app-stories.md); §21 in [`app-tests.md`](../admin-portal/app-tests.md).

## Amendments

- [ADR-120](./ADR-120-learn-embed-centered-loading-indicator.md) (2026-10-08): centered portal loading indicator, hide iframe paint until `load`, opaque skeleton pulse. [WA-17](../issues-log.md).

## Date

2026-10-07
