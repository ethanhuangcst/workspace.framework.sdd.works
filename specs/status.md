# The latest status of framework.sdd.works

> Type: Framework (process) artifact of framework.sdd.works
> as_of: 2026-10-06
> [Definition](./framework/seeds/templates/EN/sdd-scrum-practices.md#statusmd)

---

## Project progress

| Milestone | Status |
| --- | --- |
| Project kickoff | Done |
| Initial product backlog refined | Done |

| Sprint | Status | Note |
| --- | --- | --- |
| Sprint 1 - 6 | Done | - Sprint 1 closed 2026-09-25.<br>- Sprint 2 closed 2026-09-26.<br>- Sprint 3 closed the web portal and MCP for R2.<br>- Sprint 4 closed 2026-10-03.<br>- [Sprint 5](./sprint-backlog.md#sprint-5) closed 2026-10-05.<br>- [Sprint 6](./sprint-backlog.md#sprint-6) closed 2026-10-05. |
| [Sprint 7](./sprint-backlog.md#sprint-7) | WIP | - Ten SBIs **Done** (includes [feature-45](./sprint-backlog.md#sprint-7) sdd-spec-to-build).<br>- **WIP**: [feature-65](./sprint-backlog.md#sprint-7) fullstack-engineer, [feature-66](./sprint-backlog.md#sprint-7) ai-architect, [feature-67](./sprint-backlog.md#sprint-7) mcp-expert, [feature-68](./sprint-backlog.md#sprint-7) rag-expert, [feature-62](./sprint-backlog.md#sprint-7) testing-expert, [feature-61](./sprint-backlog.md#sprint-7) frontend-design.<br>- **ToDo**: [feature-64](./sprint-backlog.md#sprint-7) frontend-developer. |
| [Sprint 8](./sprint-backlog.md#sprint-8) | ToDo | - Agent: feature-51, task-01–02.<br>- Portal: task-03; feature-53–57 subset install; feature-58–60 configurable tabs ([Spec-seeds-16](./product-backlog.md#pb-110), [Web-portal-24](./product-backlog.md#pb-111), [Web-portal-25](./product-backlog.md#pb-112)). |
| Unplanned PBIs | ToDo | - 12 rows in [Unplanned PBIs](./sprint-backlog.md#unplanned-pbis). No open Theme rows. |

## where we are now

- Which sprint are we working on now: [Sprint 7](./sprint-backlog.md#sprint-7) is **WIP**.
- What SBI are we working on now: [feature-62 Skill testing-expert](./sprint-backlog.md#sprint-7). [feature-61](./sprint-backlog.md#sprint-7) is also **WIP**.

## what could be the next

- Finish the [feature-62](./sprint-backlog.md#sprint-7) testing-skill proposal, then write the seed after confirm.
- [feature-61](./sprint-backlog.md#sprint-7) seed exists; close after CE-SKILL-15 and close confirm.
- [feature-64 Skill frontend-developer](./sprint-backlog.md#sprint-7) is **ToDo**.
- [feature-65](./sprint-backlog.md#sprint-7) to [feature-68](./sprint-backlog.md#sprint-7) seeds exist: fullstack-engineer, ai-architect, mcp-expert, and rag-expert. Close each after its CE-SKILL case and close confirm.
- Or run `sdd-refine-backlog` on OGT [i18n-03](./product-backlog.md#pb-69) before HanS and HanT engineering work.
- After Sprint 7, Sprint 8 portal work starts with [feature-53 Pack install profile manifests](./sprint-backlog.md#sprint-8) then [feature-55 Install profile API](./sprint-backlog.md#sprint-8).

## Current OGT(On-going Tasks)

| # | Task Name | Affected SBIs | Created | Status |
| --- | --- | --- | --- | --- |
| 1 | Check the current skill name (`sdd-implementation` or `sdd-implement`) and rename it to `sdd-build` | - | Sprint 7 | ToDo |
| 2 | Rename skill `fullstack-developer` to `fullstack-engineer` | - | Sprint 7 | ToDo |
| 3 | Update the `*-design.md` section in `sdd-scrum-practices.md` to add UI-related content | - | Sprint 7 | ToDo |
| 4 | Ensure skill-and-rule-only pack as constants.json | - | Sprint 7 | ToDo |
| 5 | Rename skill `sdd-atdd` to `atdd-expert` and make it framework independent | - [feature-52 Skill sdd-atdd](./sprint-backlog.md#sprint-7) | Sprint 7 | ToDo |
| 6 | All links should use placeholders such as `{client_root}` and `{workspace}` | - | Sprint 5 | ToDo |
| 7 | Review ethan.md | Limits - Report block reads hard-coded | Sprint 5 | ToDo |
| 8 | Refine Implementable PBI i18n-03 HanS and HanT engineering artifacts | - [i18n-03 HanS and HanT engineering artifacts](./product-backlog.md#pb-69) | Sprint 7 plan | ToDo |

## Last 15 closed OGTs

| # | Task Name | Affected SBIs | Created | Closed |
| --- | --- | --- | --- | --- |
| 1 | Seed files should state Pokymon Card Collection is an example only | - [task-01 Cross-review five process file seeds](./sprint-backlog.md#sprint-6) | Sprint 5 | Sprint 6 |
| 2 | Review EN seed sprint-backlog.md with [seed-artifacts-building-guide.md](./seed-artifacts-building-guide.md) | - [task-01 Cross-review five process file seeds](./sprint-backlog.md#sprint-6) | Sprint 5 | Sprint 6 |
| 3 | Add pack seed templates adr.md and knowledge.md | - [feature-40 Skill sdd-retrospective](./sprint-backlog.md#sprint-6) | Sprint 6 | Sprint 6 |
| 4 | Rename deployment.md to release.md | - [feature-48 Seed release.md](./sprint-backlog.md#sprint-7) | Sprint 5 | Sprint 6 |
| 5 | Add test-strategy.md as a new product level engineering artifact | - [feature-50 Seed test-strategy.md](./sprint-backlog.md#sprint-7) | Sprint 5 | Sprint 6 |
| 6 | artifacts-map.json should be a core artifact | - [ADR-082](./adr/ADR-082-artifacts-map-json.md), practices, guides | Sprint 5 | Sprint 6 |
| 7 | Point sdd-refine-backlog and sdd-plan-sprint at feature-break-down | - [feature-38 Pack rule sdd-incremental-delivery.mdc](./sprint-backlog.md#sprint-6) | Sprint 6 | Sprint 6 |
| 8 | Add practices section feature-break-down | - [feature-38 Pack rule sdd-incremental-delivery.mdc](./sprint-backlog.md#sprint-6) | Sprint 6 | Sprint 6 |
| 9 | sdd-review-status needs to review the RID log | - [Skill-12 Pack skill sdd-review-status](./product-backlog.md#pb-86) | Sprint 5 | Sprint 6 |
| 10 | Update sprint-backlog.md to add un-planned PBIs | - | Sprint 5 | Sprint 5 |
| 11 | Add MVP slicing practice into sdd-scrum-practices.md | - | Sprint 5 | Sprint 5 |
| 12 | Add PBI ordering practice into sdd-scrum-practices.md | - | Sprint 5 | Sprint 5 |
| 13 | Simplify sdd-scrum-practices.md, each seed, header and other common components | - | Sprint 5 | Sprint 5 |
| 14 | Review the issues-log seed | - feature-21 Change-log and issues-log seeds | Sprint 4 | Sprint 4 |
| 15 | Enhance sdd-review-status to give agents more room to conclude status and propose actions | - feature-24 Skill sdd-review-status | Sprint 4 | Sprint 4 |

Last updated: 2026-10-06 11:45 ethan
