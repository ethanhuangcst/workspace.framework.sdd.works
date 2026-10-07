# ADR-102: Pack skill testing-expert (not sdd-tester)

## Status

Accepted

## Context

[Skill-18](product-backlog.md#L140) (Sprint 7 feature-62) was named `sdd-tester`. The job is generic software testing: browser, API, and the unit runner the project already uses. It should work in any software project with minimal SDD coupling.

[ADR-092](./ADR-092-pack-authoring-skill-sdd-prefix.md) applies to authoring skills that collide with Cursor built-ins. [ADR-101](./ADR-101-frontend-design-pack-skill-name.md) already allows an unprefixed domain skill when the folder is not an authoring skill. `testing-expert` does not match a Cursor built-in name. Ethan may keep a personal `webapp-testing` copy for history; the pack ships one all-in-one skill and does not require any other testing skill at install time.

## Decision

1. Pack folder and frontmatter `name`: `testing-expert` (not `sdd-tester`).
2. Seed path: `specs/framework/seeds/skills/testing-expert/SKILL.md`.
3. After install: `{client_root}/{skills_dir}/testing-expert/SKILL.md`.
4. No `constants.json` row. The skill is not a practices job and is not routed through Ethan's constants table by default.
5. SDD integration is **optional**: `sdd-spec-to-build` may load this skill when an SBI needs tests. The skill body must not require sprint backlog, `artifacts-map.json`, or process files. The skill designs the strategy, defines methods and tools, creates tests, runs the pyramid (unit, API, browser), and writes a short report. When `test-strategy.md` exists, update it after the user confirms. When it does not, state the strategy in chat.
6. Do not ship `skills/sdd-tester/`. An update removes a stale `sdd-tester` folder on `{client_root}/{skills_dir}/` when the install ledger syncs.
7. Browser checks are in the seed: Playwright, optional `scripts/with_server.py` and `examples/`, screenshot and console on failure, role or test-id selectors. The skill body must not tell the agent to load `webapp-testing` or other testing skills. Install `testing-expert` only for pack testing; retire separate testing skills from the client when the user wants a single skill.

## Rationale

- The name states the job: testing across layers, not an SDD-only tester.
- Minimal SDD dependency keeps the skill usable outside framework.sdd.works projects.
- [ADR-092](./ADR-092-pack-authoring-skill-sdd-prefix.md) stays limited to authoring skills.

## Consequences

- [Skill-18](product-backlog.md#L140) and Sprint 7 feature-62 use `testing-expert`.
- framework-design, framework-stories, and a **CE-SKILL** case land when the seed is written and the user confirms.
- Historical changelog lines may still say `sdd-tester`.

## Date

2026-10-06
