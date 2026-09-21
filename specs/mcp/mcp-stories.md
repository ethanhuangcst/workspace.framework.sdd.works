# framework.sdd.works — MCP service user stories

MCP server that installs and updates the SDD framework and resolves named keys. Stories and ACs for the **MCP** surface. Admin portal: [`app-stories.md`](../admin-portal/app-stories.md). Design: [`mcp-design.md`](./mcp-design.md). Phase 1 backlog: [`r1-product-backlog.md`](../phase1-specs/r1-product-backlog.md). Phase 2 backlog: [`product-backlog.md`](../product-backlog.md).

**Phase 2 upcoming (no Gherkin yet):** [Install whole git artifacts](../product-backlog.md#pb-2) will extend install/update beyond skills, rules, agents, and workflows. Acceptance scenarios are written when that story starts.

**Tools:** `sdd_install_framework`, `sdd_update_framework`, `sdd_list_versions`, `sdd_get_key`. Protocol ids are not localized.

**Roles:** MCP client (IDE/agent), Developer, Admin.

**Default Given:** unless stated, the MCP client is connected and authorized where the tool requires auth.

Open questions (do not block ACs that can use explicit `client`): ~~merge vs overwrite~~ (DECIDED: manifest-tracked merge, ADR-048); auto-detect vs required `client` (Cursor-first; prefer explicit `client` when ambiguous); `sdd_get_key` credential type; ~~TRAE Agents first-class vs candidate~~ (CONFIRMED first-class via empirical spike 2026-09-17).

---

## `sdd-mcp-path-map` — Client path map (seed data + resolver)

Versioned data file `packages/sdd-paths/paths.json` + transport-agnostic resolver. Architecture foundation for install/update. v1 ships Cursor seed only. (PATH-01)

### User story 1 — Resolver returns allow-listed roots

**As the** install/update core
**I want** a single resolver that maps `(client, os)` to `{ skills, rules, other }` roots
**So that** writes always target documented client config dirs and never escape the user home

#### AC1

```gherkin
Scenario: Cursor roots resolve per OS
  Given the path map contains cursor with default and darwin/win32/linux entries
  When the resolver is called with client "cursor" and os "darwin"
  Then the result is { skills, rules, other } under ~/.cursor/... for darwin
  And the same call for win32 returns roots under %USERPROFILE%\.cursor\...
  And every returned path starts with the user home after expansion
```

#### AC2

```gherkin
Scenario: Explicit overrides win
  Given the resolver is called with client "cursor" and os "darwin"
  And the caller supplies explicit skills/rules/other overrides
  Then the resolver returns the overrides
  And the overrides still pass path-policy before any write
```

#### AC3

```gherkin
Scenario: Unknown client or OS is rejected
  Given the path map has no entry for client "unknown-cli"
  When the resolver is called with client "unknown-cli"
  Then the result code is client_unknown
  And no paths are returned
  Given the path map has cursor but no win32 entry and no default
  When the resolver is called with client "cursor" and os "win32"
  Then the result code is os_unsupported
```

#### AC4

```gherkin
Scenario: Escaped or out-of-root path is rejected
  Given any resolved or overridden path contains ".." or escapes the user home after expansion
  When path-policy validates it
  Then the result code is path_rejected
  And the path is not used for writes
```

### User story 2 — The map is versioned and validated in CI

**As a** maintainer
**I want** the path map to be a versioned JSON file validated by schema and unit tests on every PR
**So that** path changes are reviewable data edits, not code changes, and stale installs can warn

#### AC5

```gherkin
Scenario: CI rejects an invalid map
  Given a PR edits packages/sdd-paths/paths.json
  When the table-validation unit test runs
  Then every entry resolves under HOME or USERPROFILE
  And no entry contains ".."
  And every client has a default entry
  And trailing slashes are consistent
  And the PR fails CI if any of the above is violated
```

#### AC6

```gherkin
Scenario: Map version is exposed for staleness warnings
  Given the path map has version N
  When sdd_list_versions is implemented (Sprint 5)
  Then its output includes paths_version N
  So a local install whose stored map version is older than N can warn the user
```

### Notes

- Updates are reactive (human PR, bump `version`), not scheduled. No daily job, no auto-discovery in v1.
- The map is mechanism (where to write files), not product knowledge. Do not grow it into a per-client POI encyclopedia (`no-city-encyclopedia`).
- Qwen discovery (MCPI-04) layers on top of this map as a fallback/refinement, never replacing it.

---

## `sdd-mcp-transport-stdio` — stdio transport

Node stdio entry registers tools with pinned `@modelcontextprotocol/sdk`. Core is transport-agnostic. (TRAN-01)

### User story 1 — Local client connects over stdio

**As a** developer using a local MCP client
**I want** the server to start on stdio and advertise the four SDD tools
**So that** my IDE can call install, update, list, and get_key

#### AC1

```gherkin
Scenario: stdio server advertises SDD tools (no get_key)
  Given the MCP stdio process is started
  When the client completes initialize and lists tools
  Then the tool list includes sdd_install_framework, sdd_update_framework, and sdd_list_versions
  And the tool list does not include sdd_get_key
  And each tool description states parameters, success shape, and failure modes
```

#### AC2

```gherkin
Scenario: Invalid tool arguments are rejected before side effects
  Given the MCP stdio process is started
  When the client calls a registered tool with arguments that fail the input schema
  Then the call fails with a structured validation error
  And no files are written
  And no key values are returned
```

---

## `sdd-mcp-transport-http` — Streamable HTTP transport

HTTP entry on `/mcp` with bearer or session auth. Same core as stdio. (TRAN-02)

### User story 1 — Remote client connects over HTTP

**As a** developer using a remote MCP client
**I want** to call the same tools on `/mcp` with a bearer token
**So that** cloud clients and third-party apps can use the service

#### AC1

```gherkin
Scenario: Authorized HTTP client lists tools
  Given Streamable HTTP MCP is available at /mcp
  And the client sends a valid bearer token
  When the client completes initialize and lists tools
  Then the tool list includes the same four SDD tools as stdio
```

#### AC2

```gherkin
Scenario: Missing or invalid bearer is rejected
  Given Streamable HTTP MCP is available at /mcp
  When the client calls /mcp without a valid bearer token
  Then the result is unauthorized
  And no tool runs
  And no stack trace is returned
```

---

## `sdd-mcp-list-versions` — `sdd_list_versions`

List available package versions and a high-level inventory. Read-only. No key values. (MCPL-01)

### User story 1 — Discover versions before install

**As an** MCP client
**I want** to list available framework versions and inventory
**So that** the model can choose a version before install or update

#### AC1

```gherkin
Scenario: List versions and inventory from sync cache
  Given the operator server has run a successful package sync
  When the client calls sdd_list_versions over HTTP
  Then the result includes one or more version identifiers from the sync manifest
  And the result includes a high-level inventory of skills, rules, agents, and workflows
  And no key values are present
  And no files are written
```

#### AC3

```gherkin
Scenario: stdio list_versions fetches from operator REST API
  Given the stdio binary is configured with SDD_SERVER_URL pointing at the operator server
  And the operator server has run a successful package sync
  When the client calls sdd_list_versions over stdio
  Then the result includes versions and inventory from GET /api/sdd/versions
  And no database or GitHub calls are made from the stdio process
```

#### AC2

```gherkin
Scenario: List fails when the package source is unavailable
  Given the configured GitHub repository cannot be read
  When the client calls sdd_list_versions
  Then the result is a structured error
  And the call is not reported as empty success
```

---

## `sdd-mcp-get-key` — `sdd_get_key`

Caller passes `key_name`. MCP reads `key_value` from the store and returns it in plaintext when authorized. (MCPK-01)

### User story 1 — Resolve a named key

**As an** MCP client
**I want** to retrieve a key value by name
**So that** the calling tool can use operator-stored secrets (for example AI API keys) without storing them in the client repo

#### AC1

```gherkin
Scenario: Authorized get of an existing key
  Given a key named "cursor-prod" exists in the store with a key_value
  And the client is authorized for sdd_get_key
  When the client calls sdd_get_key with key_name "cursor-prod"
  Then the plaintext key_value for that name is returned
```

#### AC2

```gherkin
Scenario: Missing key
  Given the client is authorized for sdd_get_key
  And no key named "missing-key" exists
  When the client calls sdd_get_key with key_name "missing-key"
  Then the result code is not_found
  And no other key names or values are returned
```

#### AC3

```gherkin
Scenario: Unauthorized get_key
  Given a key named "cursor-prod" exists
  And the client is not authorized for sdd_get_key
  When the client calls sdd_get_key with key_name "cursor-prod"
  Then the result code is unauthorized
  And the key value is not returned
```

---

## `sdd-mcp-install` — `sdd_install_framework` (stdio + HTTP, Cursor)

Install skills (with `SKILL.md`), rules, and other folders into Cursor paths. Stdio writes locally; HTTP returns tarball URL for AI extraction (ADR-054). Path allow-list. Structured summary. (MCPI-01)

### User story 1 — Install SDD framework for Cursor

**As a** developer on Cursor
**I want** to install the SDD framework into Cursor skill and rule paths
**So that** the IDE can use the package skills and rules

#### AC1

```gherkin
Scenario: Install writes skills, rules, and other folders
  Given the client is Cursor on the developer machine over stdio
  And the operator server has synced the requested package version
  And SDD_SERVER_URL points at the operator server
  When the client calls sdd_install_framework for that version
  Then the stdio process fetches the package from GET /api/sdd/package
  And skills each containing SKILL.md are written under the Cursor skills root
  And rules are written under the Cursor rules root
  And other package folders are written to documented paths
  And the result includes paths, version, and asset counts
```

#### AC2

```gherkin
Scenario: Invalid or escaped path is rejected
  Given the client calls sdd_install_framework
  When the resolved target is outside allowed user config roots or contains path escape
  Then the result code is path_rejected
  And no files are written
```

#### AC3

```gherkin
Scenario: Manifest exists but files were deleted
  Given the client has .sdd-installed.json matching the requested version
  And the listed skill or rule folders have been manually deleted
  When the client calls sdd_install_framework for that version
  Then the tool reinstalls all package files
  And the result includes paths, version, and asset_counts
  And the result code is not already_up_to_date
```

#### AC4

```gherkin
Scenario: Force reinstall when version matches
  Given the client has a complete install at version A
  When the client calls sdd_install_framework with force true for version A
  Then the tool reinstalls all package files
  And the result includes version A and asset_counts
```

#### AC5

```gherkin
Scenario: Same ref label but repo content changed
  Given the client has .sdd-installed.json for ref main at commit SHA-A
  And the GitHub repo at ref main now resolves to commit SHA-B with different skills
  When the client calls sdd_install_framework for main
  Then the tool reinstalls all package files from SHA-B
  And stale package-owned skills from SHA-A are removed
  And the result is not already_up_to_date
```

---

## `sdd-mcp-update` — `sdd_update_framework` (stdio, Cursor)

Refresh an existing install. Idempotent on the same version. (MCPU-01)

### User story 1 — Update to a chosen or latest version

**As a** developer with an existing Cursor install
**I want** to update the SDD framework
**So that** skills and rules match the chosen package version

#### AC1

```gherkin
Scenario: Update to a newer version
  Given Cursor already has the SDD framework at version A
  And version B is available and newer than A
  When the client calls sdd_update_framework for version B
  Then the install matches version B
  And the result includes a structured summary of changes
```

#### AC2

```gherkin
Scenario: Same version is idempotent
  Given Cursor already has the SDD framework at version A
  When the client calls sdd_update_framework for version A
  Then the result code is already_up_to_date
  And existing user files are not rewritten without cause
```

---

## `sdd-mcp-cross-client` — Cross-client path resolution

Seed path maps for first-class clients across macOS, Windows, and Linux, plus **Qwen-assisted** search of local client configuration to determine install roots (ADR-047). TRAE Agents stays candidate until verified. (MCPI-02, MCPI-04)

### User story 1 — Install uses resolved client paths

**As a** developer on a first-class client
**I want** install and update to resolve that client’s skills/rules roots from seed maps and local config
**So that** assets land where the client loads skills and rules

#### AC1

```gherkin
Scenario: First-class client roots are resolved and used
  Given the client argument or detection is Cursor Agents, WorkBuddy, WorkBuddy CN, Claude Code, Cline, VS Code, Codex, or Copilot
  And the OS is macOS, Windows, or Linux
  When the client calls sdd_install_framework over stdio
  Then files are written only under that client’s resolved skills and rules roots for that OS
  And every written path passed the path allow-list
```

#### AC2

```gherkin
Scenario: Unknown or unverified client is rejected
  Given the client is not in the first-class seed map
  And Qwen cannot confidently resolve config roots
  When the client calls sdd_install_framework
  Then the result is a structured error
  And no files are written
```

---

## `sdd-mcp-path-llm` — Qwen client-config discovery

Use Qwen to search local client configuration when installing skills/rules across clients. Fallback to seed map. (MCPI-04)

### User story 1 — LLM proposes roots from config snippets

**As a** developer installing the SDD framework on a supported client
**I want** the MCP server to inspect my local client config with Qwen
**So that** install targets match how that client is actually configured

#### AC1

```gherkin
Scenario: Qwen proposes allow-listed roots from redacted config
  Given stdio MCP on the developer machine
  And Qwen credentials are configured
  And candidate config files exist under allow-listed user roots
  When the client calls sdd_install_framework for a first-class client
  Then the server sends only redacted path-related config snippets to Qwen
  And Qwen returns structured skills and rules roots
  And those roots pass path-policy before any write
  And the install summary includes the resolution source llm or seed
```

#### AC2

```gherkin
Scenario: Qwen unavailable falls back to seed map
  Given Qwen is unavailable or returns low confidence
  And the seed path map has defaults for the explicit client argument
  When the client calls sdd_install_framework
  Then roots come from the seed map
  And files are written only under allow-listed seed roots
```

#### AC3

```gherkin
Scenario: Unresolved roots write nothing
  Given Qwen is unavailable or low confidence
  And the seed map cannot resolve the client
  When the client calls sdd_install_framework
  Then the result code is client_config_unresolved or llm_unavailable
  And no files are written
```

#### AC4

```gherkin
Scenario: LLM-proposed escape is rejected
  Given Qwen returns a path outside allow-listed roots or containing path escape
  When the client calls sdd_install_framework
  Then the result code is path_rejected
  And no files are written
```

---

## `sdd-mcp-path-detect` — Client path detection

Deterministically read client configuration (env vars + config files) to resolve install paths. Fall back to Qwen + seed map. (MCPI-05)

### User story 1 — Auto-detect calling client

**As a** developer calling sdd_install_framework without an explicit client argument
**I want** the MCP server to detect which client I am from the MCP handshake
**So that** I do not have to specify the client every time

#### AC1

```gherkin
Scenario: clientInfo.name auto-detects Cursor
  Given the MCP client sends clientInfo.name "cursor" or "Cursor" in the initialize handshake
  When the client calls sdd_install_framework without a client argument over stdio
  Then the server resolves paths for the cursor client
  And the resolution source is env, config, seed, or llm
  And the result is not client_unknown
```

#### AC2

```gherkin
Scenario: clientInfo.name auto-detects Claude Code
  Given the MCP client sends clientInfo.name "claude-code" or "Claude Code"
  When the client calls sdd_install_framework without a client argument over stdio
  Then the server resolves paths for the claude client
  And the resolution source is env, config, seed, or llm
```

#### AC3

```gherkin
Scenario: Unrecognized clientInfo.name falls back to explicit arg or error
  Given the MCP client sends an unrecognized clientInfo.name
  And no explicit client argument is provided
  When the client calls sdd_install_framework
  Then the result code is client_unknown
  And no files are written
```

### User story 2 — Env var resolution

**As a** developer who relocated my client config directory via an env var
**I want** sdd_install_framework to honor that relocation
**So that** files are written to my actual config location, not the default

#### AC1

```gherkin
Scenario: CLAUDE_CONFIG_DIR relocates skills root
  Given CLAUDE_CONFIG_DIR is set to a non-default absolute path
  When the client calls sdd_install_framework for the claude client over stdio
  Then skills are written under $CLAUDE_CONFIG_DIR/skills/
  And the resolution source is env
```

#### AC2

```gherkin
Scenario: CODEX_HOME relocates skills root
  Given CODEX_HOME is set to a non-default absolute path
  When the client calls sdd_install_framework for the codex client over stdio
  Then skills are written under the resolved Codex skills root under $CODEX_HOME
  And the resolution source is env
```

#### AC3

```gherkin
Scenario: CLINE_DIR relocates skills root
  Given CLINE_DIR is set to a non-default absolute path
  When the client calls sdd_install_framework for the cline client over stdio
  Then skills are written under $CLINE_DIR/skills/
  And the resolution source is env
```

#### AC4

```gherkin
Scenario: KIRO_HOME relocates skills root
  Given KIRO_HOME is set to a non-default absolute path
  When the client calls sdd_install_framework for the kiro client over stdio
  Then skills are written under $KIRO_HOME/skills/
  And the resolution source is env
```

### User story 3 — Config file probe

**As a** developer whose client config file documents custom skill paths
**I want** sdd_install_framework to read the config file
**So that** install targets match the client's actual configuration

#### AC1

```gherkin
Scenario: Config file probe finds customized skills root
  Given the client config file exists at the documented path
  And the config file contains a custom skills root entry
  When the client calls sdd_install_framework over stdio
  Then the server reads the config file and resolves the custom skills root
  And the resolution source is config
  And the resolved path passes the allow-list before any write
```

#### AC2

```gherkin
Scenario: Config file absent falls through to seed map
  Given the client config file does not exist at the documented path
  And no relocating env var is set
  And the seed map has defaults for the client
  When the client calls sdd_install_framework over stdio
  Then roots come from the seed map
  And the resolution source is seed
```

### User story 4 — Fallback to Qwen + seed map

**As a** developer on a client without env vars or config files (Cursor, WorkBuddy, TRAE, Windsurf)
**I want** sdd_install_framework to fall back to Qwen then seed map
**So that** install still works even without deterministic signals

#### AC1

```gherkin
Scenario: No env var, no config file → Qwen → seed
  Given the client has no documented env var for config relocation
  And no config file is found at the documented path
  And Qwen credentials are configured
  When the client calls sdd_install_framework over stdio
  Then the server falls through to Qwen discovery
  And if Qwen resolves, the resolution source is llm
  And if Qwen fails, the seed map is used and the resolution source is seed
```

#### AC2

```gherkin
Scenario: All resolution fails → structured error, no writes
  Given no env var, no config file, Qwen unavailable, and no seed map entry
  When the client calls sdd_install_framework over stdio
  Then the result code is client_config_unresolved or llm_unavailable
  And no files are written
```

### User story 5 — Resolution source in summary

**As a** developer
**I want** the install summary to report how paths were resolved
**So that** I can debug path issues and trust the install target

#### AC1

```gherkin
Scenario: Summary includes resolution_source
  Given the client calls sdd_install_framework over stdio
  When the install completes
  Then the result includes resolution_source with one of: env, config, seed, llm
  And the result includes the resolved paths for skills, rules, and other
```

---

## `sdd-mcp-sync-job` — Server-side framework sync (SYNK-01)

Operator server sync job fetches framework files from GitHub into local cache. (ADR-053)

### User story 1 — Sync framework from GitHub

**As the** operator server
**I want** to sync the configured GitHub repo into a local package cache
**So that** stdio clients can install without direct GitHub or database access

#### AC1

```gherkin
Scenario: Initial sync stores files and manifest
  Given Settings contains a reachable GitHub repository
  When the sync job runs
  Then unpacked files are stored under .data/sdd-packages/<commit-sha>/
  And manifest.json records latestCommit, latestVersion, versions, and inventory
  And a pkg.tar.gz exists for the commit
```

#### AC2

```gherkin
Scenario: New commit triggers cache update
  Given a prior sync stored commit SHA-A
  And the GitHub repo default ref now resolves to commit SHA-B
  When the sync job runs
  Then files for SHA-B are stored
  And manifest.json latestCommit is SHA-B
```

#### AC3

```gherkin
Scenario: Skill renamed in repo
  Given the repo renamed skill tdd to test-driven-dev
  When the sync job runs after the push
  Then the cache inventory lists test-driven-dev
  And tdd is no longer in the cache inventory
```

#### AC4

```gherkin
Scenario: Skill deleted in repo
  Given the repo deleted skill dod
  When the sync job runs after the push
  Then dod is no longer in the cache inventory
```

#### AC5

```gherkin
Scenario: GitHub unavailable preserves stale cache
  Given a prior successful sync exists
  And GitHub is unreachable
  When the sync job runs
  Then the result is sync_error
  And the existing cache and manifest are unchanged
```

#### AC6

```gherkin
Scenario: Same commit is a no-op
  Given the sync job already stored commit SHA-A
  When the sync job runs again without a new commit
  Then the result status is unchanged
  And no duplicate storage is created
```

#### AC7 — GitHub webhook triggers sync (ADR-055)

```gherkin
Scenario: Valid push webhook refreshes cache
  Given GITHUB_WEBHOOK_SECRET is configured
  And a push event with valid HMAC signature
  When POST /api/github/webhook is called
  Then syncFrameworkRepo runs
  And list-versions cache is cleared
```

#### AC8 — Scheduled sync catch-up (ADR-055)

```gherkin
Scenario: Cron route runs scheduled sync
  Given CRON_SECRET is configured
  And Authorization Bearer matches CRON_SECRET
  When POST /api/sync/cron is called
  Then syncFrameworkRepo runs
```

#### AC9 — HTTP install refreshes stale cache (ADR-055)

```gherkin
Scenario: Repo moved ahead of cache on HTTP install
  Given cache latestCommit is SHA-OLD
  And live GitHub tip resolves to SHA-NEW
  When sdd_install_framework runs on HTTP channel
  Then the server syncs before returning packageUrl
  And commitSha in the response is SHA-NEW
  And already_up_to_date is not returned when installed_commit is SHA-OLD
```

#### AC10 — Cache staleness observability (ADR-055)

```gherkin
Scenario: HTTP install exposes cache age
  Given cache syncedAt is older than 30 minutes
  When sdd_install_framework runs on HTTP channel
  Then the response includes cache_synced_at, cache_age_minutes, and cache_stale true
  And instructions mention stale cache advisory
```

### E2E test plan (freshness regression)

| Test | Layer | Assertion |
| --- | --- | --- |
| `install.test.ts` — stale cache + live tip ahead | 3 | Returns new commitSha after refresh; not `already_up_to_date` |
| `webhook/route.test.ts` | 1 | Valid HMAC → sync; bad HMAC → 401 |
| `sync/cron/route.test.ts` | 2 | Valid CRON_SECRET → sync |
| `ensure-cache-fresh.test.ts` | 3 | Sync when cache ≠ live; fresh when equal |
| Opt-in `sync-e2e.test.ts` | all | Real GitHub repo sync unchanged + idempotent |

---

## `sdd-mcp-package-api` — Package REST API (PKAPI-01)

Public REST API serves sync cache to stdio clients. (ADR-053)

### User story 1 — stdio client downloads packages

**As a** stdio MCP binary on an end-user machine
**I want** to fetch package versions and tarballs from the operator server
**So that** I can install without DB, GitHub token, or Prisma

#### AC1

```gherkin
Scenario: Versions endpoint after sync
  Given the operator server has a populated sync cache
  When GET /api/sdd/versions is called
  Then the response is 200 with versions, inventory, paths_version, latestCommit
```

#### AC2

```gherkin
Scenario: Package download
  Given the operator server has a populated sync cache
  When GET /api/sdd/package?version=latest is called
  Then the response is 200 with application/gzip body
  And headers X-SDD-Commit and X-SDD-Version are present
```

#### AC3

```gherkin
Scenario: Sync pending before first sync
  Given no sync has run
  When GET /api/sdd/versions is called
  Then the response is 409 with error code sync_pending
```

#### AC4

```gherkin
Scenario: Unknown version returns not found
  Given the sync cache does not contain version v9.9.9
  When GET /api/sdd/package?version=v9.9.9 is called
  Then the response is 404 with error code version_not_found
```

#### AC5

```gherkin
Scenario: Admin manual sync trigger
  Given an authenticated admin session
  When POST /api/admin/sync is called
  Then the sync job runs and returns synced or unchanged status
```

---

## `sdd-mcp-http-install-policy` — HTTP install policy (ADR-054)

HTTP MCP must not write Server 2 disk as if it were the user’s home. Install/update return tarball URL + metadata for AI extraction. (MCPI-03, MCPU-02)

### User story 1 — Remote install returns tarball URL for AI extraction

**As a** developer calling MCP over HTTP
**I want** install and update to return a package URL and extraction instructions
**So that** the AI agent extracts files locally and the hosted server never writes another user’s `~/.cursor`

#### AC1

```gherkin
Scenario: HTTP install returns package URL and instructions
  Given the client calls sdd_install_framework over Streamable HTTP
  And the operator sync cache contains the requested version
  When the tool runs
  Then the result includes packageUrl pointing at GET /api/sdd/package
  And the result includes paths, manifest, manifestPath, and instructions
  And the server disk is not written as a user config root
```

#### AC2

```gherkin
Scenario: HTTP update follows the same policy
  Given the client calls sdd_update_framework over Streamable HTTP
  When the tool runs
  Then the result includes packageUrl and instructions
  And the server disk is not written as a user config root
```

---

## `sdd-mcp-prompt-setup` — Prompt-based MCP setup (SETUP-01)

End users paste one prompt; the AI configures HTTP MCP. (ADR-054)

### User story 1 — One-prompt setup

**As an** end user in Cursor
**I want** to paste one prompt to connect framework.sdd.works MCP
**So that** I do not need to edit mcp.json manually or install a binary

#### AC1

```gherkin
Scenario: Agent setup endpoint serves markdown instructions
  When GET /agent-setup is requested
  Then the response Content-Type is text/markdown
  And the body includes https://framework.sdd.works/mcp
  And the body includes agent-specific configuration steps
```
