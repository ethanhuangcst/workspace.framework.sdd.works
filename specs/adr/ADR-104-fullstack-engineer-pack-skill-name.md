# ADR-104: Pack skill fullstack-engineer (not fullstack-developer)

## Status

Accepted

## Context

[Skill-20](../product-backlog.md#pb-116) (Sprint 7 feature-65) shipped as `fullstack-developer`. The job is one web feature end to end: screen, API, data, and auth in the stack the project already uses. It should stay stack-agnostic and minimally coupled to SDD process files.

The name `fullstack-engineer` matches public skills catalogs (for example SkillsMP `fullstack-engineer`) and states implementation across layers without implying a single pinned framework version.

Visual direction stays on [Skill-17](../product-backlog.md#pb-113) `frontend-design`. UI-only work stays on [Skill-19](../product-backlog.md#pb-115) `frontend-developer`. Verification stays on [Skill-18](../product-backlog.md#pb-114) `testing-expert`.

## Decision

1. Pack folder and frontmatter `name`: `fullstack-engineer` (not `fullstack-developer`).
2. Seed path: `specs/framework/seeds/skills/fullstack-engineer/SKILL.md`.
3. After install: `{client_root}/{skills_dir}/fullstack-engineer/SKILL.md`.
4. No `constants.json` row by default. The skill is not a practices job unless practices assign one.
5. SDD integration is **optional**: `sdd-spec-to-build` may load this skill when an SBI needs a multi-layer web feature. The skill body must not require sprint backlog, `artifacts-map.json`, or process files.
6. The skill follows [TRUE AGENT](../framework/framework-design.md#true-agent). It must not default to a pinned stack (Next.js, Drizzle, tRPC, Better Auth, and similar) in the body. Use those libraries only when the repo or the user already names them.
7. Do not ship `skills/fullstack-developer/`. An update removes a stale `fullstack-developer` folder on `{client_root}/{skills_dir}/` when the install ledger syncs.

## Rationale

- One name across catalog and pack reduces drift.
- Stack detection from project files keeps the skill usable outside a single Next.js template.
- Neighbor skills stay separate so this skill does not absorb design, UI-only, or test-report jobs.

## Consequences

- Update [Skill-20](../product-backlog.md#pb-116) requirement bullets and Sprint 7 feature-65 row text to `fullstack-engineer`.
- framework-design, framework-stories, and a **CE-SKILL** case land when the user confirms the seed usable.
- Historical changelog lines may still say `fullstack-developer`.

## Date

2026-10-06
