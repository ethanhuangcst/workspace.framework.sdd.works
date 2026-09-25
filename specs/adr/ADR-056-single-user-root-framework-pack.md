# ADR-056: One framework pack, on the user root

## Status
Accepted

## Context
`sdd_install_framework` already writes the server pack to the user client root (`~/.cursor` on Cursor): agents, skills, rules, and workflows. A later design copied that pack into `<workspace>/.cursor/` so a project could edit its own framework without changing the user root.

IDE behavior, checked 2026-09-23, does not make that workspace copy the one that runs. See [`../knowledge/agent/ide-asset-precedence.md`](../knowledge/agent/ide-asset-precedence.md).

- Cursor project agents win on the same name. Project rules win only where the text conflicts, and the user-root rule still loads. Skills with the same name both load. Personal Cursor commands win over project commands.
- Claude Code personal skills override project skills. Codex shows both skills and does not merge them.

Rules and skills are what change how the coach behaves. Those edits have to land in the user root to take effect. Once the user edits the user root for rules and skills, the same place can hold the agent and the templates. A second copy of the agent and the templates does not buy a project-specific coach.

## Decision
1. The installed framework pack has one home: the user client root. For Cursor that is `~/.cursor/{agents,skills,rules,workflows,templates}/`.
2. Ethan does not copy that pack into `<workspace>/.cursor/`.
3. `/ethan` is the user-root agent, `~/.cursor/agents/ethan.md`, in every project. The product does not create `<workspace>/.cursor/agents/ethan.md`.
4. `sdd_install_framework` and `sdd_update_framework` remain the install and update path. They write the user root only.
5. A workspace file is in scope only when it is new for that project: a rule or a skill whose name is not already in the user root. That file is an addition. It is not a second copy of an installed name.
6. The pack lookup file is read from the user-root templates tree when that file is in the pack. It is not copied into the workspace or into `specs/`. The filename is `constants.md` ([ADR-060](./ADR-060-constants-on-client-root.md)). The earlier name `project-constants.md` is superseded.

## Rationale
A workspace fork cannot override user-root skills, and it cannot fully override user-root rules or commands. Keeping two copies would still force framework edits into `~/.cursor`, and it would leave a stale workspace agent that Cursor prefers over later installs.

One pack matches the installer that already exists (ADR-054). Update replaces `~/.cursor` and reaches every project.

## Consequences
- Every project shares one ethan prompt, one skill set, and one rule set until the user adds a new project-only name.
- A workspace `agents/ethan.md` that already exists still wins call-up, because that is Cursor. Remove it when this project should use the user-root agent. This repository's `.cursor/` may remain as the authoring tree for the package until it is removed. Removing it from a customer workspace does not uninstall `~/.cursor`.
- The current package manifest has no `templates/` entry. Constants are unavailable until that tree is added to the package. Ethan does not invent a workspace copy to fill the gap.

## Date
2026-09-23
