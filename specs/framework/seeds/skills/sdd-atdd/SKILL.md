---
name: sdd-atdd
description: >
  Draft or revise user stories and Gherkin acceptance criteria in the module
  stories file listed in artifacts-map.json before implementation. Use when the
  user asks for ATDD, user stories, acceptance criteria, Gherkin, story mapping,
  or /sdd-atdd. Loaded by sdd-spec-to-build when an SBI needs acceptance criteria
  before the build phase. Does not write product-backlog.md or production code.
---

# ATDD

`{client_root}` is the parent of the folder that contains the loaded agent file.

`{locale}` is the value in `{workspace}/artifacts-map.json`. When `locale` is missing, use `EN`.

The practices file for this run is `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md`.

## Capabilities

| Capability | Result |
| --- | --- |
| Resolve stories file | The `*-stories.md` or `stories.md` path in the module's `files` list ([ADR-100](../../../../adr/ADR-100-optional-module-folder.md)) |
| Read practices | `#module-name-storiesmd`, `#6-user-story-mapping`, `#term-atdd`, `#acceptance-criteria-practices` |
| Draft US and AC | As a / I want / So that plus Gherkin scenarios aligned with common-test-strategy |
| Confirm before write | ATDD Summary in chat; write only after the user picks |
| Scope | One feature group or one story set per run unless the user expands |

## Knowledge

| Source | Load when |
| --- | --- |
| `{workspace}/artifacts-map.json` | Start; resolve stories path from `modules[].files` |
| `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md`, `#module-name-storiesmd` | Before drafting file shape |
| Same file, `#6-user-story-mapping` | When ordering or slicing stories |
| Same file, `#acceptance-criteria-practices` | Before drafting Gherkin scenarios |
| Same file, `#term-atdd` | When explaining ATDD vs TDD |
| Stories, design paths from the map when they exist | Before append or revise |
| Parent PBI on `product-backlog.md` when named | Scope and requirement bullets |
| `{client_root}/rules/friendly-language.mdc` | User-facing reply text |

## Path resolution

1. Pick the module from SBI Related specs, user context, or the only module in the map.
2. In that module's `files` list, use the path that ends with `-stories.md` or equals `{artifacts_root}/stories.md` for singleton layout.
3. Do not build `{artifacts_root}/{folder}/{stem}-stories.md` when the map already lists a different path.

## When to run

- The user asks for ATDD, user stories, acceptance criteria, Gherkin, story mapping, or `/sdd-atdd`.
- `sdd-spec-to-build` loads this skill in the design phase when the SBI needs acceptance criteria before build.
- An Implementable PBI or Feature SBI is ready for module stories content.

## ATDD Summary (before write)

Send one message:

- **Target file:** `{workspace-relative stories path from the map}`
- **Scope:** {feature-id, user story numbers, or SBI code}
- **User stories to add or change:** {titles or `none`}
- **Acceptance criteria:** {scenario names or `none`}
- **Skipped:** {out of scope for this run or `none`}

### Your choice

After the summary, list the choices in the same message. Do not open a question card.

1. I will enter instructions in chat.
2. Apply the listed writes to the target stories file.
3. Leave it to me.

The user's reply that names the choice is the confirmation. Write only after that reply.

## Write rules

- Write only the stories path from the map for this module. One confirm covers that file for this run.
- Follow the Template and How to write under `#module-name-storiesmd`.
- Use i18n keys, roles, or `data-testid` in Gherkin when the product has UI. Do not lock English product copy as the contract.
- One scenario is one behavior. Name scenarios for observable outcomes.
- Do not write `product-backlog.md`, `sprint-backlog.md`, or production code.
- Do not set any backlog row to **Done**. Finishing a stories draft is not **close confirm**.
- Do not replace an entire existing stories file unless the user pick explicitly asks for a full rewrite.

## Limits

- Read `locale` from the map. Allowed values are `EN`, `HanS`, and `HanT`. When `locale` is missing, reply in the language of the user's request.
- Do not commit unless the user asks.
- Leave `{client_root}/.sdd-installed.json` unchanged.
- Leave `sdd_install_framework` and `sdd_update_framework` uncalled.
- Unit and integration test implementation stays with TDD and the project test spec after acceptance criteria exist.
