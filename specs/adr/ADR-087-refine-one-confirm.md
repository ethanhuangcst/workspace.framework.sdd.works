# ADR-087: One confirm for sdd-refine-backlog

## Status
Accepted

## Context
`sdd-refine-backlog` listed findings in one table, then asked one AskQuestion per fail. A long fail list made the refine slow. Fail text used readiness item numbers and the word Retire. Those words are not on the board the user is looking at.

[ADR-086](./ADR-086-pbi-size.md) item 4 says the skill sets Size after the user picks each readiness fail. This ADR replaces that confirm step. Size rules in ADR-086 stay as written.

## Decision
1. The skill sends one chat message: a numbered findings list, then the choices under that list. Leave AskQuestion uncalled. A question card in the same turn appears before the chat text, so the list would show only after the question.
2. The choices under the list are:
   - Accept all and update specs.
   - I will enter instructions in chat.
   - Create an OGT to record these findings and I will refine later.
   - Leave it to me.
3. Accept all is offered only when every proposed change edits an existing product backlog item (PBI): `Size`, requirement bullets, or both. A split, a merge, a new PBI, or removal of a sprint backlog item (SBI) is not in Accept all. Those rows use "I will enter instructions in chat".
4. Accept all writes every item in the findings list, in one pass. "I will enter instructions in chat" writes nothing until the user names the items, then the skill sends the list again. The on-going task (OGT) choice writes one OGT row in `status.md` and leaves the backlog unchanged. "Leave it to me" writes nothing.
5. Each finding is a numbered item: headline `{PBI code} — {noun}`, then Issue, then Proposed fix. The noun is the table Description or the Requirements noun when the row is missing.
6. Issue starts with `{part} is {verdict}`. The next sentence names the PBI code, the short name, and what the person sees. It does not list paths or anchor ids. Proposed fix is one sentence: the action and the result. Readiness item numbers and Retire stay out. Remove or delete is the verb when a PBI is no longer needed.

## Rationale
The findings list and the choices are one chat message. A numbered list is easier to copy than a wide table. Issue names the part and the verdict first, then the PBI code, the short name, and what the person sees. Accept all is safe when the write cannot invent a new code or a merge target. The OGT choice parks the whole list without a per-fail loop. The OGT names each finding by PBI code and short name.

## Consequences
- `sdd-refine-backlog` drops the per-fail AskQuestion loop when this ADR is applied to the skill.
- The findings list is a numbered item per PBI: headline `code — noun`, Issue, then Proposed fix. Issue is plain English for humans.
- ADR-086 item 4 remains the Size rules. The confirm is this ADR.

## Date
2026-10-04
