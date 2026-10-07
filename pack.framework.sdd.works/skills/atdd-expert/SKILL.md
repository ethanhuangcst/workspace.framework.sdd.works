---
name: atdd-expert
description: >
  Draft high-quality user stories and Gherkin acceptance criteria from a
  requirement the caller already gathered. Use when the user asks for ATDD,
  user stories, acceptance criteria, Gherkin, or story mapping, or when
  sdd-spec-to-build loads this skill for a stories file. Applies coverage,
  observable outcomes, and i18n-safe steps. Does not resolve pack paths,
  process files, or production code.
---

# ATDD expert

This skill drafts user stories and acceptance criteria that a person can test before implementation. It does not look up a project map, a backlog, or a practices file unless the caller names one.

The caller supplies the requirement, the scope, and the file path when a write is wanted.

## Capabilities

| Action | When |
| --- | --- |
| Slice one requirement into user stories | The caller gives a feature or PBI outcome |
| Draft Gherkin under each story | A story needs testable acceptance |
| Check coverage and quality | Before showing a draft |
| Show an ATDD summary and the draft in chat | Before any file write |
| Write the named file | The caller names the path and the user says yes |

## Knowledge

| Source | Load when |
| --- | --- |
| [reference.md](./reference.md) | Drafting or revising stories, scenarios, or a full `*-stories.md` shape |
| `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md`, `#module-name-storiesmd` | Before writing or revising `{stem}-stories.md` or `stories.md`. When `locale` is missing, use `EN` |
| `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md`, `#acceptance-criteria-practices` | The pack is installed and the caller asks to match project practices exactly. When `locale` is missing, use `EN`. Start at that heading. Stop at the next heading of the same level |

When the practices file is absent, [reference.md](./reference.md) is the full quality bar.

## ATDD summary before write

Show this block in chat before the user chooses apply or chat-only edit:

- **Scope:** what requirement or feature slice this draft covers
- **Draft table:** when more than one story or scenario group is in scope, list each row with `#` starting at 1.

| # | Item | Detail |
| --- | --- | --- |
| 1 | `{story title}` | `{scenario count; happy / failure / empty paths}` |

- **Skipped:** anything out of scope or needing a product decision
- **Target path:** only when the caller named one
- **Quality gaps:** when the checklist in [reference.md](./reference.md) fails before show, send a gap table instead of the draft until fixed. **Check** is the checklist item. **Problem** is one sentence. **Fix** is one sentence for the draft change.

| # | Check | Problem | Fix |
| --- | --- | --- | --- |
| 1 | `{checklist item}` | `{what fails}` | `{what to change in the draft}` |

Then ask: edit in chat, apply writes to the named path, or stop without write.

## Limits

- Do not read `artifacts-map.json` or a backlog to find the target unless the caller passes the path or `sdd-spec-to-build` already resolved it in the thread.
- Do not write a file until the caller names the path and the user chooses apply.
- Do not write production code, automated tests, or a backlog row.
- Do not replace a whole existing stories file unless the user asks for a full rewrite.
- User story mapping backbone and MVP slices stay a separate step when the user asks to map. See [reference.md](./reference.md) Mapping.
- Leave out a draft whose purpose is unauthorized access or data exfiltration.

## Anti-patterns

- A story that names an agent task or a technical layer instead of a user outcome.
- A scenario that asserts English button copy as the only contract.
- Several unrelated behaviors in one scenario.
- Happy path only when the product must handle validation, denial, or empty state.
