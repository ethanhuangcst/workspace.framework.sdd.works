# ADR-047 — Qwen LLM for MCP client install-path discovery

**Status:** Accepted  
**Date:** 2026-09-14  
**Context:** `sdd_install_framework` / `sdd_update_framework` must place skills and rules into many IDE/agent clients (Cursor, Claude Code, Cline, VS Code, Copilot, WorkBuddy, …) across macOS / Windows / Linux. Static path maps alone drift as vendors change config layouts. The operator already provisions Aliyun Bailian **Qwen** (`QWEN_*` in `.env.local`).

## Decision

1. **Primary LLM:** Qwen via OpenAI-compatible Chat Completions (`QWEN_BASE_URL` + `QWEN_CHAT_MODEL`, fallback `QWEN_CHAT_MODEL_FALLBACK`). Native Bailian URL remains available as `QWEN_NATIVE_BASE_URL` but install discovery uses the compatible-mode endpoint unless an ADR revises that.
2. **Scope of LLM use:** Only the **MCP stdio** install/update path-resolution step — search and interpret **local client configuration** (settings files, MCP config, known skill/rule directory hints) to propose install roots. **Not** a product chat LLM on the admin portal. **Not** used for `sdd_get_key`, version listing, or GitHub sync.
3. **Hybrid resolver:** Keep a small **seed path map** (documented defaults per client/OS). On install/update:
   1. Collect candidate config file paths under allow-listed user roots (no `..` escape).
   2. Read redacted snippets (paths and known config keys only — never API keys, tokens, or `key_value` store contents).
   3. Call Qwen with a structured prompt to return JSON `{ skillsRoot?, rulesRoot?, otherRoots?, confidence, rationale }`.
   4. **Validate** every proposed path with the same path allow-list as today; reject → `path_rejected` / `client_config_unresolved`.
   5. If Qwen is unavailable or confidence is below threshold → fall back to seed map + explicit `client` argument; never invent roots outside allow-list.
4. **HTTP MCP:** LLM discovery runs only where the process can see the caller’s filesystem (stdio). HTTP remains under `local_install_required` / local-bridge policy (MCPI-03).
5. **Image / multimodal:** `QWEN_IMAGE_MODEL` is reserved; **out of scope** for install-path discovery.

## Consequences

- Tech-spec “no product LLM” is **superseded** for this narrow MCP use case.
- Env codes: `QWEN_API_KEY`, `QWEN_BASE_URL`, `QWEN_CHAT_MODEL`, optional fallback and host/region metadata (see tech-spec).
- Tests: unit-test path allow-list + JSON schema of LLM output with **fixture** LLM responses in default CI; live Qwen is opt-in.
- Cost/latency: document in tool descriptions; cache successful resolution per `(client, os, config mtime hash)` for a short TTL.
- Open question “auto-detect vs required `client`” becomes: **prefer explicit `client` when provided**; otherwise LLM + seed may detect; unknown → structured error, no writes.

## Alternatives rejected

- Static-only path encyclopedia grown in source for every client (brittle; contradicts maintainability).
- Asking the calling IDE’s own model to invent paths without server-side allow-list (unsafe).
- Portal-side chat LLM for operators (out of product scope).
