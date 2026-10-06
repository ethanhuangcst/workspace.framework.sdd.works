# Engineering readiness

Rules for which jobs apply, how to resolve paths from the map, and the readiness summary before build.

## Operating modes

| Mode | When | Result |
| --- | --- | --- |
| Readiness | The user asks to prepare for implementation, engineering readiness, spec before build, ready to implement, or whether a feature is ready to build | A readiness summary for all applicable jobs, then offer the next job or ask which job to run |
| Single job | The user names stories, tests, UI, mockup, technical design, a checklist number, or one artifact path | Run one job, show the draft, write after yes |

When the user does not name a job and does not ask for readiness, run **single job** mode: the first **applicable** job that is missing or stale, in checklist order.

Readiness mode assesses every applicable job in one reply. It does not write every file in one reply.

## Applicability

| Job | Usually applies | N/A when |
| --- | --- | --- |
| 1 Artifacts and alignment | The map or artifact set is unclear, or specs may drift from the requirement | Skip only after paths for this feature are named in the thread |
| 2 Stories | The feature has testable behavior (ATDD) | Doc-only page, pure config, or the user says no stories |
| 3 Tests | Code or automation is expected | The user says tests live only in another named place |
| 4 UI design section | The SBI or feature has a user interface | MCP-only, CLI, API-only, or backend-only work |
| 5 UI mockup | Same as job 4 and the team uses a mockup for this feature | Same as job 4, or the user says design text is enough |
| 6 UI asset sync | Same as job 4 and mockup or design assets exist | Same as job 4 |
| 7 Technical design | Almost always | The user confirms design lives in another named doc only |

Every **N/A** row needs a one-sentence reason in the readiness summary.

## Resolve the module

When `{workspace}/artifacts-map.json` exists:

1. Read `modules` and each module `files` list. Paths are workspace-relative, as in `sdd-scrum-practices` artifacts map rules.
2. Pick the module in scope: the user names a module, folder, or feature; the thread names one SBI tied to one module; or the map has exactly one module entry.
3. When several modules match and the user did not narrow scope, ask which module before you write.

When the map is absent, use paths the user names. Do not invent a pack path.

## Resolve the file for a job

From the chosen module `files` list, pick **one** path per job. Do not assume `{folder}/{stem}-stories.md` when the map lists another path.

| Job | Match rule (first match in the module `files` list) |
| --- | --- |
| 2 Stories | Basename ends with `-stories.md`, or basename is exactly `stories.md` |
| 3 Tests | Basename ends with `-tests.md`, or basename is exactly `tests.md` |
| 4, 5, 6, 7 Design (and UI work) | Basename ends with `-design.md`, or basename is exactly `design.md` |

Flat layouts without a component subfolder are valid: for example `specs/stories.md`, `specs/tests.md`, `specs/design.md` when the map lists them on a module with no `folder`. Prefixed flat paths such as `specs/app-stories.md` under `{artifacts_root}` without a subfolder use the same suffix rules.

When the job needs a path and the module `files` list has no matching entry, job 1 applies: propose adding the path to the map or name a path with the user.

Optional pack detail: `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md`, artifacts map **Rules**. When `locale` is missing, use `EN`.

## Readiness summary

Show this before you say the feature is ready for build or propose `sdd-build`:

- **Scope:** feature id, SBI, module
- **Table:** Job | Applicable (Y/N) | Status (done / stale / missing) | Path | Note
- **Ready for build:** yes or no, and what is still open

Then ask: run the next job, change the summary, or stop.

Do not treat the first stale job as full readiness. Do not propose `sdd-build` until every applicable job is done or N/A with a reason, and the user confirms readiness.

## Job 1 detail

- Load `sdd-update-specs` when existing specs drift from the requirement or implementation.
- Propose `atdd-expert`, `testing-expert`, `frontend-design`, or `fullstack-engineer` when a mapped file is missing for an applicable job.
- Propose a map or path change only when the user confirms.
