# Issues log (framework.sdd.works)

> Type: Framework (process) artifact of framework.sdd.works
> as_of: 2026-10-06
> [Definition](../pack.framework.sdd.works/templates/EN/sdd-scrum-practices.md#issues-logmd)

---

## Open issues

| Id | Title | Component | Priority | Description | Related | Close Check | Status | Added time |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Closed issues

| Id | Title | Component | Priority | Description | Related | Close Check | Closed Sprint | Closed time |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PK-01 | Pack files link to product-repo ADR and Knowledge | Pack | High | Pack seeds linked to `specs/adr/` and other product-only docs. Those trees are not in the install deliverable. | One-time cross-review of pack seeds | `rg` on `pack.framework.sdd.works/` finds no out-of-pack links to adr, framework-design, seed-artifacts-building-guide, or product-backlog. Second review 2026-10-06 passed. | Sprint 7 | 06/Oct/2026 |
| WA-01 | `/` is still the logo-card home | Web-app | High | `/` still rendered the logo-card home. The instructions guide should be the home page. | [Web-portal-09](./product-backlog.md#L430) Public landing, footer, reset link, password gate | `should_show_instructions_guide_on_root` shows the guide, not the logo card. | Sprint 3 | 26/Sep/2026 |
| WA-02 | Footer scrolls away | Web-app | High | The footer scrolled away with the page. It should stay fixed at the bottom of the viewport. | [Web-portal-09](./product-backlog.md#L430) Public landing, footer, reset link, password gate | `.site-footer` stays in view after scroll to the bottom. | Sprint 3 | 26/Sep/2026 |
| WA-03 | Reset success still says Back to home | Web-app | High | After the reset mail is sent, the link said Back to home. It should be Back to login. | [Web-portal-09](./product-backlog.md#L430) Public landing, footer, reset link, password gate | `reset-back-login` goes to `/login`. | Sprint 3 | 26/Sep/2026 |
| WA-04 | Empty-password screen traps accounts that already have a password | Web-app | High | An account that already had a password still saw the empty-password screen. | [Web-portal-09](./product-backlog.md#L430) Public landing, footer, reset link, password gate | A hashed admin leaves that screen. An empty hash still reaches set-password. | Sprint 3 | 26/Sep/2026 |
| WA-05 | Reset submit flashes and stays on the form | Web-app | High | Reset submit flashed and brought the form back. The page should stay on `/reset-password` and show success or a keyed error. | [Web-portal-10](./product-backlog.md#L458) Reset submit and Features tab | URL stays `/reset-password`. Success callout shows. A failed request shows `reset-error`. | Sprint 3 | 26/Sep/2026 |
| WA-06 | Features tab cannot be clicked | Web-app | High | On the instructions guide, the Features tab did not open the features panel. | [Web-portal-10](./product-backlog.md#L458) Reset submit and Features tab | Features opens `?tab=features` and hides the setup panel. | Sprint 3 | 26/Sep/2026 |
| WA-07 | Reset claims success while Resend is skipped | Web-app | High | Reset showed success while Resend was skipped. Skip mail only when `E2E_SKIP_MAIL=1`. | [Web-portal-10](./product-backlog.md#L458) Reset submit and Features tab | A clean `npm run dev` sends mail. Playwright sets the skip flag and does not reuse a server. | Sprint 3 | 26/Sep/2026 |
| WA-08 | Reset success does not name the email and can disappear | Web-app | High | Reset success did not name the address, and a document reload dropped the success state. | [Web-portal-11](./product-backlog.md#L461) Reset success stays on page with previous sentence | Success callout names the address. The URL has no `?email=`. | Sprint 3 | 26/Sep/2026 |
| WA-09 | Get secret leaves Features and never shows a value | Web-app | High | Get secret left Features and showed no value. Lookup should stay on Features and use the exact key name. | [Web-portal-08](./product-backlog.md#L456) Instructions page — Get secret | `POST /api/sdd/secret` stays on Features and shows the value or not-found. | Sprint 3 | 26/Sep/2026 |
| WA-10 | Reset success copy and local mail | Web-app | High | Success copy must be the previous sentence, with no `{email}`. Local reset returned success without calling Resend. | [Web-portal-11](./product-backlog.md#L461) Reset success stays on page with previous sentence | Callout has no `{email}` in `en`, `zh-Hans`, and `zh-Hant`. | Sprint 3 | 26/Sep/2026 |
| WA-11 | Get secret result not in view; found layout incomplete | Web-app | High | The Get secret result was off screen. A found value needs a code block, a copy control, and the lookup-row width. | [Web-portal-08](./product-backlog.md#L456) Instructions page — Get secret | The result scrolls into view. The found value is a code block with copy at lookup-row width. | Sprint 3 | 26/Sep/2026 |
| WA-12 | Local DB missing seed admin; empty-hash rows force set-password | Web-app | High | The local database had no seed admin. Leftover empty-hash test rows kept sending login to set-password. | [Web-portal-09](./product-backlog.md#L430) Public landing, footer, reset link, password gate | Leftover `empty-*` rows are gone. The auth test deletes its fixture. The seed admin has a hash. | Sprint 3 | 26/Sep/2026 |
