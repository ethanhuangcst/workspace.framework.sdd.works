# ADR-122: Instructions guide hero and Setup tab content

## Status

Accepted

## Context

The public instructions guide (`/` and `/instructions`) is the primary onboarding surface. Operators approved a mockup refresh that:

- Retitles the hero to **Built on Harness. Ready for Scrum** (`admin.guide.title`, same English string in all three locales).
- Sets the hero headline in **Antonio** (`--font-hero`) beside a smaller header-scale wordmark in `.guide-hero-title`.
- Simplifies Setup: a bold lead line, one copy-prompt pill, install phrase + `sdd_install_framework` blocks, then agents roster.
- Removes on-page **Manual setup** (`mcp.json` sample) and the **Tools** table. Stdio config remains in `GET /setup` markdown only ([ADR-061](./ADR-061-setup-prompt-public-path.md)).
- Adds a single update hint (`admin.guide.setup_update_tool`) above the agents heading, naming `sdd_update_framework` without a copy control or code block.

Prior acceptance ([AC4](../admin-portal/app-stories.md) / feature-12) required Manual setup on the page. That behavior is superseded by this ADR.

## Decision

### Hero

- Load Antonio from Google Fonts in app and mockup CSS (`--font-hero`).
- `.guide-hero-title`: flex row, `align-items: center`; wordmark **5.625rem** tall, **`margin-left: -23px`**; `h1` weight **700**, **`clamp(1.45rem, 2.65vw, 2.125rem)`**.
- Tagline key `admin.guide.lead` unchanged. Sticky header rules stay [ADR-111](./ADR-111-guide-header-sticky.md).

### Setup tab

| Element | Rule |
| --- | --- |
| Lead | `admin.guide.setup_highlight` in `.setup-highlight`, `data-testid="setup-highlight"`, plain bold text, no box |
| Copy CTA | `copy-setup-prompt` copies the `/setup` fetch sentence only |
| After connect | `setup_after_prompt`, copyable `setup_install_phrase`, `setup_after_tool`, copyable `sdd_install_framework` |
| Manual `mcp.json` | **Not** rendered on the portal Setup tab |
| Tools table | **Not** rendered (`#tools` absent) |
| Agents | Seven-row roster with icons; **no** `agents_intro` paragraph |
| Update | `setup_update_tool` in `.setup-update-preface`, `data-testid="setup-update-preface"`, bold line above `h_agents`; **no** `copy-update-cmd` |

### Mockup gate

Mockup pages `01-home.html` and `13-instructions.html` and `assets/mockup.css` / `assets/i18n.js` are the review surface. Production React and `portal.css` match after operator approval (same gate as [ADR-121](./ADR-121-sdd-works-wordmark-logo.md) for the wordmark asset).

## Rationale

Setup steps belong in the fetched `/setup` document so one source stays authoritative for stdio JSON. The portal page stays a short path: copy prompt, connect MCP, install tool, pick an agent. Duplicating `mcp.json` and a Tools table added noise and drifted from MCP docs.

Antonio gives the hero a distinct display voice without changing body type (Outfit + Noto).

## Consequences

- Regression suites must stop asserting Manual setup and Tools on Setup ([`app-tests.md`](../admin-portal/app-tests.md) §7, §10 superseded for those rows; §25 is canonical after ship).
- Orphan message keys (`manual_*`, `h_tools`, `tool_*`, `agents_intro`) may remain until a cleanup pass; components must not reference them.
- `/setup` markdown must still document stdio config for operators who skip the copy-prompt path.

## Related

- [Web-portal-35](../product-backlog.md#pb-132)
- [AC36](../admin-portal/app-stories.md)
- [`app-design.md`](../admin-portal/app-design.md) `/instructions` table
- [ADR-121](./ADR-121-sdd-works-wordmark-logo.md) (hero wordmark art and sizes)
