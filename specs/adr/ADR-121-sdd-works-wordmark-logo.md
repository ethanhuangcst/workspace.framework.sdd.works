# ADR-121: SDD WORKS wordmark logo asset

## Status

Accepted

## Context

The portal uses `public/sdd-logo.png` for the cyan / orange **SDD WORKS** wordmark in `Logo.tsx`, auth shells, the guide hero, and static UI mockups. The on-disk art is outdated relative to the current brand file the operator supplied at [`src/618x618.logos.png`](../../src/618x618.logos.png).

Facts:

1. The file name suggests a square canvas; the PNG is **718×256**, RGBA, horizontal wordmark (SDD in cyan, splatter, WORKS in orange).
2. [`Logo.tsx`](../../src/components/ui/Logo.tsx) serves one URL (`/sdd-logo.png`) for home, header, and auth sizes. CSS classes `.logo-full` and `.logo-header-mark` only change height and max-width.
3. Square mail / MCP icon [`public/sdd-mark.png`](../../public/sdd-mark.png) is **out of scope** for this ADR. It stays until a separate brand pass.
4. Favicon and `apple-icon.png` are **out of scope** for this ADR.

## Decision

### Source of truth

- Authoring path in the app repo: **`src/618x618.logos.png`** (keep the filename; do not rename without operator request).
- Intrinsic size for layout and `next/image`: **width 718, height 256**.

### Deployed asset

- Replace **`public/sdd-logo.png`** with a copy of the source file at implementation time. Keep the public URL **`/sdd-logo.png`** so routes, tests, and mail templates that reference the wordmark path stay stable.
- Do not serve the wordmark from `src/` in production. `src/618x618.logos.png` is the versioned source; `public/sdd-logo.png` is what the browser loads.

### Rendering rules (unchanged tokens unless mockup review adjusts them)

- Transparent background on the image. Do **not** add an opaque plate behind `.logo img` ([knowledge note](../knowledge/agent/admin-portal-seed-and-logo.md)).
- CSS height tokens stay: home **144px**, auth **112px**, header **72px**, with existing max-width and negative horizontal offsets unless mockup review changes optical alignment.
- `object-fit: contain` on all logo images. Reserve space with the 718×256 intrinsic ratio in `Logo.tsx` to limit layout shift.
- `Logo` keeps `alt=""` and puts the host string on the link or wrapper `aria-label` only.

### Mockup (review before production swap)

- Copy the source PNG to [`specs/admin-portal/ui-mockup/assets/sdd-logo.png`](../admin-portal/ui-mockup/assets/sdd-logo.png).
- Update mockup `<img>` intrinsic `width` / `height` to **718** and **256** wherever `assets/sdd-logo.png` is used.
- Primary review surface: [`13-instructions.html`](../admin-portal/ui-mockup/13-instructions.html) (guide header) plus [`01-home.html`](../admin-portal/ui-mockup/01-home.html) and [`02-login.html`](../admin-portal/ui-mockup/02-login.html) for hero and auth scales.

### Implementation gate

Operator approved the mockup (2026-10-08). Production may copy `src/618x618.logos.png` to `public/sdd-logo.png`, update `Logo.tsx` to **718×256**, and run [`app-tests.md`](../admin-portal/app-tests.md) §24.

## Rationale

One public URL avoids a repo-wide path migration. A single source file under `src/` keeps the brand PNG next to other operator-supplied assets and documents the canonical art without exposing `src/` over HTTP.

## Consequences

- Operators replace art by updating `src/618x618.logos.png` and copying to `public/` (or a future sync script).
- Mockup asset and `public/sdd-logo.png` must stay in sync when the wordmark changes.
- Visual regression checks cover header, home hero, and auth card ([AC35](../admin-portal/app-stories.md), [`app-tests.md`](../admin-portal/app-tests.md) §24).

## Related

- [Web-portal-34](../product-backlog.md#pb-131)
- [`app-design.md`](../admin-portal/app-design.md) § Visual language / brand table
- [admin-portal-seed-and-logo.md](../knowledge/agent/admin-portal-seed-and-logo.md)
