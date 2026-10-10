# ADR-126: AI-read pack templates and pack-scrum-in-sdd.md filename

## Status

Accepted (amended 2026-10-08: trio beside `constants.json`, not under `EN/`; amended 2026-10-09 by [ADR-130](./ADR-130-simplified-installer-url-only-and-empty-cache.md) decision 9: install path is `{client_root}/templates/`, not `{client_root}/templates/framework.sdd.works/`).

## Context

[ADR-125](./ADR-125-dual-audience-scrum-guide-and-guide-editor-skill.md) splits **human-read** portal markdown from **AI-read** install templates. [ADR-068](./ADR-068-scrum-in-sdd-filename.md) named the AI guide seed `scrum-in-sdd.md` in every locale folder under `templates/{EN|HanS|HanT}/`. That collided with human filenames under `content/scrum-in-sdd/scrum-in-sdd.{locale}.md` and with [i18n-04](../product-backlog.md#L304) (HanS and HanT template guides).

Maintainers chose:

1. Rename the AI guide seed to **`pack-scrum-in-sdd.md`**.
2. **No i18n** for that file: one English body.
3. Keep AI-read seeds under **`templates/`**, not `content/`.
4. Treat **`pack-scrum-in-sdd.md`**, **`sdd-scrum-practices.md`**, and **`coach-knowledge.md`** as one **AI-read** set beside **`constants.json`** on `{client_root}` after install (internal links, not portal tabs). Do **not** copy those four into the workspace.

Human-read Scrum guide stays **`content/scrum-in-sdd/scrum-in-sdd.{locale}.md`** with i18n and [ADR-125](./ADR-125-dual-audience-scrum-guide-and-guide-editor-skill.md) link rules.

## Decision

### AI-read template trio (beside constants)

| File | Role | Authoring seed | After install |
| --- | --- | --- | --- |
| `pack-scrum-in-sdd.md` | Names and meaning for Scrum in SDD | `pack.framework.sdd.works/templates/framework.sdd.works/pack-scrum-in-sdd.md` | `{client_root}/templates/framework.sdd.works/pack-scrum-in-sdd.md` |
| `sdd-scrum-practices.md` | What, how, and when | `pack.framework.sdd.works/templates/framework.sdd.works/sdd-scrum-practices.md` | `{client_root}/templates/framework.sdd.works/sdd-scrum-practices.md` |
| `coach-knowledge.md` | Harness, XP, BDD, Lean, AI delivery topics outside the guide | `pack.framework.sdd.works/templates/framework.sdd.works/coach-knowledge.md` | `{client_root}/templates/framework.sdd.works/coach-knowledge.md` |

1. These three files are **AI-read**: agents open them from `{client_root}/templates/framework.sdd.works/` with **no `{locale}` segment**; they use **internal pack links** among themselves; they are **not** instructions portal content tabs.
2. They sit beside `constants.json` ([ADR-060](./ADR-060-constants-on-client-root.md), [ADR-081](./ADR-081-constants-json.md)). Locale folders hold process and engineering seeds that may copy into the project.
3. **No HanS or HanT copies** of the AI-read trio. Retire the intent of [i18n-04](../product-backlog.md#L304) for template guide locales. Chinese guide text for people lives in **human-read** `content/scrum-in-sdd/scrum-in-sdd.zh-Hans.md` and `scrum-in-sdd.zh-Hant.md`.
4. Remove **`templates/{EN|HanS|HanT}/scrum-in-sdd.md`**, **`templates/framework.sdd.works/EN/sdd-scrum-practices.md`**, and **`templates/framework.sdd.works/EN/coach-knowledge.md`** when the move lands.
5. Locale seeds that link to the trio use `../pack-scrum-in-sdd.md` and `../sdd-scrum-practices.md`.

### Human-read guide (unchanged role, distinct paths)

| Role | Path |
| --- | --- |
| Pack | `pack.framework.sdd.works/content/scrum-in-sdd/scrum-in-sdd.{locale}.md` |
| Portal mirror | `src/content/scrum-in-sdd/scrum-in-sdd.{locale}.md` |

Portal and Features copy may still say “Scrum in SDD guide” in prose. The **filename** `scrum-in-sdd.{locale}.md` is the human artifact name on the content tab, not the AI template name.

### Core artifacts vocabulary

`artifacts-map.json` on a project remains a core artifact alongside the **guide** and **practices** roles. The installed guide file is **`pack-scrum-in-sdd.md`**, not `scrum-in-sdd.md`. Living references in pack seeds, `ethan.md`, skills, and specs use the trio beside `constants.json`. Closed rows in `specs/sprint-backlog.md` and dated entries in `specs/changes-log.md` stay as written. |

### Semantic sync

Human EN and `pack-scrum-in-sdd.md` stay semantically aligned (section order, terms). They are not byte-identical. Maintainers use **`sdd-guide-editor`** ([ADR-125](./ADR-125-dual-audience-scrum-guide-and-guide-editor-skill.md)).

## Supersedes

- [ADR-068](./ADR-068-scrum-in-sdd-filename.md): template guide filename and per-locale `templates/{HanS|HanT}/scrum-in-sdd.md` expectation.
- [i18n-04](../product-backlog.md#L304) for HanS and HanT **`scrum-in-sdd.md` under `templates/`** (human content i18n remains).

## Consequences

- OGT on `status.md`: rewrite **`pack-scrum-in-sdd.md`**, move practices and coach beside constants, retarget links, update install and ledger paths, and adjust `rebuild-scrum-in-sdd-en.mjs` so `--index-only` writes human paths only.
- [ADR-125](./ADR-125-dual-audience-scrum-guide-and-guide-editor-skill.md), [ADR-106](./ADR-106-coach-knowledge-file.md), [ADR-109](./ADR-109-content-tab-heading-anchors.md), and [ADR-082](./ADR-082-artifacts-map-json.md) carry amendment notes or text updates for this filename split.

## Date

2026-10-08
