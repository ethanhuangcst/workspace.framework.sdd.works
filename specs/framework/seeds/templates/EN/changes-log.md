# Changes log ([product name])

> Conclusion record. An entry is written when a change is done. It states what changed, why, and how it was verified.
> An open defect stays in [`issues-log.md`](./issues-log.md). A concluded fix still gets an entry here.
> Days are `## YYYY-MM-DD`, newest day first. Under a day, the newest entry is first.
> Each entry is a `###` title, then **Why**, **What changed**, and **Verification**. **Boundary** is present only when the entry must say what it does not cover.
> Each of those labels is one short paragraph. **What changed** names the files and the backlog or sprint item when one exists. **Verification** names the check that passed.
> Step-by-step detail stays in git and in the spec that owns the change. Do not put secrets here.
> **Example**: Pokymon Card Collection. After you copy this file, remove the sample entries and keep only real changes.
> **Practices**: [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) (what, how, when).
> **Framework**: [`scrum-in-sdd.md`](./scrum-in-sdd.md) (names and meaning).

---

## 2026-09-21

### Search does set first; rarity stays in this sprint

**Why**: Doing both filters at once would mix the empty state and the combined condition into one acceptance check.

**What changed**: Sprint 2 [Search](./sprint-backlog.md#sprint-2) stays WIP. The set filter can be demonstrated. The rarity filter is the unfinished part of the same item. It is not a new item.

**Verification**: After a set is chosen, the list contains only that set. Rarity is not asserted yet.

**Boundary**: This does not change the uniqueness rule in [Catalog a card](./product-backlog.md#pb-1).

### Catalog a card is unique on set + card number

**Why**: If the same card can exist as two records, search counts and trades will both be wrong.

**What changed**: The card table is unique on (collector, set, card number). A second catalog increases quantity by 1. The decision is in [`architecture.md`](./architecture.md) §2. Product Backlog [Catalog a card](./product-backlog.md#pb-1) and Sprint 1 [Catalog a card](./sprint-backlog.md#sprint-1) are Done.

**Verification**: The duplicate-catalog test passed. After the second submit there is still one row, and the quantity is 2.

**Boundary**: This does not merge duplicate rows already stored. That is a data task before go-live, and it is not part of this entry.
