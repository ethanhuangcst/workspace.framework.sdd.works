---
name: sdd-spec-to-build
description: >
  Bring one feature or SBI to engineering readiness before a build: applicable
  stories, tests, UI specs, and technical design. Use when the user asks to
  prepare for implementation, engineering readiness, spec before build, ready
  to implement, spec a feature, spec to build, or to update stories, tests, UI
  design, a mockup, or technical design. Loads atdd-expert, testing-expert,
  sdd-update-specs, frontend-designer, frontend-developer, or fullstack-engineer.
  Does not build the feature. Proposes sdd-build after the user confirms
  readiness.
---

# Spec to build

This skill brings one feature or SBI to **engineering readiness** before implementation. It updates the specs that apply to that work. It does not implement the feature.

When every applicable job is done or marked N/A with a reason, and the user confirms readiness, propose `sdd-build`. Do not start the build in this skill.

`{workspace}` is the project folder. `{artifacts_root}` is the specs folder named by the project or the map.

## Capabilities

| Action | When |
| --- | --- |
| Assess readiness | The user prepares for implementation or asks if the feature is ready to build |
| Run one engineering job | The user names an artifact or job, or single-job mode picks the first applicable gap |
| Resolve paths from the map | `artifacts-map.json` exists and the module in scope is known |
| Show draft and target path | Before any spec file write |
| Propose `sdd-build` | Applicable jobs are done or N/A and the user confirms readiness |

Readiness rules, applicability, path matching, and the summary template are in [readiness.md](./readiness.md).

## Jobs

Checklist for one feature. Not every job applies to every SBI. See [readiness.md](./readiness.md) Applicability.

1. Update engineering artifacts and alignment. Load `sdd-update-specs` when specs drift. Propose a skill and a job when a mapped file is missing.
2. Update the module stories file with `atdd-expert`. Pass requirement text, scope, and the resolved path in the thread. Target: `*-stories.md` or `stories.md` from the map. Follow the practices stories template before you draft.
3. Update the module tests file with `testing-expert`. Target: `*-tests.md` or `tests.md`. Follow the practices **Strategy** and layer case sections before you draft.
4. Update the **UI design** section in the module design file. Use `frontend-designer` when the user asks. Target: `*-design.md` or `design.md`. Follow the practices **UI design** template before you draft.
5. Create or update a UI mockup when the feature has a user interface, using `frontend-designer` and `frontend-developer`. Follow **Mockups and assets** in the same practices section.
6. Sync UI assets so implementation and UI design match. Follow the mockup sync rule in practices.
7. Update the **Technical design** section in the module design file with `fullstack-engineer`. Follow the practices **Technical design** template before you draft.

`frontend-designer` is the installed skill. The user may say frontend-design. Load `frontend-designer`.

## Knowledge

| Source | Load when |
| --- | --- |
| [readiness.md](./readiness.md) | Readiness mode, applicability, path resolution, readiness summary |
| `{workspace}/artifacts-map.json` | Resolving module paths; optional when the user names every path |
| `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md`, `#module-name-storiesmd` | Before you draft or edit `*-stories.md` or `stories.md` for job 2. When `locale` is missing, use `EN` |
| `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md`, `#module-name-testsmd` | Before you draft or edit `*-tests.md` or `tests.md` for job 3. When `locale` is missing, use `EN` |
| `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md`, `#module-name-designmd` | Before you draft or edit `*-design.md` or `design.md` for jobs 4–7. When `locale` is missing, use `EN` |
| `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md`, artifacts map **Rules** | Pack installed and map shape is ambiguous. When `locale` is missing, use `EN` |

## After one job

List what changed: the file, the skill used, and what stayed out of scope. Wait for the user.

When readiness is satisfied and the user confirms, propose `sdd-build`. Do not start the build in this skill.

## Limits

- Readiness mode may assess all jobs without writing. One job still writes at most one confirm batch per reply unless the user names more than one job.
- Do not say the feature is well spec'd or propose `sdd-build` without a readiness summary and user confirm.
- Do not run UI jobs 4–6 when applicability is N/A.
- Do not start the next feature.
- Do not set a backlog row to **Done**.
- Do not call `sdd_install_framework` or `sdd_update_framework`.
- When `{workspace}/artifacts-map.json` and `{client_root}/rules/sdd-dod.mdc` both exist and a backlog item is being closed, follow **close confirm** before any **Done** row. Path confirm for a spec file is not **close confirm**.

## Anti-patterns

- Calling the feature ready after only stories when UI jobs still apply.
- A mockup for a headless MCP or API-only SBI.
- Forcing a stories file on a documentation-only SBI.
- Writing every artifact in one pass without per-file confirm.
- Writing stories, tests, and design in one pass when the user named one job.
- Building the feature inside this skill.
- Loading `frontend-design` when the folder name is `frontend-designer`.
- Assuming `specs/{folder}/{stem}-stories.md` when the map lists `specs/stories.md` or another path.
