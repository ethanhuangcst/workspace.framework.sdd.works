# Change log ([product name])

> This file records conclusion-level changes: what changed, why, and how it was verified.
> Step-by-step detail stays in `git log` and in each spec. This file does not replace any spec.
> Tracking artifact (not a second sprint backlog). See [`sdd-scrum-guide.md`](./sdd-scrum-guide.md).
> **Example**: Pokymon Card Collection. After you copy it, keep only real changes.
> **Practices**: [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) (what, how, when).
> **Framework**: [`sdd-scrum-guide.md`](./sdd-scrum-guide.md) (names and meaning).

---

## 2026-09-21

### Catalog a card is unique on set + card number

**Why**: If the same card can exist as two records, search counts and trades will both be wrong.

**What changed**: The card table is unique on (collector, set, card number). A second catalog increases quantity by 1. The decision is in [`architecture.md`](./architecture.md) §2. Product Backlog [Catalog a card](./product-backlog.md#pb-1) and Sprint 1 [Catalog a card](./sprint-backlog.md#s1-catalog) are Done.

**Verification**: The duplicate-catalog test passed. After the second submit there is still one row, and the quantity is 2.

**Boundary**: This does not merge duplicate rows already stored. That is a data task before go-live, and it is not part of this entry.

### Search does set first; rarity stays in this sprint

**Why**: Doing both filters at once would mix the empty state and the combined condition into one acceptance check.

**What changed**: Sprint 2 [Search](./sprint-backlog.md#s2-search) stays WIP. The set filter can be demonstrated. The rarity filter is the unfinished part of the same item. It is not a new item.

**Verification**: After a set is chosen, the list contains only that set. Rarity is not asserted yet.

**Boundary**: This does not change the uniqueness rule in [Catalog a card](./product-backlog.md#pb-1).
