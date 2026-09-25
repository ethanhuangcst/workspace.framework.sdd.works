# sprint-backlog — [product name]

> **Purpose**: Short-cycle execution list — what to do, what is blocked, and how to accept it.
> **Example**: Pokymon Card Collection. After you copy this file, replace the product name and the items.
> **Single source of truth for schedule and status**: this file. The `Sprint` column in `product-backlog.md` is a projection of this file.
> **Related**: [`architecture.md`](./architecture.md) · [`deployment.md`](./deployment.md) · [`artifacts-map.md`](./artifacts-map.md) · [`sdd-scrum-guide.md`](./sdd-scrum-guide.md) · [`status.md`](./status.md)
> **Numbering**: `Code` is the Type plus a two-digit number inside that sprint, such as `feature-01` or `task-01`. Feature, Research, Bug-fix, Documentation, and Task are defined in [`framework-design.md`](./framework-design.md). A seed is a Feature. When citing another document, prefer the item name.
> **Practices**: [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) (what, how, when: jobs, templates, table conventions).
> **Framework**: [`sdd-scrum-guide.md`](./sdd-scrum-guide.md) (names and meaning).
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

| Code | Parent PBI | Module | Type | SBI | Acceptance criteria | Related docs | Note | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| <a id="s1-task-01"></a>task-01 | [Local-01 Local startup](./product-backlog.md#pb-6) | Runtime | Task | Local startup | - After `make up`, the app opens and an empty collection is visible. | [`deployment.md`](./deployment.md) §1 | - The local stack starts. | Done |
| <a id="s1-task-02"></a>task-02 | [Scope-01 Scope gate](./product-backlog.md#pb-5) | Product | Task | Scope gate | - No prices, no public marketplace, no real brand names. | [`architecture.md`](./architecture.md) §1 | - Sample copy uses Pokymon only. | Done |
| <a id="s1-feature-01"></a>feature-01 | [Collect-01 Catalog a card](./product-backlog.md#pb-1) | Collection | Feature | Catalog a card | - A second catalog of the same set and card number increases quantity by 1 and does not add a row. | [`architecture.md`](./architecture.md) §2 | - Unique constraint and duplicate-catalog test passed. | Done |

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

| Code | Parent PBI | Module | Type | SBI | Acceptance criteria | Related docs | Note | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| <a id="s2-feature-01"></a>feature-01 | [Collect-02 Search by set and rarity](./product-backlog.md#pb-2) | Collection | Feature | Search by set and rarity | - After filtering, the list contains only matches.<br>- No matches shows an empty state. | — | - Set filter can be demonstrated.<br>- Rarity filter is not done. | WIP |
| <a id="s2-feature-02"></a>feature-02 | [Collect-03 Binder](./product-backlog.md#pb-3) | Collection | Feature | Binder | - Placing a card in a binder and removing it does not change the quantity in the full catalog. | [`architecture.md`](./architecture.md) §2 | — | ToDo |
| <a id="s2-feature-03"></a>feature-03 | [Collect-04 Record a trade](./product-backlog.md#pb-4) | Collection | Feature | Record a trade | - Giving decreases quantity by 1.<br>- Receiving increases it by 1.<br>- Quantity 0 cannot be given. | — | — | ToDo |

### Retrospective

Learnings:

—

Opportunities:

—
