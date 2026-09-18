# Client Path Configuration Knowledge

**Area:** MCP install/update (MCPI-01 / MCPI-02 / MCPI-04)
**Source of truth for:** `packages/sdd-paths/paths.json` seed map expansion (Sprint 7 / MCPI-02).
**Related:** [`mcp-stories.md`](./mcp-stories.md) · [`req-spec.md`](../req-spec.md) §3 · [ADR-047](../adr/ADR-047-qwen-path-discovery.md)

Research date: 2026-09-17. Confirm before relying on a path — clients ship new versions frequently.

---

## How to read this file

Each client entry has:

- **Regular paths** — where the client reads skills / rules / agents / other framework artifacts by default, split into **user (global)** and **project (workspace)** scopes. OS variants only where they differ.
- **Read customized paths** — env vars, config files, or MCP mechanisms the install tool can inspect to discover non-default roots. This is what MCPI-04 (Qwen path discovery) and the resolver `overrides` parameter consume.
- **Notes** — precedence, compatibility aliases, character limits, gotchas.

**Legend:** `~` = `$HOME` (macOS/Linux), `%USERPROFILE%` = Windows home. `darwin` / `linux` / `win32` match Node `process.platform`.

---

## First-class clients (MCPI-02 AC1)

### Cursor (and Cursor Agents)

**Regular paths**

| Scope | Skills | Rules | Agents | Other |
| --- | --- | --- | --- | --- |
| User (global) | `~/.cursor/skills/<name>/SKILL.md` | `~/.cursor/rules/*.mdc` | `~/.cursor/agents/<name>.md` | `~/.cursor/sdd/` |
| Project | `.cursor/skills/<name>/SKILL.md` (also `.agents/skills/`) | `.cursor/rules/*.mdc` | `.cursor/agents/<name>.md` | `.cursor/sdd/` |
| Windows | `%USERPROFILE%\.cursor\…` (same layout) | | | |

Background subagent runtime data: `~/.cursor/subagents/`. Per-project SDK agent store: `~/.cursor/projects/<hash>/sdk-agent-store/`.

**Read customized paths**

- No documented env var to relocate `~/.cursor`. Discovery is filesystem-only: check `~/.cursor/` and `<workspace>/.cursor/`.
- Cursor also reads **Claude** and **Codex** compatibility dirs: `.claude/skills/`, `.codex/skills/`, `~/.claude/skills/`, `~/.codex/skills/`, plus `.claude/agents/` and `.codex/agents/` for subagents. `.cursor/` wins on name conflicts.
- `~/.cursor/skills/` can be synced to Cloud Agents via Settings → Agents → Sync Skills. Only `~/.cursor/skills/` syncs; `~/.agents/skills/` stays local.

**Notes**

- Skills auto-discover recursively; nested `.cursor/skills/` in monorepo subdirs scope to that directory.
- Skills frontmatter: `paths` (glob scoping), `model` (restrict to a model), `name`, `description`.
- `/migrate-to-skills` converts eligible rules/commands to skills.
- Cursor Agents = the agent runtime inside Cursor; same paths, agents live in `.cursor/agents/` / `~/.cursor/agents/`.
- **Compat alias gotcha (verified 2026-09-17 on operator machine):** Cursor reads `~/.claude/skills/` and `~/.claude/agents/` as compatibility aliases. If a user has `~/.claude/skills/` populated (e.g. from Claude Code) but `~/.cursor/skills/` is empty or absent, Cursor still discovers those skills. The seed map default `~/.cursor/skills/` is the **native** write target, but the user's **existing** skills may live under `~/.claude/skills/`. `sdd_install_framework` should check both: write to the native `~/.cursor/skills/` by default, but if the user has skills only under `~/.claude/skills/` and no `~/.cursor/skills/`, consider writing to the `.claude` alias or prompting the user. The resolver currently returns only the seed-map path and does not probe the alias.

---

### Claude Code

**Regular paths**

| Scope | Skills | Rules | Agents | Commands (legacy) | Other |
| --- | --- | --- | --- | --- | --- |
| User | `~/.claude/skills/<name>/SKILL.md` | `~/.claude/rules/*.md` | `~/.claude/agents/<name>.md` | `~/.claude/commands/<name>.md` | `~/.claude/` |
| Project | `.claude/skills/<name>/SKILL.md` | `.claude/rules/*.md` | `.claude/agents/<name>.md` | `.claude/commands/<name>.md` | `.claude/` |
| Windows | `%USERPROFILE%\.claude\…` | | | | |

