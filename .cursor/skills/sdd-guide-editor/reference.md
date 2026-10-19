# Scrum in SDD guide — variants and paths

Product repo: `framework.sdd.works`. Pack tree: `pack.framework.sdd.works/`. Decisions: [ADR-125](../../../specs/adr/ADR-125-dual-audience-scrum-guide-and-guide-editor-skill.md), [ADR-126](../../../specs/adr/ADR-126-ai-read-pack-templates-and-pack-scrum-in-sdd-filename.md).

## Two variants

| Variant | Reader | Index | Links |
| --- | --- | --- | --- |
| Human-read | Portal visitors, stand-alone markdown | Yes: `## Index`, h1 and h2 only | No links to other pack artifacts; no product-repo URLs. Allowed: `#` anchors in the same file. Must pass `npm run check:pack-seeds` |
| AI-read | Installed client `pack-scrum-in-sdd.md` | No Index block | Internal pack links: `./sdd-scrum-practices.md`, `./coach-knowledge.md`, skills and rules under `{client_root}` after install |

Semantic sync: same section order, heading wording, and terms. Markdown may differ (links, Index, intro bullets).

English body order: **Part I** The Scrum Gap for SDD, **Part II** Scrum in SDD Guide, **Appendix 1:** Agentic Programming, Harness Engineering, and SDD aligned with Agile practices, then **Appendix 2: Short summary of the 2020 Scrum Guide**.

## Seed map

| Variant | Pack authoring | Product mirror |
| --- | --- | --- |
| Human `en` | `pack.framework.sdd.works/content/scrum-in-sdd/scrum-in-sdd.en.md` | `src/content/scrum-in-sdd/scrum-in-sdd.en.md` |
| Human `zh-Hans` | `pack.framework.sdd.works/content/scrum-in-sdd/scrum-in-sdd.zh-Hans.md` | `src/content/scrum-in-sdd/scrum-in-sdd.zh-Hans.md` |
| Human `zh-Hant` | `pack.framework.sdd.works/content/scrum-in-sdd/scrum-in-sdd.zh-Hant.md` | `src/content/scrum-in-sdd/scrum-in-sdd.zh-Hant.md` |
| AI-read guide | `pack.framework.sdd.works/templates/framework.sdd.works/pack-scrum-in-sdd.md` | — |
| AI-read practices | `pack.framework.sdd.works/templates/framework.sdd.works/sdd-scrum-practices.md` | — |
| AI-read coach | `pack.framework.sdd.works/templates/framework.sdd.works/coach-knowledge.md` | — |

Tab config: `pack.framework.sdd.works/content/.instructions-tabs.json` (`scrum-in-sdd` content tab paths).

After install: `{client_root}/templates/framework.sdd.works/pack-scrum-in-sdd.md`, `sdd-scrum-practices.md`, and `coach-knowledge.md` beside `constants.json`. Do not copy those four into the workspace. Locale seeds stay under `{client_root}/templates/framework.sdd.works/{EN|HanS|HanT}/` and may copy into the project.

**Canonical structural edit surface:** human EN at `pack.framework.sdd.works/content/scrum-in-sdd/scrum-in-sdd.en.md` unless the user scopes a locale-only fix.

## Human-read variant rules

- Apply `pack.framework.sdd.works/rules/sdd-pack-authoring.mdc` on all pack seeds.
- Human portal seeds must not link to other pack artifacts (`./sdd-scrum-practices.md`, `../templates/`, `skills/`, `rules/`, and similar).
- Human portal seeds must not link to `specs/adr/`, `specs/knowledge/`, `framework-design.md`, or other paths that exist only in this product repo.
- Restate terms in prose when the AI-read variant would have linked to practices or another seed.
- Wording: `friendly-language.mdc` when present on `{client_root}` or the user's rules.
- Lists in guide markdown stay **tight** (no blank line between a bullet and its indented continuation) so Cursor preview shows the full file.
- Index link slugs follow portal rules ([ADR-109](../../../specs/adr/ADR-109-content-tab-heading-anchors.md)).

## AI-read variant rules

- Omit the entire `## Index` section through the line before the first `# **Part I**` (or first part h1).
- Prefer relative links to `./sdd-scrum-practices.md` and `./coach-knowledge.md`. Locale seeds under `EN/` link up with `../pack-scrum-in-sdd.md` and `../sdd-scrum-practices.md`.
- Do not add links to this product repo's `specs/` tree in AI-read seeds.

## zh-Hans and zh-Hant

- Translate for native Simplified or Traditional Chinese, not calque English.
- Keep heading structure and anchor slugs aligned with EN so portal deep links stay valid.
- Update human pack paths and `src/content` mirrors together. No AI-read HanS or HanT guide.

## Post-edit sync (EN structural change)

Run from the product repo root (`framework.sdd.works`):

```bash
node scripts/rebuild-scrum-in-sdd-en.mjs --index-only
npm run check:pack-seeds
```

The index script reads human EN pack content and writes human EN pack + `src/content` mirrors only. Align `templates/framework.sdd.works/pack-scrum-in-sdd.md` separately (no Index, install-safe links).

Do **not** run the script without `--index-only` unless part signatures in the script match the current EN doc; full rebuild can reorder or rewrite the preamble.

Optional verification: `npm test -- src/lib/scrum-in-sdd-catalog.test.ts`.

## Portal spec follow-up

Load **sdd-update-specs** when the edit changes:

- Index fragments or part or appendix titles (admin-portal stories, tests, design, mockups).
- `content/.instructions-tabs.json` paths or tab ids.

Module paths: `specs/admin-portal/app-stories.md`, `app-tests.md`, `app-design.md` per `{workspace}/artifacts-map.json`.
