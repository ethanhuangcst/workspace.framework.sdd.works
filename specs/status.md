<!-- This artifact tracks the current status of the sdd-scrum process -->
---
title: the current status of sdd-scrum execution
type: tracking-spec
status: active
as_of: 2026-09-26
tags:
  - sdd
  - scrum
  - docs
related_spec: sprint-backlog.md
related:
  - product-backlog.md
  - change-log.md
  - artifacts-map.md
  - sprint-backlog.md
---

# status of the current sdd-scrum process

Sprint Backlog is the SBI list. This file records sprint status, the current SBI, and what to do next.

## Sprint status

| Sprint | Status | Note |
| --- | --- | --- |
| Sprint 1 | Done | Closed 2026-09-25. EN guide and practices confirmed. |
| Sprint 2 | Done | Closed 2026-09-26. Installer stories are Done. [MCP-01](./product-backlog.md#pb-16) go-live is Sprint 15. |
| Sprint 3 | WIP | feature-11 is WIP. feature-07 is Done. feature-17 is WIP (Get secret on Setup). ToDo: feature-01, feature-02, feature-03, feature-16 (guide tab). |
| Sprint 4–15 | ToDo | Not started. Sprint 15 includes [MCP-01](./product-backlog.md#pb-16) go-live. |

## where we are now:

- Which sprint are we working on now: **Sprint 3** (WIP). Sprint 1 and Sprint 2 are Done.
- What SBI are we working on now: **feature-11** (update `ethan.md` start load). Mark owns this. Dan owns feature-07 (Features page). Dave owns feature-01, feature-02, and feature-03 after feature-11.

## what could be the next:

- Dan: Sprint 3 feature-07 is Done. The Features tab reads the synced markdown.
- Mark: Sprint 3 feature-11, then feature-01, feature-02, and feature-03 with Dave.
- [MCP-01](./product-backlog.md#pb-16) go-live is Sprint 15 feature-06: pack copy, GitHub Releases for the five `sdd-mcp` binaries, admin-portal sync.

## Current on-going tasks

OGT for Sprint 3, feature-07, Features tab reads synced markdown:

| # | On-going Task | Status |
| --- | --- | --- |
| 1 | The Features page shows the markdown file as written. No fixed sections. | Done |
| 2 | Version text is part of that file, not a separate lookup | Done |
| 3 | Three files: `features.en.md`, `features.zh-Hans.md`, `features.zh-Hant.md`. Missing file falls back to English. | Done |
| 4 | Dan builds the Features page. Mark and Dave build start-a-new-project. | Done |
| 5 | feature-05 includes the old feature-06. The row was not renamed to a task. | Done |
| 6 | If the sync cache cannot be read, the page reads `src/content/features/`. | Done |
