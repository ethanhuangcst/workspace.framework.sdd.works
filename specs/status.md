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
| Sprint 4      | WIP    | feature-23 is Done. The next item in order is feature-24, not started. |
| Sprint 5 - 16 | ToDo   | Not started. Sprint 16 includes [MCP-01](./product-backlog.md#pb-16) go-live.                                                                              |




## where we are now

- Which sprint are we working on now: Sprint 4 (WIP). feature-23 is Done, and no sprint item is in progress.
- What SBI are we working on now: none. feature-23 Initial sdd-audit-artifacts is Done.



## what could be the next

Next items follow Sprint 4 after feature-23, in sprint item order.

- feature-24 Skill sdd-review-status
- feature-22 Add rule artifacts-map



## Current OGT(On-going Tasks)

Open tasks only. The newest row stays on top. A `Done` row leaves this table and becomes row 1 of Last 15 closed OGTs. `#` is the place in this table. Each Affected SBIs item is its own bullet. The bullet is the code and the SBI name.

No open task.


## Last 15 closed OGTs

Newest closed task first. `#` is the place in this list. Closed is the sprint name when the row closed. A 16th row drops the oldest.


| #   | Task Name                                                                                                                                                                                                                                                                                                            | Affected SBIs | Created  | Closed   |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | -------- | -------- |
| 1   | `sdd-audit-artifacts`: build the fixture workspaces for `CE-AUDIT-01` through `CE-AUDIT-17` as part of feature-23 DoD. | feature-23 Initial sdd-audit-artifacts | Sprint 4 | Sprint 4 |
| 2   | Check that the MCP tools `sdd_install_framework` and `sdd_update_framework` find the IDE skills folder correctly (Cursor: `~/.cursor/skills/`, not `~/.cursor/skills-cursor/` or `~/.claude/skills/`). Confirm that installed skills land at `{client_root}/skills/<name>/SKILL.md` and that a new IDE session lists them. |               | Sprint 4 | Sprint 4 |
| 3   | Sync the Core / Framework / Engineering artifact groups from the EN guide into the portal copies under `src/content/scrum-in-sdd/` (`scrum-in-sdd.en.md`, `scrum-in-sdd.zh-Hans.md`, `scrum-in-sdd.zh-Hant.md`). `{stem}` replaces `{model_name}`, and `issues-log.md` is in Engineering. |               | Sprint 4 | Sprint 4 |
| 4   | Add the missing seed files to `[framework/seeds/](./framework/seeds/)`: the `.sdd-installed.json` field example (`pack_complete: false`), EN `issues-log.md` and `.secrets`, the four rule `.mdc` files, and the `sdd-audit-artifacts` and `sdd-get-status` skills.                                                  |               | Sprint 4 | Sprint 4 |
| 5   | Clarify Core artifacts, Framework artifacts, and Engineering artifacts in `[scrum-in-sdd.md](./framework/seeds/templates/EN/scrum-in-sdd.md)`. Practices now call `artifacts-map.md` a core artifact.                                                                                                                |               | Sprint 4 | Sprint 4 |
| 6   | `sdd-audit-artifacts`: a root map that cannot be read is `Index broken`. AC15 and CE-AUDIT-17. The skill does not open the process files under `specs/`.                                                                                                                                                             |               | Sprint 4 | Sprint 4 |
| 7   | `sdd-audit-artifacts`: the read-only stop is CE-AUDIT-06 and AC13. The skill does not write a project file, the ledger, or `artifacts-map.mdc`.                                                                                                                                                                      |               | Sprint 4 | Sprint 4 |
| 8   | `sdd-audit-artifacts`: the design test range is `CE-AUDIT-01` through `CE-AUDIT-16`.                                                                                                                                                                                                                                 |               | Sprint 4 | Sprint 4 |
| 9   | `sdd-audit-artifacts`: the report is the four labels `verdict`, `locale`, `opened`, and `failed`. AC14 and CE-AUDIT-16 check that block.                                                                                                                                                                             |               | Sprint 4 | Sprint 4 |
| 10  | `sdd-audit-artifacts`: a map that omits `status.md` or `sprint-backlog.md` is not `Usable`. With a map present, the skill opens only listed paths.                                                                                                                                                                   |               | Sprint 4 | Sprint 4 |
| 11  | Review `[product-backlog.md](./product-backlog.md)` and `[sprint-backlog.md](./sprint-backlog.md)`: Skill-10 `sdd-audit-artifacts` (Sprint 4 feature-23), Skill-15 `sdd-get-status` (Sprint 4 feature-24), Skill-04 `sdd-update-project` (Sprint 5 feature-25), and Sprint 5 feature-26 (Ethan runs update-project). |               | Sprint 4 | Sprint 4 |
| 12  | Stories and acceptance criteria for feature-27 are in `[framework-stories.md](./framework/framework-stories.md)`.                                                                                                                                                                                                    |               | Sprint 4 | Sprint 4 |
| 13  | Tests for feature-27 are in `[framework-test.md](./framework/framework-test.md)`.                                                                                                                                                                                                                                    |               | Sprint 4 | Sprint 4 |
| 14  | EN `status.md` seed follows the starter shape. Comments and samples are kept.                                                                                                                                                                                                                                        |               | Sprint 4 | Sprint 4 |
| 15  | One `status.md` section list is in `[framework-design.md](./framework/framework-design.md)` §2.3, the templates section, and `sdd-get-status`.                                                                                                                                                                       |               | Sprint 4 | Sprint 4 |

Last updated: 2026-09-30 19:40 ethan