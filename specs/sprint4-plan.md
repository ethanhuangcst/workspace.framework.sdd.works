# Sprint 4 Plan — MVP-4: Settings + framework live view

**Batch:** MVP-4 · **Status:** Done  
**Updated:** 2026-09-14  
**Backlog:** [`product-backlog.md`](./product-backlog.md) · **Req:** [`req-spec.md`](./req-spec.md) · **Tech:** [`tech-spec.md`](./tech-spec.md)

## Goal

An admin can configure one GitHub repo URL and see a read-only, near-real-time view of the framework repository in the portal.

## In scope

| Feature | Name | Stories | Status |
| --- | --- | --- | --- |
| SETT-01 | GitHub repository URL | [settings](./admin-portal/app-stories.md#sdd-admin-settings) | **Done** |
| FRMW-01 | Framework live view | [framework](./admin-portal/app-stories.md#sdd-admin-framework) | **Done** |

## Delivery order

1. SETT-01 — singleton URL; dirty Save; validate + reachability check before persist — **Done** (operator confirmed usable)
2. FRMW-01 — read-only tree from Settings URL; poll + short TTL cache; sync error callout — **Done** (operator confirmed usable)

## Dependencies

- **Requires Sprint 1** (ACCT-01, INF-02, I18N-01).
- Operator `GITHUB_TOKEN` (contents:read) in env — server-side only (or `GITHUB_FIXTURE=1` / `fixture/*` owner for CI / local fixture).
- Unblocks Sprint 5 (`sdd_list_versions`) and Sprint 6 (package source).

## Out of scope this sprint

- In-portal edit / git push
- MCP tools
- Multiple GitHub URLs (v1 is one URL)
- Webhook cache invalidation (`GITHUB_WEBHOOK_SECRET` unused)

## Exit criteria (DoD)

- [x] Save disabled when clean; unreachable URL does not persist
- [x] Framework page shows tree from configured repo; error state keeps shell
- [x] `GITHUB_TOKEN` never reaches the browser
- [x] E2E: Settings save + framework view (fixture GitHub in CI)
- [x] User confirms Settings + Framework are usable

## Design / mockups

- [app-design.md](./admin-portal/app-design.md) · [11-settings](./admin-portal/ui-mockup/11-settings.html) · [12-framework](./admin-portal/ui-mockup/12-framework.html)

## Retrospective

- No new ADR (poll + TTL + injectable port documented in knowledge).
- Knowledge: [`knowledge/agent/admin-portal-seed-and-logo.md`](./knowledge/agent/admin-portal-seed-and-logo.md) (GitHub fixture / `fixture/*` routing).
