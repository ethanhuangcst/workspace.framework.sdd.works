# Test strategy — framework.sdd.works

> **Purpose**: Product-level test strategy. Extends **common-test-strategy**; do not weaken it. Module specs use `{stem}-tests.md`.
> **Practices**: [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) (what, how, when).
> **Framework**: [`scrum-in-sdd.md`](./framework/seeds/templates/EN/scrum-in-sdd.md) (names and meaning).

## 1. Baseline

This document extends the agent rule **common-test-strategy**. [`framework-tests.md`](./framework/framework-tests.md) and module `{stem}-tests.md` files must comply with that baseline and may add stricter gates.

## 2. Product-specific deltas

| Area | This project |
| --- | --- |
| Unit / integration / E2E | Vitest for `src/`; CE cases in [`framework-tests.md`](./framework/framework-tests.md) are manual or fixture-driven contract checks |
| CI | Default pipeline fixture-only; live third parties opt-in |
| Critical journeys | MCP install/update, admin portal auth and keys, public instructions Features tab |

## 3. Module specs

Framework module: [`framework-tests.md`](./framework/framework-tests.md). Admin portal: [`app-tests.md`](./admin-portal/app-tests.md). MCP: [`mcp-tests.md`](./mcp/mcp-tests.md).

## 4. Secrets and data

No secrets in specs or client-visible surfaces. Test keys and fixtures only in approved env or CI secrets.