App state + MCP config: `~/.claude.json`. Per-project auto-memory: `~/.claude/projects/<hash>/`.

**Read customized paths**

- **`CLAUDE_CONFIG_DIR`** — relocates the entire `~/.claude` tree (settings, credentials, sessions, plugins, skills, agents, rules). Highest-priority signal for non-default roots. Example: `CLAUDE_CONFIG_DIR=~/.claude-work claude`.
- `--add-dir <path>` / `/add-dir` grants file access and also loads `.claude/skills/` + `.claude/commands/` from that dir. `permissions.additionalDirectories` grants file access only (no skill/command discovery).
- MCP servers spawn with `CLAUDE_PROJECT_DIR` set to the project root — useful for resolving project-relative paths inside an MCP tool.
- `roots/list` MCP request returns the launch dir + every `--add-dir` granted dir; `notifications/roots/list_changed` fires on change.

**Notes**

- Skills supersede commands; both create slash commands, skills win on name collision. Existing `.claude/commands/` files keep working.
- Project skills load from `.claude/skills/` at the start dir and every parent up to the repo root.
- Managed (enterprise) settings override everything; CLI flags (`--settings`, `--permission-mode`) override `settings.json` for the session.

---

### Cline

**Regular paths**

| Scope | Skills | Rules | Agents | Other |
| --- | --- | --- | --- | --- |
| User | `~/.cline/skills/` | `~/.cline/rules/` | `~/.cline/agents/` | `~/.cline/` (data under `~/.cline/data/`) |
| Project | `.cline/skills/` | `.cline/rules/` (legacy `.clinerules/`) | `.cline/agents/` | `.cline/` |
| Windows | `%USERPROFILE%\.cline\…` | | | |

Legacy global rules: `~/Documents/Cline/Rules/` (macOS/Linux/WSL; Windows `Documents\Cline\Rules`). Cross-tool: `~/.agents/AGENTS.md`.

**Read customized paths**

- **`CLINE_DIR`** — overrides the root `~/.cline` (CLI / JetBrains / shared core).
- **`CLINE_DATA_DIR`** — overrides `~/.cline/data/` (settings, sessions, db).
- **`CLINE_HOOKS_DIR`** — additional hooks dir.
- `CLINE_HUB_ADDRESS`, `CLINE_SESSION_BACKEND_MODE`, `CLINE_SANDBOX`, `CLINE_SANDBOX_DATA_DIR`, `CLINE_COMMAND_PERMISSIONS` — runtime behavior, not path roots.
- VS Code extension task history lives in `globalStorage/saoudrizwan.claude-dev/tasks` (separate from `~/.cline/`); CLI/JetBrains use `~/.cline/data/`.

**Notes**

- Rules: workspace `.cline/rules/` > global `~/.cline/rules/`. Toggles stored as absolute file paths in `globalClineRulesToggles` / `localClineRulesToggles`.
- MCP settings: `~/.cline/data/settings/cline_mcp_settings.json`.
- `resolveRulesConfigSearchPaths` checks `AGENTS.md`, `.clinerules`, `.cline/rules` (modern preferred).

---

### Codex (OpenAI)

**Regular paths**

| Scope | Skills | Agents | Instructions | Other |
| --- | --- | --- | --- | --- |
| User | `$HOME/.agents/skills/<name>/SKILL.md` | `~/.codex/agents/<name>.toml` | `~/.codex/AGENTS.md` (or `AGENTS.override.md`) | `~/.codex/` |
| Project | `.agents/skills/<name>/SKILL.md` | `.codex/agents/<name>.toml` | `AGENTS.md` (walked root → cwd) | `.codex/` |
| Admin | `/etc/codex/skills/` | | | |

Config: `~/.codex/config.toml`. Profiles: `~/.codex/profile-<name>.config.toml` (overlay via `--profile`). Project config: `.codex/config.toml` (walked root → cwd, closest wins).

**Read customized paths**

