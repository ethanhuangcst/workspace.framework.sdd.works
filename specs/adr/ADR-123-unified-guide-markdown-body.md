# ADR-123: Unified guide markdown body styling

## Status

Accepted

## Context

Instructions **content** tabs render pack markdown in the portal ([ADR-071](./ADR-071-portal-content-paths.md), [Web-portal-25](../product-backlog.md#pb-112)). Today each tab uses a different wrapper class and CSS path:

| Tab (examples) | Wrapper class | Table markup | Table CSS |
| --- | --- | --- | --- |
| Features | `features-body` | Raw `<table>` | Global admin `table` / `th` / `td` (mono uppercase headers, auto column widths) |
| Scrum in SDD | `scrum-body` | Raw `<table>` if any | Prose headings only; tables inherit admin globals |
| Invoke custom agents | `portal-content-body` | `<div class="content-table"><table>` | Scoped catalog table rules |
| Future content tabs | `portal-content-body` | Wrapped when `instructions-tabs.ts` post-processes HTML | Same as invoke |

Operators add tabs via `content/.instructions-tabs.json`. New tabs must not require new portal CSS. [WA-18](../issues-log.md) tracks the defect.

Catalog work in mockup (shared `content-table`, fixed first column, h3 badge alignment) must apply to **every** content tab, not Features alone.

## Decision

### One wrapper class

All `type: "content"` tab panels use:

```text
guide-section guide-md-body [guide-md-body--catalog | guide-md-body--prose]
```

| Modifier | When | Markdown shape |
| --- | --- | --- |
| `guide-md-body--catalog` | Features (`content/features/*.md`) | Section `h2`, group `h3` badges, two-column GFM tables |
| `guide-md-body--prose` | Scrum in SDD, invoke-agents, and **default for new content tabs** | Document `h1` / `h2`, paragraphs, lists, tables |

**Test ids stay tab-specific** (`features-body`, `scrum-body`, `{id}-body`). Only presentation classes change.

### One markdown HTML pipeline for tables

After marked renders HTML for any content tab path:

1. Wrap every `<table>` in `<div class="content-table">…</div>` (same as invoke today).
2. Keep Features-only **list** em-dash split in `renderFeaturesMarkdown` until catalog lists are removed from seeds.

Do not branch table wrapping on `content/features/` alone.

### Shared CSS token block

In `portal.css` / `tokens.css` (mockup mirrors `mockup.css`):

| Token / rule | Role |
| --- | --- |
| `--guide-md-catalog-col1` | Fixed first column width for all catalog tables (default **11rem**) |
| `.guide-md-body` | Full width of `--guide-max`; no inner `40rem` prose cap; shared `scroll-margin-top` for headings |
| `.guide-md-body .content-table` | `table-layout: fixed`, width **100%**, optional `padding-left: 0.45rem` under `--catalog` so column text aligns with `h3` badge label inset |
| `.guide-md-body--catalog h3` | Gray group label (today’s Features chip) |
| `.guide-md-body--prose h1` / `h2` | Long-form scale (today’s `.scrum-body` part titles) |
| Table `th` / `td` | Sentence-case UI headers, not admin uppercase mono globals |

Retire presentation rules on `.features-body`, `.scrum-body`, and `.portal-content-body` after migration. Remove those class names from `contentBodyClassName()` in [`instructions-tabs-dom.ts`](../../src/lib/instructions-tabs-dom.ts).

### Mockup gate

[`13-instructions.html`](../admin-portal/ui-mockup/13-instructions.html) (Features, Scrum sample), [`14-invoke-agents-review.html`](../admin-portal/ui-mockup/14-invoke-agents-review.html), and [`01-home.html`](../admin-portal/ui-mockup/01-home.html) use `guide-md-body` before production ships.

## Rationale

Tab-specific CSS duplicated table behavior and drifted (Features vs invoke). One class plus two modifiers keeps Features catalog visuals while preserving Scrum / invoke heading hierarchy. Config-driven tabs inherit `--prose` and table wrap without new engineering.

## Consequences

- [`scrum-body-heading-scale.md`](../knowledge/agent/scrum-body-heading-scale.md) guidance updates: Scrum must not use `features-body`; use `guide-md-body--prose`.
- Tests that assert class names (`features-body` on article) may assert `guide-md-body` instead; **test ids unchanged**.
- Admin data tables (`[data-keys-table]`) stay separate; they do not use `guide-md-body`.

## Related

- [WA-18](../issues-log.md)
- [AC37](../admin-portal/app-stories.md)
- [`app-design.md`](../admin-portal/app-design.md) Guide markdown body
- [ADR-109](./ADR-109-content-tab-heading-anchors.md)
