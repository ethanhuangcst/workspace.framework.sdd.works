# Sprint 3 Plan — MVP-3: Keys management

**Batch:** MVP-3 · **Status:** Done  
**Updated:** 2026-09-14  
**Backlog:** [`r1-product-backlog.md`](./r1-product-backlog.md) · **Req:** [`r1-req-spec.md`](./r1-req-spec.md) · **Tech:** [`r1-tech-spec.md`](./r1-tech-spec.md)

## Goal

An admin can create, view, edit, and delete keys (name, description, value); list shows all three; values are protected at rest and never appear unauthenticated.

## In scope

| Feature | Name | Stories | Status |
| --- | --- | --- | --- |
| KEYS-01 | Keys CRUD | [keys](../admin-portal/app-stories.md#sdd-admin-keys) | **Done** |

## Delivery order

1. KEYS-01 — create / list / edit / delete; Copy action; encrypt at rest with `KEYS_ENCRYPTION_KEY`; no regenerate — **Done** (operator confirmed usable)

## Dependencies

- **Requires Sprint 1** (ACCT-01, INF-02, I18N-01).
- Sprint 2 preferred but not a hard data dependency.

## Out of scope this sprint

- MCP `sdd_get_key` (Sprint 5) — store only
- Settings / Framework / install tools

## Exit criteria (DoD)

- [x] CRUD works; unique English `key_name`; list shows name, description, value
- [x] Values only on authenticated Keys pages; never in logs or unauthenticated responses
- [x] RHF + Zod validation; CSRF-safe mutations
- [x] Unit/integration on key store + E2E Keys journey
- [x] User confirms Keys page is usable

## Design / mockups

- [app-design.md](../admin-portal/app-design.md) · [06-keys](../admin-portal/ui-mockup/06-keys.html) · [07-key-new](../admin-portal/ui-mockup/07-key-new.html) · [09-key-edit](../admin-portal/ui-mockup/09-key-edit.html)

## Retrospective

- ADR: [`ADR-048-keys-encryption-at-rest.md`](../adr/ADR-048-keys-encryption-at-rest.md)
- Knowledge: [`knowledge/agent/admin-portal-seed-and-logo.md`](../knowledge/agent/admin-portal-seed-and-logo.md) (Keys validation / UX)
