# Test report

**Scope:** Hostname cutover (ADR-127 / feature-72) — middleware host redirect, default `sdd.works` origins, Learn embed on `learn.sdd.works`, setup / lite / node paste and API markdown

**Run at:** 2026-10-08T11:36:39Z

**Commit or ref:** `f6606a6` (working tree may include later hostname impact edits)

## Summary

| Layer | Passed | Failed | Skipped |
| --- | --- | --- | --- |
| Unit and component | 44 | 0 | 0 |
| API and integration | 27 | 0 | 0 |
| Browser E2E | 0 | 0 | 0 |
| **Total** | **71** | **0** | **0** |

**Result:** pass

## Checks

| Check | Layer | Result | Evidence |
| --- | --- | --- | --- |
| Redirect `framework.sdd.works` → `sdd.works` | unit | pass | `src/middleware.test.ts` › should_redirect_framework_host_to_sdd_works |
| Pass through apex `sdd.works` | unit | pass | `src/middleware.test.ts` › should_pass_through_sdd_works |
| Redirect `www.sdd.works` → apex | unit | pass | `src/middleware.test.ts` › should_redirect_www_host_to_apex |
| Redirect legacy WordPress `/en/home-en` → `/instructions` | unit | pass | `src/middleware.test.ts` › should_redirect_legacy_wordpress_home_* |
| Do not 301 `/api/*` on `framework` (webhook + package) | unit | pass | `src/middleware.test.ts` › should_pass_through_api_* |
| Default paste sentences use `https://sdd.works` | unit | pass | `hostname-defaults.regression.test.ts` › paste_sentences; `paste-sentences.test.ts` |
| Default MCP URL and package base use `https://sdd.works` | unit | pass | `hostname-defaults.regression.test.ts` › mcp_and_package_base |
| Reject pre-cutover apex Learn embed host | unit | pass | `instructions-tabs-config.test.ts` › should_fail_when_embed_host_is_pre_cutover_sdd_works |
| Accept `learn.sdd.works` postMessage origin; reject others | unit | pass | `learn-embed-messaging.test.ts` |
| Learn iframe `src` / fallback / height messaging | unit | pass | `LearnScrumEmbedPanel.test.tsx`; `sdd-works-learn-url.test.ts` |
| Pack and bundled tabs config validate | unit | pass | `instructions-tabs-config.test.ts` › CE-TABS-01 |
| Invalid tabs / labels / traversal fail | unit | pass | `instructions-tabs-config.test.ts` › CE-TABS-02 |
| Setup markdown: `sdd.works` origin, MCP name `framework.sdd.works` | API | pass | `hostname-defaults.regression.test.ts` › setup_markdown |
| Lite and node setup markdown use `sdd.works` | API | pass | `hostname-defaults.regression.test.ts` › lite_and_node; `sdd-api.test.ts` › lite/node markdown |
| Agent / lite / node setup + local origin rewrite | API | pass | `sdd-api.test.ts` › SDD package API |
| Package, features, instructions-tabs, lite file APIs | API | pass | `sdd-api.test.ts` › remaining cases |
| Production browser AC44 (Learn iframe on `sdd.works`) | browser | skip | Not run in this Vitest pass; requires deployed image + WordPress `frame-ancestors` |

## Commands run

- Unit and component + API: `npm run test -- --run src/middleware.test.ts src/mcp/hostname-defaults.regression.test.ts src/mcp/paste-sentences.test.ts src/lib/sdd-works-learn-url.test.ts src/lib/learn-embed-messaging.test.ts src/core/seeds/instructions-tabs-config.test.ts src/components/features/LearnScrumEmbedPanel.test.tsx src/app/api/sdd/sdd-api.test.ts --reporter=verbose`

## Notes

- Browser E2E for AC44 was not part of this run.
- Full-repo Vitest may still fail on unrelated sync freshness / CSS overflow suites; those files were out of scope.
- Report path: `specs/test-report.md` (`artifacts_root` from `artifacts-map.json`).
