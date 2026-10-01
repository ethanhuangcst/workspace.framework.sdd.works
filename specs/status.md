---

## title: The latest status of framework.sdd.works
type: tracking-spec
status: active
as_of: 2026-09-30
tags:
  - sdd
  - scrum
  - docs
related_spec: sprint-backlog.md
related:
  - product-backlog.md
  - changes-log.md
  - artifacts-map.md
  - [sprint-backlog.md](http://sprint-backlog.md)

# The latest status of framework.sdd.works

Sprint Backlog is the SBI list.

## Project progress


| Milestone                       | Status |
| ------------------------------- | ------ |
| Project kickoff                 | Done   |
| Initial product backlog refined | Done   |



| Sprint        | Status | Note                                                                                                                                                       |
| ------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sprint 1 - 3  | Done   | Sprint 1 closed 2026-09-25. Sprint 2 closed 2026-09-26. Sprint 3 closed the web portal and MCP for R2.                                                     |
| Sprint 4      | WIP    | feature-04 Sprint-backlog seed is Done. feature-27 is reopened and WIP. The `status.md` seed is under review with the seed artifacts building guide. |
| Sprint 5 - 16 | ToDo   | Not started. Sprint 16 includes [MCP-01](./product-backlog.md#pb-16) go-live.                                                                              |




## where we are now

- Which sprint are we working on now: Sprint 4 (WIP). feature-27 is reopened.
- What SBI are we working on now: feature-27 Seed status.md (WIP). The `status.md` seed is under review with the seed artifacts building guide.



## what could be the next

Next items follow Sprint 4 after feature-27, in sprint item order.

- feature-30 Fill practices job 6 and ship sdd-update-status
- feature-24 Skill sdd-review-status
- feature-22 Add rule artifacts-map



## Current OGT(On-going Tasks)

Open tasks only. The newest row stays on top. A `Done` row leaves this table and becomes row 1 of Last 15 closed OGTs. `#` is the place in this table. Each Affected SBIs item is its own bullet. The bullet is the code and the SBI name.

| # | Task Name | Affected SBIs | Created | Status |
| --- | --- | --- | --- | --- |
| 1 | Review the `status.md` seed with [`seed-artifacts-building-guide.md`](./seed-artifacts-building-guide.md), and update [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md#statusmd) | - feature-27 Seed status.md | Sprint 4 | WIP |


## Last 15 closed OGTs

Newest closed task first. `#` is the place in this list. Closed is the sprint name when the row closed. A 16th row drops the oldest.


| #   | Task Name                                                                                                                                                                                                                                                                                                            | Affected SBIs | Created  | Closed   |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | -------- | -------- |
| 1   | Retrospective rules for `sprint-backlog.md` | - feature-04 Sprint-backlog seed | Sprint 4 | Sprint 4 |
| 2   | Sprint item table rules for `sprint-backlog.md` | - feature-04 Sprint-backlog seed | Sprint 4 | Sprint 4 |
| 3   | Sprint body rules for `sprint-backlog.md` | - feature-04 Sprint-backlog seed | Sprint 4 | Sprint 4 |
| 4   | Definition of Done rules for `sprint-backlog.md` | - feature-04 Sprint-backlog seed | Sprint 4 | Sprint 4 |
| 5   | RID coverage section removed from `sprint-backlog.md` | - feature-04 Sprint-backlog seed | Sprint 4 | Sprint 4 |
| 6   | RID Log rules for `sprint-backlog.md` | - feature-04 Sprint-backlog seed | Sprint 4 | Sprint 4 |
| 7   | Header rules for `sprint-backlog.md` | - feature-04 Sprint-backlog seed | Sprint 4 | Sprint 4 |
| 8   | `sdd-audit-artifacts`: build the fixture workspaces for `CE-AUDIT-01` through `CE-AUDIT-17` as part of feature-23 DoD. | feature-23 Initial sdd-audit-artifacts | Sprint 4 | Sprint 4 |
| 9   | Check that the MCP tools `sdd_install_framework` and `sdd_update_framework` find the IDE skills folder correctly (Cursor: `~/.cursor/skills/`, not `~/.cursor/skills-cursor/` or `~/.claude/skills/`). Confirm that installed skills land at `{client_root}/skills/<name>/SKILL.md` and that a new IDE session lists them. |               | Sprint 4 | Sprint 4 |
| 10  | Sync the Core / Framework / Engineering artifact groups from the EN guide into the portal copies under `src/content/scrum-in-sdd/` (`scrum-in-sdd.en.md`, `scrum-in-sdd.zh-Hans.md`, `scrum-in-sdd.zh-Hant.md`). `{stem}` replaces `{model_name}`, and `issues-log.md` is in Engineering. |               | Sprint 4 | Sprint 4 |
| 11  | Add the missing seed files to [framework/seeds/](./framework/seeds/): the `.sdd-installed.json` field example (`pack_complete: false`), EN `issues-log.md` and `.secrets`, the four rule `.mdc` files, and the `sdd-audit-artifacts` and `sdd-get-status` skills.                                                  |               | Sprint 4 | Sprint 4 |
| 12  | Clarify Core artifacts, Framework artifacts, and Engineering artifacts in [scrum-in-sdd.md](./framework/seeds/templates/EN/scrum-in-sdd.md). Practices now call `artifacts-map.md` a core artifact.                                                                                                                |               | Sprint 4 | Sprint 4 |
| 13  | `sdd-audit-artifacts`: a root map that cannot be read is `Index broken`. AC15 and CE-AUDIT-17. The skill does not open the process files under `specs/`.                                                                                                                                                             |               | Sprint 4 | Sprint 4 |
| 14  | `sdd-audit-artifacts`: the read-only stop is CE-AUDIT-06 and AC13. The skill does not write a project file, the ledger, or `artifacts-map.mdc`.                                                                                                                                                                      |               | Sprint 4 | Sprint 4 |
| 15  | `sdd-audit-artifacts`: the design test range is `CE-AUDIT-01` through `CE-AUDIT-16`.                                                                                                                                                                                                                                 |               | Sprint 4 | Sprint 4 |
Last updated: 2026-10-01 13:32 ethan