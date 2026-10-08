# How to call Agent Skills (SDD pack)

The framework pack ships skills under `skills/` on full MCP install. Each skill is a folder with `SKILL.md`. Rules live under `rules/` as `.mdc` files. Skills and rules load from paths your IDE defines. This page covers where skills live, how to attach them in chat, and when the model actually runs a skill.

**Verified here (2026-10-08):** Cursor (Desktop chat and Agent).

**Vendor docs only (same date):** Claude Code skills under `.claude/skills/`.

**Shared notes**

- A skill is instructions for the host model. The host decides when to read `SKILL.md` (attachment, @ mention, or tool discovery).
- Pack install copies skills to the client tree your tool uses (for Cursor, often `~/.cursor/skills/` or `<project>/.cursor/skills/`).
- Lite HTTP install ships a subset of build-helper skills plus `friendly-language.mdc` only (see the Features content tab).
- Skill **names** in chat should match the folder name (for example `sdd-retrospective`, not a display title).

## Cursor

| Topic | Detail |
| --- | --- |
| Skill folder | `~/.cursor/skills/<name>/SKILL.md` or `<project>/.cursor/skills/<name>/SKILL.md`. Project skills can override user skills when names collide. |
| Rules | `~/.cursor/rules/*.mdc` or `<project>/.cursor/rules/*.mdc`. Always-on rules apply without a skill attach. |
| Attach in chat | Use **@** and pick a skill, or type `/` and choose a skill when the UI lists them. You can also attach a skill from the skill picker in Agent mode. |
| Agent behavior | After attach, the model should read `SKILL.md` at the start of the turn and follow its workflow (capabilities, limits, and confirm gates). |
| Pack skills | SDD process skills (`sdd-dod`, `sdd-plan-sprint`, `sdd-retrospective`, and others) ship in the pack `skills/` tree. Sync or MCP install before you expect them in the picker. |
| Invoke again | Same chat keeps attached context until you remove the attachment or start a new chat. For a different skill, attach that skill on the next message. |

## Claude Code

| Topic | Detail |
| --- | --- |
| Skill folder | `~/.claude/skills/<name>/SKILL.md` or `<project>/.claude/skills/<name>/SKILL.md`. |
| Start | Invoke the skill name per Claude Code docs (slash or skill command for your version). |
| Invoke again | Same session until you switch skill or start a new session. |

## When to use a skill vs plain chat

| Situation | Use |
| --- | --- |
| Close an SBI, sprint, or RID on process files | **sdd-retrospective** or process skills named in `sdd-dod.mdc` |
| Engineering readiness before code | **sdd-spec-to-build** |
| One web feature across UI and API | **fullstack-engineer** (attach with your task) |
| AI or RAG architecture advice only | **ai-architect** or **rag-expert** (advisory; no infra unless you ask) |
| Quick wording fix | **improve-prompt** (returns paste-ready text; does not run your task) |

## Pack lookup

`templates/constants.json` lists skill keys the pack expects on the client root. If a key is missing after install, re-run MCP install or copy the skill folder from the pack tarball before you rely on the picker.
