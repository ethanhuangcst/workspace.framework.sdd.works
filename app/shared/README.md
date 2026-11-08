# Admin portal UI assets

Production UI layer for **framework.sdd.works**, ported from [`specs/admin-portal/ui-mockup/`](../../specs/admin-portal/ui-mockup/).

## Layout

| Path | Purpose |
| --- | --- |
| `src/styles/` | `tokens.css`, `portal.css`, `email.css`, `globals.css` |
| `src/components/ui/` | Primitives matching mockup classes |
| `src/components/layout/` | `AuthShell`, `AppShell` |
| `src/components/features/` | Page bodies (Home, Login, Keys, Settings, …) |
| `src/i18n/` | `t()` + catalog loader |
| `messages/` | `en` / `zh-Hans` / `zh-Hant` |
| `public/` | `sdd-logo.png` (transparent wordmark), `sdd-mark.png` (square), favicon, apple-icon, WeChat QR |

## Rules

1. Mockups are the visual source of truth — keep CSS class names.
2. All user-facing copy goes through `t(locale, key)` / message files.
3. Locale switcher labels are **EN / 简 / 繁**.
4. After changing a mockup HTML/CSS, update these assets in the same change.

See Detailed Page Design in [`specs/admin-portal/app-design.md`](../../specs/admin-portal/app-design.md#15-detailed-page-design).
