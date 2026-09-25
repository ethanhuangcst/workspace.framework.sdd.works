# constants

Lookup for path names, the instructions URL, skill keys, and rule keys. This file is not inside a locale folder. Ethan reads it only after `{client_root}/.sdd-installed.json` has `pack_complete: true`. On a failed start he reads `instructions_url` from this file when the file can be read.

Live path after install: `{client_root}/templates/framework.sdd.works/constants.md`. Do not copy this file into the workspace or into `specs/`. Writing rules: [`sdd-scrum-practices.md`](./EN/sdd-scrum-practices.md) under Templates.

## Paths

| Name | Value |
| --- | --- |
| `agents_dir` | `agents` |
| `skills_dir` | `skills` |
| `rules_dir` | `rules` |
| `workflows_dir` | `workflows` |
| `templates_dir` | `templates` |

## instructions_url

`https://framework.sdd.works/instructions`

## Skills

| Skill key | Folder |
| --- | --- |
| `skill_start_project` | `sdd-new-project` |
| `skill_update_project` | `sdd-update-project` |
| `skill_refine_pb` | `sdd-refine-pb` |
| `skill_plan_sprint` | `sdd-plan-sprint` |
| `skill_update_status` | `sdd-update-status` |
| `skill_retrospective` | `sdd-retrospective` |
| `skill_close_sprint` | `sdd-close-sprint` |
| `sdd-atdd` | `sdd-atdd` |
| `sdd-tdd` | `sdd-tdd` |
| `sdd-audit-artifacts` | `sdd-audit-artifacts` |
| `sdd-update-specs` | `sdd-update-specs` |
| `sdd-implement-feature` | `sdd-implement-feature` |

## Rules

| Rule key | File |
| --- | --- |
| `sdd-dod` | `sdd-dod.mdc` |
| `sdd-incremental-delivery` | `sdd-incremental-delivery.mdc` |
| `sdd-realtime-status` | `sdd-realtime-status.mdc` |
