# ADR-120: Learn embed centered loading indicator

## Status

Accepted

## Context

[ADR-118](./ADR-118-learn-embed-loading-skeleton.md) adds a 3×3 skeleton overlay on `.learn-embed-frame-host` until iframe `load`. [WA-17](../issues-log.md) reports that a circular spinner appears in the top-row center tile instead of the center of the embed area.

Facts:

1. The portal overlay does not define a spinner. The visible ring is from the **sdd.works** `learn-embedded` document loading inside the iframe.
2. The iframe stays painted under the overlay (`z-index: 0`) while loading.
3. Skeleton cells pulse with **opacity** down to 0.55, so the remote spinner **shows through** the center cell.
4. The remote loader is positioned for the inner tile grid, not the full host box.

Cross-origin rules still prevent styling inside the iframe. The portal owns loading chrome until `load`.

## Decision

### Portal (framework.sdd.works)

Amend ADR-118 loading behavior:

1. **Hide iframe paint while loading.** Until `iframeLoaded`, apply `visibility: hidden` (or equivalent) on `.learn-embed-frame` so the embed document cannot bleed through the overlay. Layout size unchanged.
2. **One centered indicator on the host.** While loading, show a portal-owned `.learn-embed-loading-indicator` centered in `.learn-embed-frame-host` (flex or absolute inset with `place-items: center`). It sits above the skeleton grid (`z-index` above cells). Decorative only: `aria-hidden="true"`. The host keeps `aria-label` from `admin.guide.learn_scrum_embed_loading`.
3. **Spinner visual.** Guide tokens only: ring using `var(--line-strong)` and `var(--ink)` or a single ink stroke. No theme blue from sdd.works. Size about **1.25rem**. Rotate only when `prefers-reduced-motion: no-preference`; static ring when reduced motion is requested.
4. **Skeleton cells stay opaque.** Pulse animation must not lower whole-cell opacity below 1. Prefer pulsing **background** or an opaque underlay so the iframe never shows through cells.
5. **Unchanged from ADR-118.** 3×3 grid, `pointer-events: none`, overlay removed on iframe `load`, reset on `embedUrl` change, fallback and Get secret outside the host.

### sdd.works (optional follow-up, out of this repo)

When `learn-embedded` is framed, suppress or hide the WordPress or block loading spinner so only the portal indicator shows. Not required to close WA-17 if portal steps 1–4 pass.

### Mockup

[`13-instructions.html`](../admin-portal/ui-mockup/13-instructions.html) loading state includes the centered indicator on the host.

## Rationale

One loading story in the embed box: grid reserves tile layout; a centered ring signals wait without misaligned remote chrome. Hiding iframe paint removes dual-loader confusion ([WA-17](../issues-log.md)).

## Consequences

- [`LearnScrumEmbedPanel.tsx`](../../src/components/features/LearnScrumEmbedPanel.tsx): indicator markup while `!iframeLoaded`.
- [`portal.css`](../../src/styles/portal.css): indicator animation, iframe hidden-until-load, opaque skeleton pulse.
- AC34 in [`app-stories.md`](../admin-portal/app-stories.md); §23 in [`app-tests.md`](../admin-portal/app-tests.md).
- ADR-118 remains the base skeleton decision; this ADR amends overlay behavior only.

## Date

2026-10-08
