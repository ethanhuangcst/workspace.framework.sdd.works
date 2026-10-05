# Test strategy — [product name]

> **Purpose**: Product-level test strategy at `{artifacts_root}/test-strategy.md`. Extends **common-test-strategy**; do not weaken it. Module specs use `{stem}-tests.md`. Optional / JIT (not a required process artifact).
> **Example**: Pokymon Card Collection.
> **Practices**: [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) (what, how, when).
> **Framework**: [`scrum-in-sdd.md`](./scrum-in-sdd.md) (names and meaning).

## 1. Baseline

This document **extends** the agent rule **common-test-strategy** (test pyramid, TDD, quality checklist). Project rules and module `{stem}-tests.md` files must **comply with** that baseline. They may add stricter gates; they must not remove layers or lower the checklist.

When this file and **common-test-strategy** conflict, use the **stricter** interpretation.

## 2. Product-specific deltas

List only what differs from the baseline for this product (environments, tools, latency budgets, critical journeys). Leave this section empty until the team agrees on deltas.

| Area | This project |
| --- | --- |
| Unit / integration / E2E mix | Same as common-test-strategy unless a row here says otherwise |
| CI | Fixture-only by default; live keys only in opt-in jobs |
| Critical journeys | Name the few paths that must have E2E or evidenced manual scripts |

## 3. Module specs

Each module keeps detailed cases in `{workspace}/{artifacts_root}/{folder}/{stem}-tests.md`. The product backlog and sprint backlog link those files where tests are in scope for a PBI or SBI.

## 4. Secrets and data

Use isolated test data. Do not use production data in automation. Secrets stay out of specs, client storage, and logs.
