---
name: sdd-spec-to-build
description: >
  Spec then build one SBI. Use when the user is about to implement a sprint
  backlog item, says design this SBI, plan before coding, consolidate the
  requirement, clarify unknowns, implement this SBI, or build the sprint item.
  Consolidate the requirement, ask the human about unknowns, write the design,
  then implement that same SBI to its acceptance criteria and the Definition of
  Done. Load sdd-update-specs and sdd-atdd when the change needs them. Do not
  start the next SBI. Do not use sdd-design, sdd-implement, or sdd-tdd.
---

# Spec to build for one SBI

Implementation goes wrong when the requirement is still split across the sprint row, the parent product item, and the chat. This skill closes that gap, then does the work for that one SBI, and stops. The next SBI waits until this one meets its acceptance criteria and the Definition of Done.

## Phase 1 — Spec

1. Read the SBI, its parent PBI, and the related design or test spec named on the row. Treat the sprint backlog as the schedule and the product backlog as the requirement.
2. Consolidate the requirement into one short design: what will be true when the SBI is done, which files change, and what stays out of scope.
3. List unknowns. Ask the human developer. Do not guess product behavior, copy, or acceptance while an unknown is open.
4. After the human answers, write that design into the spec the SBI already points at. Confirm before creating a new spec file.
5. Stop Phase 1 when the design is ready for implementation: acceptance is stated, open unknowns are closed or explicitly deferred, and the spec matches that. Do not write production code in Phase 1.

## Phase 2 — Build

1. Read the SBI, its acceptance criteria, and the design from Phase 1. If the design is missing or an unknown is still open, return to Phase 1.
2. Load only the skills that this SBI needs. Specs that the change touches go through `sdd-update-specs` (`{client_root}/skills/sdd-update-specs/SKILL.md` or pack seed `specs/framework/seeds/skills/sdd-update-specs/SKILL.md`). Acceptance-driven behavior changes go through `sdd-atdd` when the SBI needs them. Do not invent a third implementation path. Do not load `sdd-tdd`, `sdd-design`, or `sdd-implement`.
3. Implement that SBI. Confirm before writing project files.
4. Stop when acceptance criteria are met and checks in `{client_root}/rules/sdd-dod.mdc` are satisfied except **close confirm** and any **Done** row write. Do not open the next SBI.

## Limits

- Do not set PBI, SBI, or sprint status to **Done** or **WIP** on process files.
- When the SBI is ready to close, state that in chat and apply **close confirm** from `sdd-dod.mdc`. Load **sdd-retrospective** when that rule requires it before **Done** writes.
- Artifact confirm for specs and code is separate from **close confirm**.

## Why one SBI

Incremental delivery is the rule. A second SBI started in the same pass leaves both unfinished.

## Why confirm

A design file is a project artifact. The human has to agree before it is written, and again before production code changes.
