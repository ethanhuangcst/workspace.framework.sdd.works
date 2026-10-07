# Refine backlog reply

Load this file when composing the findings message for the user.

**Key** is the PBI code only. Put the short name in **Problem**. **Problem** is one or two sentences from the user's view. **Fix** is one sentence for the board after the change.

## Message order

1. **Boundary:** one sentence that this skill reviews `product-backlog.md` only.
2. **Lead:** one sentence with fail count.
3. **Findings:** table when count is greater than zero.
4. **Accept all note:** when every row is Size or requirement bullets only, say **Accept all and update specs** is offered. When any row is split, merge, new PBI, or SBI removal, say **Accept all** is not offered and why in one sentence.
5. **Your choice.**

When the fail count is zero, send `none` after the boundary and stop. Leave **Your choice** and the write out.

## Boundary

This skill reviews and consolidates `product-backlog.md`. User Stories and Acceptance Criteria are written when a feature is designed, with `atdd-expert` or `sdd-spec-to-build`.

## Lead sentence

Template:

`{N} readiness fails on product-backlog.md.`

When `{N}` is zero, send the boundary, then `none`, then stop.

## Findings table

List every fail. Number rows starting at 1.

| # | Key | Problem | Fix |
| --- | --- | --- | --- |
| 1 | `{PBI code}` | `{part} is {verdict}. {code, short name, and what you see}.` | `{one plain sentence for the board after the change}.` |

### Column rules

- **Key:** PBI code on the row. Do not send a code alone in **Problem** without the short name in the same cell.
- **Problem:** first clause is `{part} is {verdict}` where `{part}` is Size, Description, Status, or a link. One or two sentences total. No comma chains of paths or anchor ids.
- **Fix:** say what you will change and what the board will look like after. Use remove or delete when the PBI should go away.

Readiness item numbers from the skill check stay out of the table.

## Your choice

Offer **Accept all and update specs** only when every row is an edit to an existing PBI (Size, requirement bullets, or both). When offered, list it as option 1 and renumber the rest.

When **Accept all and update specs** is offered:

1. Accept all and update specs.
2. I will enter instructions in chat.
3. Create an OGT to record these findings and I will refine later.
4. Leave it to me.

When it is not offered, list:

1. I will enter instructions in chat.
2. Create an OGT to record these findings and I will refine later.
3. Leave it to me.

The user's reply that names one choice is the confirmation.

## Good and bad

**Bad Problem cell**

`Size is wrong, Collect-02, card list, Epic should be Feature.`

**Good row**

| # | Key | Problem | Fix |
| --- | --- | --- | --- |
| 1 | Collect-02 | Size is Epic; Collect-02 Card list view is Implementable work. | Set Size to Implementable on product-backlog.md. |
