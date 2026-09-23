---
title: IDE precedence for a second copy of framework assets
type: ops-lesson
status: active
as_of: 2026-09-23
tags:
  - cursor
  - claude-code
  - codex
  - coach-ethan
related_spec: specs/adr/ADR-056-single-user-root-framework-pack.md
---

# IDE precedence for a second copy of framework assets

## Summary

A same-name file under the project `.cursor/` (or the client equivalent) does not reliably replace the user-root file. Decision: [ADR-056](../../adr/ADR-056-single-user-root-framework-pack.md).

## Evidence

Checked 2026-09-23 against current vendor docs.

| Product | Rules | Commands or workflows | Agents | Skills |
| --- | --- | --- | --- | --- |
| Cursor | On a conflict: Team, then project, then user. The same filename in both folders still both apply. | Personal `~/.cursor/commands/` wins over project `.cursor/commands/`. No published rule for a `workflows/` folder. | Project `.cursor/agents/` wins on the same name. | Both locations load. No same-name winner. |
| Claude Code | User rules load first. Project rules have higher priority. `CLAUDE.md` files are concatenated. | Personal overrides project, same as skills. A skill beats a command of the same name. | Project `.claude/agents/` is higher priority than `~/.claude/agents/`. | Personal `~/.claude/skills/` overrides project `.claude/skills/`. |
| Codex | Files closer to the working directory override earlier `AGENTS.md` guidance. | Repeatable workflows are skills. | A custom agent beats a built-in of the same name. Project versus `~/.codex/agents/` is not stated. | Both can appear. Codex does not merge two skills with the same name. |

## Lesson / guidance

Do not fork the installed pack into the workspace to customize rules or skills. Edit the user-root pack. Add a workspace file only when its name is new for that project.

## Links

- [Cursor rules](https://cursor.com/docs/rules)
- [Cursor subagents](https://cursor.com/docs/subagents)
- [Cursor skills](https://cursor.com/docs/skills)
- [Claude Code skills](https://code.claude.com/docs/en/skills)
- [Claude Code subagents](https://code.claude.com/docs/en/subagents)
- [Codex skills](https://developers.openai.com/codex/skills)
- [Codex AGENTS.md](https://developers.openai.com/codex/guides/agents-md)