- **`CODEX_HOME`** — relocates the entire `~/.codex` (config, auth, logs, sessions, skills, package metadata). Must exist if set. Primary override signal.
- **`CODEX_SQLITE_HOME`** — relocates SQLite state (default `CODEX_HOME`); `sqlite_home` config key takes precedence over the env var.
- `project_doc_fallback_filenames` in `config.toml` adds instruction filenames (e.g. `TEAM_GUIDE.md`).
- Skills `[[skills.config]]` entries in `~/.codex/config.toml` can disable a skill by path without deleting it.

**Notes**

- Skills: `REPO` (`.agents/skills` walked cwd → root), `USER` (`$HOME/.agents/skills`), `ADMIN` (`/etc/codex/skills`). Same-name skills both appear (no merge).
- Instructions: global `AGENTS.override.md` else `AGENTS.md`, then per-directory walk root → cwd, one file per dir, capped by `project_doc_max_bytes` (32 KiB default).

---

### GitHub Copilot (coding agent + CLI)

**Regular paths**

| Scope | Instructions | Agents | Other |
| --- | --- | --- | --- |
| User | `~/.copilot/copilot-instructions.md`, `~/.copilot/instructions/**/*.instructions.md` | `%USERPROFILE%\.github\agents\*.agent.md` (VS; user-level) | `~/.copilot/` |
| Project | `.github/copilot-instructions.md`, `.github/instructions/**/*.instructions.md`, `AGENTS.md` (also `CLAUDE.md`, `GEMINI.md`) | `.github/agents/<name>.agent.md` | `.github/` |

Agent file: YAML frontmatter (`name`, `description`, `model`, `tools`) + Markdown instructions.

**Read customized paths**

- **`COPILOT_CUSTOM_INSTRUCTIONS_DIRS`** — comma-separated extra dirs scanned for `AGENTS.md` and `*.instructions.md`. Primary override for non-default instruction roots.
- VS Tools → Options → GitHub → Copilot can change the user-level agents dir (default `%USERPROFILE%\.github\agents`).
- No documented env var for a global Copilot home; `~/.copilot/` is fixed.

**Notes**

- Path-specific instructions use `applyTo` glob frontmatter; `excludeAgent: "code-review"` / `"cloud-agent"` restricts surface.
- Copilot CLI also reads `.claude/CLAUDE.md` for CLAUDE.md instructions.
- Coding agent (autonomous) supports `AGENTS.md` (nested supported) since Aug 2025.

---

### VS Code (generic + Copilot extension)

**Regular paths**

