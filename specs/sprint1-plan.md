# Sprint 1 Plan — MVP-1: Portal foundation + admin auth

**Batch:** MVP-1 · **Status:** Done  
**Updated:** 2026-09-14  
**Accepted:** 2026-09-14 — operator confirmed login + password reset usable  
**Backlog:** [`product-backlog.md`](./product-backlog.md) · **Req:** [`req-spec.md`](./req-spec.md) · **Tech:** [`tech-spec.md`](./tech-spec.md)

## Goal

An operator can run the admin portal locally, log in as a seeded admin, and reset a forgotten password by email. The versioned client path map and resolver ship as the architecture foundation for MCP install/update (Cursor seed only in v1).

## In scope

| Feature | Name | Stories | Status |
| --- | --- | --- | --- |
| INF-01 | Project scaffold | [app-stories](./admin-portal/app-stories.md) | **Done** — Next.js App Router, Makefile `dev`/`up`/`down`, Tailwind, Vitest/Playwright |
| INF-02 | Database schema & migrations | [app-stories](./admin-portal/app-stories.md) | **Done** — Prisma schema + migrate + seed (`me@ethanhuang.com`; password via SEED-01 `ADMIN_SEED_PASSWORD`) |
| INF-03 | CI pipeline | [app-stories](./admin-portal/app-stories.md) | **Done** — `.github/workflows/ci.yml` (lint, typecheck, unit, E2E; fixture Resend via `E2E_RESET_FILE`) |
| PATH-01 | Client path map (seed data + resolver) | [path-map](./mcp/mcp-stories.md#sdd-mcp-path-map) | **Done** — `packages/sdd-paths` (Cursor × 3 OS); unit tests green; `paths_version` exposure deferred to Sprint 5 (`sdd_list_versions`) |
| I18N-01 | i18n foundation (`en` / `zh-Hans` / `zh-Hant`) | [I18N](./admin-portal/app-stories.md#sdd-admin-i18n) | **Done** — `messages/*` + `t()` + locale switcher |
| ACCT-01 | Admin login | [login](./admin-portal/app-stories.md#sdd-admin-login) | **Done** — email/password session, CSRF; login not rate-limited; empty-password seed → `/set-password` (password field not required on first login) |
| ACCT-02 | Password reset (Resend) | [reset](./admin-portal/app-stories.md#sdd-admin-password-reset) | **Done** — reset request + set-password; E2E captures link via `E2E_RESET_FILE` |

## Delivery order (one story at a time)

1. INF-01 — scaffold (Next.js App Router, Makefile `dev`/`up`/`down`, Tailwind, Vitest/Playwright hooks) — **done**
2. INF-02 — Prisma schema + local Postgres (`localhost:5435` / `framework_sdd`) — **done**
3. PATH-01 — `packages/sdd-paths/paths.json` (Cursor × macOS/Windows/Linux) + JSON Schema + resolver + table-validation test — **done**
4. I18N-01 — catalogs + `t()` + locale switcher — **done**
5. ACCT-01 — login + session cookie — **done**
6. ACCT-02 — reset request + Resend + set-password — **done**
7. INF-03 — GitHub Actions (fixture-only default) — **done**

## Dependencies

- None from prior MVPs.
- Operator fills `.env.local` secrets (`SESSION_SECRET`, `RESEND_*`, `MAIL_FROM`, …) — `protect-eng`.
- Dev DB: local PostgreSQL. Prod DB: AliCloud (not required to close Sprint 1 locally).

## Out of scope this sprint

- ACCT-03 accounts CRUD (Sprint 2)
- Keys, Settings, Framework view, MCP tools
- Production deploy to Server 2

## Exit criteria (DoD)

- [x] `make dev` / `make up` / `make down` work with local Postgres
- [x] Seeded admin can log in; session is httpOnly / CSRF-safe (login not rate-limited)
- [x] Password reset email path works (sandbox or live Resend with operator key; CI uses file capture)
- [x] UI strings via i18n; locale switch does not crash on missing keys
- [x] `packages/sdd-paths/paths.json` exists with Cursor seed (macOS/Windows/Linux); resolver returns allow-listed roots; table-validation test passes; `paths_version` is exposed once `sdd_list_versions` lands (Sprint 5)
- [x] Lint, typecheck, unit, and at least one auth E2E path defined in CI (fixture-only)
- [x] User confirms: “Do you confirm this feature is usable?” for login + reset — **confirmed 2026-09-14**

## Progress notes (2026-09-14)

- Seeded admin: email `me@ethanhuang.com`, username `admin`, **no default password**. First sign-in: leave password blank → `/set-password` → then sign in with the new password.
- Login UI: password is **not** HTML-`required`; hint key `admin.login.password_first_hint`.
- Brand logo: transparent PNG; CSS must not paint `.logo img { background: #000 }`. Display size 200% of original tokens; home offset `-30px`; header offset `-22px`.
- **MVP-1 closed.** Next: Sprint 2 (`ACCT-03`).

## Design / mockups

- [app-design.md](./admin-portal/app-design.md) · [01-home](./admin-portal/ui-mockup/01-home.html) · [02-login](./admin-portal/ui-mockup/02-login.html) · [03-reset](./admin-portal/ui-mockup/03-reset.html) · [04-set-password](./admin-portal/ui-mockup/04-set-password.html)
