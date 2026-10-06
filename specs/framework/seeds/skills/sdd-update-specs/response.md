# Update specs reply

Load this file when composing the gap report for the user.

**Key** is the spec basename or a short workspace-relative path when the basename alone is ambiguous. **Problem** is one sentence for what work shows. **Fix** is one imperative sentence for the spec change.

## Message order

1. **Scope** lines (Sync mode, Compared, Work source).
2. **Aligned** (bullets or `none`).
3. **Lead** when gaps exist: one sentence with gap count.
4. **Gaps** table when count is greater than zero.
5. **Your choice.**

When every compared row aligns, send scope and **Aligned** only, one sentence that specs match work, and skip **Gaps** and the write offer unless the user asked for another file.

## Scope block

**Scope**

- Sync mode: {Spec before code | Spec after code}
- Compared: {short list of spec paths}
- Work source: {diff, files, or description}

## Aligned

- When none: `none`.
- When some: one bullet per file that matches work.

## Lead sentence

Template when gaps exist:

`{N} gaps between work and the compared specs.`

## Gaps table

List every gap. Number rows starting at 1.

| # | Key | Problem | Fix |
| --- | --- | --- | --- |
| 1 | `{basename or path}` | `{what work shows; name section or AC id when helpful}.` | `{proposed spec change in one imperative sentence}.` |

### Column mapping

- **Problem:** what work shows (old **Work says**).
- **Fix:** proposed spec change (old **Proposed spec change**).

## Your choice

1. Confirm all listed spec updates.
2. I will name which files to update in chat.
3. Leave specs unchanged.

The user's reply that names one choice is the confirmation. Do not open a question card.

## Good row

| # | Key | Problem | Fix |
| --- | --- | --- | --- |
| 1 | app-stories.md | Scenario "Save card" expects a toast; the UI shows inline text only. | Update the scenario to match inline confirmation or add a toast to the product. |
