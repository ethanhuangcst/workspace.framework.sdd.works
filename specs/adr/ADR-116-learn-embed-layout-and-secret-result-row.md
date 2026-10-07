# ADR-116: Learn embed layout and secret result row

## Status

Accepted (spacing and result row superseded by [ADR-117](./ADR-117-learn-embed-spacing-and-codeblock-tokens.md))

## Context

[ADR-113](./ADR-113-learn-embed-copy-and-fallback.md) added intro copy above the Learn iframe. [ADR-115](./ADR-115-get-secret-on-learn-tab.md) placed Get secret under the iframe and above the fallback link.

Visitors reported **WA-15**: the found-secret row uses the portal `.codeblock` (rounded corners, elevated background, tall copy strip) instead of matching the key name row (`.input-box` + `.btn`).

Product direction removes the intro line, puts the learn.sdd.works link directly under the iframe, then Get secret with spacing below the link.

## Decision

1. **Remove** the intro paragraph (`admin.guide.learn_scrum_intro`) from the Learn panel UI. Locale keys may remain unused in catalogs.
2. **Order:** iframe → fallback link (`admin.guide.learn_scrum_open_external`) → Get secret block (`#learn-secret`).
3. **Spacing:** `0.75rem` between iframe and fallback; `1.25rem` between fallback and the secret lookup row (`.learn-embed-secret` top margin).
4. **Found secret row** matches the lookup row visually:
   - Same flex row: fixed-width value field + action button.
   - Value field uses `.input-box` styling (square corners, `var(--fill)` background, `2.125rem` height, `32rem` width on desktop).
   - Copy control uses `.btn` and `.secret-action-btn` so its width matches **Get secret** on the row above.
   - Do not use `.codeblock` / `.codeblock-copy` for the secret result on the guide.

## Rationale

One visual system for name and value rows reduces confusion. The iframe and external course link stay together; keys sit after the course escape hatch.

## Consequences

- [ADR-113](./ADR-113-learn-embed-copy-and-fallback.md) intro bullet is **superseded** for the live UI. Fallback URL rules unchanged.
- [ADR-115](./ADR-115-get-secret-on-learn-tab.md) panel order is **superseded** (fallback before secret).
- **AC29** and **AC31** in [`app-stories.md`](../admin-portal/app-stories.md) gain ADR-116 scenarios; intro assertions drop.
- [`GuideSecretLookup.tsx`](../../src/components/features/GuideSecretLookup.tsx) result markup changes; [`portal.css`](../../src/styles/portal.css) adds `.secret-result-row` rules.

## Date

2026-10-07
