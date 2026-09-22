# Product overview — [product name]

> **Purpose**: Record what [product name] must do, where the boundary is, and how to accept it.
> **Example**: This file is filled in for **Pokymon Card Collection**. After you copy it, replace the product name, items, and acceptance criteria with the real product.
> **Status**: v1.0 · as_of 2026-09-21
> **Related**: [`architecture.md`](./architecture.md) · [`deployment.md`](./deployment.md) · [`sprint-backlog.md`](./sprint-backlog.md) · [`artifacts-map.md`](./artifacts-map.md) · [`status.md`](./status.md)
> **Practices**: [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) (what, how, when: jobs, templates, table conventions).
> **Framework**: [`sdd-scrum-guide.md`](./sdd-scrum-guide.md) (names and meaning).
> **Schedule**: The `Sprint` column in the backlog table at the end is a projection of [`sprint-backlog.md`](./sprint-backlog.md). Schedule changes belong in that file.

Pokymon Card Collection is an app a collector uses to catalog cards, place them in binders, search by set or rarity, and record trades. The cards are fictional “Pokymon”. The sample does not claim any licensed brand.

---------
## Scope boundary

### What this product does

- A collector can catalog a card (name, set, rarity, quantity).
- A collector can place a card in a named binder.
- A collector can search their own collection by set or rarity.
- A collector can record a trade (card given, card received, date).

Acceptance: those four behaviors stay in scope in later reviews. Any expansion is registered here as “exception + date” → [Backlog “Catalog a card”](#pb-1) · [Backlog “Binder”](#pb-3) · [Backlog “Search”](#pb-2) · [Backlog “Record a trade”](#pb-4)

### Explicitly out of scope

- **Payments and prices** — no selling cards, no prices.
- **A public marketplace** — a trade is recorded only on the collector’s own account. The app does not match strangers.
- **Licensed brand content** — no real Pokémon names, art, or trademarks.

Acceptance: those items stay unchanged in later reviews → [Backlog “Scope gate”](#pb-5)

---------
# Requirements

> This section states what is needed. Executable detail, acceptance criteria, and status are in the Product Backlog at the end.
> Every requirement must have a matching backlog item. Back-references prefer the item name and use the number only as a locator.

---------
## [Local] Local startup

- Start the app on this machine with the default configuration, as a baseline for later checks. → [Backlog “Local startup”](#pb-6)

---------
## [Collection] Catalog, search, binder, trade

- **Catalog a card**: one record per card (set + card number). Quantity may increase. → [Backlog “Catalog a card”](#pb-1)
- **Search**: filter by set or rarity. Return only the current collector’s cards. → [Backlog “Search”](#pb-2)
- **Binder**: a card may be placed in one binder. A card that is not in a binder remains in the full catalog. → [Backlog “Binder”](#pb-3)
- **Trade**: record the card given and the card received. Quantities change with the trade. → [Backlog “Record a trade”](#pb-4)

---------
# Product Backlog

| # | Category | Parent | Title | Description | Acceptance criteria | Related | Sprint | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| <a id="pb-1"></a>1 | [Collection] | — | Catalog a card | The collector records name, set, card number, rarity, and quantity. Set + card number is unique. | A second catalog of the same set and card number increases quantity and does not create a second row. An empty name is rejected. | [Sprint 1 “Catalog a card”](./sprint-backlog.md#s1-catalog) · [`architecture.md`](./architecture.md) §2 | Sprint 1 | Done |
| <a id="pb-2"></a>2 | [Collection] | Catalog a card | Search by set and rarity | Search only the current collector’s cards. | After a set is chosen, the list contains only that set. After a rarity is chosen, the list contains only that rarity. No matches shows an empty state. | [Sprint 2 “Search”](./sprint-backlog.md#s2-search) | Sprint 2 | WIP |
| <a id="pb-3"></a>3 | [Collection] | Catalog a card | Binder | The collector creates a binder and places cards in it. | After a card is placed in a binder it still appears in the full catalog. Removing it from the binder does not change the catalog quantity. | [Sprint 2 “Binder”](./sprint-backlog.md#s2-binder) · [`architecture.md`](./architecture.md) §2 | Sprint 2 | ToDo |
| <a id="pb-4"></a>4 | [Collection] | Catalog a card | Record a trade | Record the card given, the card received, and the date. | Giving a card decreases its quantity by 1. Receiving a card increases that card’s quantity by 1. A card at quantity 0 cannot be given. | [Sprint 2 “Record a trade”](./sprint-backlog.md#s2-trade) | Sprint 2 | ToDo |
| <a id="pb-5"></a>5 | [Scope] | — | Scope gate | No payments, no public marketplace, no licensed brand content. | The UI and API have no prices, no stranger matching, and no real brand names or trademark art. | [`architecture.md`](./architecture.md) §1 | Sprint 1 | Done |
| <a id="pb-6"></a>6 | [Local] | — | Local startup | The app starts on this machine with the default configuration. | After `make up`, the app shows an empty collection and one card can be cataloged. | [Sprint 1 “Local startup”](./sprint-backlog.md#s1-local) · [`deployment.md`](./deployment.md) §1 | Sprint 1 | Done |

---------

## Change record

| Date | Change |
| --- | --- |
| 2026-09-21 | Template landed: six backlog items filled in for Pokymon Card Collection as a copyable example. |
