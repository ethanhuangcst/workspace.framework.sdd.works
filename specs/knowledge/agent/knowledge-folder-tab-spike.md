# Knowledge folder tab spike (mockup)

## Purpose

Evaluate **Web-portal-36** **`internal_page_folder`** UX before production: index-driven listing, subfolders, **`same_tab`** vs **`new_tab`** rows.

**Status:** Mockup confirmed 2026-10-08. Engineering specs: [ADR-124](../../adr/ADR-124-internal-page-folder-index-json.md), admin-portal **AC38**, **app-design** Internal page folder, **app-tests** §27.

## Run

From the product repo:

```bash
npx serve specs/admin-portal/ui-mockup -p 8765
```

Open `http://localhost:8765/16-knowledge-folder-spike.html`.

## Data source

Mirrors pack seeds under `specs/admin-portal/ui-mockup/assets/samples/knowledge/` (sync from `src/content/knowledge/` when seeds change).

## Unknowns (production still decides)

| Topic | Spike assumption | Production decision |
| --- | --- | --- |
| URL shape | `?path=archived&doc=invoke-agent-trae` | Confirm vs single `path=` segment chain |
| New tab target | Static `16-knowledge-article-view.html?src=` | Real route + cache/bundle resolver ([ADR-071](../adr/ADR-071-portal-content-paths.md)) |
| Markdown | Client `marked` CDN | Server HTML pipeline + `guide-md-body--prose` |
| API | Direct fetch of `.index.json` and `.md` | `GET /api/sdd/instructions-tabs` extension or sibling route |
| i18n | Labels from `.index.json` per locale | Same; tab chrome stays portal message keys |
| Error states | Plain text | i18n keys + tab-level error panel |

## Files

| File | Role |
| --- | --- |
| `16-knowledge-folder-spike.html` | Spike shell |
| `16-knowledge-article-view.html` | New-tab article chrome |
| `assets/knowledge-spike.js` | Index resolver + navigation |
| `assets/mockup.css` | `.knowledge-*` styles |
