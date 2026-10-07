# ADR-105: Pack skill frontend-designer (not frontend-design)

## Status

Accepted

## Supersedes

[ADR-101](./ADR-101-frontend-design-pack-skill-name.md) for pack folder and frontmatter `name` only. ADR-101 remains historical for the `sdd-frontend-design` rename and the anthropics upstream body.

## Context

[Skill-17](product-backlog.md#L134) (Sprint 7 feature-61) shipped as `frontend-design` to match the [anthropics/skills frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design) catalog id.

The job is a **designer** role: distinctive UI direction before or during implementation. The name `frontend-designer` pairs with [Skill-19](product-backlog.md#L150) `frontend-developer` and states the actor, not the upstream catalog folder.

[ADR-092](./ADR-092-pack-authoring-skill-sdd-prefix.md) does not apply. The skill is not an authoring skill. `frontend-designer` is not a Cursor built-in skill name.

## Decision

1. Pack folder and frontmatter `name`: `frontend-designer` (not `frontend-design`).
2. Seed path: `specs/framework/seeds/skills/frontend-designer/SKILL.md` and sibling `LICENSE.txt` (Apache 2.0, unchanged).
3. After install: `{client_root}/{skills_dir}/frontend-designer/SKILL.md`.
4. No `constants.json` row. The skill is not a practices job by default.
5. SDD integration stays optional: `sdd-spec-to-build` loads `frontend-designer` for UI design on an SBI. The skill body must not require sprint backlog, `artifacts-map.json`, or process files.
6. Do not ship `skills/frontend-design/`. An update removes a stale `frontend-design` folder on `{client_root}/{skills_dir}/` when the install ledger syncs.
7. Upstream craft may still be read from anthropics `frontend-design` when refreshing body text. The pack id stays `frontend-designer`.

## Rationale

- `frontend-developer` and `frontend-designer` name two adjacent jobs in one vocabulary.
- A separate pack id avoids treating the pack skill as the same install slot as a personal or catalog `frontend-design` copy when both exist.

## Consequences

- Update [Skill-17](product-backlog.md#L134), Sprint 7 feature-61, framework-design, framework-stories, framework-tests **CE-SKILL-15**, and every skill that names **frontend-designer** as a neighbor.
- Historical changelog and ADR-101 text may still say `frontend-design`.

## Date

2026-10-06
