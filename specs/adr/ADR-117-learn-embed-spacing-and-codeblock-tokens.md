# ADR-117: Learn embed spacing and codeblock tokens

## Status

Accepted

## Context

[ADR-116](./ADR-116-learn-embed-layout-and-secret-result-row.md) set Learn spacing in `rem` and moved the found-secret row off `.codeblock` onto `.input-box`. **WA-15** feedback continues: iframe-to-link gap is too large, link-to-Get-secret gap is too small, and the value row should stay a **code block** with a visible border while matching the lookup row height and Copy button width.

Setup and manual `mcp.json` blocks use the same `.codeblock` component. Rounded corners and elevated fill on code blocks diverge from `.input-box` on the guide.

## Decision

1. **Learn vertical spacing (fixed pixels):**
   - Iframe bottom → fallback link: **15px** (`.learn-embed-fallback` top margin).
   - Fallback link bottom → `#learn-secret` / first secret row: **45px** (`.learn-embed-secret` top margin).
2. **Found secret row** uses `.codeblock.secret-result-block` again (not `.secret-result-row` / faux input). It sits in `.secret-stack` below `.secret-lookup` with the same `1.25rem` stack gap as today.
3. **Secret-stack code block (local):**
   - Row height **2.125rem** for the value field and Copy control, aligned with `.secret-lookup .input-box` and `.secret-action-btn`.
   - Copy uses `.codeblock-copy` styled to the same **width** as **Get secret** (shared `.secret-action-btn` width rules on both buttons).
   - Border stays visible: **1.5px** `var(--line-strong)`, same as `.input-box`.
4. **Global `.codeblock` tokens** in [`portal.css`](../../src/styles/portal.css) and mockup CSS:
   - `border-radius: 0` (square corners, match input boxes).
   - `border: 1.5px solid var(--line-strong)`.
   - `background: var(--fill)` (replace `var(--bg-elevated)` for the default block).
   - Multi-line blocks (manual `mcp.json`, setup copy) keep taller content via existing padding; only the border, radius, and fill change globally.
   - **File blocks** (`.codeblock--file`): `.codeblock-head` uses `var(--bg)` (page background); JSON body uses `var(--fill)` so the header is a subtle step lighter than the gray code area.
5. **Compact single-line code blocks** (secret result): `.secret-stack .codeblock` sets `align-items: stretch`, `.codeblock-text` uses `0.75rem` horizontal padding and line height so total row is **2.125rem**; `.codeblock-copy` height **2.125rem**, flex alignment with Get secret button.

## Rationale

Fixed px spacing matches design review on the Learn tab. One code-block vocabulary for secret values avoids a second “fake input” row. Global square, bordered, fill-backed code blocks align the guide with secret lookup fields without restyling file-style blocks’ internal layout.

## Consequences

- [ADR-116](./ADR-116-learn-embed-layout-and-secret-result-row.md) items 3–4 on spacing and non-codeblock result are **superseded** by this ADR.
- [`GuideSecretLookup.tsx`](../../src/components/features/GuideSecretLookup.tsx) reverts result markup to `.codeblock.secret-result-block` + `.codeblock-copy` with `.secret-action-btn` width class on Copy.
- **AC31** / **§20** in [`app-tests.md`](../admin-portal/app-tests.md) assert 15px / 45px margins and codeblock result row.
- **WA-15** close check updates to codeblock + height + button width.
- Mockup [`13-instructions.html`](../admin-portal/ui-mockup/13-instructions.html) is the visual confirm target before production CSS ships.

## Date

2026-10-07
