# ADR-085: `sdd-spec-to-build` replaces design, implement, and TDD pack skills

## Status
Accepted

## Context
[ADR-066](./ADR-066-sdd-design-before-implementation.md) split SBI work into `sdd-design` (consolidate the requirement, write the design, stop) and `sdd-implement` (load helpers including `sdd-tdd`, implement one SBI). Living catalogs and Sprint 13 still listed three pack skills for one job: design, implement, and TDD.

That split left two handoffs and a separate TDD folder that had no seed. The pack needs one SBI skill from consolidated requirement through implementation to the Definition of Done.

## Decision
1. The skill folder is `sdd-spec-to-build`. The constants key is `sdd-spec-to-build` (key equals folder name).
2. The skill runs two phases on one SBI: (1) consolidate the requirement, ask the human about unknowns, write the design the SBI points at; (2) implement that SBI only, loading `sdd-update-specs` and `sdd-atdd` when the acceptance criteria and the Definition of Done require them.
3. The pack does not ship `sdd-design`, `sdd-implement`, or `sdd-tdd`. Remove those keys from `constants.json`.
4. [Skill-11](../product-backlog.md#pb-80) owns `sdd-spec-to-build`. [Skill-02](../product-backlog.md#pb-22) and [Skill-10](../product-backlog.md#pb-65) are Retired. Sprint 13 feature-13 stores the initial `SKILL.md`. feature-15 and feature-03 (implement rename / ship) are Retired. feature-01 is `sdd-atdd` only.
5. This ADR supersedes [ADR-066](./ADR-066-sdd-design-before-implementation.md) for living behavior.

## Rationale
One SBI needs one skill path. A design-only gate and a second implement skill forced a second invoke for the same item. A pack TDD skill without a seed added catalog noise. Spec update and ATDD stay loadable helpers when the SBI needs them.

## Consequences
- Living guides, Features catalogs, locale strings, and mock lists use `sdd-spec-to-build` and drop `sdd-tdd`, `sdd-design`, and `sdd-implement`.
- The seed moves from `skills/sdd-design/` to `skills/sdd-spec-to-build/`. The `sdd-implement` seed folder is deleted.
- Dated history and ADR-066 body stay as written.

## Date
2026-10-04
