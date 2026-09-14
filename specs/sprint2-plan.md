# Sprint 2 Plan — MVP-2: Account management

**Batch:** MVP-2 · **Status:** ToDo  
**Updated:** 2026-09-14  
**Backlog:** [`product-backlog.md`](./product-backlog.md) · **Req:** [`req-spec.md`](./req-spec.md) · **Tech:** [`tech-spec.md`](./tech-spec.md)

## Goal

Default admin is seeded from env with a real password; an authenticated admin can manage other admin accounts (create, view, update, deactivate) end-to-end in the portal.

## In scope

| Feature | Name | Stories | Status |
| --- | --- | --- | --- |
| SEED-01 | Default admin from env | [seed](./admin-portal/app-stories.md#sdd-admin-seed) | **Done** — seed hashes `ADMIN_SEED_PASSWORD`; fails if unset |
| ACCT-03 | Admin account management | [accounts](./admin-portal/app-stories.md#sdd-admin-accounts) | ToDo |

## Delivery order (one story at a time)

1. **SEED-01** — seed `me@ethanhuang.com` / `admin` with password from `ADMIN_SEED_PASSWORD` — **done**
2. **ACCT-03** — accounts list + create / update / deactivate (server-side authz); invite accept flow if in stories

## Dependencies

- **Requires Sprint 1** (INF-02, ACCT-01, I18N-01) — Done.
- Operator sets `ADMIN_SEED_PASSWORD` in `.env.local` / Portainer (`protect-eng`).
- Seed fails closed if `ADMIN_SEED_PASSWORD` is missing or blank.

## Out of scope this sprint

- Keys, Settings, Framework, MCP
- Hard-delete without confirmation UX beyond ACCT-03 AC
- Portal chat LLM

## Exit criteria (DoD)

- [x] `make up` / `prisma db seed` creates or updates the default admin with a non-empty password hash from `ADMIN_SEED_PASSWORD`
- [ ] Operator can sign in with `me@ethanhuang.com` and the env password (no blank-password bootstrap)
- [ ] Authenticated admin can create, view, update, and deactivate accounts
- [ ] Authorization enforced on BFF; UI hiding is not the control
- [ ] i18n keys for all new UI; E2E covers seed login + create + deactivate happy path + unauthorized rejection
- [ ] User confirms accounts management (and seed login) is usable

## Design / mockups

- [app-design.md](./admin-portal/app-design.md) · [10-admins](./admin-portal/ui-mockup/10-admins.html) · [05-accept-invite](./admin-portal/ui-mockup/05-accept-invite.html)
