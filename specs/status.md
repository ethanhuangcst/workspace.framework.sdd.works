<!-- This artifact tracks the current status of the sdd-scrum process -->
---
title: the current status of sdd-scrum execution
type: tracking-spec
status: active
as_of: 2026-09-29
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
| Sprint 3 | WIP | feature-03 (map seed) is Done. Current SBI is feature-27 (seed `status.md`, WIP). Then feature-23 (`sdd-audit-artifacts`), feature-24 (`sdd-get-status`), feature-25, feature-26, feature-21, feature-01, feature-02, feature-22. |
| Sprint 4–15 | ToDo | Not started. Sprint 15 includes [MCP-01](./product-backlog.md#pb-16) go-live. |

## where we are now:

- Which sprint are we working on now: **Sprint 3** (WIP). Sprint 1 and Sprint 2 are Done.
- What SBI are we working on now: **feature-27** (seed `status.md`, WIP). feature-03 is Done. Then feature-23 (`sdd-audit-artifacts`), feature-24 (`sdd-get-status`), feature-25, feature-26, feature-21, feature-01, feature-02, feature-22. Sprint 4 has no SBIs.

## what could be the next:

- Dan: Sprint 3 feature-07 is Done. The Features tab reads the synced markdown.
- Mark: Sprint 3 feature-27 (seed `status.md`) is WIP. Then feature-23, feature-24, feature-25, feature-26, feature-21, feature-01, feature-02, and feature-22. feature-03 is Done.
- [MCP-01](./product-backlog.md#pb-16) go-live is Sprint 15 feature-06: pack copy, GitHub Releases for the five `sdd-mcp` binaries, admin-portal sync.

## Current on-going tasks

Open tasks only. Closed tasks move to the section below. Keep the latest 15 closed rows.

| # | On-going Task | Status |
| --- | --- | --- |
| 3 | Review [`product-backlog.md`](./product-backlog.md) and [`sprint-backlog.md`](./sprint-backlog.md): Skill-10 `sdd-audit-artifacts` (Sprint 3 feature-23), Skill-15 `sdd-get-status` (Sprint 3 feature-24), Skill-04 `sdd-update-project` (Sprint 3 feature-25), and Sprint 3 feature-26 (Ethan runs update-project). | ToDo |
| 6 | Check that the MCP tools `sdd_install_framework` and `sdd_update_framework` find the IDE skills folder correctly (Cursor: `~/.cursor/skills/`, not `~/.cursor/skills-cursor/` or `~/.claude/skills/`). Confirm that installed skills land at `{client_root}/skills/<name>/SKILL.md` and that a new IDE session lists them. | ToDo |

## Last 15 closed OGTs

Newest closed task first. `#` here is the place in this list, not the number the task had while it was open.

| # | Closed task | Status |
| --- | --- | --- |
| 1 | Sprint columns are `#`, `Code`, `SBI`. `Code` is column 2. | Done |
| 2 | Review [`agent-design.md`](./agent-ethan/agent-design.md) and [`framework-design.md`](./framework.seeds/framework-design.md) against the start load. | Done |
| 3 | Update `specs/framework.seeds/agents/ethan.md` from [`agent-design.md`](./agent-ethan/agent-design.md) §2.2, §2.4, and the job index in §3. | Done |
| 4 | Seed `local` paths in `artifacts-map.md` and `framework-design.md` stay concrete paths under `specs`. No `{artifacts_root}` placeholder. | Done |
| 5 | Practices open a map path as `{workspace}/<path>` and do not prefix `artifacts_root` again. | Done |
| 6 | If the sync cache cannot be read, the Features page reads `src/content/features/`. | Done |
| 7 | feature-05 includes the old feature-06. The row was not renamed to a task. | Done |
| 8 | Dan builds the Features page. Mark and Dave build start-a-new-project. | Done |
| 9 | Three files: `features.en.md`, `features.zh-Hans.md`, `features.zh-Hant.md`. A missing file falls back to English. | Done |
| 10 | Version text is part of the Features markdown, not a separate lookup. | Done |
| 11 | The Features page shows the markdown file as written. No fixed sections. | Done |
| 12 | Ethan prompt: no pack scan on start; skills run jobs; a missing framework sends the instructions page ([ADR-056](./adr/ADR-056-single-user-root-framework-pack.md)). | Done |
| 13 | Pointers that called practices “columns only” now say the guide is definition and practices are what, how, and when. | Done |
| 14 | Practices say when to copy template seeds. Templates are seeds, not live artifacts. | Done |
| 15 | `adr/` and `knowledge/` are the Knowledge category, not one of the three core artifact lists. | Done |
