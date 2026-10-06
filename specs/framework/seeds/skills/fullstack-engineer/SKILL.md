---
name: fullstack-engineer
description: >
  Build one web feature end to end: frontend, backend API, database, and auth,
  in the stack the project already uses. Use when the user asks to build a web
  app feature, add an API endpoint with its screen, wire a form to a database,
  add login or roles, or says build this feature end to end or frontend and
  backend together. frontend-design owns visual direction. frontend-developer
  owns UI-only work. testing-expert owns test strategy, runs, and reports. Does
  not require SDD process files.
---

# Fullstack engineer

The host runs the loop. This skill states what the agent may do, what it loads, and what waits for a person. The agent picks the order from the thread.

`{client_root}` is the parent of the folder that contains the loaded agent file. It holds installed rules and skills. Project code stays in the workspace the user opened.

This skill implements one feature across layers. It does not replace **frontend-design**, **frontend-developer**, or **testing-expert**.

## Capabilities

| Action | When |
| --- | --- |
| Read the stack from project files | Before any code. Files include `package.json`, lock files, `pyproject.toml`, `go.mod`, and `docker-compose.yml` |
| State the slice: screen, API contract, data model, and auth rule | The feature touches more than one layer |
| Write a failing test for each behavior | Before production code for business logic, an API route, a data transform, or auth |
| Implement the API route with input validation and one error shape | The feature needs a server route or handler |
| Change the data model with a migration | The feature needs a new table, column, or index |
| Wire the screen to the API with loading, empty, and error states | The feature has a screen |
| Keep handlers thin and place business rules in the module the repo already uses | The feature adds server or domain logic |
| Run the project test and lint commands | After each change, and before the reply that says the work is finished |
| Add a root `Makefile` with `dev`, `up`, and `down` | The workspace is a new project with no `Makefile` |

## Knowledge

| Source | Load when |
| --- | --- |
| Project stack files and existing code in the same layer | Before choosing a library, a folder, or a pattern |
| The docs for the installed framework version, such as `node_modules/next/dist/docs/` | The stack has version-specific APIs |
| The project test strategy file, when one exists | Choosing the test layer and the test runner |
| `{client_root}/rules/i18n-support.mdc` | The feature has user-facing text |
| `{client_root}/rules/common-test-strategy.mdc` | Writing or running tests during this feature |
| `{client_root}/rules/friendly-language.mdc` | Writing interface copy, an error message a person reads, or Markdown |

When a rule file is absent, the Limits below still apply.

## Feature slice (before large writes)

When the change spans several layers or the user asked for a plan first, send one message:

- **Scope:** {feature name}
- **Stack:** {from project files}
- **Layers:** screen, API, data, auth as applicable
- **Files to touch:** {paths or discover from tree}

Wait for confirm before a wide refactor. When the user asked to implement directly, skip the slice unless the thread is ambiguous.

## Limits

- Infer the stack from project files and existing code. Do not recommend Next.js, Drizzle, tRPC, Better Auth, Prisma, or another named stack unless those packages are already in the project or the user asks to adopt them.
- Use the stack, package manager, and libraries already in the project. Ask before adding a framework, a database, or an ORM the project does not use.
- Ask before a destructive migration: a dropped table or column, or rewritten data.
- Read secrets from environment variables or the project secret store. A secret value stays out of code, client bundles, logs, and responses.
- Enforce authorization on the server. A hidden button is not access control.
- Validate every request body and URL parameter on the server.
- Keep test doubles in tests. A production code path does not return fabricated data.
- Put user-facing text behind i18n keys when the project has i18n. When it has none, add the minimal i18n setup with the first screen, or ask the user.
- A shippable screen has accessible labels, keyboard focus, and visible loading, empty, and error states.
- Do not load **frontend-design** for a pure wiring or API task unless the user wants a new visual direction.
- Do not load **frontend-developer** when the work is API and data only with no UI change.
- Do not load **testing-expert** unless the user asks for a test strategy, new tests across layers, or a test run and report.
- Fix the code or the wrong test. Do not delete or skip a failing test to make the run pass.
- Do not read or write SDD process files unless the user asks. Do not set a backlog row to **Done** or **WIP**.

## Anti-patterns

- A screen that calls an API route that does not exist yet, with mock data left in place.
- An API error body that shows a stack trace, a query, or a token.
- A list endpoint that runs one query per row.
- One change across every layer with no test that proves the behavior.
- A new state library or styling system added for one screen.
- Business rules copied into a route handler when the repo already has a service or domain module.

## Report the result

After the work, send one message with:

- The files changed, grouped by layer.
- The commands run and their results: tests, lint, and migrations.
- The environment variable names the feature needs, without values.
- What the user checks in the browser to confirm the feature works.

## Optional SDD harness

When the project uses the framework pack and the work is one sprint backlog item, `sdd-spec-to-build` may load this skill for the build phase. Acceptance criteria stay in `atdd-expert`. Close stays in `sdd-dod.mdc`. This skill does not replace either one.
