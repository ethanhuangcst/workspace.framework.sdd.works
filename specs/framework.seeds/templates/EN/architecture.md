# Architecture — [product name]

> **Purpose**: Record the stack and a small number of decisions. Product behavior belongs in [`product-backlog.md`](./product-backlog.md). Optional / JIT (not a required process artifact).
> **Example**: Pokymon Card Collection.
> **Practices**: [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) (what, how, when).
> **Framework**: [`scrum-in-sdd.md`](./scrum-in-sdd.md) (names and meaning).

## 1. Product shape

| Surface | Role | Who uses it |
| --- | --- | --- |
| Web app | Catalog cards, search, binders, record trades | Collector |

No payments, no public marketplace, and no licensed brand content. See [Scope gate](./product-backlog.md#pb-5).

## 2. Stack and one decision

| Category | Choice | Note |
| --- | --- | --- |
| App | Next.js · TypeScript | Example stack; replace if needed |
| Data | Postgres | One table each for cards, binders, and trades |

**Decision: one row per card. A binder is only a grouping.**

- The business key of a card is (collector, set, card number). Quantity is a field on that row.
- A binder does not copy the card. A card is placed in one binder through a relation. Removing it from the binder does not delete the card row.
- Do not keep a separate copy of the card list inside each binder. A copy would require two quantity updates on a trade.

Local startup is in [`deployment.md`](./deployment.md) §1.
