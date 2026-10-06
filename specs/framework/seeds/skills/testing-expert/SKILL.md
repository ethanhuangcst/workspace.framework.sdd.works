---
name: testing-expert
description: >
  All-in-one testing: design the strategy, define methods and tools, create
  tests, run the layers that strategy names, and write a short report. Covers
  unit and component, API and integration, and browser end-to-end with
  Playwright. Use when the user asks to test a feature, add tests, write a
  test strategy, run tests, debug UI, click through the app, or says
  /testing-expert, Playwright, or browser testing. This skill owns those
  browser checks. Do not load webapp-testing. sdd-spec-to-build may load this
  skill when a feature needs tests. Does not require a sprint backlog or
  process files.
license: Complete terms in LICENSE.txt
---

# Testing expert

The host runs the loop. This skill states what the agent may do, what it loads, and what waits for a person. The agent picks the order from the thread.

`{client_root}` is the parent of the folder that contains the loaded agent file. It is where rules and skills install, not where test files live.

This skill owns unit, API, and browser checks. Do not load `webapp-testing` or another testing skill for those checks.

The five jobs for one feature are strategy, tools, create, run, and report.

## Capabilities

| Capability | When | Result |
| --- | --- | --- |
| Resolve scope | The user names a feature, an SBI, a module, or a diff | One bounded set of checks |
| Design strategy | Scope is known | Happy path and one failure path per layer, pyramid split |
| Pick tools | Strategy is drafted | The runner the repo already has; defaults in Tools |
| Create tests | Strategy is confirmed | Real test files in the project |
| Run the layers | Tests exist and the strategy is confirmed | The layers that strategy names, in the order the thread needs |
| Report | Run finished | One table and one count line |

## Knowledge

| Source | Load when |
| --- | --- |
| `{workspace}/{artifacts_root}/test-strategy.md` | It exists; before strategy, and update after confirm |
| `{workspace}/artifacts-map.json` | It exists; module test file paths and stems |
| Project markers: `package.json`, `pyproject.toml`, `go.mod` | Before picking tools |
| `{client_root}/rules/common-test-strategy.mdc` | Installed; before pyramid split |
| This skill folder `browser.md` | The work includes a web UI. Server helper, static HTML, and rendered-page facts live there |
| This skill folder `templates/test-report.md` | Before writing a report file; fill placeholders from the run |
| This skill folder `templates/test-report-failures.md` | When any check failed; append or paste failure detail |

## Tools

Default per language. Use the project's existing runner when it differs.

| Layer | JavaScript / TypeScript | Python |
| --- | --- | --- |
| Unit, component | Vitest or Jest, plus Testing Library | pytest |
| API, integration | Same runner against HTTP routes, or supertest | pytest plus httpx against the app |
| Browser E2E | `@playwright/test` when the repo already uses it; otherwise Python Playwright below | Playwright `sync_api` |

Go, Rust, and other stacks: use the project's native test runner for unit and API layers; use Playwright for browser checks when the app has a web UI.

## Browser and E2E

Load `browser.md` in this folder when the work includes a web UI. That file holds the server helper, static HTML, and rendered-page facts. This file does not repeat them.

## File names

When the skill writes a file, use the name the user gives. Otherwise use the default.

| File | Default name | Prefix rule |
| --- | --- | --- |
| Product test strategy | `test-strategy.md` | No prefix |
| Module test plan | `{stem}-tests.md` or `{folder}-tests.md` | The module `stem` from `artifacts-map.json` when present, otherwise the module `folder` |
| Test report file | `test-report.md` | No prefix when the run is product-wide |
| Module test report file | `{stem}-test-report.md` or `{prefix}-test-report.md` | Same prefix rule as the module test plan |

When the user names a prefix, use that prefix for every module test file in that run. Otherwise use the default prefix from the row above.

Examples:

- One module `mcp`: default `mcp-tests.md`.
- Two modules `webapp` and `mcp`: user names the prefix per module, so files are `webapp-tests.md` and `mcp-tests.md`.
- User names `api-checks.md` for one module: file is `api-checks.md`.

## Strategy output (before write)

Send one message:

- **Scope:** {feature name or SBI code}
- **Layers:** unit and component, API, browser
- **Checks:** happy path and one failure path per layer
- **Tools:** {runner per layer}
- **Files to write:** {path or `none` when tests go in existing files}
- **Pyramid split:** about 70 / 20 / 10

Wait for confirm. Update `test-strategy.md` only when it exists and the user confirms.

## Report

**Chat (default after every run):**

| Check | Result | Evidence |
| --- | --- | --- |
| {name} | pass, fail, or skip | {command, screenshot path, or log line} |

Then one line: {n} passed, {n} failed, {n} skipped.

When any check failed, add a short **Failures** subsection in chat using the shape in `templates/test-report-failures.md`.

**File (when the user asks for a saved report, PR evidence, or a path on disk):**

Fill `templates/test-report.md` from this skill folder. Write it under `{workspace}/{artifacts_root}/` when that folder exists, otherwise at the path the user names. Use the **File names** row. When any check failed, append `templates/test-report-failures.md` under a **Failures** heading in the same file. Still send the chat table and count line.

## Limits

- Do not hard-code a runner, port, tool, or file path when the user or the repo names one.
- Do not inspect a dynamic page before `networkidle` or a stable selector.
- Do not require a sprint backlog, `artifacts-map.json`, or process files to run.
- Do not load `webapp-testing` or another testing skill when this skill is loaded.
- Do not mark a backlog row Done or write process files unless the user asks.
- Do not ship a second dashboard. Chat stays one table and one count line; file reports use only `templates/` in this skill folder.
- When the user only asked for a strategy, stop after the Strategy output unless they ask to create or run.

## Optional SDD harness

When the project uses the framework pack and the current task is one sprint backlog item, `sdd-spec-to-build` may load this skill. The skill runs without that load.
