# Product overview — [product name]

> Type: Framework (process) artifact of [product name]
> as_of: [YYYY-MM-DD]
> [Definition](./sdd-scrum-practices.md#product-backlogmd)

---

## Index

- [Product overview](#product-overview)
- [Definition of Done](#definition-of-done)
- [Requirements](#requirements)
  - [[component name]](#component)
- [Product Backlog](#product-backlog)
- [Change record](#change-record)

---

# Product overview

- [What the product does for the primary user.]
- [Optional second line: phase, constraint, or scope in plain language.]

[Back to top](#index)

---

<a id="definition-of-done"></a>

# Definition of Done

This section lists additional product checks on top of the standard Definition of Done in `sdd-dod.mdc`. Mark a PBI or SBI **Done** only when every standard check and every additional check here passes. [`sprint-backlog.md`](./sprint-backlog.md) links here instead of duplicating this list.

- [Additional PBI check with verification link.]

[Back to top](#index)

---

# Requirements

Each item has a PBI code, one noun for the deliverable, and bullets the user can act on. The table uses the same code and the same noun. Requirements link the PBI code to the table row (`#pb-N`). The table links the PBI code to Requirements (`#req-pb-N`). Other files link to `#pb-N` only.

Replace `[component name]` with your component label. Add one `##` heading per component. Link each heading from the Index.

<a id="component"></a>

## [component name]

- <a id="req-pb-1"></a>[[PBI code]](#pb-1) [noun]
  - [One bullet the user can act on.]
  - [Optional second bullet.]

[Back to top](#index)

---

# Product Backlog

| # | Component | PBI Code | Description | Size | Related | Sprint | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | [component] | <a id="pb-1"></a>[[PBI code]](#req-pb-1) | [noun] | Implementable | - [[related spec or PBI]]([path]#pb-N) | — | ToDo |

[Back to top](#index)

---

# Change record

| Date | Change |
| --- | --- |
| [YYYY-MM-DD] | [First entry after the seed was copied, or the reason for a backlog change.] |

[Back to top](#index)
