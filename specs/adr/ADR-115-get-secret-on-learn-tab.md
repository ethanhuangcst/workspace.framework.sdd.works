# ADR-115: Get secret on Learn Scrum tab

## Status

Accepted

## Context

Get secret looks up one stored key by name ([ADR-067](./ADR-067-get-secret-on-setup.md)). Since Sprint 3 feature-17 the form sits at the bottom of the **Setup** panel after the tools table, anchor `#setup-secret`.

The **Learn Scrum in SDD** tab embeds the course grid and shows intro copy, the iframe, and a fallback link to `https://learn.sdd.works` ([ADR-113](./ADR-113-learn-embed-copy-and-fallback.md)). Visitors who finish the nine modules often need a trial or integration key while they are on that tab, not while reading MCP install steps on Setup.

Setup should stay install-focused: copy prompt, manual `mcp.json`, agents, and tools. Features stays a catalog only.

## Decision

1. **Remove** the secret form from the Setup panel. Setup has no `#setup-secret` section and no `secret-lookup`.
2. **Add** the same secret form to the Learn Scrum panel ([`LearnScrumEmbedPanel`](../../src/components/features/LearnScrumEmbedPanel.tsx)), **below the iframe** and **above** the fallback paragraph that links to `https://learn.sdd.works` (`admin.guide.learn_scrum_open_external`).
3. **Order** inside the Learn panel: intro → iframe → secret stack → fallback link.
4. **Lookup behavior** is unchanged from ADR-067 item 3: exact name, one plaintext value, not-found, empty name does not call the API, result scrolls into view, width matches the lookup row, existing i18n keys for hint, button, found, missing, and empty.
5. **Submit** stays on the Learn tab. The URL does not switch to `?tab=setup` or `?tab=features`. Anchor `#learn-secret` identifies the secret section for scroll-into-view after lookup.
6. Setup paste sentence and `mcp.json` sample stay without a token. `sdd_get_key` stays off the stdio tool list.

## Rationale

Course completion and key lookup belong on the Learn tab. Moving only placement, not lookup rules, avoids a second secret product.

## Consequences

- [ADR-067](./ADR-067-get-secret-on-setup.md) placement on Setup is **superseded** for the live guide. Lookup rules in ADR-067 still apply.
- [Web-portal-13](../product-backlog.md#L388) Get secret on Setup is **superseded** for placement; behavior stays the same PBI family.
- Implementation likely extracts shared secret UI and lookup hook from [`SetupGuidePanel.tsx`](../../src/components/features/SetupGuidePanel.tsx) into one component used by `LearnScrumEmbedPanel`.
- [`app-stories.md`](../admin-portal/app-stories.md) AC17 and scenarios that require `secret-lookup` on Setup are **superseded** by new acceptance criteria for Learn placement.
- Mockups [`13-instructions.html`](../admin-portal/ui-mockup/13-instructions.html) and [`01-home.html`](../admin-portal/ui-mockup/01-home.html) move the secret block into the Learn panel markup.
- Pack [`content/.admin-note.md`](../../pack.framework.sdd.works/content/.admin-note.md) setup row text should say Get secret lives on the Learn tab, not Setup.
- Sticky guide header ([ADR-111](./ADR-111-guide-header-sticky.md)): scroll-into-view for secret results must clear the pinned block (same bar as heading anchors).

## Date

2026-10-07
