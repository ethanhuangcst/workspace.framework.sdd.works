# ADR-101: Pack skill frontend-design (not sdd-frontend-design)

## Status

Accepted (folder name superseded by [ADR-105](./ADR-105-frontend-designer-pack-skill-name.md))

## Context

[Skill-17](product-backlog.md#L134) (Sprint 7 feature-61) originally named the pack skill `sdd-frontend-design` so the folder would not match the Cursor catalog skill `frontend-design`. [ADR-092](./ADR-092-pack-authoring-skill-sdd-prefix.md) applies to **authoring** skills that collide with Cursor built-ins (`create-skill`, `create-rule`, `build-agent`).

The design skill is a **domain utility**: distinctive UI direction before or during implementation. It should work in any web project with minimal SDD coupling. The canonical body is the merged [anthropics/skills frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design) craft (SkillsMP, 2026-09-03), plus optional production gates when the client ships i18n and test rules.

[ADR-099](./ADR-099-improve-prompt-skill-name.md) already allows an unprefixed pack folder when the skill is not an authoring skill and does not collide with a Cursor **built-in** name. `frontend-design` matches the public skill id; collision risk is duplicate install of the same catalog skill, which the pack manifest merge resolves like any other pack-owned skill file.

## Decision

1. Pack folder and frontmatter `name`: `frontend-design` (not `sdd-frontend-design`).
2. Seed path: `specs/framework/seeds/skills/frontend-design/SKILL.md` and sibling `LICENSE.txt` (Apache 2.0, same as upstream).
3. After install: `{client_root}/{skills_dir}/frontend-design/SKILL.md`.
4. No `constants.json` row. The skill is not a practices job and is not routed through Ethan's constants table by default.
5. SDD integration is **optional**: `sdd-spec-to-build` may load this skill when an SBI needs UI design; the skill body must not require sprint backlog, `artifacts-map.json`, or process files.
6. Do not ship `skills/sdd-frontend-design/`. An update removes a stale `sdd-frontend-design` folder on `{client_root}/{skills_dir}/` when the install ledger syncs.

## Rationale

- One name across SkillsMP, personal `~/.cursor/skills/frontend-design/`, and the pack reduces fork drift.
- Minimal SDD dependency keeps the skill usable outside framework.sdd.works projects.
- [ADR-092](./ADR-092-pack-authoring-skill-sdd-prefix.md) stays limited to authoring skills; this ADR is the explicit exception for Skill-17.

## Consequences

- Update [Skill-17](product-backlog.md#L134) requirement bullets and Sprint 7 feature-61 row text to `frontend-design`.
- framework-design § frontend-design, **CE-SKILL-15**, and framework-stories § frontend-design: done 2026-10-06.
- [sdd-spec-to-build](../framework/seeds/skills/sdd-spec-to-build/SKILL.md) Phase 2 names `frontend-design` for UI SBIs: done 2026-10-06. feature-61 close still needs CE-SKILL-15 run and user confirm.
- Historical changelog lines may still say `sdd-frontend-design`.

## Date

2026-10-06
