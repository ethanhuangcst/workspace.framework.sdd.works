# The latest status of framework.sdd.works

> Type: Framework (process) artifact of framework.sdd.works
> as_of: 2026-10-07 (eight Sprint 8 SBIs Done; Agent-02 and Agent-03 WIP)
> [Definition](../pack.framework.sdd.works/templates/EN/sdd-scrum-practices.md#statusmd)

---

## Project progress

| Milestone | Status |
| --- | --- |
| Project kickoff | Done |
| Initial product backlog refined | Done |

| Sprint | Status | Note |
| --- | --- | --- |
| Sprint 1 - 6 | Done | - Sprint 1 closed 2026-09-25.<br>- Sprint 2 closed 2026-09-26.<br>- Sprint 3 closed the web portal and MCP for R2.<br>- Sprint 4 closed 2026-10-03.<br>- [Sprint 5](./sprint-backlog.md#sprint-5) closed 2026-10-05.<br>- [Sprint 6](./sprint-backlog.md#sprint-6) closed 2026-10-05. |
| [Sprint 7](./sprint-backlog.md#sprint-7) | Done | - Closed 2026-10-06. Seventeen SBIs **Done** (engineering skills, EN seeds, friendly-language rule). |
| [Sprint 8](./sprint-backlog.md#sprint-8) | WIP | - Twelve SBIs: ten **Done** ([feature-53](./sprint-backlog.md#sprint-8), [feature-57](./sprint-backlog.md#sprint-8), [feature-55](./sprint-backlog.md#sprint-8), [feature-56](./sprint-backlog.md#sprint-8), [feature-58](./sprint-backlog.md#sprint-8)–[feature-60](./sprint-backlog.md#sprint-8), [feature-69](./sprint-backlog.md#sprint-8)–[feature-71](./sprint-backlog.md#sprint-8)). **WIP:** [feature-51](./sprint-backlog.md#sprint-8), [task-01](./sprint-backlog.md#sprint-8). |
| Unplanned PBIs | ToDo | - 12 rows in [Unplanned PBIs](./sprint-backlog.md#unplanned-pbis). Includes [Web-portal-21](./product-backlog.md#L438) (partner site), [Web-portal-26](./product-backlog.md#L419), [MCP-07](./product-backlog.md#L325). |

## where we are now

- Which sprint are we working on now: [Sprint 8](./sprint-backlog.md#sprint-8) is **WIP**.
- What SBI are we working on now: [feature-51 Agent guiding proposals](./sprint-backlog.md#sprint-8) and [task-01 Complete Agent-02 job index in ethan.md](./sprint-backlog.md#sprint-8) stay **WIP**. Lite install HTTP, instructions tabs, Learn Scrum tab, heading anchors, and Skill-24 retrospective are **Done**.

## what could be the next

- Continue [feature-51](./sprint-backlog.md#sprint-8) and [task-01](./sprint-backlog.md#sprint-8) to finish Agent-03 and Agent-02 on Sprint 8.
- [Spec-seeds-15](./product-backlog.md#L474) stays **ToDo** until [MCP-07](./product-backlog.md#L328) puts the lite allow-list in production sync cache and the install tarball.
- [Web-portal-21](./product-backlog.md#L438) install-first landing is **unplanned** (2study.ai workspace, not Sprint 8).

## Current OGT(On-going Tasks)

| # | Task Name | Affected SBIs | Created | Status |
| --- | --- | --- | --- | --- |
| 1 | Fix stale `product-backlog.md#L` links in specs | - [`scripts/check-spec-links.sh`](../scripts/check-spec-links.sh)<br>- [`sprint-backlog.md`](./sprint-backlog.md#sprint-8) Parent PBI and Unplanned PBIs<br>- [`changes-log.md`](./changes-log.md) | Sprint 8 | ToDo |
| 2 | All links should use placeholders such as `{client_root}` and `{workspace}` | - | Sprint 5 | ToDo |
| 3 | Refine Implementable PBI i18n-03 HanS and HanT engineering artifacts | - [i18n-03 HanS and HanT engineering artifacts](./product-backlog.md#L304) | Sprint 7 plan | ToDo |
| 4 | Use a numbered table reply in compare and planning skills | - sdd-refine-backlog, sdd-update-specs, sdd-plan-sprint, sdd-spec-to-build, atdd-expert, sdd-review-status | Sprint 7 | WIP |
| 5 | Refresh CE-SKILL catalog for shipped skills | - [framework-tests.md](./framework/framework-tests.md) CE-SKILL-07 | Sprint 7 refine | ToDo |
| 6 | Restructure workspace: seeds in a separate folder with its own Git remote | - [`pack.framework.sdd.works/`](../pack.framework.sdd.works/) pack authoring tree<br>- Admin Settings pack sync and [MCP-07](./product-backlog.md#L325)<br>- [MCP-01](./product-backlog.md#L318) install allow-list copy paths<br>- [Spec-seeds-15](./product-backlog.md#L474), [Spec-seeds-18](./product-backlog.md#L482) | Sprint 8 | ToDo |
| 7 | Add instructions-tabs rules to Admin Settings pack note | - [`src/content/.admin-note.md`](../src/content/.admin-note.md)<br>- [Web-portal-26](./product-backlog.md#L446) pack note on Settings<br>- [feature-58](sprint-backlog.md#sprint-8)–[feature-60](sprint-backlog.md#sprint-8) | Sprint 8 | WIP |

## Last 15 closed OGTs

| # | Task Name | Affected SBIs | Created | Closed |
| --- | --- | --- | --- | --- |
| 1 | Ensure skill-and-rule-only pack as constants.json | - | Sprint 7 | Sprint 8 |
| 2 | Check the current skill name (`sdd-implementation` or `sdd-implement`) and rename it to `sdd-build` | - | Sprint 7 | Sprint 8 |
| 3 | Review ethan.md | - [feature-51 Agent guiding proposals](./sprint-backlog.md#sprint-8)<br>- [task-01 Complete Agent-02 job index in ethan.md](./sprint-backlog.md#sprint-8) | Sprint 5 | Sprint 8 |
| 4 | Update the `*-design.md` section in `sdd-scrum-practices.md` to add UI-related content | - [sdd-spec-to-build](../pack.framework.sdd.works/skills/sdd-spec-to-build/SKILL.md) jobs 4–7 | Sprint 7 | Sprint 8 |
| 5 | Rename skill `sdd-atdd` to `atdd-expert` and make it framework independent | - [feature-52 Skill sdd-atdd](./sprint-backlog.md#sprint-7) | Sprint 7 | Sprint 7 |
| 6 | Rename skill `fullstack-developer` to `fullstack-engineer` | - | Sprint 7 | Sprint 7 |
| 7 | Seed files should state Pokymon Card Collection is an example only | - [task-01 Cross-review five process file seeds](./sprint-backlog.md#sprint-6) | Sprint 5 | Sprint 6 |
| 8 | Review EN seed sprint-backlog.md with [seed-artifacts-building-guide.md](./seed-artifacts-building-guide.md) | - [task-01 Cross-review five process file seeds](./sprint-backlog.md#sprint-6) | Sprint 5 | Sprint 6 |
| 9 | Add pack seed templates adr.md and knowledge.md | - [feature-40 Skill sdd-retrospective](./sprint-backlog.md#sprint-6) | Sprint 6 | Sprint 6 |
| 10 | Rename deployment.md to release.md | - [feature-48 Seed release.md](./sprint-backlog.md#sprint-7) | Sprint 5 | Sprint 6 |
| 11 | Add test-strategy.md as a new product level engineering artifact | - [feature-50 Seed test-strategy.md](./sprint-backlog.md#sprint-7) | Sprint 5 | Sprint 6 |
| 12 | artifacts-map.json should be a core artifact | - [ADR-082](./adr/ADR-082-artifacts-map-json.md), practices, guides | Sprint 5 | Sprint 6 |
| 13 | Point sdd-refine-backlog and sdd-plan-sprint at feature-break-down | - [feature-38 Pack rule sdd-incremental-delivery.mdc](./sprint-backlog.md#sprint-6) | Sprint 6 | Sprint 6 |
| 14 | Add practices section feature-break-down | - [feature-38 Pack rule sdd-incremental-delivery.mdc](./sprint-backlog.md#sprint-6) | Sprint 6 | Sprint 6 |
| 15 | sdd-review-status needs to review the RID log | - [Skill-12 Pack skill sdd-review-status](./product-backlog.md#L113) | Sprint 5 | Sprint 6 |

Last updated: 2026-10-07 close confirm feature-55, feature-56, feature-58–60, feature-69–71
