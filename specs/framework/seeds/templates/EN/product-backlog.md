# Product overview — [product name]

> Type: Framework (process) artifact of Pokymon Card Collection
> as_of: 2026-10-04
> [Definition](./sdd-scrum-practices.md#product-backlogmd)

---

- Pokymon Card Collection lets a collector catalog a card, place it in a binder, search by set or rarity, and record one trade.
- The cards are fictional Pokymon.

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

Each item has a PBI code, one noun for the deliverable, and bullets the user can act on. The table uses the same code and the same noun. Requirements link the PBI code to the table row (`#pb-N`). The table links the PBI code to Requirements (`#req-pb-N`). Other files link to `#pb-N` only.

---------

## Collect

- <a id="req-pb-1"></a>[Collect-01](#pb-1) Catalog a card
  - The collector records name, set, card number, rarity, and quantity.
  - Set plus card number is unique.
  - Quantity can increase.
- <a id="req-pb-2"></a>[Collect-02](#pb-2) Search by set and rarity
  - Search only the current collector’s cards.
  - Filter by set or rarity.
- <a id="req-pb-3"></a>[Collect-03](#pb-3) Binder
  - The collector creates a binder and places a card in it.
  - The card still appears in the full catalog.
- <a id="req-pb-4"></a>[Collect-04](#pb-4) Record a trade
  - Record the card given, the card received, and the date.
  - Quantities change with the record.

[Back to top](#index)

---------

## Scope

- <a id="req-pb-5"></a>[Scope-01](#pb-5) Scope gate
  - No payments, no public marketplace, and no licensed brand content.

[Back to top](#index)

---------

## Local

- <a id="req-pb-6"></a>[Local-01](#pb-6) Local startup
  - The default configuration starts the app on this machine.

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

| # | Component | PBI Code | Description | Size | Related | Sprint | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Collect | <a id="pb-1"></a>[Collect-01](#req-pb-1) | Catalog a card | Implementable | - [Sprint 1 feature-01](./sprint-backlog.md#sprint-1)<br>- [`architecture.md`](./architecture.md) §2 | Sprint 1 | Done |
| 2 | Collect | <a id="pb-2"></a>[Collect-02](#req-pb-2) | Search by set and rarity | Implementable | - [Collect-01](#pb-1)<br>- [Sprint 2 feature-01](./sprint-backlog.md#sprint-2) | Sprint 2 | WIP |
| 3 | Collect | <a id="pb-3"></a>[Collect-03](#req-pb-3) | Binder | Implementable | - [Collect-01](#pb-1)<br>- [Sprint 2 feature-02](./sprint-backlog.md#sprint-2)<br>- [`architecture.md`](./architecture.md) §2 | Sprint 2 | ToDo |
| 4 | Collect | <a id="pb-4"></a>[Collect-04](#req-pb-4) | Record a trade | Implementable | - [Collect-01](#pb-1)<br>- [Sprint 2 feature-03](./sprint-backlog.md#sprint-2) | Sprint 2 | ToDo |
| 5 | Scope | <a id="pb-5"></a>[Scope-01](#req-pb-5) | Scope gate | Implementable | [`architecture.md`](./architecture.md) §1 | Sprint 1 | Done |
| 6 | Local | <a id="pb-6"></a>[Local-01](#req-pb-6) | Local startup | Implementable | - [Sprint 1 task-01](./sprint-backlog.md#sprint-1)<br>- [`release.md`](./release.md) §1 | Sprint 1 | Done |

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
| 2026-10-03 | Each Requirements item is the PBI code, one noun, and bullets. The table columns are `#`, Component, PBI Code, Description, Related, Sprint, Status. `#pb-1` stays Collect-01. |
| 2026-10-04 | The header is three lines: Type, as_of, and Definition. |
| 2026-10-04 | Requirements link to `#pb-N` on the table. The table PBI Code links to `#req-pb-N` on Requirements. |

[Back to top](#index)
