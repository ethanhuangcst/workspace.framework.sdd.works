# Sprint 4 Plan — MVP-4: Settings + framework live view

**Batch:** MVP-4 · **Status:** ToDo  
**Backlog:** [`product-backlog.md`](./product-backlog.md) · **Req:** [`req-spec.md`](./req-spec.md) · **Tech:** [`tech-spec.md`](./tech-spec.md)

## Goal

An admin can configure one GitHub repo URL and see a read-only, near-real-time view of the framework repository in the portal.

## In scope

| Feature | Name | Stories |
| --- | --- | --- |
| SETT-01 | GitHub repository URL | [settings](./admin-portal/app-stories.md#sdd-admin-settings) |
| FRMW-01 | Framework live view | [framework](./admin-portal/app-stories.md#sdd-admin-framework) |

## Delivery order

1. SETT-01 — singleton URL; dirty Save; validate + reachability check before persist
2. FRMW-01 — read-only tree/file view from Settings URL; poll or webhook + short cache; sync error callout

## Dependencies

- **Requires Sprint 1** (ACCT-01, INF-02, I18N-01).
- Operator `GITHUB_TOKEN` (contents:read) in env — server-side only.
- Unblocks Sprint 5 (`sdd_list_versions`) and Sprint 6 (package source).

## Out of scope this sprint

- In-portal edit / git push
- MCP tools
- Multiple GitHub URLs (v1 is one URL)

## Exit criteria (DoD)

- [ ] Save disabled when clean; unreachable URL does not persist
- [ ] Framework page shows tree from configured repo; error state keeps shell
- [ ] `GITHUB_TOKEN` never reaches the browser
- [ ] E2E: Settings save + framework view (fixture GitHub in CI)
- [ ] User confirms Settings + Framework are usable

## Design / mockups

- [app-design.md](./admin-portal/app-design.md) · [11-settings](./admin-portal/ui-mockup/11-settings.html) · [12-framework](./admin-portal/ui-mockup/12-framework.html)
