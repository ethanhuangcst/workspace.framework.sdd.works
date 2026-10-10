# Scrum in SDD (AI-read)

Audience: AI agents. Human portal guide: `content/scrum-in-sdd/scrum-in-sdd.{locale}.md`. What, how, when: `./sdd-scrum-practices.md`. Coach topics: `./coach-knowledge.md`.

Scrum in SDD applies Spec-Driven Development with agentic programming under Harness Engineering. This file names terms and the KEEP / ADD / MODIFY split. It does not replace the 2020 Scrum Guide.

---

# Part I — Agentic programming, harness, and SDD

**Agentic programming** uses AI agents as active collaborators in planning, coding, testing, review, and operations, within human goals and guardrails.

**Harness engineering** is the runtime that makes agent work reliable: tool integration, orchestration, context, permissions, observability, and human oversight.

**Spec-Driven Development (SDD)** treats the specification as the primary artifact. Requirements, behavior, constraints, and acceptance criteria come first; implementation and tests follow the spec.

**Alignment:** Agentic programming is the paradigm. Harness engineering is the infrastructure. SDD is the method inside that paradigm. The spec is the source of truth for behavior and evaluation.

**Harness layers in SDD:** Rules constrain execution. Skills provide reusable jobs. Agents execute against the spec. Workflows coordinate fragile sequences. Knowledge files supply meaning when a step needs context.

**XP in the harness:** ATDD, TDD, pairing, CI, test automation, refactoring, small increments. Details in `./coach-knowledge.md` (XP).

**Scrum rhythm with SDD:** Product backlog holds requirements and acceptance criteria. Sprint backlog holds what this sprint makes true. Increment meets Definition of Done. Events stay; humans and agents participate. Spec changes precede behavior changes.

**Other Agile fit:** BDD examples, ATDD checks, Lean WIP, Kanban visibility, continuous delivery when spec, tests, and DoD pass. See `./coach-knowledge.md` for BDD and Lean.

**Human and agent roles:** Humans define harness and spec, approve side effects, validate outputs. Agents refine, implement, test, and report within the harness.

---

# Part II — Gaps classic Scrum does not cover for SDD

SDD under harness engineering needs explicit rules, skills, agents, workflows, knowledge boundaries, spec-first delivery, artifact maps, and continuous status sync while work is not Done. Classic Scrum does not define those by itself.

---

# Part III — Scrum in SDD definition

## Overview

- **Keep:** empiricism, Scrum values, Product Owner / Developers / Scrum Master accountabilities, Product Backlog, Sprint Backlog, Increment as concepts.
- **Add:** harness layers, pack rules and skills, core and process artifacts, engineering artifacts, ADR and knowledge trees when mapped.
- **Modify:** mixed human and agent teams; shorter cycles; Markdown process files; DoD as a rule; realtime status checkpoints; retrospective as event and skill.

## Terminology

| Term | Meaning |
| --- | --- |
| Scrum in SDD | Scrum adapted for SDD under harness engineering |
| Spec | Source of truth for behavior, constraints, acceptance criteria |
| Harness | Runtime that governs agent execution |
| Rule | Constraint on execution (`{client_root}/rules/`) |
| Skill | Reusable job (`{client_root}/skills/`) |
| Agent | Human or AI actor performing work |
| Workflow | Fixed action sequence for one fragile job |
| Knowledge | Retained context used during execution |
| Artifact | Persistent document for plan, execute, or inspect |
| PBI, SBI, Feature, Task, OGT, MVP | See **Terminology in practice** in `./sdd-scrum-practices.md` |
| Increment | Usable output that meets Definition of Done |

## KEEP — unchanged in spirit

Scrum theory (empiricism, transparency, inspection, adaptation), Scrum values, core accountabilities, Product Backlog / Sprint Backlog / Increment as artifact roles.

## ADD — pack and project artifacts

**Rules (examples):** `sdd-dod.mdc`, `sdd-incremental-delivery.mdc`, `sdd-realtime-status.mdc`, `friendly-language.mdc`.

**Skills (examples):** `atdd-expert`, `sdd-update-project`, `sdd-refine-backlog`, `sdd-plan-sprint`, `sdd-retrospective`, `sdd-audit-artifacts`, `sdd-review-status`, `sdd-update-specs`, `sdd-spec-to-build`, `sdd-build-agent`, `sdd-create-skill`, `sdd-create-rule`.

**Core artifacts (client template tree, not copied into workspace):**

- `pack-scrum-in-sdd.md` — this file; names and meaning
- `sdd-scrum-practices.md` — what, how, when
- `constants.json` — skill keys, rule keys, instructions URL

**Workspace core:**

- `artifacts-map.json` at `{workspace}` root — path index for this project

**Process artifacts (five files):** `product-backlog.md`, `sprint-backlog.md`, `status.md`, `changes-log.md`, `issues-log.md`.

**Engineering artifacts (typical):** `architecture.md`, `{stem}-stories.md`, `{stem}-design.md`, `{stem}-tests.md`, `release.md`, `test-strategy.md`, `.secrets` (names only).

**Pack metadata (client root, not project artifacts):** `.sdd-installed.json` install ledger; `pack_complete: true` when install finished.

**Optional trees:** `adr`, `knowledge` directory roots in `artifacts-map.json`.

## MODIFY — how classic Scrum behaves here

**Team:** Humans and AI agents; Scrum Master also upholds harness quality; humans remain accountable.

**Events:** Shorter sprints possible; planning and daily sync may be augmented by `sdd-realtime-status` WIP checkpoints; retrospective at sprint end, on demand, by rule, or before close (see practices Retrospective under sprint-backlog).

**Artifacts:** Backlogs as Markdown; continuous updates; Unplanned PBIs section on `sprint-backlog.md`; DoD enforced via rule before backlog close.

## Minimum setup

Product Owner, part-time Scrum Master, developers (human and/or agent), shared spec, installed SDD pack (rules, skills, templates), agent tool, defined human approval and agent execution boundaries.

## Operating principles

Spec before implementation. Rules before autonomy. Humans accountable. Agents execute inside constraints. Artifacts are shared truth. Inspect continuously. Retrospective improves process. Write rules agents and humans can follow.
