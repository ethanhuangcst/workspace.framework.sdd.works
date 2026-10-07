# ADR-111: Guide header stays on screen

## Status

Accepted

## Context

`/` and `/instructions` open with a logo, the page title, the line `SKILLS.RULES.AGENTS.TEMPLATES`, and the tab row (Setup, Features, and later tabs). A hairline sits under the tagline (`.guide-hero` `border-bottom` in `src/styles/portal.css`). Long tab bodies scroll that chrome off the viewport, so the visitor loses the title and the tab row.

[Web-portal-05](../product-backlog.md#pb-71) shipped this layout. [Web-portal-25](../product-backlog.md#pb-112) owns which tabs appear. [ADR-109](./ADR-109-content-tab-heading-anchors.md) already offsets in-page heading targets by the tab bar height.

## Decision

1. On `/` and `/instructions`, one block stays at the top of the viewport while the tab body scrolls. The block contains the logo and title row, the tagline `SKILLS.RULES.AGENTS.TEMPLATES`, and the tab names.
2. The hairline under the tagline is removed. The tab row keeps its own underline. The active tab keeps its mark on that underline.
3. The block uses `position: sticky` inside the guide column (`top: 0`, opaque page background). The logo row and the tab row are one sticky element so they pin together.
4. The locale switch and the site footer stay as they are. The locale switch is not inside the sticky block.
5. In-page heading targets ([ADR-109](./ADR-109-content-tab-heading-anchors.md)) use `scroll-margin-top` at least as tall as this sticky block, so a heading link is not hidden under the logo or the tabs.
6. On a narrow viewport the title may wrap inside the sticky block. The tab row may scroll sideways inside the block. The page itself does not gain a horizontal scrollbar.

## Rationale

Sticky keeps the block in normal flow, so the first screen does not need a spacer that must match a wrapping title. One wrapper avoids the tab row covering the title. Dropping the tagline rule leaves the tab underline as the only line in that block.

## Consequences

- [Web-portal-29](../product-backlog.md#pb-126) implements this ADR on the live page and on mockups `01-home.html` and `13-instructions.html`.
- [Web-portal-05](../product-backlog.md#pb-71) stays Done. This ADR changes the chrome on top of that layout.
- [Web-portal-28](../product-backlog.md#pb-125) heading offset must clear the full sticky block, not only the tab row.

## Date

2026-10-07
