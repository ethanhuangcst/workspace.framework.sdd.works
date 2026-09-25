# framework.sdd.works — Requirements Spec

## 1. Overview

**framework.sdd.works** is an MCP (Model Context Protocol) service plus an **admin portal**. The MCP server installs and updates a Spec-Driven Development (SDD) framework in the AI coding client that calls it, and can return named key values. The admin portal manages accounts, keys, and a read-only live view of the framework repository.

User-facing copy (MCP messages where shown to users, and the admin UI) SHALL support **i18n**: Simplified Chinese, Traditional Chinese, and English.

## 2. Goals

- Provide one MCP entry point to install and update the SDD framework in supported clients.
- Deliver a consistent set of SDD assets: skills, rules, and supporting folders.
- Expose a controlled `sdd_get_key` tool for named key/value lookup, and `sdd_list_versions` for discovery before install.
- Provide an admin portal for account management, key CRUD, Settings (one GitHub repository URL), and a read-only real-time sync view of the configured GitHub repo.
- Keep core MCP logic transport-agnostic; support local (**stdio**) and remote (**Streamable HTTP**) as needed.
- Validate untrusted inputs; never leak secrets in logs or in responses other than the authorized `sdd_get_key` path.

## 3. Supported Clients

### 3.1 IDEs

- Cursor
- Codex (ChatGPT app)
- GitHub Copilot
- AWS Kiro
- CodeBuddy / CodeBuddy CN
- TRAE / TRAE CN
- VS Code

### 3.2 Agents

**Confirmed / named targets**

- Cursor Agents
- WorkBuddy / WorkBuddy CN
- TRAE Agents — *MCP / install-path support needs verification before treating as first-class*

**Other popular agent tools** (candidate support; path maps and MCP transport to be confirmed per client)

| Agent | Notes |
| --- | --- |
| Claude Code | Terminal-first agent; strong native MCP (stdio / HTTP) |
| Claude Desktop | Desktop MCP client (Anthropic) |
| OpenAI Codex CLI | Agent / CLI surface related to Codex |
| GitHub Copilot coding agent | Async / agent mode in Copilot ecosystem |
| Windsurf (Cascade) | AI IDE agent; MCP support partial–native depending on version |
| Cline | VS Code–oriented agent; common MCP client |
| Continue | Open IDE agent extension; MCP-capable |
| Gemini CLI | Google terminal agent |
| OpenCode | Open-source multi-provider agent harness |
| Devin | Autonomous coding agent (integration model TBD) |
| Replit Agent | Cloud IDE agent (integration model TBD) |

Support tiers: **first-class** (documented install paths + tested MCP) vs **candidate** (listed here; verified later). TRAE Agents starts as candidate until verified.

### 3.3 Other tools

