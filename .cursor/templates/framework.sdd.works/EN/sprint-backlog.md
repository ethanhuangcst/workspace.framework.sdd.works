# sprint-backlog — [product name]

> **Purpose**: Short-cycle execution list — what to do, what is blocked, and how to accept it.
> **Example**: Pokymon Card Collection. After you copy this file, replace the product name and the items.
> **Single source of truth for schedule and status**: this file. The `Sprint` column in `product-backlog.md` is a projection of this file.
> **Related**: [`architecture.md`](./architecture.md) · [`deployment.md`](./deployment.md) · [`artifacts-map.md`](./artifacts-map.md) · [`sdd-scrum-guide.md`](./sdd-scrum-guide.md) · [`status.md`](./status.md)
> **Numbering**: `#N` is the item number inside that sprint. When citing another document, prefer the item name.
> **Practices**: [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) (what, how, when: jobs, templates, table conventions).
> **Framework**: [`sdd-scrum-guide.md`](./sdd-scrum-guide.md) (names and meaning).
> **as_of**: 2026-09-22

---

## RID Registry (Risks / Impediments / Dependencies)

> This section records risks, impediments, and dependencies only. It does not belong to any sprint.

| # | Severity | Type | Title | Description | Impact | Solution (→ product-backlog) | Related docs | Handling note | Status | Updated |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **R1** | **High** | Risk | The same card is cataloged twice | If set + card number is not unique, search and inventory treat one card as two. | Quantity and trade records no longer match. | [Catalog a card](./product-backlog.md#pb-1) | [Sprint 1 “Catalog a card”](#s1-catalog) · [`architecture.md`](./architecture.md) §2 | The unique constraint landed in Sprint 1. A production data check remains for go-live. | Open | 2026-09-21 |
| **D1** | **Blocking** | Dependency | Unique card-number constraint | The database is unique on (collector, set, card number). | Without the constraint, a duplicate catalog is not rejected. | [Catalog a card](./product-backlog.md#pb-1) | [Sprint 1 “Catalog a card”](#s1-catalog) · [`architecture.md`](./architecture.md) §2 | Implemented locally, with a duplicate-catalog test. | Implemented | 2026-09-21 |

> **Severity**: **Critical** = fails without an error and exposes another person’s data; **Blocking** = must be solved before go-live; **High** = one failure makes inventory wrong; **Medium** = affects the ability to check the result.
> **Type**: risk = a failure that might happen; impediment = a block that has already happened; dependency = the work required to close a risk.

### RID coverage

| RID | Solution (Backlog item) | Acceptance criteria and design/test location | Sprint location |
|---|---|---|---|
| R1 | [Catalog a card](./product-backlog.md#pb-1) | [Catalog a card acceptance criteria](./product-backlog.md#pb-1) · [`architecture.md`](./architecture.md) §2 | [Sprint 1 “Catalog a card”](#s1-catalog) |
| D1 | [Catalog a card](./product-backlog.md#pb-1) | [Catalog a card acceptance criteria](./product-backlog.md#pb-1) · [`architecture.md`](./architecture.md) §2 | [Sprint 1 “Catalog a card”](#s1-catalog) |

---

## Sprint 1

Sprint Goal: A collector can catalog a card on this machine, and the same card does not appear as two records.

**Status: closed** (every item is complete)

### ToDo

| # | Item | Category | Module | Acceptance criteria | Related docs | Note | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| <a id="s1-local"></a>1 | Local startup | Task | Runtime | After `make up`, the app opens and an empty collection is visible. | [Local startup](./product-backlog.md#pb-6) · [`deployment.md`](./deployment.md) §1 | The local stack starts. | Done |
| <a id="s1-catalog"></a>2 | Catalog a card | Task | Collection | A second catalog of the same set and card number increases quantity by 1 and does not add a row. | [Catalog a card](./product-backlog.md#pb-1) · [`architecture.md`](./architecture.md) §2 | Unique constraint and duplicate-catalog test passed. | Done |
| 3 | Scope gate | Task | Product | No prices, no public marketplace, no real brand names. | [Scope gate](./product-backlog.md#pb-5) · [`architecture.md`](./architecture.md) §1 | Sample copy uses Pokymon only. | Done |

### Retrospective

**What went well**

- We fixed “one card, one record” before search, so the primary key did not have to change later.

**What to improve**

- Empty-state copy should come from the message catalog, not be hard-coded in the page.

**What we learned**

- A unique constraint belongs in the acceptance criteria, not only in a database comment.

---

## Sprint 2

Sprint Goal: A collector can find their own cards by set or rarity, place a card in a binder, and record one trade.

**Status: in progress**

### ToDo

| # | Item | Category | Module | Acceptance criteria | Related docs | Note | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| <a id="s2-search"></a>1 | Search by set and rarity | Task | Collection | After filtering, the list contains only matches. No matches shows an empty state. | [Search](./product-backlog.md#pb-2) | Set filter can be demonstrated. Rarity filter is not done. | WIP |
| <a id="s2-binder"></a>2 | Binder | Task | Collection | Placing a card in a binder and removing it does not change the quantity in the full catalog. | [Binder](./product-backlog.md#pb-3) · [`architecture.md`](./architecture.md) §2 | — | ToDo |
| <a id="s2-trade"></a>3 | Record a trade | Task | Collection | Giving decreases quantity by 1. Receiving increases it by 1. Quantity 0 cannot be given. | [Record a trade](./product-backlog.md#pb-4) | — | ToDo |

### Retrospective

**What went well**

- —

**What to improve**

- —

**What we learned**

- —
