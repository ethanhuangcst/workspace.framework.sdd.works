

---

## title: the current status of sdd-scrum execution
type: tracking-spec
status: active
as_of: 2026-09-22
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

# status of the current sdd-scrum process

## where we are now:



- Which sprint are we working on now: Sprint 2
- What SBI are we working on now: SBI 1 — Guide MVP 1 slice ([s2-guide](./sprint-backlog.md#s2-guide))



## what could be the next:



- Taxonomy OGTs 1–8 are Done.
- Fill remaining guide MVP 1 terms; then Sprint 2 SBI 2 (Coach MVP 1).



## Current on-going tasks



OGT for Sprint #2, SBI #1, Guide MVP 1 slice — artifact taxonomy gaps:


| #   | On-going Task                                                                                                                                                                                                  | Status                                                                                                       |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 1   | Place `artifacts-map.md` in a category: process artifact (project map) or framework-definition pack (always installed)                                                                                         | Done — required process artifact (project index); not guide/practices, not tracking                          |
| 2   | Move the 8-step playbook from `sdd-scrum-guide.md` into `sdd-scrum-practices.md`; guide only names events and artifacts                                                                                        | Done — jobs 1–8 live in practices; guide intro is names/meaning only                                         |
| 3   | Keep `status.md` as a tracking *projection* (current sprint, SBI, next, OGT). Sprint Backlog remains SBI execution truth. Do not duplicate ToDo/WIP/Done there                                                 | Done — same rule as EN/status.md comment (OGT ≠ SBI; OGT table only here)                                    |
| 4   | Name OGT in the guide as a tracking concept. Write OGT rows only in `status.md`, never in `sprint-backlog.md`                                                                                                  | Done — guide §1 OGT; §2 process vs tracking                                                                  |
| 5   | Guide: architecture, deployment, and `{component}-stories/design/test` are optional until a component exists. This repo lists instances in `artifacts-map.md`                                                  | Done — optional/JIT; not required; users fill as they prefer                                                 |
| 6   | Keep `agent-ethan/`, `adr/`, `knowledge/` off the three core lists (product/domain extras, not sdd-scrum core)                                                                                                 | Done — fourth category **Knowledge** (`adr/`, `knowledge/`); `agent-ethan/` stays this product’s coach specs |
| 7   | Practices: when to copy `.cursor/templates/...`. Templates are seeds, not live artifacts                                                                                                                       | Done — practices **Templates**; guide seeds vs working copies                                                |
| 8   | Rewrite pointers that still say practices = “columns only” (`artifacts-map`, agent-design, practices intro, product-backlog pb-5) to: guide = definition, practices = what/how/when, process vs tracking lists | Done — map, pb-5, product-backlog header, agent-design                                                       |


