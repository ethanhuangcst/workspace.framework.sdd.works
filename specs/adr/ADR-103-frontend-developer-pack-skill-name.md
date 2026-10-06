# ADR-103: Pack skill frontend-developer

## Status

Accepted

## Context

[Skill-19](../product-backlog.md#pb-115) (Sprint 7 feature-64) needs a strong frontend **implementation** skill with minimal SDD coupling. Visual direction stays on [Skill-17](../product-backlog.md#pb-113) `frontend-design`. Verification stays on [Skill-18](../product-backlog.md#pb-114) `testing-expert`.

The personal folder `~/.cursor/skills/frontend-developer/` is a Next.js Cache Components guide (`name`: `cache-components`). It is not the Skill-19 job. The pack skill must cover components, pages, data loading, forms, accessibility, and performance in the stack the project already uses.

[ADR-101](./ADR-101-frontend-design-pack-skill-name.md) and [ADR-102](./ADR-102-testing-expert-pack-skill-name.md) use unprefixed domain folder names when the skill is not an authoring skill and does not collide with a Cursor built-in. `frontend-developer` is not a Cursor built-in name.

## Decision

1. Pack folder and frontmatter `name`: `frontend-developer`.
2. Seed path: `specs/framework/seeds/skills/frontend-developer/SKILL.md`.
3. Optional sibling `next-cache-components.md` in the same folder. Load it only when the project enables Cache Components in `next.config`. The pack seed is not a copy of the personal Cache Components skill as the whole skill.
4. After install: `{client_root}/{skills_dir}/frontend-developer/SKILL.md`.
5. No `constants.json` row. The skill is not a practices job by default.
6. SDD integration is **optional**: `sdd-spec-to-build` may load this skill when an SBI needs UI implementation. The skill body must not require sprint backlog, `artifacts-map.json`, or process files.
7. The skill follows [TRUE AGENT](../framework/framework-design.md#true-agent): capabilities, knowledge, and limits. The host picks the order. Long cache reference stays in `next-cache-components.md`, not a numbered procedure in `SKILL.md`.

## Rationale

- One name states the job: implement UI in the project stack, not SDD-only frontend work.
- Splitting Cache Components into a sibling file keeps the main skill usable for non-Next stacks and avoids a 400-line procedural skill body.
- Minimal SDD dependency matches Skill-19 requirement bullets.

## Consequences

- [Skill-19](../product-backlog.md#pb-115) requirement text references this ADR.
- framework-design, framework-stories, and a **CE-SKILL** case land when the user confirms the seed usable (feature-64 close).
- Personal `~/.cursor/skills/frontend-developer/` may stay as `cache-components` until the user replaces or renames it.

## Date

2026-10-06
