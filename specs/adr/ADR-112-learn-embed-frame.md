# ADR-112: Learn embed frame matches the grid

## Status

Accepted

## Context

The Learn Scrum tab frames `https://sdd.works/en/learn/` ([ADR-110](./ADR-110-embedded-external-page-tab.md)). `.learn-embed-frame` in `src/styles/portal.css` is `width: 100%`, `min-height: min(72vh, 780px)`, and `border: 1px solid var(--line)`.

The portfolio on that page is a 3 by 3 grid of square tiles. The frame is a tall rectangle, so the grid does not fill it. The border draws a second edge around the embedded page. The white space inside the frame is the WordPress page. The iframe is cross-origin, so portal CSS cannot change that padding.

## Decision

1. `.learn-embed-frame` has no border and no border radius.
2. The frame is `width: 100%` and fills the guide column. Drop `min-height: min(72vh, 780px)` and the `.learn-spike` min-height override. **Fixed `aspect-ratio: 1 / 1` shipped under this ADR and is superseded by [ADR-114](./ADR-114-learn-embed-auto-height.md)** (auto height via postMessage).
3. The portal does not crop the iframe with `transform`, `overflow: hidden`, or a negative offset.
4. Tab `urls` use the grid-only embed page `https://sdd.works/en/learn-embedded/` (2026-10-07). Portal CSS does not crop the iframe.

## Rationale

A square frame matches three columns of square tiles. Removing the border leaves one edge, the page inside the frame. Cropping a cross-origin page breaks when the WordPress layout moves.

## Consequences

- [Web-portal-27](../product-backlog.md#L404) AC28 covers the frame. The embed URL and host allowlist stay on [ADR-110](./ADR-110-embedded-external-page-tab.md).
- A grid with no surrounding copy waits on a sdd.works embed view. That view is not a change in this repo.

## Date

2026-10-07
