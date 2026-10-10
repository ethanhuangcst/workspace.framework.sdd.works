# ADR-130: Simplified installer, URL only, empty cache

## Status

Accepted. Not implemented. Supersedes the install steps in [ADR-129](./ADR-129-url-mcp-server-plan-local-writer.md) decisions 3, 4, and 5. ADR-129 decisions 1 and 2 (URL entry and paste setup) stay. [ADR-056](./ADR-056-single-user-root-framework-pack.md), [ADR-057](./ADR-057-install-ledger-pack-complete.md), and [ADR-059](./ADR-059-ledger-lists-pack-files.md) stay as they are.

**Update 2026-10-09:** Decisions 3, 4, and 6 are superseded by [ADR-131](./ADR-131-http-only-install-bundled-fallback.md). ADR-131 removes the writer binary (decision 3), removes the writer stdout contract (decision 4), and replaces the empty-cache behavior with bundled pack fallback (decision 6). Decisions 1, 2, and 5 stay.

## Context

The ADR-129 installer was tested manually on TRAE CN, CodeBuddy CN, and Codex on 09 Oct 2026. The tests found three bugs that trace to design choices, not code errors:

- MC-13: The writer stdout prints only `{"action":"apply"}`. It does not report the accepted client root or the written files. The agent cannot tell where files landed, so a write to the wrong client root looks like a failure.
- MC-14: `cache_stale` is keyed on `syncedAt` age, but `syncedAt` only advances on a new commit. A content-current pack goes stale by age and blocks every install, with no self-healing path for the agent.
- MC-15: The pack `templates/` folder is missing the `framework.sdd.works/` level that 40-plus skill, rule, and agent references expect.

The candidate root flag in ADR-129 decision 5 caused the MC-13 confusion: the agent proposed a folder, the writer ignored it for a known client, and the agent never saw the decision.

## Decision

1. **mcp.json stays a URL only.** ADR-129 decisions 1 and 2 are unchanged. The entry is `"url": "https://sdd.works/mcp"`. No `command`.

2. **Setup prompt is URL only.** `GET /setup` tells the agent to write the URL entry and stop. The install instructions, the writer flags, and the fallback copy steps move out of the setup prompt. They live in the `sdd_install_framework` tool result at install time. The setup prompt no longer carries a section 4.

3. **Writer binary stays primary, no candidate root.** The writer resolves the client root from `--client` and `--os` alone, using the path table in `packages/sdd-paths/paths.json`. The `--client-root` flag is removed. For an unknown client, the writer returns `client_unknown` and exits. It does not call an LLM. The agent fallback stays for when the writer cannot run.

4. **Writer stdout reports the root and the files.** On `apply` and `rewrite_ledger`, the writer prints `accepted_root` and the written file list, not only `{"action":"apply"}`. The agent reads the stdout and can confirm the root before it trusts the result.

5. **Cache age gate is dropped.** `cache_stale` is no longer keyed on `syncedAt` age. Each successful sync, including manual, webhook, and scheduled, updates `syncedAt` to now, even when the commit is unchanged. The server serves the latest synced pack.

6. **Empty cache returns an empty framework.** When the cache is empty, `sdd_install_framework` returns a valid result with zero files, an empty ledger, `pack_complete: true`, and a `cache_empty: true` flag. It does not return `sync_pending` and does not name a git host or repository. The agent writes an empty `.sdd-installed.json` or skips. The operator syncs the pack on the admin portal or via webhook. The next install call gets real files.

7. **`--os` is validated.** The resolver returns `os_unsupported` for an unknown value. It does not fall to `default` and hide a wrong argument.

8. **Unknown clients use the seed map.** Unknown clients are added by updating `packages/sdd-paths/paths.json` (PATH-01). The writer binary does not call an LLM at install time. The LLM discovery path in `src/core/path-resolve-llm.ts` is not used by the end-user install.

9. **Fix the hard-coded template path in the pack.** The skills, rules, and the agent hard-code `{client_root}/templates/framework.sdd.works/...` in 40-plus places. The pack repo never had a `framework.sdd.works/` level under `templates/` (zero git commits touch that path), and the pack `constants.json` defines `"templates_dir": "templates"`. The `framework.sdd.works/` level is a fiction in the skill text. The fix is to change those references to `{client_root}/templates/...`, matching `constants.json` and the pack repo structure. The pack repo structure stays as it is. This is MC-15 and is done in the pack repo, not in this codebase.

## Rationale

The candidate root flag added confusion without value: all known clients are in the seed map, and the path table already wins for known clients. Removing it makes the writer output the only thing the agent needs to check. The age gate blocked content-current packs and forced an operator sync that served no safety purpose. Returning an empty framework on an empty cache keeps the git repo out of the tool result and lets the agent proceed without error.

## Consequences

- `public/agent-setup/prompt.md` loses its install section. The install instructions move into the `sdd_install_framework` tool result text.
- `src/mcp/write-mode.ts` removes the `--client-root` flag and adds `accepted_root` plus the file list to the stdout.
- `src/core/sync/sync-job.ts` updates `syncedAt` on `unchanged`.
- `src/core/tools/install-http.ts` drops the `cacheAgeMinutes > CACHE_STALE_MINUTES` check and returns an empty manifest when the cache is empty.
- `packages/sdd-paths/resolver.ts` returns `os_unsupported` for an unknown `os`.
- ADR-129 remains the implemented path until the code and the setup markdown change.

## Decision (continued)

10. **Remove the local LLM discovery path.** `src/core/path-resolve-llm.ts` is no longer called from the stdio program or the writer binary. The `skipLlm` flag is removed from every caller. The seed map (`packages/sdd-paths/paths.json`) is the single path source for every transport. Unknown clients return `client_unknown` or `client_config_unresolved` and are added by a seed map update, not by Qwen at runtime. This removes the client-side Qwen dependency and stops sending local config snippets to a third-party LLM from the user machine.

## Deferred option: server-side LLM discover endpoint

A server-side LLM discover endpoint is deferred, not part of the first release. The shape, if it is needed later:

- The stdio program encounters an unknown client. It reads local config files and env vars, redacts them with the existing `redactConfigSnippet` logic, and POSTs to `POST /api/sdd/discover-paths` with `{client, os, redactedSnippets}`.
- The server holds `QWEN_API_KEY`. It calls Qwen, validates the proposal paths against the path policy server-side, and returns `{skillsRoot, rulesRoot, agentsRoot, workflowsRoot, confidence, rationale}` or `{code: "llm_unavailable"}`.
- The stdio program validates the returned paths again locally, because the server response is untrusted input, and uses them or returns `client_config_unresolved`.

This keeps Qwen credentials server-side only. The client sends redacted snippets, not raw config. The client does the final path-policy validation.

The cost: local config snippets still leave the client machine, even redacted. The server does LLM work per unknown-client install. For known clients, the endpoint is unused. This is why it is deferred until an unknown client actually needs runtime discovery. The seed map update remains the first response to a new client.

## Date

2026-10-09
