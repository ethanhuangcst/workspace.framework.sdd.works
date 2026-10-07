# Test strategy — [product name]

> **Purpose**: Product-wide quality bar: baseline extension, pyramid, tools, environments, CI policy, and named critical journeys. Optional / JIT (not a required process artifact).
> **Practices**: [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) (what, how, when).
> **Framework**: [`scrum-in-sdd.md`](./scrum-in-sdd.md) (names and meaning).

This file is the **product-level test strategy** only. It states what the whole product must prove and how layers and CI behave. **Detailed test plans, scenario lists, and case-level mapping** (stories, files, Gherkin, per-layer assertions) live in module **`{stem}-tests.md`** files from `{workspace}/artifacts-map.json`. Do not duplicate those cases here; link the module spec and keep this document at policy depth.

| Spec | Role |
| --- | --- |
| **common-test-strategy** (agent rule) | Baseline pyramid, TDD, quality checklist |
| [`test-strategy.md`](./test-strategy.md) | Product-wide gates, tools, CI vs acceptance closure |
| [`{module}/{stem}-tests.md`](./[module]/[stem]-tests.md) | Module test plan and cases (replace path from map) |
| [`architecture.md`](./architecture.md) | Services, boundaries, deploy shape |
| [`release.md`](./release.md) | Post-deploy smoke paths |

Align with [`architecture.md`](./architecture.md). Acceptance criteria in `{stem}-stories.md` drive cases in `{stem}-tests.md`; this file does not restate AC.

## 1. Baseline

| Item | This product |
| --- | --- |
| Extends **common-test-strategy** | **Yes** |
| Weakens pyramid or quality checklist | **No** |
| Conflict resolution | **Stricter** interpretation wins |
| Coverage (when measurable) | Changed critical path **100%**; overall **≥ 80%** unless a row in §2 sets stricter |

Project rules and every `{stem}-tests.md` must **comply with** the baseline. They may add stricter gates; they must not remove layers or lower the checklist.

## 2. Product-specific deltas

List only what differs from **common-test-strategy** for this product. Leave rows as bracket placeholders until the team agrees.

| Area | This project |
| --- | --- |
| Services under test | [Example: one web app] or [Example: web, agent, RAG as separate packages] |
| Unit / integration / E2E tools | [Example: Vitest, Testing Library, Playwright] |
| CI default | Fixture-only; no paid or live vendor keys on every PR |
| Acceptance closure | [Example: MVP batch or go-live checklist] may require live deps on the demo path |
| Critical journeys | [Name 1–3 paths; detail in `{stem}-tests.md`] |
| Latency budgets (optional) | [Example: P95 ≤ N s for agent task under fixture] |
| i18n assertions | Prefer `role`, `data-testid`, or message keys; not single-locale copy as the contract |

## 3. Test goals

State outcomes the **product** must prove. Module `{stem}-tests.md` files break these into cases.

1. **[Example: Correctness]** [Domain facts match upstream or DB; no fabricated success when a dependency failed.]
2. **[Example: Tenancy or auth]** [Cross-tenant or cross-user data never leaks; revoked credentials fail closed.]
3. **[Example: Agent or LLM boundary]** [Structured outputs pass schema validation; failures use stable codes or message keys.]
4. **[Example: RAG or retrieval]** [Hits are traceable; empty or degraded paths are explicit, not silent invention.]
5. **[Example: Deployability]** [Health and smoke paths match [`release.md`](./release.md).]

Add or remove goals when the architecture has no agent, RAG, or multi-tenant surface.

## 4. CI default vs acceptance closure

Separate **daily CI** from **acceptance** for the current MVP or release slice.

| Activity | Stub / fixture / mock | Real dependencies on the demo path |
| --- | --- | --- |
| PR / default CI | **Allowed** for determinism and cost | Not required |
| Acceptance closure for the slice | **Must not** pretend a declared integration is live | **Required** for each dependency that slice uses in demo |

Rules:

1. **Green CI does not by itself close acceptance** when this table applies.
2. **Runtime degradation** after a real integration exists is allowed; **never wired** is not.
3. Run closure checks in an opt-in job, manual script, or checklist; keep default PR jobs fixture-first unless the team promotes a live job.

## 5. Pyramid and tools