- MCP config: `.vscode/mcp.json` (project) or user `settings.json` → `chat.mcp.discovery.enabled`. VS Code Copilot uses `servers` (not `mcpServers`) with explicit `type: stdio|http|sse`.
- Custom agents / instructions follow GitHub Copilot conventions above when Copilot is the active chat participant.
- Generic VS Code extensions keep state in `globalStorage/<publisher.extension>/` per OS:
  - macOS: `~/Library/Application Support/Code/User/globalStorage/`
  - Linux: `~/.config/Code/User/globalStorage/`
  - Windows: `%APPDATA%\Code\User\globalStorage\`

**Read customized paths**

- `--user-data-dir <path>` CLI flag relocates the VS Code user data dir (and therefore `globalStorage`).
- `--extensions-dir <path>` relocates extensions.
- No single env var for "the AI client home"; depends on the extension. For Copilot, see `COPILOT_CUSTOM_INSTRUCTIONS_DIRS` above.

**Notes**

- VS Code Copilot MCP schema differs (silent failure if you use `mcpServers` instead of `servers` or omit `type`).

---

### WorkBuddy / WorkBuddy CN (Tencent CodeBuddy)

**Regular paths**

| Scope | Skills | Rules | Agents | Commands | Other |
| --- | --- | --- | --- | --- | --- |
| User | `~/.codebuddy/skills/` | `~/.codebuddy/rules/*.md` | `~/.codebuddy/agents/` | `~/.codebuddy/commands/` | `~/.codebuddy/` |
| Project | `.codebuddy/skills/` | `.codebuddy/rules/*.md` (each in a folder with `RULE.mdc`) | `.codebuddy/agents/` | `.codebuddy/commands/` | `.codebuddy/` |

Memory: `~/.codebuddy/CODEBUDDY.md` (user), `./CODEBUDDY.md` or `./.codebuddy/CODEBUDDY.md` (project), `./CODEBUDDY.local.md` (local). MCP: `~/.codebuddy/mcp.json` (global), `.codebuddy/mcp.json` (project). Settings: `~/.codebuddy/settings.json` + `settings.local.json`.

**Read customized paths**

- No documented env var for relocating `~/.codebuddy` in the public docs reviewed. Discovery is filesystem-only.
- Project rules load only from the current working dir's `.codebuddy/rules/` (not parent dirs).
- Compatible with `AGENTS.md` (auto-loaded if `CODEBUDDY.md` absent at root).

**Notes**

- Rules: `alwaysApply: true` always load; others on-demand.
- `paths` frontmatter field works in any memory file (not just `.codebuddy/rules/`).
- **Claude Code compatibility is plugin-level only (verified 2026-09-17):** CodeBuddy recognizes `.claude-plugin/plugin.json` as a compatible metadata dir (alongside `.codebuddy-plugin/` and `.workbuddy-plugin/`), and supports `${CLAUDE_PLUGIN_ROOT}` / `${CLAUDE_PLUGIN_DATA}` as aliases. But it does **not** scan `~/.claude/skills/` as a loose filesystem alias the way Cursor does. Native skills path is `~/.codebuddy/skills/` only. To surface Claude Code skills in CodeBuddy, either copy them to `~/.codebuddy/skills/` or package them as a plugin with `.claude-plugin/plugin.json` + `skills/` at the plugin root.
- Marketplace skills load from `~/.codebuddy/skills-marketplace/skills/`; plugin-sourced skills load from `~/.codebuddy/plugins/marketplaces/…/skills/`. These are separate from the native `~/.codebuddy/skills/` dir.

---

### TRAE / TRAE CN (ByteDance)

**Regular paths**

| Scope | Skills | Rules | Agents | Other |
| --- | --- | --- | --- | --- |
| User (global) | `~/.trae/skills/<name>/SKILL.md` | `~/.trae/user_rules` (file) | `~/.trae-cn/agents/<name>.md` (CN) / `~/.trae/agents/` | `~/.trae/` |
| Project | `.trae/skills/<name>/SKILL.md` | `.trae/rules/` (dir, recursive ≤3 levels) | `.trae/agents/<name>.md` | `.trae/` |

MCP: `.trae/mcp.json` (project), `~/.trae/mcp.json` (user). Settings: `.trae/settings.json` + `.trae/settings.local.json` (gitignored). Compatible: `AGENTS.md`, `CLAUDE.md`, `CLAUDE.local.md` at project root.

**Read customized paths**

- No documented env var for relocating `~/.trae` in the docs reviewed. TRAE CN uses `~/.trae-cn/` for user-level agents (distinct from `~/.trae/`).
- Subagents require Settings > Beta > Subagents toggle ON; `name` must start with a letter, ≤50 chars; `description` required.
- MCP server names in agent `mcpServers` must match configured servers.

**Notes**

- Precedence: user input > custom agent prompt > global rules (`user_rules.md`) > project rules (`.trae/rules`) ≈ `AGENTS.md`.
- Rule size: project_rules pruned first if total > 20000 bytes; single rule suggested ≤ 10000 chars (warning > 1000).
- Candidate tier in our backlog until MCP / install-path support verified (req-spec open question 6).

---

## Candidate / other clients (req-spec §3.2)

### Continue.dev

**Regular paths**

| Scope | Skills | Rules | Config | Other |
| --- | --- | --- | --- | --- |
| User | `~/.continue/skills/` (also reads `.claude/skills/`) | `~/.continue/config.yaml` `rules:` + `~/.continue/rules/` | `~/.continue/config.yaml` (macOS/Linux), `%USERPROFILE%\.continue\config.yaml` (Windows) | `~/.continue/` |
| Project | — | `.continue/rules/*.md` (lexicographic order) | — | `.continue/` |

CLI (`cn`) uses the same `config.yaml`; `--config <path>` overrides per session; `--rule <path|string>` injects rules; `--agent <org/name>` loads an agent file. Permissions: `~/.continue/permissions.yaml`. Logs: `~/.continue/logs/cn.log`.

**Read customized paths**

- `--config <path>` flag (CLI) points at an alternate `config.yaml`.
- `config.ts` at `~/.continue/config.ts` can programmatically extend config (`modifyConfig(config)`).
- Rules in `config.yaml` support `uses: file://…` for local rule files.

**Notes**

- Skills discovered under `~/.continue/skills` and project `.claude/skills/`; `/skills` lists, `/import-skill` adds.
- `slashCommands` array deprecated — use prompt files.

---

### Windsurf (Cascade / Devin Desktop)

**Regular paths**

| Scope | Rules | Workflows | Global rules | Other |
| --- | --- | --- | --- | --- |
| Project (modern) | `.windsurf/rules/*.md` (YAML frontmatter `trigger`) | `.windsurf/workflows/*.md` | — | `.windsurf/` |
| Project (legacy) | `.windsurfrules` (single file, always-on) | — | — | — |
| User (global) | — | — | `~/.codeium/windsurf/memories/global_rules.md` | `~/.codeium/windsurf/memories/` |

After the June 2026 Cognition rebrand to Devin Desktop, current builds prefer `.devin/rules/*.md` with `.windsurf/rules/` as fallback; `.windsurfrules` still read.

**Read customized paths**

- No documented env var for relocating `~/.codeium/windsurf`. Discovery is filesystem-only.
- `trigger` modes: `always_on`, `model_decision`, `glob` (requires `globs`), `manual` (must `@rule-name`).
- Auto-generated memories: `~/.codeium/windsurf/memories/` (persists across Cascade conversations).

**Notes**

- Workspace rules: 12000 char limit per file; global rules: 6000 char limit. Workspace > global.
- Also supports `AGENTS.md` (root = global; subdir = auto-scoped, no frontmatter needed).

---

### Gemini CLI

**Regular paths**

| Scope | Skills | Instructions | Other |
| --- | --- | --- | --- |
| User | `~/.gemini/skills/<name>/SKILL.md` (alias `~/.agents/skills/`) | `~/.gemini/GEMINI.md` | `~/.gemini/` |
| Project | `.gemini/skills/<name>/SKILL.md` (alias `.agents/skills/`) | `GEMINI.md` (walked workspace + parents; JIT per dir) | `.gemini/` |

Settings: `~/.gemini/settings.json` (can set `context.fileName` to rename `GEMINI.md`, e.g. `["AGENTS.md","CONTEXT.md","GEMINI.md"]`).

**Read customized paths**

- **`GEMINI_CLI_HOME`** — relocates the Gemini CLI home (per third-party analysis; verify against current SDK). Resolves `$GEMINI_CLI_HOME/.gemini/tmp/` for session data.
- `context.fileName` in `settings.json` changes the instruction filename(s).
- `/memory show` / `/memory reload` inspect and refresh loaded context files.

**Notes**

- Skills precedence (low → high): built-in → extension → user (`~/.gemini/skills/` or `~/.agents/skills/`) → workspace (`.gemini/skills/` or `.agents/skills/`). Within a tier, `.agents/skills/` beats `.gemini/skills/`.
- `gemini skills install <git-url> --scope user|workspace --path <subdir> --consent`.

---

### OpenCode

**Regular paths**

| Scope | Skills | Instructions | Other |
| --- | --- | --- | --- |
| User | `~/.config/opencode/skills/<name>/SKILL.md` (also `~/.claude/skills/`, `~/.agents/skills/`) | `~/.config/opencode/AGENTS.md` | `~/.config/opencode/` |
| Project | `.opencode/skills/<name>/SKILL.md` (also `.claude/skills/`, `.agents/skills/`) | `AGENTS.md` (walked cwd → home or project root) | `.opencode/` |

**Read customized paths**

- **`XDG_DATA_HOME`** — relocates `~/.config/opencode/` (and `~/.local/share/opencode/` for data). Primary override signal.
- V2 currently only recognizes `AGENTS.md` (not `CLAUDE.md` fallback).
- `opencode.json` permissions: `allow` / `deny` / `ask` patterns control skill access.

**Notes**

- Walks cwd → git worktree root for `.opencode/skills/` and compatible `.claude/skills/` / `.agents/skills/`.
- Skills loaded on-demand via the `skill` tool; agent sees name + description, loads full `SKILL.md` when invoked.

---

### AWS Kiro

**Regular paths**

| Scope | Skills | Steering (rules) | Agents | Specs | Other |
| --- | --- | --- | --- | --- | --- |
| User | `~/.kiro/skills/` | `~/.kiro/steering/` | `~/.kiro/agents/` (`.json` or `.md`) | — | `~/.kiro/` |
| Project | `.kiro/skills/` | `.kiro/steering/` | `.kiro/agents/` | `.kiro/specs/` (requirements.md, design.md, tasks.md) | `.kiro/` |

MCP: `~/.kiro/settings/mcp.json` (global), `.kiro/settings/mcp.json` (project). Permissions: `~/.kiro/workspace-roots/<hash>/permissions.yaml` (per-user, outside repo). Hooks: `.kiro/hooks/`. Powers: `~/.kiro/powers/`.

**Read customized paths**

- **`KIRO_HOME`** — relocates the global `~/.kiro` (agents, skills, steering, settings, sessions). Primary override signal.
- Steering inclusion modes: `always`, `fileMatch`, `manual`, `auto`. Custom agents must explicitly load steering via `resources` (e.g. `file://.kiro/steering/**/*.md`).
- Compatible with `AGENTS.md` (root or `~/.kiro/steering/`, always included, no inclusion modes).

**Notes**

- Agent scope > Project > Global; deny wins regardless of scope.
- Same-name agents: project wins with warning. Specs are project-only.
- CLI loads all `.kiro/steering/` files automatically (no inclusion modes on CLI).

---

## Cross-client patterns

### Env var override summary

| Client | Env var | Relocates |
| --- | --- | --- |
| Claude Code | `CLAUDE_CONFIG_DIR` | entire `~/.claude` |
| Codex | `CODEX_HOME` | entire `~/.codex` |
| Codex | `CODEX_SQLITE_HOME` | SQLite state only |
| Cline | `CLINE_DIR` | root `~/.cline` |
| Cline | `CLINE_DATA_DIR` | `~/.cline/data/` |
| Cline | `CLINE_HOOKS_DIR` | extra hooks dir |
| Gemini CLI | `GEMINI_CLI_HOME` | Gemini home (verify) |
| OpenCode | `XDG_DATA_HOME` | `~/.config/opencode/` |
| Kiro | `KIRO_HOME` | entire `~/.kiro` |
| Copilot | `COPILOT_CUSTOM_INSTRUCTIONS_DIRS` | extra instruction dirs (comma-sep) |
| Cursor | — (none documented) | filesystem-only |
| WorkBuddy | — (none documented) | filesystem-only |
| TRAE | — (none documented) | filesystem-only |
| Windsurf | — (none documented) | filesystem-only |
| Continue | `--config` flag (CLI) | alternate `config.yaml` |

### MCP-based path discovery

- **Claude Code** sets `CLAUDE_PROJECT_DIR` in spawned MCP server env; answers `roots/list` with launch dir + `--add-dir` dirs, and sends `notifications/roots/list_changed`. An MCP server (like ours) can read these to resolve project-relative paths.
- Other clients do not expose a documented MCP mechanism for discovering their config roots. For those, the install tool falls back to: (1) explicit `client`/`os` args, (2) seed map defaults, (3) Qwen-assisted local config scan (MCPI-04 / ADR-047).

### Compatibility aliases (`.agents/skills/`)

Cursor, Codex, Gemini CLI, OpenCode, and Continue all read `.agents/skills/<name>/SKILL.md` (and `~/.agents/skills/`) as an interoperable path. A single skill placed at `~/.agents/skills/<name>/SKILL.md` is visible to all of them. This is the closest thing to a shared standard and is the strongest candidate for a cross-client "other" root.

### AGENTS.md as a shared instruction standard

Cursor, Claude Code, Codex, Copilot, Cline, WorkBuddy, TRAE, Windsurf, Kiro, OpenCode, and Gemini CLI (configurable) all read `AGENTS.md` at the project root (and often nested dirs). It is the de facto cross-client instruction file. It does not carry skills or agents, only prose instructions.

---

## Open questions for MCPI-02 / MCPI-04

1. **TRAE first-class?** TRAE supports `.trae/skills/` + `.trae/agents/` + MCP, but user-level agents live under `~/.trae-cn/` on CN builds — verify the install tool handles both `~/.trae/` and `~/.trae-cn/`.
2. **WorkBuddy env var?** No documented override for `~/.codebuddy`. If an operator relocates it, the seed map will miss. Qwen discovery should check common config files.
3. **Cursor relocation?** No env var. If a user symlinks `~/.cursor` elsewhere, only Qwen config scan would catch it.
4. **Windsurf → Devin transition.** `.devin/rules/` is preferred in current builds; `.windsurf/rules/` is fallback. Seed map should write to `.windsurf/rules/` for now and revisit.
5. **`.agents/skills/` as the shared "other" root.** Consider mapping `other` for all `.agents/`-compatible clients to `~/.agents/skills/` so a single write surfaces everywhere. Needs design decision (merge vs overwrite).

---

## Evaluation: Detect-then-resolve-then-write install flow

**Proposal:** Each `sdd_install_framework` / `sdd_update_framework` call reads the calling client's configuration first, determines the actual install path, then writes — instead of relying on seed-map defaults alone.

**Research date:** 2026-09-17. Evidence: MCP 2026-07-28 spec, SDK source, Microsoft APM, client docs.

### How client identification works in MCP

| Transport | Mechanism | Available signals |
| --- | --- | --- |
| **stdio** | Server is a child process — inherits `process.env` | `clientInfo.name` from initialize + all client env vars (`CLAUDE_CONFIG_DIR`, `CODEX_HOME`, etc.) + `CLAUDE_PROJECT_DIR` |
| **HTTP** | Stateless request carries `_meta.io.modelcontextprotocol/clientInfo` | `clientInfo.name` only — **no** env vars, **no** local filesystem access |

Our SDK (`@modelcontextprotocol/sdk`): `McpServer.server.getClientVersion()` returns `{ name, version }` from the initialize handshake. Accessible inside tool handlers via the server instance.

**Note:** MCP 2026-07-28 spec deprecates `roots/list` (server-initiated request for working dirs). New pattern is MRTR (Multi Round-Trip Requests) — server returns `InputRequiredResult`, client retries with input. For path discovery, explicit `client` arg + env vars are simpler than MRTR.

### Proposed resolution chain (stdio only — HTTP returns `local_install_required` per MCPI-03)

```
1. Explicit `client` arg (caller tells us)           → highest priority
2. `clientInfo.name` from MCP initialize              → identify which client
3. Env var resolution (per-client)                    → check CLAUDE_CONFIG_DIR, CODEX_HOME, etc.
4. Config file probe (per-client)                     → read ~/.claude.json, ~/.codex/config.toml, etc.
5. Seed map fallback (PATH-01)                        → default paths from paths.json
6. Qwen discovery (MCPI-04, ADR-047)                  → last resort, for clients with no env var
```

Steps 1–4 are **deterministic** (no LLM cost). Step 6 is only for clients without env vars (Cursor, WorkBuddy, TRAE, Windsurf).

### Env var resolution table (verified 2026-09-17)

| Client | Env var | Resolves to | Source |
| --- | --- | --- | --- |
| Claude Code | `CLAUDE_CONFIG_DIR` | `$CLAUDE_CONFIG_DIR/` (entire `~/.claude`) | Official docs |
| Codex | `CODEX_HOME` | `$CODEX_HOME/` (entire `~/.codex`) | Official docs |
| Cline | `CLINE_DIR` | `$CLINE_DIR/` (root `~/.cline`) | Official docs |
| Cline | `CLINE_DATA_DIR` | `$CLINE_DATA_DIR/` (data subdirectory) | Official docs |
| Cline | `CLINE_MCP_SETTINGS_PATH` | exact MCP settings file | Source code (resolveMcpSettingsPath) |
| Kiro | `KIRO_HOME` | `$KIRO_HOME/` (entire `~/.kiro`) | Official docs |
| Copilot | `COPILOT_CUSTOM_INSTRUCTIONS_DIRS` | extra instruction dirs (comma-sep) | Official docs |
| Copilot | `COPILOT_HOME` | `$COPILOT_HOME/mcp-config.json` | APM docs |
| OpenCode | `XDG_DATA_HOME` | `$XDG_DATA_HOME/opencode/` | XDG standard |
| Gemini CLI | `GEMINI_CLI_HOME` | Gemini home | Third-party analysis (verify) |
| Cursor | — | filesystem-only | No env var documented |
| WorkBuddy | — | filesystem-only | No env var documented |
| TRAE | — | filesystem-only | No env var documented |
| Windsurf | — | filesystem-only | No env var documented |

### `clientInfo.name` mapping (needs verification per client)

The MCP `clientInfo.name` sent by each client is not standardized. Expected values (to verify with real clients):

| Client | Expected `clientInfo.name` | Our internal id |
| --- | --- | --- |
| Claude Code | `claude-code` or `Claude Code` | `claude` |
| Cursor | `cursor` or `Cursor` | `cursor` |
| Cline | `cline` or `Cline` | `cline` |
| Codex | `codex` or `Codex` | `codex` |
| Copilot | `github-copilot` or `Copilot` | `copilot` |
| Kiro | `kiro` or `Kiro` | `kiro` |
| Continue | `continue` or `Continue` | `continue` |
| Windsurf | `windsurf` or `Windsurf` | `windsurf` |
| Gemini CLI | `gemini-cli` or `Gemini CLI` | `gemini` |
| OpenCode | `opencode` or `OpenCode` | `opencode` |

Build a case-insensitive mapping table with aliases. Fall back to explicit `client` arg if `clientInfo.name` is empty or unrecognized.

### Pros

1. **Deterministic for 6+ clients** — Claude Code, Codex, Cline, Kiro, Copilot, OpenCode all expose env vars. No LLM cost for those.
2. **Handles relocation** — users who set `CLAUDE_CONFIG_DIR` or `CODEX_HOME` are resolved correctly, not silently missed.
3. **Already proven** — Microsoft's Agent Package Manager (APM) uses exactly this pattern: `resolved_config_path()` checks env var → falls back to default.
4. **No extra round trips** — env vars are in `process.env` at spawn time; config files are local reads. No MRTR needed.
5. **Strictly better than seed-map-only** — seed map becomes the fallback instead of the primary.

### Cons / Risks

1. **stdio only** — env vars and config files are only accessible when the server runs as a child process. HTTP install returns `local_install_required` (MCPI-03 unchanged).
2. **4 clients have no env var** — Cursor, WorkBuddy, TRAE, Windsurf. For those, the flow falls through to seed map → Qwen. No regression vs. current design.
3. **`clientInfo.name` not standardized** — different clients may send different names. Need a case-insensitive mapping table with aliases. Verify with real clients during Sprint 6.
4. **Config file formats differ** — JSON (`~/.claude.json`), TOML (`~/.codex/config.toml`), YAML (`~/.continue/config.yaml`). Per-client parser needed. Only read the fields relevant to path discovery; don't parse the entire config.
5. **Extra filesystem reads** — each install call probes 1–3 config files. Mitigated by caching resolved paths per session (stdio session is long-lived).
6. **SDK access** — `getClientVersion()` is on `McpServer.server` (the underlying `Server`), not on `McpServer` directly. Tool handlers need a reference to the server instance.

### Comparison with current design (MCPI-04 / ADR-047)

| Aspect | Current (seed map + Qwen) | Proposed (detect + env + seed + Qwen) |
| --- | --- | --- |
| Deterministic | Only seed map defaults | Env vars for 6+ clients, seed map for rest |
| LLM cost | Qwen call on every install | Qwen only for 4 clients without env vars |
| Relocation handling | Missed (seed map is static) | Handled via env vars |
| Accuracy | Probabilistic (Qwen) | Exact for env-var clients, probabilistic for others |
| Latency | Qwen round trip (~seconds) | Local file reads (~ms) for env-var clients |
| Complexity | Lower | Higher (per-client resolver) but bounded |

### Recommendation

**Adopt for Sprint 6 (MCPI-01).** The detect-then-resolve-then-write flow is strictly better:

1. Build a `resolveClientPaths(client, os, env)` function that chains: env vars → config file probe → seed map → (optional Qwen).
2. Use `McpServer.server.getClientVersion()` to auto-detect the client from `clientInfo.name` when the explicit `client` arg is omitted.
3. Cache resolved paths per stdio session (the server process lives for the duration of the client session).
4. Keep Qwen as the last-resort fallback for clients without env vars (Cursor, WorkBuddy, TRAE, Windsurf).
5. Update ADR-047 to document the new resolution chain.

This does not change MCPI-03 (HTTP install policy) — HTTP still returns `local_install_required`. The detect-resolve-write flow is stdio-only, which is where install happens.





