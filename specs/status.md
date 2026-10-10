# The latest status of framework.sdd.works

> Type: Framework (process) artifact of framework.sdd.works
> as_of: 2026-10-10 (Sprint 9 WIP; twenty-three SBIs Done; task-02 ToDo only; manual e2e CB/TRAE pass; Codex OGTs open)
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
| [Sprint 9](./sprint-backlog.md#sprint-9) | WIP | - Twenty-three SBIs **Done** (includes [feature-98](./sprint-backlog.md#sprint-9) / [Web-portal-41](./product-backlog.md#pb-140)). Open SBI: [task-02 Go-live](./sprint-backlog.md#sprint-9) only. [MCP-07](./product-backlog.md#pb-105) is **Retired**. Re-smoke live `/setup` and §7.1 hostnames after deploy. |
| Unplanned PBIs | — | - One row: [Web-portal-21](./product-backlog.md#pb-107) partner site (not this repo). |

## where we are now

- Which sprint are we working on now: [Sprint 9](./sprint-backlog.md#sprint-9) is **WIP**. [Sprint 8](./sprint-backlog.md#sprint-8) is **Done**.
- What SBI are we working on now: [task-02 Go-live](./sprint-backlog.md#sprint-9) is the only open SBI (**ToDo**). [feature-98](./sprint-backlog.md#sprint-9) / [Web-portal-41](./product-backlog.md#pb-140) closed 2026-10-10 after user confirm. Manual e2e §16 **pass** on CodeBuddy CN and TRAE CN (TC-1 through TC-6) and **pass** once-per-run for TC-7 through TC-9 (Cursor MCP + verify scripts) on 2026-10-10. Evidence: [`go-live-test.md`](./mcp/go-live-test.md), [`mcp-manual-test-results.md`](./mcp/mcp-manual-test-results.md). **Open OGT rows TC-1 through TC-9 track Codex only:** not verified because operator Codex token ran out 2026-10-10 (TC-2 through TC-6 skipped; TC-1 canonical still [MC-19](./issues-log.md)). Open issues: [WA-14](./issues-log.md), [WA-15](./issues-log.md).

## what could be the next

- After go-live, re-run [release.md](./release.md) §7.2 on `https://sdd.works/setup`, Copy, and Setup tab even though [WA-19](./issues-log.md)–[WA-21](./issues-log.md) are already closed on localhost.
- After the next image deploy, confirm `https://sdd.works/api/sdd/lite/files` returns 200, then close [task-02 Go-live](./sprint-backlog.md#sprint-9).
- [Web-portal-21](./product-backlog.md#pb-107) is **unplanned** here (partner property such as 2study.ai).

## Current OGT(On-going Tasks)

CodeBuddy CN and TRAE CN finished §16 TC-1 through TC-6 on 2026-10-10. TC-7 through TC-9 finished once-per-run (not Codex-specific). Rows **1 through 9** stay open for **Codex only**; operator did not verify Codex because the Codex token ran out 2026-10-10.

| # | Task Name | Affected SBIs | Created | Status |
| --- | --- | --- | --- | --- |
| 1 | Codex TC-1 Setup connects MCP (canonical fetch) | - [task-02 Go-live](./sprint-backlog.md#sprint-9)<br>- [MC-10](./issues-log.md), [MC-19](./issues-log.md)<br>- [`mcp-tests.md`](./mcp/mcp-tests.md#16-manual-e2e-before-go-live) §16 | Sprint 9 | ToDo, Codex not verified |
| 2 | Codex TC-2 Install page guides agent, no scaffold | - [task-02 Go-live](./sprint-backlog.md#sprint-9)<br>- [MC-17](./issues-log.md)<br>- [`mcp-tests.md`](./mcp/mcp-tests.md#16-manual-e2e-before-go-live) §16 | Sprint 9 | ToDo, Codex not verified (token exhausted) |
| 3 | Codex TC-3 Known client installs at seed-map root | - [task-02 Go-live](./sprint-backlog.md#sprint-9)<br>- [MC-16](./issues-log.md)<br>- [`mcp-tests.md`](./mcp/mcp-tests.md#16-manual-e2e-before-go-live) §16 | Sprint 9 | ToDo, Codex not verified (token exhausted) |
| 4 | Codex TC-4 Templates land at nested path | - [task-02 Go-live](./sprint-backlog.md#sprint-9)<br>- [MC-18](./issues-log.md), [MC-15](./issues-log.md)<br>- [`mcp-tests.md`](./mcp/mcp-tests.md#16-manual-e2e-before-go-live) §16 | Sprint 9 | ToDo, Codex not verified (token exhausted) |
| 5 | Codex TC-5 Update noop on same commit | - [task-02 Go-live](./sprint-backlog.md#sprint-9)<br>- [MC-14](./issues-log.md)<br>- [`mcp-tests.md`](./mcp/mcp-tests.md#16-manual-e2e-before-go-live) §16 | Sprint 9 | ToDo, Codex not verified (token exhausted) |
| 6 | Codex TC-6 Update apply on older ledger | - [task-02 Go-live](./sprint-backlog.md#sprint-9)<br>- [MC-16](./issues-log.md)<br>- [`mcp-tests.md`](./mcp/mcp-tests.md#16-manual-e2e-before-go-live) §16 | Sprint 9 | ToDo, Codex not verified (token exhausted) |
| 7 | Codex TC-7 Fixture pack falls back to bundled | - [task-02 Go-live](./sprint-backlog.md#sprint-9)<br>- [MC-06](./issues-log.md), [MC-03](./issues-log.md)<br>- [`scripts/manual-e2e-prep.sh`](../scripts/manual-e2e-prep.sh) | Sprint 9 | ToDo, Codex not verified (once-per-run pass elsewhere) |
| 8 | Codex TC-8 sdd_get_key missing name not a tool error | - [task-02 Go-live](./sprint-backlog.md#sprint-9)<br>- [MC-09](./issues-log.md)<br>- [`mcp-tests.md`](./mcp/mcp-tests.md#16-manual-e2e-before-go-live) §16 | Sprint 9 | ToDo, Codex not verified (once-per-run pass elsewhere) |
| 9 | Codex TC-9 Unknown client root_required flow | - [task-02 Go-live](./sprint-backlog.md#sprint-9)<br>- [ADR-132](./adr/ADR-132-simplified-install-root-and-templates.md)<br>- [`mcp-tests.md`](./mcp/mcp-tests.md#16-manual-e2e-before-go-live) §16 | Sprint 9 | ToDo, Codex not verified (once-per-run pass elsewhere) |
| 10 | Fix stale `product-backlog.md#L` links in specs | - [`scripts/check-spec-links.sh`](../scripts/check-spec-links.sh)<br>- [`sprint-backlog.md`](./sprint-backlog.md#sprint-8) Parent PBI and Unplanned PBIs<br>- [`changes-log.md`](./changes-log.md) | Sprint 8 | ToDo |

## Last 15 closed OGTs

| # | Task Name | Affected SBIs | Created | Closed |
| --- | --- | --- | --- | --- |
| 1 | Add instructions-tabs rules to Admin Settings pack note | - [`src/content/.admin-note.md`](../src/content/.admin-note.md)<br>- [Web-portal-26](./product-backlog.md#pb-123)<br>- [feature-87](./sprint-backlog.md#sprint-9) | Sprint 8 | Sprint 9 |
| 2 | Review `sdd_get_key` so the return is clean | - [MC-07](./issues-log.md) and [MC-09](./issues-log.md) closed in issues-log<br>- [`get-key.ts`](../src/core/tools/get-key.ts) for any follow-up polish | Sprint 9 | Sprint 9 |
| 3 | Refresh CE-SKILL catalog for shipped skills | - [framework-tests.md](./framework/framework-tests.md) **CE-SKILL-07**, **CE-SKILL-14** | Sprint 7 refine | Sprint 9 |
| 4 | Use a numbered table reply in compare and planning skills | - sdd-refine-backlog, sdd-update-specs, sdd-plan-sprint, sdd-spec-to-build, atdd-expert, sdd-review-status | Sprint 7 | Sprint 9 |
| 5 | Refine Implementable PBI i18n-03 HanS and HanT engineering artifacts | - [i18n-03](./product-backlog.md#L304) · `templates/framework.sdd.works/HanS/`, `templates/framework.sdd.works/HanT/` engineering seeds | Sprint 7 plan | Sprint 9 |
| 6 | Rewrite pack-scrum-in-sdd.md | - [ogt-8-pack-scrum-in-sdd.md](./framework/ogt-8-pack-scrum-in-sdd.md)<br>- [ADR-126](./adr/ADR-126-ai-read-pack-templates-and-pack-scrum-in-sdd-filename.md)<br>- AI-read trio beside `constants.json` · **CE-OGT-8** | 2026-10-08 | Sprint 9 |
| 7 | Restructure workspace: seeds in a separate folder with its own Git remote | - [`pack.framework.sdd.works/`](../pack.framework.sdd.works/) pack authoring tree<br>- Remote `framework.sdd.works.git` | Sprint 8 | Sprint 9 |
| 8 | All links should use placeholders such as `{client_root}` and `{workspace}` | - [`check-pack-seed-links.sh`](../scripts/check-pack-seed-links.sh)<br>- [`pack.framework.sdd.works/`](../pack.framework.sdd.works/) pack tree<br>- [`framework-stories.md`](./framework/framework-stories.md#sdd-pack-deliverable-links--ogt-2-pack-link-placeholders) AC1–AC4 | Sprint 5 | Sprint 9 |
| 9 | Ensure skill-and-rule-only pack as constants.json | - | Sprint 7 | Sprint 8 |
| 10 | Check the current skill name (`sdd-implementation` or `sdd-implement`) and rename it to `sdd-build` | - | Sprint 7 | Sprint 8 |
| 11 | Review ethan.md | - [feature-51 Agent guiding proposals](./sprint-backlog.md#sprint-8)<br>- [task-01 Complete Agent-02 job index in ethan.md](./sprint-backlog.md#sprint-8) | Sprint 5 | Sprint 8 |
| 12 | Update the `*-design.md` section in `sdd-scrum-practices.md` to add UI-related content | - [sdd-spec-to-build](../pack.framework.sdd.works/skills/sdd-spec-to-build/SKILL.md) jobs 4–7 | Sprint 7 | Sprint 8 |
| 13 | Rename skill `sdd-atdd` to `atdd-expert` and make it framework independent | - [feature-52 Skill sdd-atdd](./sprint-backlog.md#sprint-7) | Sprint 7 | Sprint 7 |
| 14 | Rename skill `fullstack-developer` to `fullstack-engineer` | - | Sprint 7 | Sprint 7 |
| 15 | Seed files should state Pokymon Card Collection is an example only | - [task-01 Cross-review five process file seeds](./sprint-backlog.md#sprint-6) | Sprint 5 | Sprint 6 |

Last updated: 2026-10-10 Manual e2e §16: CodeBuddy and TRAE pass; OGT TC-1 through TC-9 narrowed to Codex-only verification (token exhausted)
