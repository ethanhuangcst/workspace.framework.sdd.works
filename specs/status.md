<!-- This artifact tracks the current status of the sdd-scrum process -->
---
title: the current status of sdd-scrum execution
type: tracking-spec
status: active
as_of: 2026-09-27
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
| Sprint 3 | WIP | feature-11 is WIP. feature-07, feature-16, and feature-17 are Done. feature-18 and feature-19 Done (guide rename). feature-20 Done (skill `sdd-kickoff-project`). Remaining order: feature-03 (map seed), feature-22 (rule `artifacts-map`), feature-21 (change-log and issues-log seeds) and the status seed, feature-01 (skill), feature-02 (Ethan runs it). |
| Sprint 4–15 | ToDo | Not started. Sprint 15 includes [MCP-01](./product-backlog.md#pb-16) go-live. |

## where we are now:

- Which sprint are we working on now: **Sprint 3** (WIP). Sprint 1 and Sprint 2 are Done.
- What SBI are we working on now: **feature-11** (update `ethan.md` start load). Mark owns this. Dan owns feature-07 (Features page). After feature-11, Dave and Mark follow the remaining order: feature-03 map seed, feature-22, feature-21 and the status seed, feature-01, feature-02.

## what could be the next:

- Dan: Sprint 3 feature-07 is Done. The Features tab reads the synced markdown.
- Mark: Sprint 3 feature-11, then feature-03 (map seed), feature-22, feature-21 and the status seed, feature-01, and feature-02 with Dave.
- [MCP-01](./product-backlog.md#pb-16) go-live is Sprint 15 feature-06: pack copy, GitHub Releases for the five `sdd-mcp` binaries, admin-portal sync.

## Current on-going tasks

OGT for Sprint 3, feature-11, align the practices path rule with the artifacts-map seed:

| # | On-going Task | Status |
| --- | --- | --- |
| 1 | `templates/EN/sdd-scrum-practices.md` still says map paths are relative to `artifacts_root`, and that the user may set `docs`. The seed and `framework-design.md` store workspace-relative paths such as `specs/product-backlog.md`, and `artifacts_root` may be any one folder name. Update the practices sentences so an agent does not prefix `artifacts_root` again. | Done |
| 2 | In `templates/EN/artifacts-map.md` and `framework-design.md`, keep seed `local` values as concrete paths with the default root `specs`. Do not use `{artifacts_root}` placeholders. `purpose` holds the rule that stays in the working file. Path fields hold the sample. Do not add HTML example comments. | Done |
