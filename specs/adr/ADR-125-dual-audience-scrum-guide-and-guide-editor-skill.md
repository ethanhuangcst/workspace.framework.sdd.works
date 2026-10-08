# ADR-125: Dual-audience Scrum guide and maintainer sdd-guide-editor skill

## Status

Accepted (amended 2026-10-08: human-read vs ai-read link policy; amended 2026-10-08: [ADR-126](./ADR-126-ai-read-pack-templates-and-pack-scrum-in-sdd-filename.md) AI filename and EN-only template guide)

## Context

The Scrum in SDD guide is edited often. It ships as **two synced variants** for two readers:

| Variant | Reader | Primary use | Link policy | Index |
| --- | --- | --- | --- | --- |
| **Human-read** | People | Instructions portal; distributable as stand-alone markdown | **No links to other pack artifacts** (no `./sdd-scrum-practices.md`, `skills/`, `rules/`, or sibling templates). No product-repo URLs ([`sdd-pack-authoring.mdc`](../../pack.framework.sdd.works/rules/sdd-pack-authoring.mdc), `npm run check:pack-seeds`). **Allowed:** in-document `#` heading anchors and the `## Index` block ([ADR-109](./ADR-109-content-tab-heading-anchors.md)). Body text must carry names and meaning without requiring another file. | Yes: h1 and h2 only |
| **AI-read** | Agents after install | **`pack-scrum-in-sdd.md`** with **`sdd-scrum-practices.md`** and **`coach-knowledge.md`** beside `constants.json` under `templates/` ([ADR-126](./ADR-126-ai-read-pack-templates-and-pack-scrum-in-sdd-filename.md)) | **Internal pack links** among install templates and `{client_root}/skills/` and `{client_root}/rules/`. Same ban on this product repo's `specs/` trees in seeds. | No Index block |

**Semantic sync:** both variants keep the same section order, heading wording, and terminology. Markdown is not required to be byte-identical.

Product backlog: [Spec-seeds-01](../product-backlog.md#L227) (guide role), [Web-portal-12](../product-backlog.md#L383) (human paths). Template guide i18n [i18n-04](../product-backlog.md#L304) is superseded for **`templates/`** by [ADR-126](./ADR-126-ai-read-pack-templates-and-pack-scrum-in-sdd-filename.md).

Portal English structure: Part I–III, then **Appendix: Short summary of the 2020 Scrum Guide** (not Part IV).

The framework.sdd.works product repo maintains pack seeds. Maintainer skill **`sdd-guide-editor`** owns edit workflow and sync checks. It does not ship in the pack.

## Decision

### Human guide seeds (portal)

| Role | Path |
| --- | --- |
| Pack authoring | `pack.framework.sdd.works/content/scrum-in-sdd/scrum-in-sdd.{locale}.md` |
| Product mirror | `framework.sdd.works/src/content/scrum-in-sdd/scrum-in-sdd.{locale}.md` (bundled fallback before Git sync) |

Human-read files include an Index, follow friendly-language and pack-authoring rules, and must read complete without opening any other pack artifact. Terms defined in practices or other seeds are restated or summarized in the human body when a reader needs them.

### AI-read guide seed (client template)

| Role | Path |
| --- | --- |
| Pack authoring | `pack.framework.sdd.works/templates/pack-scrum-in-sdd.md` |
| After install | `{client_root}/templates/framework.sdd.works/pack-scrum-in-sdd.md` |

AI-read file omits the Index, uses install-safe internal links, and is **English only**. See [ADR-126](./ADR-126-ai-read-pack-templates-and-pack-scrum-in-sdd-filename.md) for the trio with practices and coach-knowledge.

### Semantic sync (maintainer workflow)

After EN human-read edits, maintainers regenerate the Index with `node scripts/rebuild-scrum-in-sdd-en.mjs --index-only` in the product repo, then align **`pack-scrum-in-sdd.md`** per [`.cursor/skills/sdd-guide-editor/reference.md`](../../.cursor/skills/sdd-guide-editor/reference.md) until an automated derive step exists.

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
- Implementation tracked as OGT **Rewrite pack-scrum-in-sdd.md** on [`status.md`](../status.md).

## Date

2026-10-08