Target mix matches the baseline: about **70% / 20% / 10%** (unit or component, integration or contract, E2E). Approximate per **deployable unit** when the product has more than one service.

| Layer | [Example: Web] | [Example: Agent / MCP] | [Example: RAG / worker] |
| --- | --- | --- | --- |
| Unit / component | [Vitest + Testing Library] | [Vitest or pytest] | [Same as agent column] |
| Integration / contract | [Test DB; HTTP to sibling services stubbed in CI] | [Schema tests; stub LLM in CI] | [Fixture index; stub embedder in CI optional] |
| E2E | [Playwright, real browser] | [HTTP journey or covered via web BFF] | [API smoke or indirect via agent journey] |

**Commands** (document in the app repo): [Example: `npm test`, `npm run test:e2e`, `make test`.]

**E2E and dynamic web apps**

- Use a **real browser** (Playwright or project equivalent).
- Wait for **rendered state** (`networkidle` or a stable selector) before assert or click.
- Prefer **role**, accessible name, **data-testid**, or message keys over layout-only CSS.
- Static HTML may use `file://` for smoke; dynamic apps use **`make dev`**, **`make up`**, or the project Playwright `webServer` config.
- Ad-hoc checks may use a **`with_server`** helper when the repo documents one; the committed suite should match the project language and CI.

Case lists and file paths belong in `{stem}-tests.md`, not in this section.

## 6. Environments and data

| Environment | Purpose |
| --- | --- |
| Local | **`make up`** or **`make dev`**; optional real keys in operator-owned env files |
| CI | Isolated test database or schema; fixture vendor mode when applicable |
| Online (optional) | Live LLM, maps, or email sandbox; nightly or pre-release only |

**Data rules**

- Per-test isolation: transactions, truncate, unique prefixes, or disposable schemas.
- No production data in automation; secrets only in CI secret store or gitignored env files.
- Names of required env vars may appear here; **values never** in specs or git.

## 7. External dependencies (CI vs closure)

When the product calls LLMs, maps, email, or other paid APIs, state policy at product level. Per-tool stub rules and assertions stay in `{stem}-tests.md`.

| Dependency | Default CI | Acceptance closure when slice uses it |
| --- | --- | --- |
| [Example: LLM chat / embed] | Stub or fake client | Real provider or approved sandbox |
| [Example: Primary database] | Test instance or schema | Same engine; dedicated test or staging DB name |
| [Example: Vector store] | Test collection or container | Real service in closure when RAG is in scope |
| [Example: Agent → RAG HTTP] | Stub allowed in CI | Real HTTP between services on closure path |

**Optional opt-in quality (not default PR)**

- Model or vision **eval** suites, smoke scripts, and latency probes live in the repo and run on demand.
- Thresholds and datasets are documented in `{stem}-tests.md` or a linked knowledge note; this file only states that eval **does not** replace fixture CI unless promoted.

## 8. Stricter rules (relative to baseline)

Keep bullets short; expand in module test specs.

1. [Example: Every agent task JSON has contract tests for success and failure shapes.]
2. [Example: Browser E2E does not call MCP or internal service ports directly; only the app origin.]
3. [Example: UI tests do not assert English-only strings when the product is i18n-key based.]
4. [Example: Cross-service CI may stub HTTP; closure for a slice uses real peers on the demo path.]

## 9. Module test specs

Each module owns **`{stem}-tests.md`**: scenarios, automation mapping, fixtures, and opt-in eval detail. The product backlog and sprint backlog link those files when tests are in scope for a PBI or SBI.

| Module (from map) | Test spec |
| --- | --- |
| [`[module]/[stem]-tests.md`](./[module]/[stem]-tests.md) | [One-line scope, example: web UI and BFF] |
| [`[module]/[stem]-tests.md`](./[module]/[stem]-tests.md) | [Example: agent tools and harness] |

When the product splits UI and MCP heavily, the team may add a second product-level file (for example `mcp-test-strategy.md`) **only** if both share the same baseline; otherwise keep one `test-strategy.md` and split cases across `{stem}-tests.md` files.

## 10. Secrets and honesty

- Do not embed API keys, passwords, or production URLs in this file or in `{stem}-tests.md`.
- Tests must not pass by mocking away behavior that acceptance claims is live for the current slice.
- Errors shown to users follow i18n keys; automation follows §5 selector rules.
