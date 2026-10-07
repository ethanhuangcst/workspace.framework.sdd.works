# ADR-114: Learn embed auto height and embed-page layout

## Status

Accepted

## Context

The Learn tab frames `https://sdd.works/en/learn-embedded/` ([ADR-110](./ADR-110-embedded-external-page-tab.md), [ADR-112](./ADR-112-learn-embed-frame.md)). [ADR-112](./ADR-112-learn-embed-frame.md) set `aspect-ratio: 1 / 1` so a 3 by 3 tile grid would fit. The embed page is grid-only, but tile rows are not square. A square frame leaves excess height or clips content. The iframe is already `width: 100%` of the guide column. Inner padding and tile scale are set on sdd.works. The portal cannot restyle a cross-origin document.

## Decision

### Portal (framework.sdd.works)

1. `.learn-embed-frame` stays `width: 100%`, `border: 0`. Remove fixed `aspect-ratio: 1 / 1`.
2. Set iframe **height** from the embed document: listen for `postMessage` from `https://sdd.works` (and `https://www.sdd.works` if used) with payload `{ type: "sdd-learn-embed-height", height: number }`. Apply `height` in pixels on the iframe element. Ignore non-numeric or non-positive values.
3. **Origin check:** accept messages only when `event.origin` is on the same host allowlist as embed URLs ([ADR-110](./ADR-110-embedded-external-page-tab.md)).
4. **Fallback** when no message arrives within a short timeout after load: use a conservative default height (for example `min(90vh, 720px)`) so the panel is usable until sdd.works ships the script. Do not use `transform: scale()` or `overflow: hidden` crop on the iframe ([ADR-112](./ADR-112-learn-embed-frame.md) still applies).
5. Re-run height on `window` `resize` in the embed page (child responsibility) and when the Learn tab becomes visible if the panel remounts.

### sdd.works (learn-embedded page, out of repo)

1. Embed layout CSS: zero horizontal padding on the grid wrapper, `width: 100%`, `max-width: 100%`, left-aligned grid flush to the document edge so it matches the portal intro column at iframe width.
2. Optional `max-width` on the grid if product wants tiles smaller than the full guide column. That cap lives on sdd.works only.
3. Inline or enqueued script on `learn-embedded` that measures `document.documentElement.scrollHeight` (or the grid root) and posts `sdd-learn-embed-height` to the parent. Target origin: portal production base and local dev (`http://127.0.0.1:3040`, `http://localhost:3040`, and configured `PUBLIC_BASE_URL` hosts).

## Rationale

Width alignment is already one iframe at 100% column width. Height must follow the child document. postMessage is the standard cross-origin pattern. Layout CSS on the embed page fixes inset without portal crop.

## Consequences

- [ADR-112](./ADR-112-learn-embed-frame.md) decision 2 (square aspect ratio) is **superseded** by this ADR. Decisions 1, 3, and 4 remain.
- [Web-portal-27](../product-backlog.md#pb-124) AC30 covers portal behavior. sdd.works embed CSS and script are a **dependency** for full fit; the portal fallback remains shippable alone.
- Tests: component tests mock `postMessage`; CSS regression drops `aspect-ratio: 1 / 1` assertion; optional contract test for message type constant.

## Date

2026-10-07
