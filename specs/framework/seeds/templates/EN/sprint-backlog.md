# sprint-backlog, Pokymon Card Collection

> Type: Framework (process) artifact of Pokymon Card Collection
> as_of: 2026-10-01
> [Definition](./sdd-scrum-practices.md#definition-of-sprint-backlogmd)

## Current project progress

- Total sprints: 2
- Current WIP sprint: [**Sprint 2**](#sprint-2). Click the link to jump to Sprint 2.
- Sprint goal: A collector can find their own cards by set or rarity, place a card in a binder, and record one trade.

### Index

- [RID Log](#rid-log-risksimpediments-dependencies)
- [Sprint 1](#sprint-1)
- [Sprint 2](#sprint-2)

---

## RID Log (Risks,Impediments, Dependencies)

[Back to the top](#sprint-backlog-pokymon-card-collection)

> This section records risks, impediments, and dependencies for the entire project. It does not belong to any sprint.

### Open RIDs

| # | Severity | Title | Description | Impact | Solution | Related | Created Sprint |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R-1 | High | The same card can be cataloged twice | - Set and card number are not unique.<br>- Search and inventory then treat one card as two. | Collect-01 cannot be delivered, because quantity and trades no longer match. | Reject a second record for the same collector, set, and card number. | [architecture.md](./architecture.md) Architecture | Sprint 1 |

### Closed RIDs

| # | Severity | Title | Description | Impact | Solution | Related | Closed Sprint |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D-1 | Blocking | The card number is unique per collector and set | - The database is unique on collector, set, and card number.<br>- A duplicate catalog is rejected. | Collect-01 can be delivered. A second record for the same card does not land. | Keep the unique constraint, and test a duplicate catalog. | [architecture.md](./architecture.md) Architecture | Sprint 1 |

---

## Definition of Done

Every sprint item uses this checklist. Mark the row `Done` only when every check passes.

- Follow rule DoD
- Feature confirmed usable by user
- Acceptance criteria (story mapping spec names with links) passed
- Quality meets [Definition of Done](./scrum-in-sdd.md#commitment-definition-of-done)

Additional Done Criteria, on top of the Definition of Done, is the check for one row under that sprint. It does not add a table column.

---

## Sprint 1

[Back to the top](#sprint-backlog-pokymon-card-collection)

Sprint Goal: A collector can catalog a card on this machine, and the same card does not appear as two records.

**Status: Done** (every item is complete)

### **Done**

| # | Code | SBI | Parent PBI | Module/Type | Related specs | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | feature-01 | Cataloged card | [Collect-01 Catalog a card](./product-backlog.md#pb-1) | Collection/Feature | [`architecture.md`](./architecture.md) §2 | **Done** |
| 2 | task-02 | Scope gate | [Scope-01 Scope gate](./product-backlog.md#pb-5) | Product/Task | [`architecture.md`](./architecture.md) §1 | **Done** |
| 3 | task-01 | Local startup | [Local-01 Local startup](./product-backlog.md#pb-6) | Runtime/Task | [`deployment.md`](./deployment.md) §1 | **Done** |

### Retrospective

**Learnings**

#### 1. [Sep 21, 2026], feature-01 done

- [A unique constraint belongs in the acceptance criteria](./architecture.md)

**Opportunities**

No opportunity is recorded yet.

**Future actions**

#### 2. [Sep 21, 2026], Sprint-end

- Empty-state copy comes from the message catalog.

---

## Sprint 2

[Back to the top](#sprint-backlog-pokymon-card-collection)

Sprint Goal: A collector can find their own cards by set or rarity, place a card in a binder, and record one trade.

**Status: WIP**

### **WIP**

| # | Code | SBI | Parent PBI | Module/Type | Related specs | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | feature-01 | Found cards by set and rarity | [Collect-02 Search by set and rarity](./product-backlog.md#pb-2) | Collection/Feature | | **WIP** |
| 2 | feature-03 | Recorded trade | [Collect-04 Record a trade](./product-backlog.md#pb-4) | Collection/Feature | [Collect-04 Record a trade](./product-backlog.md#pb-4) | **ToDo** |
| 3 | feature-02 | Card placed in a binder | [Collect-03 Binder](./product-backlog.md#pb-3) | Collection/Feature | [`architecture.md`](./architecture.md) §2 | **ToDo** |

### Retrospective

**Learnings**

No learning is recorded yet.

**Opportunities**

No opportunity is recorded yet.

**Future actions**

No future action is recorded yet.
