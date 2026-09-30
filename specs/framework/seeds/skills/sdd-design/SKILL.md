---
name: sdd-design
description: >
  Design and plan before implementing an SBI. Use when the user is about to
  implement a sprint backlog item, says design this SBI, plan before coding,
  consolidate the requirement, or clarify unknowns. Consolidate the requirement,
  ask the human about unknowns, complete the design, and stop when implementation
  can start. Do not use this skill to write production code; that is sdd-implement.
---

# Design before implementing an SBI

Implementation goes wrong when the requirement is still split across the sprint row, the parent product item, and the chat. This skill closes that gap and then stops. Coding is `sdd-implement`.

## Steps

1. Read the SBI, its parent PBI, and the related design or test spec named on the row. Treat the sprint backlog as the schedule and the product backlog as the requirement.
2. Consolidate the requirement into one short design: what will be true when the SBI is done, which files change, and what stays out of scope.
3. List unknowns. Ask the human developer. Do not guess product behavior, copy, or acceptance while an unknown is open.
4. After the human answers, write that design into the spec the SBI already points at. Confirm before creating a new spec file.
5. Stop when the design is ready for implementation: acceptance is stated, open unknowns are closed or explicitly deferred, and the spec matches that. Do not write production code, tests that implement the feature, or the next SBI.

## Why confirm

A design file is a project artifact. The human has to agree before it is written, and again before any later skill implements it.
