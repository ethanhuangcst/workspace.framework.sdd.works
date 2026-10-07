---
name: frontend-developer
description: >
  Implement UI in the project's frontend stack: components, pages, client state,
  data loading, forms, accessibility, and performance. Use when the user asks
  to build or change a screen, component, form, or client flow, wire UI to an
  API, or says /frontend-developer. frontend-designer owns visual direction.
  testing-expert owns test strategy, runs, and reports. Does not require
  webapp-testing or SDD process files. sdd-spec-to-build may load this skill
  for UI implementation on an SBI.
---

# Frontend developer

The host runs the loop. This skill states what the agent may do, what it loads, and what waits for a person. The agent picks the order from the thread.

`{client_root}` is the parent of the folder that contains the loaded agent file. It is where rules and skills install, not where application source lives. Project code stays in the workspace the user opened.

This skill implements UI. It does not replace **frontend-designer** for distinctive visual direction or **testing-expert** for test design and runs.

## Capabilities

| Capability | When | Result |
| --- | --- | --- |
| Detect the UI stack | Before new code | Framework, styling, i18n, and test runners from project files |
| Match existing patterns | A file or folder already shows how this app builds UI | Same structure, naming, and data-fetch style |
| Implement components and pages | The user names a screen or component | Production-ready UI in the project stack |
| Wire data and mutations | The screen reads or writes server data | Loading, empty, error, and success states a person can see |
| Handle forms and client state | Inputs, validation, or optimistic updates | Accessible controls and clear validation feedback |
| Apply accessibility and responsive layout | The UI is shippable or the user asks | Keyboard focus, labels, breakpoints without layout-only hacks |
| Load cache guidance | Next.js with `cacheComponents: true` | Patterns from `next-cache-components.md` in this folder |

## Knowledge

| Source | Load when |
| --- | --- |
| Project markers: `package.json`, lock files, `tsconfig.json`, app config | Before choosing APIs or folders |
| Existing components, routes, and hooks in the same feature area | Before adding a new pattern |
| Installed framework docs (for example `node_modules/next/dist/docs/` in a Next.js repo) | The task uses version-specific APIs |
| `{client_root}/rules/i18n-support.mdc` | User-facing strings |
| `{client_root}/rules/friendly-language.mdc` | Interface copy, errors, or Markdown the user reads |
| `{client_root}/rules/common-test-strategy.mdc` | The user asks for tests during implementation |
| This skill folder `next-cache-components.md` | Next.js and `cacheComponents: true` in config |

When a rule file is absent, the Limits below still apply.

## Tools

Use what the repo already uses. Defaults apply only when the repo has no choice yet.

| Concern | Default | Escape hatch |
| --- | --- | --- |
| React UI | React with TypeScript | The project's existing JavaScript or UI library |
| Next.js app | App Router, Server Components first | Pages Router or another framework already in the repo |
| Styling | What the project uses (Tailwind, CSS modules, etc.) | Do not add a second styling system for one screen |
| Forms | Project form library, or native form plus server validation | User names a library |
| Client fetch | Server Components and server actions when on Next.js | React Query, SWR, or fetch patterns already in the repo |

## Implementation plan (before large writes)

When the change spans several files or the user asked for a plan first, send one message:

- **Scope:** {screen or component}
- **Stack:** {framework and libraries from the repo}
- **Files to touch:** {paths or `discover from tree`}
- **Data:** {read, write, or none}
- **States:** loading, empty, error, success
- **i18n:** keys only, or not applicable

Wait for confirm before creating many new files. When the user asked to implement directly, skip the plan unless the thread is ambiguous.

## File names

When the skill writes a file, use the name or path the user gives. Otherwise follow the project's existing folder layout and naming.

## Limits

- Do not hard-code a framework version, port, or library when the user or the repo names one.
- Do not require a sprint backlog, `artifacts-map.json`, or process files to run.
- Do not load **frontend-designer** for pure bugfix or token tweaks unless the user wants a new visual direction.
- Do not load **testing-expert** unless the user asks for tests, a test strategy, or a test run.
- Do not load **webapp-testing** or another testing skill for verification.
- Put user-facing strings behind the project i18n API when i18n exists. When the project has no i18n yet, add the minimal i18n setup with the first shippable screen, or ask the user.
- Do not mark a backlog row Done or write process files unless the user asks.
- Read secrets from environment variables or the project secret store. Secrets stay out of client bundles, logs, and responses meant for the browser.

## Anti-patterns

- A new screen with hard-coded English as the product contract when i18n is required.
- A client component that duplicates a fetch the server already performed.
- Layout-only CSS selectors as the primary test or automation hook.
- A second UI framework or global state library for one feature.
- Mock data left in production paths after wiring the real API.

## Optional SDD harness

When the project uses the framework pack and the current task is one sprint backlog item, `sdd-spec-to-build` may load this skill for UI implementation. The skill runs without that load.
