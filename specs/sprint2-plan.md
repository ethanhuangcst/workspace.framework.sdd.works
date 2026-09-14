# Sprint 2 Plan — MVP-2: Account management

**Batch:** MVP-2 · **Status:** Ready for confirm  
**Updated:** 2026-09-14  
**Backlog:** [`product-backlog.md`](./product-backlog.md) · **Req:** [`req-spec.md`](./req-spec.md) · **Tech:** [`tech-spec.md`](./tech-spec.md)

## Goal

Default admin is seeded from env with a real password; an authenticated admin can invite, list, and delete other admin accounts (and pending invites) end-to-end in the portal.

## In scope

| Feature | Name | Stories | Status |
| --- | --- | --- | --- |
| SEED-01 | Default admin from env | [seed](./admin-portal/app-stories.md#sdd-admin-seed) | **Done** — seed hashes `ADMIN_SEED_PASSWORD`; fails if unset |
| ACCT-03 | Admin account management | [invite](./admin-portal/app-stories.md#sdd-admin-invite) · [accounts](./admin-portal/app-stories.md#sdd-admin-accounts) | **Ready for confirm** — invite + list + delete (not self / not last admin); no deactivate UI in v1 |

## Delivery order (one story at a time)

1. **SEED-01** — seed `me@ethanhuang.com` / `admin` with password from `ADMIN_SEED_PASSWORD` — **done**
2. **ACCT-03** — invite by email → `/accept-invite` → list ACTIVE admins + pending invites → delete with confirm — **implemented; awaiting operator usability confirm**

## Dependencies

- **Requires Sprint 1** (INF-02, ACCT-01, I18N-01) — Done.
- Operator sets `ADMIN_SEED_PASSWORD` in `.env.local` / Portainer (`protect-eng`).
- Seed fails closed if `ADMIN_SEED_PASSWORD` is missing or blank.
- Invite mail: Resend in prod; fixture capture via `E2E_INVITE_FILE` in CI/local E2E.

## Out of scope this sprint

- Keys, Settings, Framework, MCP
- Soft-deactivate UI (`DEACTIVATED` remains unused until a later story)
- Hard-delete without confirmation UX beyond ACCT-03 AC
- Portal chat LLM

## Exit criteria (DoD)

- [x] `make up` / `prisma db seed` creates or updates the default admin with a non-empty password hash from `ADMIN_SEED_PASSWORD`
- [x] Operator can sign in with `me@ethanhuang.com` and the env password (no blank-password bootstrap)
- [x] Authenticated admin can invite by email, list admins + pending invites, and delete other admins / unused invites
- [x] Cannot delete self or the last ACTIVE admin (BFF enforced)
- [x] Authorization enforced on BFF; UI hiding is not the control
- [x] i18n keys for all new UI; E2E covers seed login + invite (mail capture) + accept + list + delete + cannot delete self
- [ ] User confirms accounts management (and seed login) is usable

## Design / mockups

- [app-design.md](./admin-portal/app-design.md) · [10-admins](./admin-portal/ui-mockup/10-admins.html) · [05-accept-invite](./admin-portal/ui-mockup/05-accept-invite.html)
