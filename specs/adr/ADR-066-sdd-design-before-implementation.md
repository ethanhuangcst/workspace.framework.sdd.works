# ADR-066: `sdd-design` before implementation

## Status
Accepted

## Context
An SBI can reach implementation while the requirement is still scattered across the backlog row, the parent PBI, and conversation. Agents then guess unknowns or start code before a design exists.

The pack already has `sdd-update-specs` (keep specs aligned with code) and an implementation skill (spec update, then TDD). Neither consolidates the requirement or stops to ask a human before design is finished.

The implementation skill was named `sdd-implement-feature`. The Features catalog already calls it `sdd-implement`: load the skills the SBI needs, follow the Definition of Done and the acceptance criteria.

## Decision
1. The skill folder is `sdd-design`. The constants key is `sdd-design` (a non-job skill; the key is the folder name).
2. The skill consolidates the SBI requirement, asks the human about unknowns, writes the design the SBI points at, and stops when that design is ready to implement.
3. It does not write production code. Implementation is `sdd-implement`.
4. It is not a practices job and not a workflow file. Ethan’s eight job rows stay as they are.
5. Rename `sdd-implement-feature` to `sdd-implement`. The constants key is `sdd-implement`. [Skill-13](../product-backlog.md#pb-65) keeps its PBI code. The skill loads `sdd-update-specs` and `sdd-tdd` when the SBI needs them. It implements one SBI and stops.

## Rationale
Design is a gate in front of implementation, not a ninth Scrum job and not a slash-only command. A skill loads when someone is about to implement an SBI. Putting the steps in `workflows/` would not run on any client. Folding them into the implementation skill would let implementation start before unknowns are closed.

`sdd-implement` matches the Features catalog and the other short skill ids. The old id named a fixed two-step recipe. The skill’s job is to load whichever of those skills the SBI’s acceptance criteria and the Definition of Done require.

## Consequences
- [Skill-14](../product-backlog.md#pb-80) owns `sdd-design`. Sprint 3 feature-13 stores that initial `SKILL.md`. Install onto `{client_root}` stays with the pack copy.
- [Skill-13](../product-backlog.md#pb-65) is `sdd-implement`. Sprint 3 feature-15 stores the initial `SKILL.md`. Sprint 12 still ships the install check.
- Do not ship `sdd-implement-feature`. Living skill lists use `sdd-implement`.

## Date
2026-09-26
