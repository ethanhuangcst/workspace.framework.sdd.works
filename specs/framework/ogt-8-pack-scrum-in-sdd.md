# OGT-8: Rewrite pack-scrum-in-sdd.md

> Type: Framework (implementation spec)
> as_of: 2026-10-08
> [Definition](../../pack.framework.sdd.works/templates/sdd-scrum-practices.md#terminology-in-practice)

Status row: [`status.md`](../status.md) open OGT **#8 Rewrite pack-scrum-in-sdd.md**.

Normative decisions: [ADR-126](../adr/ADR-126-ai-read-pack-templates-and-pack-scrum-in-sdd-filename.md), [ADR-125](../adr/ADR-125-dual-audience-scrum-guide-and-guide-editor-skill.md).

Maintainer workflow: `.cursor/skills/sdd-guide-editor/`.

## Goal

Ship **`pack-scrum-in-sdd.md`**, **`sdd-scrum-practices.md`**, and **`coach-knowledge.md`** beside **`constants.json`** under `templates/` (AI-read, not copied into the workspace). Human-read guides stay `content/scrum-in-sdd/scrum-in-sdd.{locale}.md`. Retire locale template guides named `scrum-in-sdd.md`.

## In scope

| # | Work | Result |
| --- | --- | --- |
| 1 | AI-read guide | `pack.framework.sdd.works/templates/pack-scrum-in-sdd.md` (no Index, internal links) |
| 2 | Move practices and coach | From `templates/EN/` to `templates/` beside `constants.json` |
| 3 | Remove old guides | Delete `templates/EN/scrum-in-sdd.md` and `templates/HanS/scrum-in-sdd.md` |
| 4 | `ethan.md` | Read trio under `{client_root}/templates/framework.sdd.works/` with no `{locale}` |
| 5 | Practices and locale seed links | `./pack-scrum-in-sdd.md` among the trio; `../` from `templates/EN/` seeds |
| 6 | Features catalog | Row **`pack-scrum-in-sdd.md`** for the AI guide role |
| 7 | Rebuild script | `--index-only` writes human EN paths only |
| 8 | Skills | Pack and `.cursor` skills point at the trio without `{locale}` |
| 9 | Specs | Living design, stories, tests, product-backlog, ADR-126 |
| 10 | Verify | `check:pack-seeds`, catalog tests, leftover-link search |

## Out of scope

- Closing OGT #8 on `status.md` (separate confirm after verification).
- Translating the AI-read trio.

## AI-read trio

| File | Authoring | After install |
| --- | --- | --- |
| Guide | `templates/pack-scrum-in-sdd.md` | `{client_root}/templates/framework.sdd.works/pack-scrum-in-sdd.md` |
| Practices | `templates/sdd-scrum-practices.md` | `{client_root}/templates/framework.sdd.works/sdd-scrum-practices.md` |
| Coach knowledge | `templates/coach-knowledge.md` | `{client_root}/templates/framework.sdd.works/coach-knowledge.md` |

## Verification

```bash
test ! -e pack.framework.sdd.works/templates/EN/scrum-in-sdd.md
test ! -e pack.framework.sdd.works/templates/HanS/scrum-in-sdd.md
test ! -e pack.framework.sdd.works/templates/EN/sdd-scrum-practices.md
test ! -e pack.framework.sdd.works/templates/EN/coach-knowledge.md
test -f pack.framework.sdd.works/templates/pack-scrum-in-sdd.md
test -f pack.framework.sdd.works/templates/sdd-scrum-practices.md
test -f pack.framework.sdd.works/templates/coach-knowledge.md
npm run check:pack-seeds
npm test -- src/lib/scrum-in-sdd-catalog.test.ts
```

## Definition of done (OGT close)

- [ ] Checklist rows 1–10 done.
- [ ] Verification commands pass.
- [ ] [framework-tests.md](./framework-tests.md) **CE-OGT-8** expected results match disk.
- [ ] User confirms OGT #8 usable; then move row 8 to closed OGTs on `status.md`.
