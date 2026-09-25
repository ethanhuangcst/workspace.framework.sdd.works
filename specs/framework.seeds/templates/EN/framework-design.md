# Design — framework

> **Purpose**: Sprint backlog shape. Read this before adding a sprint item or a retrospective entry.
> **Practices**: [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) (what, how, when). Product backlog category grouping lives there.
> **Framework**: [`sdd-scrum-guide.md`](./sdd-scrum-guide.md) (names and meaning).

## Two repositories

Do not mix these workspaces. They are separate git remotes.

| Workspace | Remote | What it is |
| --- | --- | --- |
| This workspace (`framework.sdd.works`) | [workspace.framework.sdd.works](https://github.com/ethanhuangcst/workspace.framework.sdd.works.git) | Build the product: framework pack authoring, MCP, and the web portal |
| Framework pack | [framework.sdd.works](https://github.com/ethanhuangcst/framework.sdd.works.git) | Published pack only (`agents/`, `skill/`, `rules/`, `templates/`) |

Author pack files here. Copying the finalized seed folder into the pack repo is [Go-live](#go-live). Do not point this checkout’s git remote at the pack repo. Do not put portal, MCP, or `src/` into the pack repo.

## Go-live

When every framework artifact under the seed folder is finalized, copy that folder into the framework pack repo. That repo is a different workspace and a different remote from this one. Then push it to GitHub.

In the framework.sdd.works admin portal, sync that pack to the server by hand, or leave it to the 30-minute auto sync from MCP.

Do not add the pack copy, the GitHub push, or the server sync to a Spec-seeds task or to Spec-seeds acceptance criteria.

## Install ledger

One file, `{client_root}/.sdd-installed.json`, is the merge ledger and the start gate. [ADR-057](../../../adr/ADR-057-install-ledger-pack-complete.md). Do not add `framework.sdd.works.json`.

The installer sets `pack_complete` to `true` in the same write as `package_version`, `package_commit`, and `files`, and only after the copy succeeds. `files` stays grouped by skills, rules, agents, workflows, and templates. Each entry is a pack file path, not a folder name ([ADR-059](../../../adr/ADR-059-ledger-lists-pack-files.md)). Idempotency uses the version, the commit, and those files on disk. It does not use the flag.

Ethan reads this file on start. A missing file, or `pack_complete` not `true`, is a fatal stop. He may set the flag `false`. He does not change `package_version` or `package_commit`. Only install or update sets the flag `true`.

## Constants

Lookup file for pack path names, the instructions URL, skill keys, and rule keys. Filename: `constants.md`. [ADR-060](../../../adr/ADR-060-constants-on-client-root.md).

| Role | Path |
| --- | --- |
| Authoring seed in this workspace | `specs/framework.seeds/templates/constants.md` (beside `EN/` and `HanS/`, not inside a locale folder) |
| After install | `{client_root}/templates/framework.sdd.works/constants.md` |

Do not copy `constants.md` into the workspace, into `{workspace}/specs`, or into the artifacts root. Writing rules live in [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) under Templates.

## Sprint item table

Columns, in this order: Code, Parent PBI, Module, Type, SBI, then Acceptance criteria, Related docs, Note, and Status.

**Code** is the Type in lowercase, a hyphen, and a two-digit number inside that sprint. Examples: `feature-01`, `research-01`, `bug-fix-01`, `documentation-01`, `task-01`. Numbering restarts at `01` for each Type in each sprint. The visible code may repeat in a later sprint. The row anchor must be unique in the file, so prefix the sprint: `s1-feature-01`.

**Type** is one word. The product backlog keeps the column name Category. Do not rename that column to Type.

- **Feature**: the item delivers something the product ships for use. That includes an agent capability, an MCP behavior, a web page, a seed, and a product behavior such as recording a card.
- **Research**: the item finds and records evidence before a feature is specified. It does not ship the feature.
- **Bug-fix**: the item corrects a defect in something already delivered. It does not add a new capability.
- **Documentation**: the item writes or retargets an explanation. It does not ship the capability the explanation describes.
- **Task**: supporting work that is not a feature, research, a bug fix, or documentation.

**Parent PBI** shows the PBI code and the PBI name, and links the product-backlog anchor.

Rows of the same Type stay together. Keep the order the rows were added inside that Type. Put the Type that appeared first in the sprint ahead of a Type that appeared later.

## Status

An SBI and a PBI use only three statuses: `ToDo`, `WIP`, and `Done`.

| Status | Meaning | Example |
| --- | --- | --- |
| `ToDo` | Not started. | No work toward the acceptance criteria has started. |
| `WIP` | Started, and either an acceptance criterion is still open or the Definition of Done has not been applied. | One part of the item works. Another part of the same acceptance criteria does not. |
| `Done` | Every acceptance criterion is met, and the Definition of Done rule has been applied to this item. | The item meets its acceptance criteria, and the DoD rule has been applied with nothing left open for this item. |

**Apply the Definition of Done rule before marking an SBI or a PBI `Done`.** Do not mark it `Done` because a file exists or a check passed while a DoD item for that row is still open. Leave it `WIP`.

The sprint line uses the same three words. `Done` only when every SBI in that sprint is `Done`. The RID Registry keeps its own statuses.

## Retrospective

Each sprint has one Retrospective section. A later retrospective in that sprint is appended to the same section. Do not open a second Retrospective heading.

Two headings, in this order: Learnings, then Opportunities.

Each run is one block under the heading it belongs to:

1. One line: timestamp, then the trigger. Example: `[10:12, Sep 24, 2026], feature-01 completed`.
2. Bullets: a short summary. When the learning was written to an ADR or a knowledge note, the summary links that file.
3. A line of dashes before the next block under the same heading.

```
Learnings:

[10:12, Sep 24, 2026], feature-01 completed

- [summary](link to the ADR or knowledge note)

----------------

[16:14, Sep 24, 2026], DoD rule for feature-02

- [summary](link to the ADR or knowledge note)

Opportunities:

[16:20, Sep 24, 2026], feature-02 still open

- summary of what to change next
```

Write the ADR or knowledge note only when the decision or lesson is reusable. A summary with no such note has no link. Do not invent a note so the bullet can link.
