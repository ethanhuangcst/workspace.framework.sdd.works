---
name: sdd-update-specs
description: >
  Compare current work with related engineering specs and update those specs
  after confirm. Use when the user asks to update related specs, sync specs
  with code, fix spec drift, compare implementation to the spec, or says
  /sdd-update-specs. Scope is engineering artifacts only, not the five process
  files. sdd-spec-to-build loads this skill when an SBI needs spec alignment.
  sdd-review-status compares process files only. sdd-refine-backlog edits the
  product backlog on process files only.
---

# Update specs

Spec-Driven Development treats the specification as the source of truth. When work and engineering specs disagree, this skill finds the gap on **engineering** artifacts, shows a report, and writes only after the user confirms. The five process files stay on `sdd-refine-backlog`, `sdd-review-status`, and `sdd-dod.mdc`.

`{client_root}` is the parent of the folder that contains the loaded agent file.

`{locale}` is the value in `{workspace}/artifacts-map.json`. When `locale` is missing, use `EN`.

The five process files are `product-backlog.md`, `sprint-backlog.md`, `status.md`, `changes-log.md`, and `issues-log.md`. This skill does not write them.

## Capabilities

The host picks order from the thread.

| Capability | When | Result |
| --- | --- | --- |
| Resolve scope | The user names an SBI, a module, paths, a diff, or what they just built | One bounded set of files to compare |
| List related specs | Scope is known | Paths from the SBI **Related specs** column, parent PBI links, and `{workspace}/artifacts-map.json` |
| Compare | Related specs and current work are readable | Aligned rows and gap rows with file and section |
| Send gap report | Compare finished | One chat message per [response.md](./response.md) |
| Draft edits | The user needs text before confirm | Plain-language summary of each spec change |
| Write after confirm | The user confirms listed files | One pass on confirmed engineering files only |
| Propose changes-log line | The user confirmed a visible spec change | One draft entry; the user or DoD writes `changes-log.md` |

### Resolve scope

Use the first match that applies:

1. Paths or module folder the user names in chat.
2. The SBI named on `status.md` as current work, or the SBI the user names.
3. Module folder inferred from a diff prefix under `{workspace}/`.
4. Every module in `artifacts-map.json` when the user asks for the whole project.

Stay on one SBI when `sdd-incremental-delivery.mdc` applies and the user did not widen scope.

### List related specs

Read `{workspace}/artifacts-map.json`.

- Open top-level `files` that are engineering artifacts: `architecture.md`, `release.md`, `test-strategy.md`, and paths that end in `-stories.md`, `-design.md`, or `-tests.md`.
- Open each path in `modules[].files` the same way.
- Skip the five process file paths even when they appear in the map.
- Add paths from the sprint row **Related specs** and from the parent PBI requirement links when scope is an SBI.

When `{workspace}/artifacts-map.json` is missing, name that file, tell the user to run `sdd-audit-artifacts`, and stop.

### Compare

Read current work from git diff, touched files, or behavior the user describes.

| Dimension | Spec side | Work side |
| --- | --- | --- |
| Behavior | Scenarios and acceptance criteria in `{stem}-stories.md` | Implemented behavior or the diff |
| Design | APIs, data, and constraints in `{stem}-design.md` | Types, routes, and modules in code |
| Tests | Cases in `{stem}-tests.md` | Coverage of acceptance criteria |
| Cross-cutting | `architecture.md`, `release.md`, `test-strategy.md` | When the change touches deployment, structure, or test policy |

State **Sync mode** in the gap report:

- **Spec before code** when the user is changing intent or acceptance.
- **Spec after code** when the user already shipped and asks to align docs with what is on disk.

When every compared row aligns, say so in one sentence and skip the write offer unless the user asks for a spot check on another file.

### Write after confirm

- Write only files the user confirmed in chat. One pass.
- Do not create a new spec file without confirm.
- Do not edit ADR or knowledge trees here. Use `sdd-retrospective` for durable lessons. Use `sdd-update-project` when the map has no `adr` or `knowledge` root.
- Propose a `changes-log.md` entry when the run concludes a visible spec change. Do not write `changes-log.md` unless the user confirms that entry or another rule requires it in the same turn.

## Knowledge

| Source | Load when |
| --- | --- |
| `{workspace}/artifacts-map.json` | Start |
| `sprint-backlog.md` and `status.md` under paths from the map | Scope is an SBI or current WIP work |
| Related paths on the SBI row | Scoped SBI |
| `{client_root}/templates/framework.sdd.works/{locale}/scrum-in-sdd.md`, Engineering Artifacts | Naming `{stem}-stories.md`, `{stem}-design.md`, `{stem}-tests.md` |
| `{client_root}/rules/friendly-language.mdc` | Wording for the gap report and drafts |
| [response.md](./response.md) | Composing the gap report |
| `{client_root}/rules/sdd-incremental-delivery.mdc` | Scope might jump to a second SBI |

Do not load `framework-design.md` from the workspace. The tables above are enough for this skill.

Module layout: each `modules[]` entry has a `files` list. Resolve design, stories, and tests from those paths. `folder` and `stem` are optional hints. Do not reconstruct paths from `folder` and `stem` when `files` already lists them.

## Report to user

Load [response.md](./response.md) and send one message in that order.

Every sentence the user reads is written from the user's view. It names the spec file, what work shows, and what will change. A sentence that only tells what the agent found in a file fails.

When the user picks confirm all or names a subset in chat, write in one pass, then summarize what changed.

## Limits

- Confirm before any write under `{workspace}`.
- Do not write the five process files.
- Do not set PBI, SBI, or sprint Status to Done or WIP.
- Do not write `status.md`, `issues-log.md`, `product-backlog.md`, or `sprint-backlog.md`.
- Do not call `sdd_install_framework` or `sdd_update_framework`.
- Leave `{client_root}/.sdd-installed.json` unchanged.
- Leave secrets out of spec edits and out of a proposed changes-log line.
- Do not duplicate `sdd-review-status`. That skill compares process files only and does not edit engineering specs.
- Do not rewrite an entire test catalog in one pass unless the user confirms that scope.
- Stop when the map is missing or a named spec path fails to open. Name the path and stop.

## Anti-patterns

- Ship code and skip stories, design, or tests that the SBI Related specs name.
- Edit `{stem}-tests.md` without checking `{stem}-stories.md` for the same acceptance criteria.
- Use this skill to fix board status or sprint rows.
- Paste a long numbered procedure that fixes step order. The host orders capabilities from context.

## Test prompts

After the seed is installed, these prompts should trigger this skill:

1. I finished the feature in code. Run sdd-update-specs and list what in the module stories, design, and tests is out of date.
2. Compare my branch diff under specs/mcp with mcp-stories and mcp-design. Draft spec fixes only.
3. I am on SBI feature-44. Update related engineering specs after I confirm your gap list.
