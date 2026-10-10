# ADR-109: Content tab headings get GitHub-style anchors

## Status
Accepted

## Context
Instructions **content** tabs render pack markdown in the portal ([ADR-071](ADR-071-portal-content-paths.md), [Web-portal-24](../product-backlog.md#L395), [Web-portal-25](../product-backlog.md#L400)). Seeds such as `content/scrum-in-sdd/scrum-in-sdd.en.md` include an Index of links like `#part-i-the-2020-scrum-guide-summary`. Those fragments match GitHub heading anchors.

`renderPortalMarkdown` and `renderFeaturesMarkdown` in `src/lib/features-catalog.ts` emit headings with no `id`. A click on an Index link does not scroll. The markdown files stay as authored. The Setup **code** tab is React and is out of scope.

## Decision
1. Every instructions tab with `type: "content"` gets heading `id` attributes from the shared markdown renderer in `src/lib/features-catalog.ts`. Features, Scrum in SDD, Invoke custom agents, and later content tabs use the same path. No per-tab special case.
2. The id is a GitHub-style slug of the heading’s plain text (inline marks such as bold are stripped). The first heading with that slug uses the bare id. The next heading with the same slug uses `slug-1`, then `slug-2`.
3. The slug counter resets at the start of each document render.
4. Features em-dash list splitting stays as it is. Only headings gain ids.
5. Guide headings use `scroll-margin-top` so the tab bar does not cover the target.
6. Pack markdown is not rewritten to add HTML ids. A repeated fragment in an Index still targets the first matching heading. A later copy needs a new fragment in the markdown if it must be a separate target.
7. English **human-read** `content/scrum-in-sdd/scrum-in-sdd.en.md` keeps an auto-built **Index** from heading slugs. **AI-read** `templates/framework.sdd.works/pack-scrum-in-sdd.md` has no Index ([ADR-126](./ADR-126-ai-read-pack-templates-and-pack-scrum-in-sdd-filename.md)). After part or heading edits on the human EN seed, run `node scripts/rebuild-scrum-in-sdd-en.mjs --index-only` from the product repo so Index `#` fragments stay aligned.

## Rationale
One renderer already serves every content tab. Anchors belong there so a new content tab inherits them. GitHub slug rules match the fragments already written in the seeds.

## Consequences
- [Web-portal-28](../product-backlog.md#L413) implements this ADR. [Web-portal-07](../product-backlog.md#L377) and [Web-portal-12](../product-backlog.md#L383) keep their Done status. This ADR adds anchors on top of those tabs.
- Tests cover a bold heading slug, a duplicate slug, and a Features heading id without dropping the em-dash split.
- Index rows that reuse one fragment for a later duplicate heading stay on the first heading until the markdown changes.

## Date
2026-10-07
