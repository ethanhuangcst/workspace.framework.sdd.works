# Knowledge folder tab spike (mockup)

## Purpose

Human-readable preview of the **Knowledge** tab ([Web-portal-36](../../product-backlog.md#pb-133), **feature-74**): browse pack folders and articles, path trail navigation, open in tab vs new window.

**Status:** Mockup confirmed 2026-10-08 (path trail revision). Engineering specs: [ADR-124](../../adr/ADR-124-internal-page-folder-index-json.md), admin-portal **AC38**, **app-design** Internal page folder, **app-tests** §27.

## Run

From the product repo:

```bash
npx serve specs/admin-portal/ui-mockup -p 8765
```

Open `http://localhost:8765/16-knowledge-folder-spike.html`.

Review URLs:

| View | URL |
| --- | --- |
| Tab root list | `/16-knowledge-folder-spike.html` |
| Subfolder list | `?path=archived` shows path `knowledge / archived` |
| Same-tab article | `?path=archived&doc=invoke-agent-trae` shows `knowledge / archived / invoke-agent-trae` |

## Navigation (confirmed)

- No **Back** button.
- Path trail above the list or article: tab **`queryParam`** (`knowledge`), then each folder **`id`** in **`path=`**, then **`doc`** id when an article is open.
- Prefix segments are links. The last segment is plain text.
- No folder **h2** on list views.

Production portal should match this spike before the path-nav revision is Done.

## Data source

Mirrors pack seeds under `specs/admin-portal/ui-mockup/assets/samples/knowledge/` (sync from `src/content/knowledge/` when seeds change).

## Files

| File | Role |
| --- | --- |
| `16-knowledge-folder-spike.html` | Spike shell |
| `16-knowledge-article-view.html` | New-tab article chrome (legacy popout; production uses full guide URL) |
| `assets/knowledge-spike.js` | Index resolver + path navigation |
| `assets/mockup.css` | `.knowledge-path*` and list styles |
