# The latest status of framework.sdd.works

> Type: Framework (process) artifact of framework.sdd.works
> as_of: 2026-10-08 (Sprint 9 ToDo)
> [Definition](../pack.framework.sdd.works/templates/sdd-scrum-practices.md#statusmd)

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
| [Sprint 8](./sprint-backlog.md#sprint-8) | Done | - Closed 2026-10-07. Twelve SBIs **Done** (Ethan jobs and guiding proposals, lite HTTP install, instructions tabs, Learn Scrum tab, heading anchors, Skill-24 retrospective). |
| [Sprint 9](./sprint-backlog.md#sprint-9) | ToDo | - Two SBIs **ToDo**: [feature-72](./sprint-backlog.md#sprint-9) hostnames; [feature-73](./sprint-backlog.md#sprint-9) Get secret on Learn tab ([ADR-115](./adr/ADR-115-get-secret-on-learn-tab.md)). |
| Unplanned PBIs | ToDo | - 12 rows in [Unplanned PBIs](./sprint-backlog.md#unplanned-pbis). Includes [Web-portal-21](./product-backlog.md#L438) (partner site), [Web-portal-26](./product-backlog.md#L419), [MCP-07](./product-backlog.md#L325). |

## where we are now

- Which sprint are we working on now: [Sprint 8](./sprint-backlog.md#sprint-8) is **Done**. [Sprint 9](./sprint-backlog.md#sprint-9) is **ToDo**.
- What SBI are we working on now: no Sprint 8 WIP. Next SBI is [feature-72 Hostnames learn.sdd.works and sdd.works](./sprint-backlog.md#sprint-9).

## what could be the next

- Start [Sprint 9](./sprint-backlog.md#sprint-9) [feature-72](./sprint-backlog.md#sprint-9) hostname cutover ([Web-portal-30](./product-backlog.md#pb-127)).
- [Spec-seeds-15](./product-backlog.md#L474) stays **ToDo** until [MCP-07](./product-backlog.md#L328) puts the lite allow-list in production sync cache and the install tarball.
- [Web-portal-21](./product-backlog.md#L438) install-first landing is **unplanned** (2study.ai workspace, not Sprint 8).

## Current OGT(On-going Tasks)

| # | Task Name | Affected SBIs | Created | Status |
| --- | --- | --- | --- | --- |
| 1 | Fix stale `product-backlog.md#L` links in specs | - [`scripts/check-spec-links.sh`](../scripts/check-spec-links.sh)<br>- [`sprint-backlog.md`](./sprint-backlog.md#sprint-8) Parent PBI and Unplanned PBIs<br>- [`changes-log.md`](./changes-log.md) | Sprint 8 | ToDo |
| 3 | Refine Implementable PBI i18n-03 HanS and HanT engineering artifacts | - [i18n-03 HanS and HanT engineering artifacts](./product-backlog.md#L304) | Sprint 7 plan | ToDo |
| 4 | Use a numbered table reply in compare and planning skills | - sdd-refine-backlog, sdd-update-specs, sdd-plan-sprint, sdd-spec-to-build, atdd-expert, sdd-review-status | Sprint 7 | WIP |
| 5 | Refresh CE-SKILL catalog for shipped skills | - [framework-tests.md](./framework/framework-tests.md) CE-SKILL-07 | Sprint 7 refine | ToDo |
| 6 | Restructure workspace: seeds in a separate folder with its own Git remote | - [`pack.framework.sdd.works/`](../pack.framework.sdd.works/) pack authoring tree<br>- Admin Settings pack sync and [MCP-07](./product-backlog.md#L325)<br>- [MCP-01](./product-backlog.md#L318) install allow-list copy paths<br>- [Spec-seeds-15](./product-backlog.md#L474), [Spec-seeds-18](./product-backlog.md#L482) | Sprint 8 | ToDo |
| 7 | Add instructions-tabs rules to Admin Settings pack note | - [`src/content/.admin-note.md`](../src/content/.admin-note.md)<br>- [Web-portal-26](./product-backlog.md#L446) pack note on Settings<br>- [feature-58](sprint-backlog.md#sprint-8)–[feature-60](sprint-backlog.md#sprint-8) | Sprint 8 | WIP |
| 8 | Rewrite pack-scrum-in-sdd.md | - [ogt-8-pack-scrum-in-sdd.md](./framework/ogt-8-pack-scrum-in-sdd.md)<br>- [ADR-126](./adr/ADR-126-ai-read-pack-templates-and-pack-scrum-in-sdd-filename.md)<br>- [framework-stories § OGT-8](./framework/framework-stories.md#ogt-8-pack-scrum-in-sdd-rename) · **CE-OGT-8** | 2026-10-08 | ToDo |

## Last 15 closed OGTs

| # | Task Name | Affected SBIs | Created | Closed |
| --- | --- | --- | --- | --- |
| 1 | All links should use placeholders such as `{client_root}` and `{workspace}` | - [`check-pack-seed-links.sh`](../scripts/check-pack-seed-links.sh)<br>- [`pack.framework.sdd.works/`](../pack.framework.sdd.works/) pack tree<br>- [`framework-stories.md`](./framework/framework-stories.md#sdd-pack-deliverable-links--ogt-2-pack-link-placeholders) AC1–AC4 | Sprint 5 | Sprint 9 |
| 2 | Ensure skill-and-rule-only pack as constants.json | - | Sprint 7 | Sprint 8 |
| 3 | Check the current skill name (`sdd-implementation` or `sdd-implement`) and rename it to `sdd-build` | - | Sprint 7 | Sprint 8 |
| 4 | Review ethan.md | - [feature-51 Agent guiding proposals](./sprint-backlog.md#sprint-8)<br>- [task-01 Complete Agent-02 job index in ethan.md](./sprint-backlog.md#sprint-8) | Sprint 5 | Sprint 8 |
| 5 | Update the `*-design.md` section in `sdd-scrum-practices.md` to add UI-related content | - [sdd-spec-to-build](../pack.framework.sdd.works/skills/sdd-spec-to-build/SKILL.md) jobs 4–7 | Sprint 7 | Sprint 8 |
| 6 | Rename skill `sdd-atdd` to `atdd-expert` and make it framework independent | - [feature-52 Skill sdd-atdd](./sprint-backlog.md#sprint-7) | Sprint 7 | Sprint 7 |
| 7 | Rename skill `fullstack-developer` to `fullstack-engineer` | - | Sprint 7 | Sprint 7 |
| 8 | Seed files should state Pokymon Card Collection is an example only | - [task-01 Cross-review five process file seeds](./sprint-backlog.md#sprint-6) | Sprint 5 | Sprint 6 |
| 9 | Review EN seed sprint-backlog.md with [seed-artifacts-building-guide.md](./seed-artifacts-building-guide.md) | - [task-01 Cross-review five process file seeds](./sprint-backlog.md#sprint-6) | Sprint 5 | Sprint 6 |
| 10 | Add pack seed templates adr.md and knowledge.md | - [feature-40 Skill sdd-retrospective](./sprint-backlog.md#sprint-6) | Sprint 6 | Sprint 6 |
| 11 | Rename deployment.md to release.md | - [feature-48 Seed release.md](./sprint-backlog.md#sprint-7) | Sprint 5 | Sprint 6 |
| 12 | Add test-strategy.md as a new product level engineering artifact | - [feature-50 Seed test-strategy.md](./sprint-backlog.md#sprint-7) | Sprint 5 | Sprint 6 |
| 13 | artifacts-map.json should be a core artifact | - [ADR-082](./adr/ADR-082-artifacts-map-json.md), practices, guides | Sprint 5 | Sprint 6 |
| 14 | Point sdd-refine-backlog and sdd-plan-sprint at feature-break-down | - [feature-38 Pack rule sdd-incremental-delivery.mdc](./sprint-backlog.md#sprint-6) | Sprint 6 | Sprint 6 |
| 15 | Add practices section feature-break-down | - [feature-38 Pack rule sdd-incremental-delivery.mdc](./sprint-backlog.md#sprint-6) | Sprint 6 | Sprint 6 |

Last updated: 2026-10-08 OGT 8 opened (rewrite pack-scrum-in-sdd.md, ADR-126)
