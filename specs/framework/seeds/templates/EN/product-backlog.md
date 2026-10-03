# Product overview — [product name]

> **Purpose**: Record what the product must do, where the boundary is, and how to accept it.
> **Example**: Pokymon Card Collection. After you copy this file, replace the product name and the items.
> **Status**: v1.0 · as_of 2026-09-24
> **Related**: [`architecture.md`](./architecture.md) · [`deployment.md`](./deployment.md) · [`sprint-backlog.md`](./sprint-backlog.md) · `artifacts-map.json` · [`status.md`](./status.md)
> **Practices**: [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) (what, how, when: jobs, templates, table conventions).
> **Framework**: [`scrum-in-sdd.md`](./scrum-in-sdd.md) (names and meaning).
> **Schedule**: The `Sprint` column is a projection of [`sprint-backlog.md`](./sprint-backlog.md). Schedule changes belong in that file.

Pokymon Card Collection lets a collector catalog a card, place it in a binder, search by set or rarity, and record one trade. The cards are fictional Pokymon. The sample does not use a licensed brand.

## Index

- [Scope boundary](#scope-boundary)
- [Requirements](#requirements)
  - [Collect](#collect)
  - [Scope](#scope)
  - [Local](#local)
  - [Definition of Done](#definition-of-done)
- [Product Backlog](#product-backlog)
- [Change record](#change-record)

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

[Back to top](#index)

---------

# Requirements

> The requirement for each feature is the paragraph under that feature name. The Product Backlog table carries a short description, relations, the sprint projection, and status. Back-references use the PBI code and the item name. Feature lines are plain Markdown.
> `Category` is one word. `PBI Code` is that word plus a two-digit number. A file that already has its own row is not also a parent row.

---------

## Collect

- [Collect-01](#pb-1) Catalog a card
  The collector records name, set, card number, rarity, and quantity. Set plus card number is unique. Quantity can increase.
- [Collect-02](#pb-2) Search by set and rarity
  Search only the current collector’s cards. Filter by set or rarity.
- [Collect-03](#pb-3) Binder
  The collector creates a binder and places a card in it. The card still appears in the full catalog.
- [Collect-04](#pb-4) Record a trade
  Record the card given, the card received, and the date. Quantities change with the record.

[Back to top](#index)

---------

## Scope

- [Scope-01](#pb-5) Scope gate
  No payments, no public marketplace, and no licensed brand content.

[Back to top](#index)

---------

## Local

- [Local-01](#pb-6) Local startup
  The default configuration starts the app on this machine.

[Back to top](#index)

---------

## Definition of Done

Every Product Backlog item uses this checklist. Mark the row `Done` only when every check passes.

- Follow rule DoD
- Feature confirmed usable by user
- Acceptance criteria (story mapping spec names with links) passed
- Quality meets [quality standard](./scrum-in-sdd.md#commitment-definition-of-done)

[Back to top](#index)

---------

# Product Backlog

| Category | PBI Code | PBI | Description | Related | Sprint | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Collect | Collect-01 | Catalog a card | Record one card by set and number. | [Sprint 1 feature-01](./sprint-backlog.md#sprint-1) · [`architecture.md`](./architecture.md) §2 | Sprint 1 | Done |
| Collect | Collect-02 | Search by set and rarity | Search the current collector’s cards. | [Collect-01 Catalog a card](#pb-1) · [Sprint 2 feature-01](./sprint-backlog.md#sprint-2) | Sprint 2 | WIP |
| Collect | Collect-03 | Binder | Place a card in a named binder. | [Collect-01 Catalog a card](#pb-1) · [Sprint 2 feature-02](./sprint-backlog.md#sprint-2) · [`architecture.md`](./architecture.md) §2 | Sprint 2 | ToDo |
| Collect | Collect-04 | Record a trade | Record one given card and one received card. | [Collect-01 Catalog a card](#pb-1) · [Sprint 2 feature-03](./sprint-backlog.md#sprint-2) | Sprint 2 | ToDo |
| Scope | Scope-01 | Scope gate | No payments, marketplace, or licensed brand. | [`architecture.md`](./architecture.md) §1 | Sprint 1 | Done |
| Local | Local-01 | Local startup | Start with the default configuration. | [Sprint 1 task-01](./sprint-backlog.md#sprint-1) · [`deployment.md`](./deployment.md) §1 | Sprint 1 | Done |

[Back to top](#index)

---------

## Change record

| Date | Change |
| --- | --- |
| 2026-09-24 | English seed added so links from `sdd-scrum-practices.md` and `sprint-backlog.md` resolve. Example remains Pokymon Card Collection. |
| 2026-09-29 | Requirements sit under each feature name. Description is a short summary. The DoD column is removed. One Definition of Done checklist sits above the table. |
| 2026-09-29 | Row anchors sit on the feature name. Table cells are plain Markdown. |
| 2026-09-30 | Feature lines are plain Markdown. HTML anchors are not used. |
| 2026-09-30 | Requirements use tight lists: each requirement sits on the line after its feature name, with no blank line. See Writing markdown in `sdd-scrum-practices.md`. |
| 2026-09-30 | Sprint links use the sprint heading. The sprint backlog Code cell is plain Markdown. |

[Back to top](#index)
