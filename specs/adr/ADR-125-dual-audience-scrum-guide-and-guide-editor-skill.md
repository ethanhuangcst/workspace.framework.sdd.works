# ADR-125: Dual-audience Scrum guide and maintainer sdd-guide-editor skill

## Status

Accepted (amended 2026-10-08: human-read vs ai-read link policy)

## Context

The Scrum in SDD guide is edited often. It ships as **two synced variants** for two readers:

| Variant | Reader | Primary use | Link policy | Index |
| --- | --- | --- | --- | --- |
| **Human-read** | People | Instructions portal; distributable as stand-alone markdown | **No links to other pack artifacts** (no `./sdd-scrum-practices.md`, `skills/`, `rules/`, or sibling templates). No product-repo URLs ([`sdd-pack-authoring.mdc`](../../pack.framework.sdd.works/rules/sdd-pack-authoring.mdc), `npm run check:pack-seeds`). **Allowed:** in-document `#` heading anchors and the `## Index` block ([ADR-109](./ADR-109-content-tab-heading-anchors.md)). Body text must carry names and meaning without requiring another file. | Yes: h1 and h2 only |
| **AI-read** | Agents after install | Client template `scrum-in-sdd.md` embedded in the pack install tree | **Internal pack links** to artifacts that exist on `{client_root}` after install (`./sdd-scrum-practices.md`, `{client_root}/skills/`, `{client_root}/rules/`, sibling templates). Same ban on this product repo's `specs/` trees in seeds. | No Index block |

**Semantic sync:** both variants keep the same section order, heading wording, and terminology. Markdown is not required to be byte-identical.

Product backlog today still names a single guide seed in [Spec-seeds-01](../product-backlog.md#L227) and portal delivery in [Web-portal-12](../product-backlog.md#L383). [i18n-04](../product-backlog.md#L304) covers HanS and HanT **template** bodies with practice links (AI-read). Backlog bullets for the split are deferred; this ADR is the normative split.

Transition: English human and agent bytes are still often copied together (including Index on some template copies). Maintainers move toward this table via **`sdd-guide-editor`**.

Portal English structure: Part I–III, then **Appendix: Short summary of the 2020 Scrum Guide** (not Part IV).

The framework.sdd.works product repo maintains pack seeds. A maintainer skill should own edit workflow, sync checks, and locale follow-up. It must not ship in the pack or appear in `constants.json`.

## Decision

### Human guide seeds (portal)

| Role | Path |
| --- | --- |
| Pack authoring | `pack.framework.sdd.works/content/scrum-in-sdd/scrum-in-sdd.{locale}.md` |
| Product mirror | `framework.sdd.works/src/content/scrum-in-sdd/scrum-in-sdd.{locale}.md` (bundled fallback before Git sync) |

Human-read files include an Index, follow friendly-language and pack-authoring rules, and must read complete without opening any other pack artifact. Terms defined in practices or other seeds are restated or summarized in the human body when a reader needs them.

### Agent guide seeds (client template)

| Role | Path |
| --- | --- |
| Pack authoring | `pack.framework.sdd.works/templates/{EN\|HanS\|HanT}/scrum-in-sdd.md` |
| After install | `{client_root}/templates/framework.sdd.works/{locale}/scrum-in-sdd.md` |

Filename stays `scrum-in-sdd.md` ([ADR-068](./ADR-068-scrum-in-sdd-filename.md)). AI-read files omit the Index and use install-safe internal links.

### Semantic sync (maintainer workflow)

After EN human-read edits, maintainers regenerate the Index with `node scripts/rebuild-scrum-in-sdd-en.mjs --index-only` in the product repo, then align AI-read templates per [`reference.md`](../../.cursor/skills/sdd-guide-editor/reference.md) until an automated derive step exists.

### Maintainer skill (product repo only)

| Role | Path |
| --- | --- |
| Skill | `framework.sdd.works/.cursor/skills/sdd-guide-editor/SKILL.md` |
| Variant rules | `framework.sdd.works/.cursor/skills/sdd-guide-editor/reference.md` |

The skill is not copied by MCP install. It does not get a row in pack `constants.json`. Ethan onboard does not load it.

When a change affects portal heading anchors or `content/.instructions-tabs.json`, the maintainer loads **`sdd-update-specs`** for the admin-portal module after user confirm.

### Canonical edit surface

English human seed `pack.framework.sdd.works/content/scrum-in-sdd/scrum-in-sdd.en.md` is the default structural source unless the user scopes a locale-only fix.

## Consequences

- [`framework-design.md`](../framework/framework-design.md) documents both seed trees and **`sdd-guide-editor`**.
- [`framework-stories.md`](../framework/framework-stories.md) and [`framework-tests.md`](../framework/framework-tests.md) add **`sdd-guide-editor`** acceptance and **CE-SKILL-23**.
- Pack [`content/.admin-note.md`](../../pack.framework.sdd.works/content/.admin-note.md) points maintainers at the skill and Appendix naming.
- Optional later: `rebuild-scrum-in-sdd-en.mjs --derive-agent` to generate agent templates from human EN.

## Date

2026-10-08
