<!-- This artifact tracks the current status of the sdd-scrum process -->
---
title: the current status of sdd-scrum execution
type: tracking-spec
status: active
as_of: 2026-09-25
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

## Project Progress

Initialization and sprint milestones. Sprint Backlog remains the SBI list. Do not duplicate ToDo/WIP/Done columns here.

### Project initialization

- framework.sdd.works installed at `~/.cursor/` — Done (user root; ADR-056)
- artifacts root and map: `specs/artifacts-map.md` — Done
- `specs/product-backlog.md` created and in use — Done

### Sprint 1

- Seed tree `specs/framework.seeds/templates/EN/` holds the EN guide and practices — Done (user confirmed 2026-09-25)
- HanS guide is Sprint 15 — not a Sprint 1 item
- Root `specs/sdd-scrum-guide.md` and `specs/sdd-scrum-practices.md` removed; process docs point at the seed tree — Done
- Agent spike: call-up and job recorded in agent-design — Done
- Phase 1 archive under `phase1-process-specs/` — Done
- Sprint 1 closed — Done

## where we are now:

- Which sprint are we working on now: **Sprint 1** is Done. **Sprint 2** is next and is not started.
- What SBI are we working on now: none. Next is Sprint 2 feature-01 (installer + ledger).
- Sprint 2 is the installer, `pack_complete` on `.sdd-installed.json`, and ethan start gate. It is not started.

## what could be the next:

- Start Sprint 2: installer writes `pack_complete` on `.sdd-installed.json` (ADR-057), and ethan stops when the flag is not true.
- Add `project-constants.md` to `specs/framework.seeds/templates/` as part of that sprint. It is not in the seed tree yet.

## Current on-going tasks
<!-- 
To keep tracking the temporary on-going tasks. (OGT, On-Going-Tasks)
OGT is different from the Sprint Backlog Items (SBIs) in sprint-backlog.md. They are the samller tasks created when AI agents are executing the SBI. Many of them are created by agents in PLAN mode and rely on agents to manage them, or created by human as the temporary tasks.
-->
OGT for guide outline (legacy Sprint 2 / Guide MVP 1 label — keep until reconciled) — taxonomy (1–8 Done) and guide outline (9–14):
| # | On-going Task | Status |
| --- | --- | --- |
| 1 | Place `artifacts-map.md` in a category: process artifact (project map) or framework-definition pack (always installed) | Done — required process artifact (project index); not guide/practices, not tracking |
| 2 | Move the 8-step playbook from `sdd-scrum-guide.md` into `sdd-scrum-practices.md`; guide only names events and artifacts | Done — jobs 1–8 live in practices; guide intro is names/meaning only |
| 3 | Keep `status.md` as a tracking *projection* (current sprint, SBI, next, OGT). Sprint Backlog remains SBI execution truth. Do not duplicate ToDo/WIP/Done there | Done — same rule as EN/status.md comment (OGT ≠ SBI; OGT table only here) |
| 4 | Name OGT in the guide as a tracking concept. Write OGT rows only in `status.md`, never in `sprint-backlog.md` | Done — guide §1 OGT; §2 process vs tracking |
| 5 | Guide: architecture, deployment, and `{component}-stories/design/test` are optional until a component exists. This repo lists instances in `artifacts-map.md` | Done — optional/JIT; not required; users fill as they prefer |
| 6 | Keep `agent-ethan/`, `adr/`, `knowledge/` off the three core lists (product/domain extras, not sdd-scrum core) | Done — fourth category **Knowledge** (`adr/`, `knowledge/`); `agent-ethan/` stays this product’s coach specs |
| 7 | Practices: when to copy `.cursor/templates/...`. Templates are seeds, not live artifacts | Done — practices **Templates**; guide seeds vs working copies |
| 8 | Rewrite pointers that still say practices = “columns only” (`artifacts-map`, agent-design, practices intro, product-backlog pb-5) to: guide = definition, practices = what/how/when, process vs tracking lists | Done — map, pb-5, product-backlog header, agent-design |
| 9 | Adopt four-part guide outline: §1 definition, §2 classic Scrum map, §3 gaps in AI-agent SDD, §4 sdd-scrum (overview, responsibilities, artifacts & commitments, events, values) | ToDo |
| 10 | §2 = 2020 Scrum as baseline (accountabilities, artifacts+commitments, events, values). Compact map + link is still preferred; a shortened local summary is OK while under review | ToDo |
| 11 | Move current taxonomy content (OGT, artifact categories, event names, seeds vs copies) under §4; do not discard | ToDo |
| 12 | Foundation: 2020 Scrum no longer fits AI-era SDD. sdd-scrum is a significant modification, not a faithful overlay. §3 names what no longer fits; §4 is the modified definition. Agents may take Scrum work (including SM). Humans may remain accountable where stated | Done — user 2026-09-22 |
| 13 | Update `s2-guide` / pb-5 / pb-8 AC so MVP 1 means skeleton of §1–§4 exists (not the old terminologies-only headings) | ToDo |
| 14 | Draft the §3 gap list as items only (still no full prose): team/agents vs 2020 roles; specs beyond classic three artifacts; dual status; events as skills/jobs; knowledge category; seeds vs working copies | ToDo |
| 15 | Ethan prompt: no pack scan on start; skills run jobs; missing framework → instructions page (ADR-056) | Done — 2026-09-24 |
| 16 | Practices job 1 still says re-install/update and copy templates; align with ADR-056 | ToDo |
