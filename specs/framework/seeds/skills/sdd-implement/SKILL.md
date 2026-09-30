---
name: sdd-implement
description: >
  Implement one SBI after its design is ready. Use when the user says implement
  this SBI, build the sprint item, or start implementation. Load the skills that
  the Definition of Done and the SBI acceptance criteria require, including
  sdd-update-specs and sdd-tdd when the change needs them. Do not use this skill
  to design the SBI (that is sdd-design) or to start the next SBI.
---

# Implement one SBI

`sdd-design` closes the requirement. This skill does the work for that one SBI and then stops. The next SBI waits until this one meets its acceptance criteria and the Definition of Done.

## Steps

1. Read the SBI, its acceptance criteria, and the design `sdd-design` wrote. If the design is missing or an unknown is still open, stop and use `sdd-design`.
2. Load only the skills that this SBI needs. Specs that the change touches go through `sdd-update-specs`. Behavior changes go through `sdd-tdd`. Do not invent a third implementation path.
3. Implement that SBI. Confirm before writing project files.
4. Stop when the acceptance criteria are met and the Definition of Done for this SBI is satisfied. Do not open the next SBI.

## Why one SBI

Incremental delivery is the rule. A second SBI started in the same pass leaves both unfinished.