- Chatbox ([chatboxai.app](https://chatboxai.app))
- Third-party apps (including web apps the operator builds)

### 3.4 Operating systems

- macOS
- Windows
- Linux

Install/update path resolution MUST account for client- and OS-specific config locations where those clients differ.

## 4. SDD Framework Contents

The framework package includes at least:

| Asset | Description | Typical install location (example) |
| --- | --- | --- |
| **Skills** | Folders that each contain a `SKILL.md` (and related files) | Client-specific skills root (e.g. `~/.cursor/skills/<skill_folder>/`) |
| **Rules** | Persistent agent rules (e.g. `.mdc` files) | Client-specific rules root (e.g. `~/.cursor/rules/`) |
| **Other folders** | Supporting SDD assets (spec templates, scripts, config) as defined by the package | Tool-appropriate paths under user config or project |

Exact inventory and target paths are defined per client and by the published framework package version.

## 5. Actors

| Actor | Role |
| --- | --- |
| **MCP client** | Supported IDE or tool that invokes MCP tools (`sdd_install_framework`, `sdd_update_framework`, `sdd_list_versions`, `sdd_get_key`) |
| **Developer (end user)** | Approves MCP connection and local filesystem writes |
| **Admin** | Signs in to the admin portal to manage accounts, keys, and view repo sync |
| **framework.sdd.works** | MCP server + admin portal backend |

## 6. Functional Requirements — MCP

### 6.1 MCP surface

- FR-M1: The product SHALL expose an MCP server with typed tool input schemas (e.g. Zod).
- FR-M2: Tool descriptions SHALL state parameters, success shape, and failure modes so the model can choose the correct tool.
- FR-M3: The server MAY expose **resources** for read-only inspection of package manifests, versions, or asset lists (URIs), without side effects.
- FR-M4: Business logic (resolve package, validate target, write files, resolve keys) SHALL be transport-agnostic; stdio or Streamable HTTP SHALL be wired only at server bootstrap.
- FR-M5: MCP user-visible messages and descriptions that are shown in the product UI SHALL be i18n keys for **en**, **zh-Hans** (Simplified Chinese), and **zh-Hant** (Traditional Chinese), with a defined missing-key fallback.

### 6.2 MCP tools

| Tool | Purpose |
| --- | --- |
| `sdd_install_framework` | Install the SDD framework (skills, rules, and other package folders) into the calling client’s configured paths |
| `sdd_update_framework` | Update an existing SDD framework install to a specified or latest package version (idempotent where practical) |
| `sdd_list_versions` | List available framework package versions and a high-level inventory before install or update |
| `sdd_get_key` | Return the plaintext `key_value` for a given `key_name` from the managed key store |

- FR-M6: `sdd_install_framework` SHALL place framework assets for the detected or specified client/OS using seed path maps and/or Qwen-assisted local config discovery (FR-M11), and return a structured summary (paths, version, asset counts, resolution source).
- FR-M7: `sdd_update_framework` SHALL refresh an existing install; re-running with the same version SHALL be idempotent or clearly report “already up to date.”
- FR-M8: `sdd_install_framework` / `sdd_update_framework` SHALL fail safely if the target path is invalid, outside allowed roots, or would overwrite user data without an explicit overwrite/merge policy.
- FR-M9: `sdd_get_key(key_name)` SHALL look up the store by `key_name` and return the plaintext `key_value` when the caller is authorized and the key exists; otherwise a structured error (not found / unauthorized) without leaking other keys.
- FR-M10: `sdd_list_versions` SHALL list available framework versions and a high-level inventory before install or update (optional read-only resources MAY mirror the same data).
- FR-M11: On **stdio** install/update, the system SHALL use **Qwen** (OpenAI-compatible) to search and interpret **local client configuration** (settings / MCP config / known skill-rule hints) together with a **seed path map**, then propose install roots. Every proposed path SHALL pass the path allow-list before any write (ADR-047).
- FR-M12: If Qwen is unavailable or confidence is below threshold, the system SHALL fall back to the seed path map and/or an explicit `client` argument. If roots remain unresolved, the tool SHALL return `client_config_unresolved` or `llm_unavailable` and SHALL NOT write files.
- FR-M13: Prompts and LLM responses for path discovery SHALL NOT include `key_value`, env secrets, or full credential-bearing config blobs — redacted path-related snippets only.
- FR-M14: Streamable HTTP install/update (fallback, ADR-054 / ADR-058) SHALL NOT run Qwen path discovery against Server 2 disk or write user config roots on the server. HTTP returns `packageUrl`, paths, manifest (with `pack_complete`), and extraction instructions for AI shell execution.
- FR-M15: On **stdio** install/update, the system SHALL first attempt **deterministic** path resolution (explicit `client` arg, MCP `clientInfo.name`, client env vars such as `CLAUDE_CONFIG_DIR` / `CODEX_HOME` / `CLINE_DIR` / `KIRO_HOME`, and config-file probes) before Qwen (FR-M11) or the seed map (FR-M12). The install/update summary SHALL report `resolution_source` as one of `env` | `config` | `seed` | `llm`. Unrecognized `clientInfo` with no explicit `client` SHALL fail closed (`client_unknown`) with no writes.
- FR-M16: Install/update idempotency SHALL compare the **resolved commit SHA** of the materialized package, not just the ref label. Same ref with a new commit SHALL reinstall (manifest-tracked merge). `already_up_to_date` requires matching `package_commit`, matching `package_version`, and intact manifest-listed files (ADR-052).
- FR-M17: The operator server SHALL run a **sync job** that fetches framework files from the configured GitHub repo and stores unpacked files + tarball + version metadata in a local cache (`.data/sdd-packages/`). Sync is idempotent on unchanged commit SHA (ADR-053).
- FR-M18: The operator server SHALL expose a public REST API: `GET /api/sdd/versions` (version list + inventory) and `GET /api/sdd/package?version=<v>` (tarball stream with `X-SDD-Commit` / `X-SDD-Version` headers). Returns `409 sync_pending` when cache is empty (ADR-053).
- FR-M19: The **stdio** MCP server SHALL fetch package data from the operator REST API (`SDD_SERVER_URL`), not from PostgreSQL or GitHub directly (ADR-053).
- FR-M20: All four MCP tools (`sdd_install_framework`, `sdd_update_framework`, `sdd_list_versions`, `sdd_get_key`) SHALL be registered on **HTTP MCP**. The stdio binary registers install, update, and list only (ADR-053). Primary end-user install writes locally over stdio (ADR-058). HTTP install returns tarball URL instead of writing locally (fallback, ADR-054).
- FR-M21: The operator server SHALL expose `GET /setup` (markdown) with agent-specific MCP configuration instructions for prompt-based setup (SETUP-01, ADR-058, ADR-061): download `~/.sdd/sdd-mcp`, write a `command` entry; HTTP URL as fallback. `GET /agent-setup` SHALL redirect to `GET /setup`. The person SHALL NOT be asked to edit the MCP file by hand.

### 6.3 Transport

| Client context | Transport |
| --- | --- |
| Local desktop MCP | **stdio** |
| Remote / shared / cloud / third-party web apps | **Streamable HTTP** (current MCP spec); legacy HTTP/SSE only if required for old clients |

Streamable HTTP SHALL enforce authentication. Do not rely on obscure tool names for security.

## 7. Functional Requirements — Admin Portal

### 7.1 Auth & accounts

- FR-A1: Admins SHALL sign in with **email + password**.
- FR-A1a: The default admin SHALL be seeded with email `me@ethanhuang.com` (or `ADMIN_SEED_EMAIL`) and a password from **`ADMIN_SEED_PASSWORD`**; seed SHALL fail if that password is missing or blank (SEED-01).
- FR-A2: Admins SHALL be able to **reset password via email**.
- FR-A3: The portal SHALL support **admin account management** (create, view, update, deactivate/delete as defined in design).

### 7.2 Pages

| Page | Requirements |
| --- | --- |
| **framework.sdd.works** (home / framework view) | **Read-only**, **real-time sync** from the configured GitHub repository (live view of framework contents; no edit-in-portal of repo files in v1) |
| **Keys** | Create, view, edit, and delete keys (`key_id`, `key_name`, `key_description`, `key_value`) used by `sdd_get_key`. List shows name, description, and value. Copy / edit / delete — no regenerate. |
| **Settings** | Maintain the single GitHub repository URL used for the framework real-time sync |

- FR-A4: Settings SHALL let an authenticated admin view and save **one** GitHub repository URL. Save is available only when the URL has changed. On save, the system SHALL verify the repository is reachable; on success show a tip and persist; on failure show a tip and leave the stored URL unchanged.
- FR-A5: The framework page SHALL sync from the GitHub URL configured in Settings (not a hard-coded-only source of truth).

### 7.3 i18n

- FR-A6: All admin UI strings SHALL use i18n keys for **en**, **zh-Hans**, and **zh-Hant**.
- FR-A7: Locale-sensitive formatting (dates, numbers) SHALL follow the active locale.
- FR-A8: Switching locale SHALL not crash on missing keys; missing keys SHALL fall back per project policy (default locale or key name).

## 8. Non-Functional Requirements

- NFR-1 **Secrets**: Environment secrets and credentials MUST NOT appear in client logs. Key **values** MAY be returned only from `sdd_get_key` (MCP) or the Keys page (authenticated admin UI)—never from unrelated tools, resources, or error payloads.
- NFR-2 **Auth**: Protect Streamable HTTP MCP and the admin portal; session/password reset flows MUST be CSRF-safe and rate-limited where applicable.
- NFR-3 **Validation**: Treat all tool and form inputs as untrusted; validate and sanitize before filesystem, DB, or network side effects.
- NFR-4 **Errors**: Structured, model- and user-safe messages; no stack traces to clients.
- NFR-5 **Cost / rate**: Document expensive or rate-limited MCP operations (including Qwen path discovery) in tool descriptions; apply backoff and short-TTL resolution cache where needed.
- NFR-6 **Compatibility**: Pin `@modelcontextprotocol/sdk` (or equivalent) and verify registration APIs against the pinned version.
- NFR-7 **Cross-platform**: `sdd_install_framework` / `sdd_update_framework` behavior MUST be verified on macOS, Windows, and Linux for at least one primary client path per OS in the test plan.
- NFR-8 **LLM safety**: Model-proposed install paths are advisory until allow-list validation; never write outside allowed roots based on LLM output alone.
- NFR-9 **Client dependencies (end users)**: End users SHALL NOT require Node, npm, Bun, PostgreSQL, or operator secrets (`DATABASE_URL`, `GITHUB_TOKEN`, `KEYS_ENCRYPTION_KEY`) to connect MCP or install the framework. Primary path (ADR-058): one OS-specific stdio binary (`~/.sdd/sdd-mcp`) configured by the website prompt; that program writes pack files. Fallback (ADR-054): HTTP MCP URL + AI tarball extraction when the binary cannot be installed or the client accepts only a URL. Terminal curl installer remains available (ADR-051, ADR-053).

## 9. Out of Scope (initial)

- Authoring or editing individual skills/rules inside an MCP session (beyond `sdd_install_framework` / `sdd_update_framework` of the package).
- Hosting arbitrary third-party skill marketplaces unrelated to this SDD package.
- Automatic commits or pushes of installed assets into the user’s git repositories.
- In-portal editing of GitHub-synced framework files (read-only sync only).

## 10. Acceptance Criteria (draft)

### MCP

1. A supported MCP client can connect and call `sdd_install_framework`, `sdd_update_framework`, `sdd_list_versions`, and `sdd_get_key`.
2. `sdd_install_framework` places skills (with `SKILL.md`), rules, and other package folders into the resolved target paths for that client/OS (seed map and/or Qwen-assisted config discovery, then allow-list).
3. `sdd_update_framework` with the same version is idempotent or clearly reports already up to date.
4. `sdd_get_key` returns the correct value for an existing `key_name` and a structured error when missing or unauthorized.
5. `sdd_list_versions` returns available package versions and a high-level inventory without writing files or leaking key values.
6. Invalid or disallowed install paths return a structured error without writing files.
7. User-visible MCP/admin strings resolve for en / zh-Hans / zh-Hant without missing-key crashes.
8. The same core install/update/key logic works behind stdio and, when enabled, Streamable HTTP.
9. When client config is ambiguous or Qwen fails and seed map cannot resolve roots, install/update returns a structured error and writes nothing.
10. Path-discovery prompts do not contain key store values or env secrets.

### Admin portal

9. Admin can register/manage accounts, log in with email+password, and reset password via email.
10. Framework page shows a read-only tree from the local SYNK-01 package cache (same source as MCP install); top-level artifact folders expand one level by default with indented child entries; admin can force-sync from Settings URL via Sync with git repository.
11. Keys page supports create / view / edit / delete of `key_id` / `key_name` / `key_description` / `key_value`; list shows name, description, and key; actions are copy / edit / delete (no regenerate); `sdd_get_key` resolves by `key_name` and returns plaintext `key_value`.
12. Settings page stores one GitHub repository URL; Save is disabled until the URL changes; on save the system verifies reachability then persists (or shows a failure tip and does not change the stored URL); changing the URL updates what the framework page syncs.
13. No key values appear in unauthenticated responses or public logs.

## 11. Decisions

| Topic | Decision |
| --- | --- |
| Settings / GitHub URL | **In scope for v1** — admins maintain one GitHub repo URL in Settings; framework sync reads from that link |
| MCP tool names | `sdd_install_framework`, `sdd_update_framework`, `sdd_list_versions`, `sdd_get_key` |
| Product LLM | **Qwen** for MCP stdio client-config path discovery only (ADR-047); no portal chat LLM |
| Default admin seed | Email `me@ethanhuang.com`; password from `ADMIN_SEED_PASSWORD` (SEED-01) |

## 12. Open Questions

1. **Traditional Chinese variant**: Prefer Taiwan (`zh-TW`) or Hong Kong (`zh-HK`) copy for `zh-Hant`, or one shared Traditional Chinese catalog?
2. **Merge vs overwrite** when the user already has custom rules or skills with the same names?
3. **Client detection UX**: Prefer explicit `client` argument; otherwise seed + Qwen may detect. What should the tool return when detection confidence is medium (ask caller vs fail closed)?
4. **`sdd_get_key` auth model**: API key, MCP session token, or same admin-issued credential as Streamable HTTP?
5. **Framework package source**: This repo’s GitHub sync, a release artifact, or both?
6. **TRAE Agents**: Confirm MCP support and SDD install paths (skills/rules roots) for TRAE Agents vs TRAE IDE.
7. **Agent first-class set for v1**: Beyond Cursor Agents and WorkBuddy / WorkBuddy CN, which of the candidate agents (Claude Code, Cline, Windsurf, etc.) ship with documented path maps in the first release?
