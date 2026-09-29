<!-- This artifact tracks the current status of the sdd-scrum process -->
---
title: the current status of sdd-scrum execution
type: tracking-spec
status: active
as_of: 2026-09-28
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
| Sprint 3 | WIP | feature-11 is WIP. The start-load design is in `agent-design.md` §2.2 and §2.4. The seed `agents/ethan.md` is not updated yet. Remaining order after feature-11: feature-03 (map seed), feature-22 (rule `artifacts-map`), feature-21 (change-log and issues-log seeds) and the status seed, feature-01 (skill), feature-02 (Ethan runs it). |
| Sprint 4–15 | ToDo | Not started. Sprint 15 includes [MCP-01](./product-backlog.md#pb-16) go-live. |

## where we are now:

- Which sprint are we working on now: **Sprint 3** (WIP). Sprint 1 and Sprint 2 are Done.
- What SBI are we working on now: **feature-11** (update `ethan.md` start load). The design text is updated. The seed file is the open OGT. Mark owns this. After feature-11, Dave and Mark follow the remaining order: feature-03 map seed, feature-22, feature-21 and the status seed, feature-01, feature-02. Sprint 4 holds `sdd-audit-artifacts`, `sdd-get-status`, and `sdd-update-project`.

## what could be the next:

- Dan: Sprint 3 feature-07 is Done. The Features tab reads the synced markdown.
- Mark: Sprint 3 feature-11, then feature-03 (map seed), feature-22, feature-21 and the status seed, feature-01, and feature-02 with Dave.
- [MCP-01](./product-backlog.md#pb-16) go-live is Sprint 15 feature-06: pack copy, GitHub Releases for the five `sdd-mcp` binaries, admin-portal sync.

## Current on-going tasks

OGT for Sprint 3, feature-11. The path-rule tasks are Done. The open tasks follow the 2026-09-28 start-load design.

| # | On-going Task | Status |
| --- | --- | --- |
| 1 | Update `specs/framework.seeds/agents/ethan.md` from [`agent-design.md`](./agent-ethan/agent-design.md) §2.2 and §2.4, and from the job index in §3. | ToDo |
| 2 | Review [`agent-design.md`](./agent-ethan/agent-design.md) and [`framework-design.md`](./framework.seeds/framework-design.md) against that start load. | ToDo |
| 3 | Review [`product-backlog.md`](./product-backlog.md) and [`sprint-backlog.md`](./sprint-backlog.md): Skill-10, Skill-15, Skill-04, and Sprint 4 feature-01 through feature-04. | ToDo |
| 4 | `templates/EN/sdd-scrum-practices.md` still says map paths are relative to `artifacts_root`, and that the user may set `docs`. The seed and `framework-design.md` store workspace-relative paths such as `specs/product-backlog.md`, and `artifacts_root` may be any one folder name. Update the practices sentences so an agent does not prefix `artifacts_root` again. | Done |
| 5 | In `templates/EN/artifacts-map.md` and `framework-design.md`, keep seed `local` values as concrete paths with the default root `specs`. Do not use `{artifacts_root}` placeholders. `purpose` holds the rule that stays in the working file. Path fields hold the sample. Do not add HTML example comments. | Done |
