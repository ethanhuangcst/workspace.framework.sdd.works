# The latest status of framework.sdd.works

> Type: Framework (process) artifact of framework.sdd.works
> as_of: 2026-10-10 (Sprint 9 WIP)
> [Definition](../pack.framework.sdd.works/templates/framework.sdd.works/sdd-scrum-practices.md#statusmd)

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
| [Sprint 8](./sprint-backlog.md#sprint-8) | Done | - Closed 2026-10-07. Thirteen SBIs **Done** (includes [feature-81](./sprint-backlog.md#sprint-8) sticky guide header for [Web-portal-29](./product-backlog.md#pb-126)). |
| [Sprint 9](./sprint-backlog.md#sprint-9) | WIP | - Twelve SBIs **Done**: [feature-72](./sprint-backlog.md#sprint-9)–[feature-79](./sprint-backlog.md#sprint-9), [feature-86](./sprint-backlog.md#sprint-9)–[feature-88](./sprint-backlog.md#sprint-9), [feature-97](./sprint-backlog.md#sprint-9). Ten SBIs **ToDo**: [task-01](./sprint-backlog.md#sprint-9), [feature-90](./sprint-backlog.md#sprint-9)–[feature-96](./sprint-backlog.md#sprint-9), [feature-82](./sprint-backlog.md#sprint-9), [feature-84](./sprint-backlog.md#sprint-9) (MCP-08, MCP-09, MCP-07; feature-80 retired). |
| Unplanned PBIs | — | - One row: [Web-portal-21](./product-backlog.md#pb-107) partner site (not this repo). |

## where we are now

- Which sprint are we working on now: [Sprint 9](./sprint-backlog.md#sprint-9) is **WIP**. [Sprint 8](./sprint-backlog.md#sprint-8) is **Done**.
- What SBI are we working on now: No **WIP** SBI. Last closed: [feature-97](./sprint-backlog.md#sprint-9) ([Web-portal-39](./product-backlog.md#pb-136)). Next **ToDo** is [task-01 Write ADR-132 and sync all specs to the simplified install design](./sprint-backlog.md#sprint-9). [feature-80](./sprint-backlog.md#sprint-9) retired, superseded by [MCP-08](./product-backlog.md#pb-137) and [MCP-09](./product-backlog.md#pb-138). [MC-09](./issues-log.md) closed 09/Oct/2026 (`sdd_get_key` missing name is not a tool error). [MC-07](./issues-log.md), [WA-14](./issues-log.md), and [WA-15](./issues-log.md) stay open. [WA-18](./issues-log.md) closed with [feature-77](./sprint-backlog.md#sprint-9).

## what could be the next

- Start [Sprint 9](./sprint-backlog.md#sprint-9) [task-01](./sprint-backlog.md#sprint-9): write [ADR-132](./adr/ADR-132-simplified-install-root-and-templates.md) and sync specs to the simplified install design. Then [feature-90](./sprint-backlog.md#sprint-9)–[feature-96](./sprint-backlog.md#sprint-9) implement the setup separation and the install redesign.
- [feature-82](./sprint-backlog.md#sprint-9) ([MCP-07](./product-backlog.md#pb-105)) serves the live pack after admin sync.
- [feature-84](./sprint-backlog.md#sprint-9) finishes the operator guide to public URLs after [feature-72](./sprint-backlog.md#sprint-9).
- [Web-portal-21](./product-backlog.md#pb-107) is **unplanned** here (partner property such as 2study.ai).

## Current OGT(On-going Tasks)

| # | Task Name | Affected SBIs | Created | Status |
| --- | --- | --- | --- | --- |
| 1 | Review `sdd_get_key` so the return is clean | - [MC-09](./issues-log.md) closed<br>- [MC-07](./issues-log.md) still open (HTTP still lists `sdd_get_key`)<br>- [`get-key.ts`](../src/core/tools/get-key.ts) | Sprint 9 | ToDo |
| 2 | Fix stale `product-backlog.md#L` links in specs | - [`scripts/check-spec-links.sh`](../scripts/check-spec-links.sh)<br>- [`sprint-backlog.md`](./sprint-backlog.md#sprint-8) Parent PBI and Unplanned PBIs<br>- [`changes-log.md`](./changes-log.md) | Sprint 8 | ToDo |
| 3 | Add instructions-tabs rules to Admin Settings pack note | - [`src/content/.admin-note.md`](../src/content/.admin-note.md)<br>- [Web-portal-26](./product-backlog.md#pb-123)<br>- [feature-87](./sprint-backlog.md#sprint-9) | Sprint 8 | WIP |

## Last 15 closed OGTs

| # | Task Name | Affected SBIs | Created | Closed |
| --- | --- | --- | --- | --- |
| 1 | Refresh CE-SKILL catalog for shipped skills | - [framework-tests.md](./framework/framework-tests.md) **CE-SKILL-07**, **CE-SKILL-14** | Sprint 7 refine | Sprint 9 |
| 2 | Use a numbered table reply in compare and planning skills | - sdd-refine-backlog, sdd-update-specs, sdd-plan-sprint, sdd-spec-to-build, atdd-expert, sdd-review-status | Sprint 7 | Sprint 9 |
| 3 | Refine Implementable PBI i18n-03 HanS and HanT engineering artifacts | - [i18n-03](./product-backlog.md#L304) · `templates/framework.sdd.works/HanS/`, `templates/framework.sdd.works/HanT/` engineering seeds | Sprint 7 plan | Sprint 9 |
| 4 | Rewrite pack-scrum-in-sdd.md | - [ogt-8-pack-scrum-in-sdd.md](./framework/ogt-8-pack-scrum-in-sdd.md)<br>- [ADR-126](./adr/ADR-126-ai-read-pack-templates-and-pack-scrum-in-sdd-filename.md)<br>- AI-read trio beside `constants.json` · **CE-OGT-8** | 2026-10-08 | Sprint 9 |
| 5 | Restructure workspace: seeds in a separate folder with its own Git remote | - [`pack.framework.sdd.works/`](../pack.framework.sdd.works/) pack authoring tree<br>- Remote `framework.sdd.works.git` | Sprint 8 | Sprint 9 |
| 6 | All links should use placeholders such as `{client_root}` and `{workspace}` | - [`check-pack-seed-links.sh`](../scripts/check-pack-seed-links.sh)<br>- [`pack.framework.sdd.works/`](../pack.framework.sdd.works/) pack tree<br>- [`framework-stories.md`](./framework/framework-stories.md#sdd-pack-deliverable-links--ogt-2-pack-link-placeholders) AC1–AC4 | Sprint 5 | Sprint 9 |
| 7 | Ensure skill-and-rule-only pack as constants.json | - | Sprint 7 | Sprint 8 |
| 8 | Check the current skill name (`sdd-implementation` or `sdd-implement`) and rename it to `sdd-build` | - | Sprint 7 | Sprint 8 |
| 9 | Review ethan.md | - [feature-51 Agent guiding proposals](./sprint-backlog.md#sprint-8)<br>- [task-01 Complete Agent-02 job index in ethan.md](./sprint-backlog.md#sprint-8) | Sprint 5 | Sprint 8 |
| 10 | Update the `*-design.md` section in `sdd-scrum-practices.md` to add UI-related content | - [sdd-spec-to-build](../pack.framework.sdd.works/skills/sdd-spec-to-build/SKILL.md) jobs 4–7 | Sprint 7 | Sprint 8 |
| 11 | Rename skill `sdd-atdd` to `atdd-expert` and make it framework independent | - [feature-52 Skill sdd-atdd](./sprint-backlog.md#sprint-7) | Sprint 7 | Sprint 7 |
| 12 | Rename skill `fullstack-developer` to `fullstack-engineer` | - | Sprint 7 | Sprint 7 |
| 13 | Seed files should state Pokymon Card Collection is an example only | - [task-01 Cross-review five process file seeds](./sprint-backlog.md#sprint-6) | Sprint 5 | Sprint 6 |
| 14 | Review EN seed sprint-backlog.md with [seed-artifacts-building-guide.md](./seed-artifacts-building-guide.md) | - [task-01 Cross-review five process file seeds](./sprint-backlog.md#sprint-6) | Sprint 5 | Sprint 6 |
| 15 | Add pack seed templates adr.md and knowledge.md | - [feature-40 Skill sdd-retrospective](./sprint-backlog.md#sprint-6) | Sprint 6 | Sprint 6 |

Last updated: 2026-10-09 Close confirm MC-09 (`sdd_get_key` not_found without isError)
