# ADR-092: Pack authoring skills use sdd- prefix

## Status
Accepted

## Supersedes
[ADR-089](./ADR-089-pack-authoring-skill-names.md) in full.

## Context
Cursor ships built-in skills `create-skill` and `create-rule` under the client skills-cursor tree. Pack skills installed at `{client_root}/skills/` with the same folder name and the same frontmatter `name` collide at invocation. Constants keys stay `skill_create_skill`, `skill_build_agent`, and `skill_create_rule`.

## Decision
1. Pack skill folders: `sdd-create-skill` (Skill-13), `sdd-build-agent` (Skill-15), `sdd-create-rule` (Skill-16).
2. Seeds live at `specs/framework/seeds/skills/<folder>/SKILL.md`. After install: `{client_root}/{skills_dir}/<folder>/SKILL.md`.
3. Do not ship `skills/skill-creator/`. An update removes stale unprefixed `create-skill`, `create-rule`, and `build-agent` folders on `{client_root}/skills/` when the install ledger syncs. Do not modify Cursor's `skills-cursor` tree.
4. Cross-skill routing in `sdd-build-agent` and `sdd-create-rule` points at `sdd-create-skill`.

## Consequences
- Product backlog and framework design link to `sdd-*` paths and section anchors.
- [ADR-074](./ADR-074-sdd-create-skill.md) folder name `sdd-create-skill` is restored; ADR-089 is historical only.

## Date
2026-10-05
