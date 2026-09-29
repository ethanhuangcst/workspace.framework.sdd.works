# sprint-backlog — [product name]

> **Purpose**: Short-cycle execution list — what to do, what is blocked, and how to accept it.
> **Example**: Pokymon Card Collection. After you copy this file, replace the product name and the items.
> **Single source of truth for schedule and status**: this file. The `Sprint` column in `product-backlog.md` is a projection of this file.
> **Related**: [`architecture.md`](./architecture.md) · [`deployment.md`](./deployment.md) · [`artifacts-map.md`](./artifacts-map.md) · [`scrum-in-sdd.md`](./scrum-in-sdd.md) · [`status.md`](./status.md)
> **Numbering**: `#` is the row’s place in that table, from 1 to n. It changes when the row moves. `Code` is the second column, between `#` and `SBI`. `Code` stays. `Code` is the Type plus a two-digit number inside that sprint, such as `feature-01` or `task-01`. Feature, Research, Bug-fix, Documentation, and Task are defined in [`framework-design.md`](../../framework-design.md). A seed is a Feature. When citing another document, prefer the item name.
> **Practices**: [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) (what, how, when: jobs, templates, table conventions).
> **Framework**: [`scrum-in-sdd.md`](./scrum-in-sdd.md) (names and meaning).
> **as_of**: 2026-09-24

---

## RID Registry (Risks / Impediments / Dependencies)

> This section records risks, impediments, and dependencies only. It does not belong to any sprint.

| # | Severity | Type | Title | Description | Impact | Solution (→ product-backlog) | Related docs | Handling note | Status | Updated |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **R1** | **High** | Risk | The same card is cataloged twice | If set + card number is not unique, search and inventory treat one card as two. | Quantity and trade records no longer match. | [Collect-01 Catalog a card](./product-backlog.md#pb-1) | [Sprint 1 feature-01](#s1-feature-01) · [`architecture.md`](./architecture.md) §2 | The unique constraint landed in Sprint 1. A production data check remains for go-live. | Open | 2026-09-21 |
| **D1** | **Blocking** | Dependency | Unique card-number constraint | The database is unique on (collector, set, card number). | Without the constraint, a duplicate catalog is not rejected. | [Collect-01 Catalog a card](./product-backlog.md#pb-1) | [Sprint 1 feature-01](#s1-feature-01) · [`architecture.md`](./architecture.md) §2 | Implemented locally, with a duplicate-catalog test. | Implemented | 2026-09-21 |

> **Severity**: **Critical** = fails without an error and exposes another person’s data; **Blocking** = must be solved before go-live; **High** = one failure makes inventory wrong; **Medium** = affects the ability to check the result.
> **Type**: risk = a failure that might happen; impediment = a block that has already happened; dependency = the work required to close a risk.

### RID coverage

| RID | Solution (Backlog item) | Acceptance criteria and design/test location | Sprint location |
|---|---|---|---|
| R1 | [Collect-01 Catalog a card](./product-backlog.md#pb-1) | [Collect-01 Catalog a card](./product-backlog.md#pb-1) · [`architecture.md`](./architecture.md) §2 | [Sprint 1 feature-01](#s1-feature-01) |
| D1 | [Collect-01 Catalog a card](./product-backlog.md#pb-1) | [Collect-01 Catalog a card](./product-backlog.md#pb-1) · [`architecture.md`](./architecture.md) §2 | [Sprint 1 feature-01](#s1-feature-01) |

---

## Sprint 1

Sprint Goal: A collector can catalog a card on this machine, and the same card does not appear as two records.

**Status: Done** (every item is complete)

### ToDo

| # | Code | SBI | Parent PBI | Module/Type | DoD | Related specs | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | <a id="s1-task-01"></a>task-01 | Local startup | [Local-01 Local startup](./product-backlog.md#pb-6) | Runtime/Task | - Follow rule DoD<br>- Feature confirmed usable by user<br>- Acceptance criteria (story mapping spec names with links) passed<br>- Quality meets [quality standard](./scrum-in-sdd.md#commitment-definition-of-done) | [`deployment.md`](./deployment.md) §1 | Done |
| 2 | <a id="s1-task-02"></a>task-02 | Scope gate | [Scope-01 Scope gate](./product-backlog.md#pb-5) | Product/Task | - Follow rule DoD<br>- Feature confirmed usable by user<br>- Acceptance criteria (story mapping spec names with links) passed<br>- Quality meets [quality standard](./scrum-in-sdd.md#commitment-definition-of-done) | [`architecture.md`](./architecture.md) §1 | Done |
| 3 | <a id="s1-feature-01"></a>feature-01 | Catalog a card | [Collect-01 Catalog a card](./product-backlog.md#pb-1) | Collection/Feature | - Follow rule DoD<br>- Feature confirmed usable by user<br>- Acceptance criteria (story mapping spec names with links) passed<br>- Quality meets [quality standard](./scrum-in-sdd.md#commitment-definition-of-done) | [`architecture.md`](./architecture.md) §2 | Done |

### Retrospective

Learnings:

[Sep 21, 2026], feature-01 completed

- [A unique constraint belongs in the acceptance criteria](./architecture.md)

Opportunities:

[Sep 21, 2026], Sprint 1 closed

- Empty-state copy should come from the message catalog, not be hard-coded in the page.

---

## Sprint 2

Sprint Goal: A collector can find their own cards by set or rarity, place a card in a binder, and record one trade.

**Status: WIP**

### ToDo

| # | Code | SBI | Parent PBI | Module/Type | DoD | Related specs | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | <a id="s2-feature-01"></a>feature-01 | Search by set and rarity | [Collect-02 Search by set and rarity](./product-backlog.md#pb-2) | Collection/Feature | - Follow rule DoD<br>- Feature confirmed usable by user<br>- Acceptance criteria (story mapping spec names with links) passed<br>- Quality meets [quality standard](./scrum-in-sdd.md#commitment-definition-of-done) | — | WIP |
| 2 | <a id="s2-feature-02"></a>feature-02 | Binder | [Collect-03 Binder](./product-backlog.md#pb-3) | Collection/Feature | - Follow rule DoD<br>- Feature confirmed usable by user<br>- Acceptance criteria (story mapping spec names with links) passed<br>- Quality meets [quality standard](./scrum-in-sdd.md#commitment-definition-of-done) | [`architecture.md`](./architecture.md) §2 | ToDo |
| 3 | <a id="s2-feature-03"></a>feature-03 | Record a trade | [Collect-04 Record a trade](./product-backlog.md#pb-4) | Collection/Feature | - Follow rule DoD<br>- Feature confirmed usable by user<br>- Acceptance criteria (story mapping spec names with links) passed<br>- Quality meets [quality standard](./scrum-in-sdd.md#commitment-definition-of-done) | — | ToDo |

### Retrospective

Learnings:

—

Opportunities:

—
