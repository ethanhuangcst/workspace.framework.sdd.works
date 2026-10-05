# ADR-099: Pack skill improve-prompt (rename from prompt-optimizer)

## Status
Accepted

## Context

[Skill-14](../product-backlog.md#pb-89) ships a utility skill that improves user prompts without executing the task. The seed folder was `prompt-optimizer` and the body matched an ECC-specific catalog (slash commands, component tables, vendor models). The PBI requires generic prompt quality and no ECC component matching.

## Decision

1. Pack folder and frontmatter `name`: `improve-prompt`.
2. Seed path: `specs/framework/seeds/skills/improve-prompt/SKILL.md`.
3. After install: `{client_root}/{skills_dir}/improve-prompt/SKILL.md`.
4. No `constants.json` row. The skill is not a practices job and is not routed through Ethan's constants table.
5. No `sdd-` prefix. This is not an authoring skill and does not collide with Cursor built-in skill names ([ADR-092](./ADR-092-pack-authoring-skill-sdd-prefix.md)).

## Rationale

Triggers such as "improve my prompt" match the folder name. The body follows [TRUE AGENT](../framework/framework-design.md#true-agent): capabilities, knowledge, limits, and anti-patterns instead of a fixed multi-phase ECC pipeline.

## Consequences

- Living docs and seeds use `improve-prompt`. Design: [framework-design § improve-prompt](../framework/framework-design.md#improve-prompt). Tests: **CE-SKILL-13**.
- Historical changelog lines may still say `prompt-optimizer`.
- After pack update, remove stale `{client_root}/{skills_dir}/prompt-optimizer/` when present.
- Description triggers and `examples.md` samples are English; the skill reply still matches the user's input language.

## Date
2026-10-05
