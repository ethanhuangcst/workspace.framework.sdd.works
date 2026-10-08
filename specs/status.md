# The latest status of framework.sdd.works

> Type: Framework (process) artifact of framework.sdd.works
> as_of: 2026-10-08 (Sprint 9 WIP)
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
| [Sprint 8](./sprint-backlog.md#sprint-8) | Done | - Closed 2026-10-07. Thirteen SBIs **Done** (includes [feature-81](./sprint-backlog.md#sprint-8) sticky guide header for [Web-portal-29](./product-backlog.md#pb-126)). |
| [Sprint 9](./sprint-backlog.md#sprint-9) | WIP | - Seven SBIs **Done**: [feature-73](./sprint-backlog.md#sprint-9), [feature-75](./sprint-backlog.md#sprint-9)–[feature-76](./sprint-backlog.md#sprint-9), [feature-78](./sprint-backlog.md#sprint-9)–[feature-79](./sprint-backlog.md#sprint-9), [feature-86](./sprint-backlog.md#sprint-9)–[feature-87](./sprint-backlog.md#sprint-9). Nine SBIs **ToDo**: [feature-72](./sprint-backlog.md#sprint-9), [feature-74](./sprint-backlog.md#sprint-9), [feature-77](./sprint-backlog.md#sprint-9), [feature-80](./sprint-backlog.md#sprint-9), [feature-82](./sprint-backlog.md#sprint-9)–[feature-85](./sprint-backlog.md#sprint-9), [feature-88](./sprint-backlog.md#sprint-9). |
| Unplanned PBIs | — | - No open rows. Seven Implementable PBIs moved to [Sprint 9](./sprint-backlog.md#sprint-9). |

## where we are now

- Which sprint are we working on now: [Sprint 9](./sprint-backlog.md#sprint-9) is **WIP**. [Sprint 8](./sprint-backlog.md#sprint-8) is **Done**.
- What SBI are we working on now: No **WIP** SBI. Last closed: [feature-87 Admin note on Framework page](./sprint-backlog.md#sprint-9) ([Web-portal-26](./product-backlog.md#pb-123)). Next **ToDo** is [feature-72 Hostnames learn.sdd.works and sdd.works](./sprint-backlog.md#sprint-9). [WA-14](./issues-log.md) and [WA-15](./issues-log.md) stay open after [feature-73](./sprint-backlog.md#sprint-9) **Done**.

## what could be the next

- Start [Sprint 9](./sprint-backlog.md#sprint-9) [feature-72](./sprint-backlog.md#sprint-9) hostname cutover ([Web-portal-30](./product-backlog.md#pb-127)).
- [Spec-seeds-15](./product-backlog.md#pb-97) stays **ToDo** on Sprint 8 until [MCP-07](./product-backlog.md#pb-105) ([feature-82](./sprint-backlog.md#sprint-9)) puts the lite allow-list in production sync cache and the install tarball.
- [Web-portal-21](./product-backlog.md#pb-107) is on Sprint 9 as [feature-83](./sprint-backlog.md#sprint-9) (partner workspace, not this portal `/`).
- [Web-portal-38](./product-backlog.md#pb-135) is on Sprint 9 as [feature-88](./sprint-backlog.md#sprint-9) (Node.js-only agent setup path; Git and Xcode out of scope).

## Current OGT(On-going Tasks)

| # | Task Name | Affected SBIs | Created | Status |
| --- | --- | --- | --- | --- |
| 1 | Fix stale `product-backlog.md#L` links in specs | - [`scripts/check-spec-links.sh`](../scripts/check-spec-links.sh)<br>- [`sprint-backlog.md`](./sprint-backlog.md#sprint-8) Parent PBI and Unplanned PBIs<br>- [`changes-log.md`](./changes-log.md) | Sprint 8 | ToDo |
| 2 | Add instructions-tabs rules to Admin Settings pack note | - [`src/content/.admin-note.md`](../src/content/.admin-note.md)<br>- [Web-portal-26](./product-backlog.md#pb-123)<br>- [feature-87](./sprint-backlog.md#sprint-9) | Sprint 8 | WIP |

## Last 15 closed OGTs

| # | Task Name | Affected SBIs | Created | Closed |
| --- | --- | --- | --- | --- |
| 1 | Refresh CE-SKILL catalog for shipped skills | - [framework-tests.md](./framework/framework-tests.md) **CE-SKILL-07**, **CE-SKILL-14** | Sprint 7 refine | Sprint 9 |
| 2 | Use a numbered table reply in compare and planning skills | - sdd-refine-backlog, sdd-update-specs, sdd-plan-sprint, sdd-spec-to-build, atdd-expert, sdd-review-status | Sprint 7 | Sprint 9 |
| 3 | Refine Implementable PBI i18n-03 HanS and HanT engineering artifacts | - [i18n-03](./product-backlog.md#L304) · `templates/HanS/`, `templates/HanT/` engineering seeds | Sprint 7 plan | Sprint 9 |
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

Last updated: 2026-10-08 Close confirm feature-87 (Web-portal-26) Done
