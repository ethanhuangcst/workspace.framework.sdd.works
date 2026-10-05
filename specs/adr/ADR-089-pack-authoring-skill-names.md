# ADR-089: Pack authoring skill folder names (no sdd- prefix)

## Status
Superseded by [ADR-092](./ADR-092-pack-authoring-skill-sdd-prefix.md) (2026-10-05). Pack folders revert to `sdd-create-skill`, `sdd-build-agent`, and `sdd-create-rule` to avoid Cursor built-in name collision.

## Status (historical)
Accepted

## Supersedes
[ADR-074](./ADR-074-sdd-create-skill.md) decision item 1 (pack folder name for skill authoring only). ADR-074 still applies to not shipping `skill-creator` and to path rules.

## Context
Three pack skills that write other harness artifacts used an `sdd-` folder prefix while constants keys stayed `skill_*`. Rules and `improve-prompt` (formerly `prompt-optimizer`, [ADR-099](./ADR-099-improve-prompt-skill-name.md)) already use short folder names. One folder name per skill keeps install paths and guide lists aligned with `constants.json` values.

## Decision
1. Pack skill folders: `create-skill` (Skill-13, key `skill_create_skill`), `build-agent` (Skill-15, key `skill_build_agent`), `create-rule` (Skill-16, key `skill_create_rule`).
2. Seeds live at `specs/framework/seeds/skills/<folder>/SKILL.md`. After install: `{client_root}/{skills_dir}/<folder>/SKILL.md`.
3. Do not ship `skills/skill-creator/`. An update removes stale `sdd-create-skill`, `sdd-build-agent`, and `sdd-create-rule` folders on `{client_root}` when the install ledger syncs the new tree.
4. Other pack skills keep their existing folder names until a separate ADR renames them.

## Consequences
- Product backlog and framework design link to the new paths and section anchors (`#create-skill`, `#build-agent`, `#create-rule`).
- Cross-skill routing in `build-agent` and `create-rule` points at `create-skill`, not a prefixed name.

## Date
2026-10-05
