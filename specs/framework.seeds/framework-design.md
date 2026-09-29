# Design — framework artifacts

> **Purpose**: One section per framework artifact: where the file lives, and the shape that file keeps. What, how, and when stay in [`sdd-scrum-practices.md`](./templates/EN/sdd-scrum-practices.md). Names and meaning stay in [`scrum-in-sdd.md`](./templates/EN/scrum-in-sdd.md).
> **Practices**: [`sdd-scrum-practices.md`](./templates/EN/sdd-scrum-practices.md).
> **Framework**: [`scrum-in-sdd.md`](./templates/EN/scrum-in-sdd.md).

An artifact seed has no status line (`initialized`, `draft`, `confirmed`, `updated`) and no last-update line. Work status stays on the product backlog, the sprint backlog, and `status.md`. Git holds the timestamp and the author. The only init signal is `initialized: no` on a live `artifacts-map.md` while `sdd-kickoff-project` is still copying files.

## Two repositories

Do not mix these workspaces. They are separate git remotes.

| Workspace | Remote | What it is |
| --- | --- | --- |
| This workspace (`framework.sdd.works`) | [workspace.framework.sdd.works](https://github.com/ethanhuangcst/workspace.framework.sdd.works.git) | Build the product: framework pack authoring, MCP, and the web portal |
| Framework pack | [framework.sdd.works](https://github.com/ethanhuangcst/framework.sdd.works.git) | Published pack only (`agents/`, `skills/`, `rules/`, `templates/`) |

Author pack files here. Copying the finalized seed folder into the pack repo is [Go-live](#go-live). Do not point this checkout’s git remote at the pack repo. Do not put portal, MCP, or `src/` into the pack repo.

## Go-live

When every framework artifact under the seed folder is finalized, copy that folder into the framework pack repo. That repo is a different workspace and a different remote from this one. Then push it to GitHub.

In the framework.sdd.works admin portal, sync that pack to the server by hand, or leave it to the 30-minute auto sync from MCP.

Do not add the pack copy, the GitHub push, or the server sync to a Spec-seeds task or to Spec-seeds acceptance criteria.

## Install ledger

One file, `{client_root}/.sdd-installed.json`, is the merge ledger and the start gate. [ADR-057](../adr/ADR-057-install-ledger-pack-complete.md). Do not add `framework.sdd.works.json`.

The installer sets `pack_complete` to `true` in the same write as `package_version`, `package_commit`, and `files`, and only after the copy succeeds. `files` stays grouped by skills, rules, agents, workflows, and templates. Each entry is a pack file path, not a folder name ([ADR-059](../adr/ADR-059-ledger-lists-pack-files.md)). Idempotency uses the version, the commit, and those files on disk. It does not use the flag.

Ethan reads this file on start. A missing file, or `pack_complete` not `true`, is a fatal stop. He may set the flag `false`. He does not change `package_version` or `package_commit`. Only install or update sets the flag `true`.

## constants.md

Lookup file for pack path names, the instructions URL, skill keys, and rule keys. [ADR-060](../adr/ADR-060-constants-on-client-root.md).

| Role | Path |
| --- | --- |
| Authoring seed | `specs/framework.seeds/templates/constants.md` (beside the locale folders, not inside one) |
| After install | `{client_root}/templates/framework.sdd.works/constants.md` |

Do not copy `constants.md` into the workspace, into `{workspace}/specs`, or into the artifacts root. It has no row in `artifacts-map.md`.

## scrum-in-sdd.md

Names and meaning. It does not take what, how, and when from practices.

| Role | Path |
| --- | --- |
| Authoring seed | `specs/framework.seeds/templates/{EN\|HanS\|HanT}/scrum-in-sdd.md` |
| After install | `{client_root}/templates/framework.sdd.works/{locale}/scrum-in-sdd.md` |

It is not a project file under `artifacts_root`. Do not copy it into the project. Ethan reads it from the client-root locale folder.

## sdd-scrum-practices.md

What, how, and when. It does not redefine guide terms.

| Role | Path |
| --- | --- |
| Authoring seed | `specs/framework.seeds/templates/{EN\|HanS\|HanT}/sdd-scrum-practices.md` |
| After install | `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md` |

It is not a project file under `artifacts_root`. Do not copy it into the project. Ethan reads it from the client-root locale folder.

## artifacts-map.md

Project config for where artifacts live. It records only what this project has. It is a labeled list, not a reading document, and it does not use tables.

| Role | Path |
| --- | --- |
| On a project | `{workspace}/artifacts-map.md` |
| Authoring seed | `specs/framework.seeds/templates/EN/artifacts-map.md` |

Keep the name `artifacts-map.md`. Do not rename it to a dotfile. Do not put the only copy inside `artifacts_root`.

Header, in this order:

1. **Product name.** Display only. It does not locate files.
2. **`artifacts_root`.** One folder name relative to the workspace. When the field is absent, use `specs`. `docs` is an example. Any other single folder name is valid. Do not store an absolute machine path.
3. **Locale.** `EN`, `HanS`, or `HanT`.

Each block has a name and a workspace-relative path. Join `{workspace}` and that path. Do not prefix `artifacts_root` again.

A file under the artifacts root includes that folder in the path. `specs/product-backlog.md` is `{workspace}/specs/product-backlog.md`. Changing `artifacts_root` rewrites those paths and the header.

The map file itself is the exception. Its path is `artifacts-map.md`, which is `{workspace}/artifacts-map.md`. That path does not include the artifacts-root folder.

In the authoring seed, `local` values are concrete paths that use the default root `specs`. Do not write `{artifacts_root}` inside a `local` value. Do not add HTML example comments. `purpose` is the rule that stays in the working file. Path fields are the sample.

One block per artifact that exists. A row may carry one line of purpose when that line prevents a wrong copy. Do not leave empty rows. Omit a seed path when the file follows `templates/{locale}/<name>`. List a pack-relative seed path only when the file does not follow that convention. Do not write a machine path into the project file.

On start, after the install ledger passes, Ethan follows the skill `sdd-audit-artifacts`. That skill returns one verdict. Ethan does not decide the verdict from a missing root file.

| Verdict | What it means | What Ethan does |
| --- | --- | --- |
| `Uninitialized` | No process file opened | Tell the user the next step is to start a new project. When the user confirms, follow the skill `sdd-kickoff-project`. |
| `Index broken` | At least one process file opened, and the map is missing or its paths do not open those files | Tell the user the next step is to update the project. When the user confirms, follow the skill `sdd-update-project`. |
| `Usable` | The map opens the process files, including `status.md` and `sprint-backlog.md` | Follow the skill `sdd-get-status`. |

An empty `locale` does not change the verdict. `sdd-audit-artifacts` reports `locale` empty only when it opened the map and the field is missing. Ethan uses that report. He does not decide that the field is empty. On `Usable`, start load still follows `sdd-get-status`. When a later job needs a locale and the audit reported it empty, the next step is `sdd-update-project` after the user confirms. Do not assume English.

Do not put a verdict flag in the map file.

`sdd-kickoff-project` writes this file when it is missing. It asks for the product name, `artifacts_root`, locale, and module folders. While the copy is still running, the header may say `initialized: no`. Remove that line when the copy finishes. Copy a seed only where the target file is missing. Do not overwrite a file that already has content.

`sdd-update-project` repairs a missing or wrong map after the user confirms an `Index broken` verdict. It does not overwrite a process file that already has content. It also writes `locale` when the audit reported that field empty and the user confirmed, and it updates other map settings when a map is already in use.

A module is a folder under `artifacts_root`. The map stores `folder`, `stem`, and the three workspace-relative paths. The default stem is the folder name. A shorter stem is set once. Two modules cannot use the same stem. A later read uses the stored paths.

The rule `artifacts-map.mdc` updates this file when a project artifact is created, renamed, or deleted. [ADR-072](../adr/ADR-072-rule-artifacts-map.md). It does not classify the workspace on start, and it does not set `pack_complete`.

## sdd-audit-artifacts

Read-only skill. [Skill-10](../product-backlog.md#pb-30). Sprint 4 writes the initial `SKILL.md`.

| Role | Path |
| --- | --- |
| Authoring seed | `specs/framework.seeds/skills/sdd-audit-artifacts/SKILL.md` |
| After install | `{client_root}/skills/sdd-audit-artifacts/SKILL.md` |

Start load follows this skill after `pack_complete` is true. The skill returns one verdict — `Uninitialized`, `Index broken`, or `Usable` — the paths it opened, the paths that failed, and whether `locale` is empty. It reports `locale` empty only when it opened the map and the field is missing. An empty `locale` does not change the verdict. It does not create or edit a project file. It does not replace `artifacts-map.mdc`.

## sdd-get-status

Read-only skill. [Skill-15](../product-backlog.md#pb-86). [ADR-073](../adr/ADR-073-skill-get-status.md). Not a practices job.

| Role | Path |
| --- | --- |
| Authoring seed | `specs/framework.seeds/skills/sdd-get-status/SKILL.md` |
| After install | `{client_root}/skills/sdd-get-status/SKILL.md` |

Start load follows this skill when the audit verdict is `Usable`. A user who asks where the project is follows it. It reads the five process files the audit opened:

| File | Authority |
| --- | --- |
| `status.md` | Current sprint, current item, and what is next |
| `sprint-backlog.md` | Sprint item list and schedule |
| `product-backlog.md` | Requirements and acceptance |
| `change-log.md` | Decisions already recorded |
| `issues-log.md` | Open defects |

It states where the project is and proposes the next-step options those files support. In a long file, it reads the current sprint and the open items. It does not create or edit a project file.

## sdd-update-status

Confirmed write of `status.md`. [ADR-065](../adr/ADR-065-skill-update-status.md). Practices job 6 stays titled Report status. The constants key is `skill_update_status`.

| Role | Path |
| --- | --- |
| Authoring seed | `specs/framework.seeds/skills/sdd-update-status/SKILL.md` |
| After install | `{client_root}/skills/sdd-update-status/SKILL.md` |

The skill drafts the picture from the sprint backlog, waits for confirm, and writes only the confirmed text into `status.md`. It does not mark a product item Done. It does not answer “where are we”. That read is `sdd-get-status`.

The seed folder on disk is still `skills/sdd-tracking/` until that rename is done. Do not ship both folders.

## product-backlog.md

Product requirements and acceptance for the project. The seed is an example a new project copies. It is not this repo's product backlog.

| Role | Path |
| --- | --- |
| On a project | `{workspace}/{artifacts_root}/product-backlog.md` |
| Authoring seed | `specs/framework.seeds/templates/EN/product-backlog.md` |

Columns, in this order: Category, PBI Code, PBI, Description, DoD, Related, Sprint, Status.

The column name stays Category. Do not rename it to Type. The DoD cell uses the same default checks as a sprint item. Those checks are in [`sdd-scrum-practices.md`](./templates/EN/sdd-scrum-practices.md). A row may replace them. An item uses `ToDo`, `WIP`, or `Done`, with the same meanings as in [sprint-backlog.md](#sprint-backlogmd).

## sprint-backlog.md

Sprint schedule and the SBI list. The seed is a starter for a new project. It is not this repo's sprint backlog.

| Role | Path |
| --- | --- |
| On a project | `{workspace}/{artifacts_root}/sprint-backlog.md` |
| Authoring seed | `specs/framework.seeds/templates/EN/sprint-backlog.md` |

### Sprint item table

Columns, in this order: `#`, Code, SBI, Parent PBI, Module/Type, DoD, Related specs, Status.

`Code` is the second column, between `#` and SBI.

The DoD cell is the check for that row. The default checks are in [`sdd-scrum-practices.md`](./templates/EN/sdd-scrum-practices.md). Story-specific checks stay in the linked specs. Do not copy those specs into the cell.

`#` is the row’s place in that table, from 1 to n. It is not part of the SBI. When a row moves, renumber `#`. The Code stays.

**Code** is the Type in lowercase, a hyphen, and a two-digit number inside that sprint. Examples: `feature-01`, `research-01`, `bug-fix-01`, `documentation-01`, `task-01`. Numbering restarts at `01` for each Type in each sprint. The visible code may repeat in a later sprint. The row anchor must be unique in the file, so prefix the sprint: `s1-feature-01`.

**Module/Type** is one cell: the module name, a slash, and the Type. Example: `Framework/Feature`.

**Type** is one word.

- **Feature**: the item delivers something the product ships for use. That includes an agent capability, an MCP behavior, a web page, a seed, and a product behavior such as recording a card.
- **Research**: the item finds and records evidence before a feature is specified. It does not ship the feature.
- **Bug-fix**: the item corrects a defect in something already delivered. It does not add a new capability.
- **Documentation**: the item writes or retargets an explanation. It does not ship the capability the explanation describes.
- **Task**: supporting work that is not a feature, research, a bug fix, or documentation.

**Parent PBI** shows the PBI code and the PBI name, and links the product-backlog anchor.

**Row order is the implementation order.** Done rows stay on top, in the order they were finished. Open rows follow, next first and last last. `WIP` is the next row when work has started. Do not group rows by Type. Do not append a row only because it is new. When a row moves, its Code stays and `#` changes.

### Status values

An SBI and a PBI use only three statuses: `ToDo`, `WIP`, and `Done`.

| Status | Meaning | Example |
| --- | --- | --- |
| `ToDo` | Not started. | No work toward the acceptance criteria has started. |
| `WIP` | Started, and either an acceptance criterion is still open or the Definition of Done has not been applied. | One part of the item works. Another part of the same acceptance criteria does not. |
| `Done` | Every acceptance criterion is met, and the Definition of Done rule has been applied to this item. | The item meets its acceptance criteria, and the DoD rule has been applied with nothing left open for this item. |

Apply the Definition of Done rule before marking an SBI or a PBI `Done`. Do not mark it `Done` because a file exists or a check passed while a DoD item for that row is still open. Leave it `WIP`.

The sprint line uses the same three words. `Done` only when every SBI in that sprint is `Done`. The RID Registry keeps its own statuses.

### Retrospective

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

## status.md

Current sprint projection. It is not a second sprint backlog. It is not the defect list.

| Role | Path |
| --- | --- |
| On a project | `{workspace}/{artifacts_root}/status.md` |
| Authoring seed | `specs/framework.seeds/templates/EN/status.md` |

It records the current sprint, the current SBI, what is next, and the OGT table for the sprint item in progress. Closed OGT rows leave that table. The file keeps the latest 15 closed OGTs in their own section, newest first. An open defect is not an OGT row. [ADR-070](../adr/ADR-070-change-log-and-issues-log.md).

## change-log.md

Conclusion record: what changed, why, and how it was verified. A row is written when a change is done. [ADR-070](../adr/ADR-070-change-log-and-issues-log.md).

| Role | Path |
| --- | --- |
| On a project | `{workspace}/{artifacts_root}/change-log.md` |
| Authoring seed | `specs/framework.seeds/templates/EN/change-log.md` |

It is not the defect list. An open defect does not go here.

## issues-log.md

Defect record. A row is opened when a defect is found and stays until it is closed. Status on a row is `Open` or `Closed`. [ADR-070](../adr/ADR-070-change-log-and-issues-log.md).

| Role | Path |
| --- | --- |
| On a project | `{workspace}/{artifacts_root}/issues-log.md` |
| Authoring seed | `specs/framework.seeds/templates/EN/issues-log.md` |

It is not the change log. An audit gap that is a defect is recorded here after the user confirms the gap. The change log gets a row only when a fix is concluded.

## architecture.md

Architecture starter for a new project. It is not this repo's architecture spec.

| Role | Path |
| --- | --- |
| On a project | `{workspace}/{artifacts_root}/architecture.md` |
| Authoring seed | `specs/framework.seeds/templates/EN/architecture.md` |

The EN seed is Sprint 14. Do not add a row for it in a project map until the file exists.

## {stem}-stories.md

User stories and acceptance criteria for one module.

The filename is `{stem}-stories.md`. The stem is the module folder name unless `artifacts-map.md` stores a shorter stem. The file sits in that module folder. `specs/web-app/app-stories.md` is `{workspace}/specs/web-app/app-stories.md` when the stem is `app`.

## {stem}-design.md

Design spec for one module.

The filename is `{stem}-design.md`. The same stem rules as [{stem}-stories.md](#stem-storiesmd) apply. `specs/web-app/app-design.md` is `{workspace}/specs/web-app/app-design.md` when the stem is `app`.

## {stem}-test.md

Test spec for one module.

The filename is `{stem}-test.md`. The same stem rules as [{stem}-stories.md](#stem-storiesmd) apply. `specs/web-app/app-test.md` is `{workspace}/specs/web-app/app-test.md` when the stem is `app`.

## deployment.md

Deployment starter for a new project. It is not this repo's deployment spec.

| Role | Path |
| --- | --- |
| On a project | `{workspace}/{artifacts_root}/deployment.md` |
| Authoring seed | `specs/framework.seeds/templates/EN/deployment.md` |

The EN seed is Sprint 14. Do not add a row for it in a project map until the file exists.

## .secrets

Secret names and where the values live. It holds no secret values.

| Role | Path |
| --- | --- |
| On a project | `{workspace}/{artifacts_root}/.secrets` |
| Authoring seed | `specs/framework.seeds/templates/EN/.secrets` |

The EN seed is Sprint 14. Do not add a row for it in a project map until the file exists.

## adr/

Durable decisions. A project may have this tree under `artifacts_root`. Ethan does not read it on start. Create a file when a retrospective finds a decision worth keeping. Do not leave an empty row in `artifacts-map.md` before the tree exists.

## knowledge/

Reusable research and ops notes. A project may have this tree under `artifacts_root`. Ethan does not read it on start. Create a file when a retrospective finds a lesson worth keeping. Do not leave an empty row in `artifacts-map.md` before the tree exists.
