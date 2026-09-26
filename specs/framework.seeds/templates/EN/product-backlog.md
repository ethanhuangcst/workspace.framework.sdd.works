# Product overview — [product name]

> **Purpose**: Record what the product must do, where the boundary is, and how to accept it.
> **Example**: Pokymon Card Collection. After you copy this file, replace the product name and the items.
> **Status**: v1.0 · as_of 2026-09-24
> **Related**: [`architecture.md`](./architecture.md) · [`deployment.md`](./deployment.md) · [`sprint-backlog.md`](./sprint-backlog.md) · [`artifacts-map.md`](./artifacts-map.md) · [`status.md`](./status.md)
> **Practices**: [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) (what, how, when: jobs, templates, table conventions).
> **Framework**: [`scrum-in-sdd.md`](./scrum-in-sdd.md) (names and meaning).
> **Schedule**: The `Sprint` column is a projection of [`sprint-backlog.md`](./sprint-backlog.md). Schedule changes belong in that file.

Pokymon Card Collection lets a collector catalog a card, place it in a binder, search by set or rarity, and record one trade. The cards are fictional Pokymon. The sample does not use a licensed brand.

---------
## Scope boundary

### What this product does

- A collector can catalog a card (name, set, rarity, quantity).
- A collector can place a card in a named binder.
- A collector can search their own cards by set or rarity.
- A collector can record one trade (card given, card received, date).

Acceptance: those four behaviors stay in scope. Any expansion is recorded here as an exception plus a date. → [Collect-01 Catalog a card](#pb-1) · [Collect-03 Binder](#pb-3) · [Collect-02 Search by set and rarity](#pb-2) · [Collect-04 Record a trade](#pb-4)

### Explicitly out of scope

- Payments and prices. The app does not sell cards.
- A public marketplace. A trade is a record on the collector’s own account.
- Licensed brand content. No real Pokémon names, images, or marks.

Acceptance: those limits stay in later reviews. → [Scope-01 Scope gate](#pb-5)

---------
# Requirements

> Executable detail, acceptance criteria, and status are in the Product Backlog table. Each requirement has a row. Back-references use the PBI code and the item name. The row anchor sits on the PBI Code cell.
> `Category` is one word. `PBI Code` is that word plus a two-digit number. A file that already has its own row is not also a parent row.

---------
## Local

- Start the app on this machine with the default configuration. → [Local-01 Local startup](#pb-6)

---------
## Collect

- **Catalog a card**: one record per set and card number. Quantity can increase. → [Collect-01 Catalog a card](#pb-1)
- **Search**: filter by set or rarity. Results are only the current collector’s cards. → [Collect-02 Search by set and rarity](#pb-2)
- **Binder**: a card can sit in one binder and still appear in the full catalog. → [Collect-03 Binder](#pb-3)
- **Trade**: record a card given and a card received. Quantities change with the record. → [Collect-04 Record a trade](#pb-4)

---------
# Product Backlog

| Category | PBI Code | PBI | Description | Acceptance criteria | Related | Sprint | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Collect | <a id="pb-1"></a>Collect-01 | Catalog a card | The collector records name, set, card number, rarity, and quantity. Set plus card number is unique. | A second catalog of the same set and card number increases quantity by 1 and does not add a row. An empty name is rejected. | [Sprint 1 feature-01](./sprint-backlog.md#s1-feature-01) · [`architecture.md`](./architecture.md) §2 | Sprint 1 | Done |
| Collect | <a id="pb-2"></a>Collect-02 | Search by set and rarity | Search only the current collector’s cards. | After a set filter, the list contains only that set. After a rarity filter, the list contains only that rarity. No matches shows an empty state. | [Collect-01 Catalog a card](#pb-1) · [Sprint 2 feature-01](./sprint-backlog.md#s2-feature-01) | Sprint 2 | WIP |
| Collect | <a id="pb-3"></a>Collect-03 | Binder | The collector creates a binder and places a card in it. | Placing a card in a binder and removing it does not change the quantity in the full catalog. | [Collect-01 Catalog a card](#pb-1) · [Sprint 2 feature-02](./sprint-backlog.md#s2-feature-02) · [`architecture.md`](./architecture.md) §2 | Sprint 2 | ToDo |
| Collect | <a id="pb-4"></a>Collect-04 | Record a trade | Record the card given, the card received, and the date. | Giving decreases quantity by 1. Receiving increases it by 1. Quantity 0 cannot be given. | [Collect-01 Catalog a card](#pb-1) · [Sprint 2 feature-03](./sprint-backlog.md#s2-feature-03) | Sprint 2 | ToDo |
| Scope | <a id="pb-5"></a>Scope-01 | Scope gate | No payments, no public marketplace, no licensed brand content. | The UI and the API have no prices, no matching with strangers, and no real brand names or marks. | [`architecture.md`](./architecture.md) §1 | Sprint 1 | Done |
| Local | <a id="pb-6"></a>Local-01 | Local startup | The default configuration starts on this machine. | After `make up`, the app opens, an empty collection is visible, and one catalog succeeds. | [Sprint 1 task-01](./sprint-backlog.md#s1-task-01) · [`deployment.md`](./deployment.md) §1 | Sprint 1 | Done |

---------

## Change record

| Date | Change |
| --- | --- |
| 2026-09-24 | English seed added so links from `sdd-scrum-practices.md` and `sprint-backlog.md` resolve. Example remains Pokymon Card Collection. |
