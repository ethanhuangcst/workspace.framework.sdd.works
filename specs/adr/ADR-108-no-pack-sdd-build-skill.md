# ADR-108: No pack skill `sdd-build`; implement with domain skills

## Status
Accepted

## Context
`sdd-spec-to-build` ended engineering readiness by proposing a pack skill `sdd-build`. That folder was never shipped. A closed OGT renamed `sdd-implement` to `sdd-build`, but the product direction moved to many implement skills (`fullstack-engineer`, `frontend-developer`, `mcp-expert`, and others) instead of one SDD wrapper.

A single `sdd-build` skill would duplicate those skills or force one stack path. The pack should stay flexible and small.

## Decision
1. The pack does not ship `sdd-build`. Do not add a `sdd-build` key to `constants.json`.
2. `sdd-spec-to-build` stops at engineering readiness. After the user confirms readiness, it proposes one or more **domain implement skills** that fit the SBI, per [build handoff](../framework/seeds/skills/sdd-spec-to-build/readiness.md#build-handoff).
3. Implementation runs under the chosen domain skill plus installed SDD rules (`sdd-dod.mdc`, `sdd-incremental-delivery.mdc`, and others). **Close confirm** stays on `sdd-dod.mdc`.
4. `sdd-build-agent` is unchanged. It writes agent files. It is not an implement skill.

## Rationale
One thin orchestration skill cannot cover every stack and SBI type. Domain skills already own TDD, stack choice, and layer scope. `sdd-spec-to-build` owns spec readiness only.

## Consequences
- Living seeds, `framework-design`, product backlog Skill-11 text, and **CE-SKILL-04** drop `sdd-build` and describe domain handoff.
- [ADR-085](./ADR-085-sdd-spec-to-build.md) decision 2 (implement inside `sdd-spec-to-build`) is superseded for living behavior. Dated history in ADR-085 stays as written.

## Date
2026-10-07
