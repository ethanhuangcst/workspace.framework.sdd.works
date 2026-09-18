# Spike: Where each installed client stores skills and rules (current settings)

**Date:** 2026-09-17
**Machine:** macOS (`darwin`), `$HOME=/Users/ethanhuang`
**Question:** According to each client's **current settings**, where does it store **skills** and **rules**?

## Method

For each client I read its actual settings files (both the user-level dotfile config and the VS Code-fork `User/settings.json` under `~/Library/Application Support/`), then checked whether any setting overrides the skills/rules storage path. None did — every client uses its defaults. I then enumerated what actually exists at those default paths.

**Settings files inspected (none contain skills/rules path overrides):**
- Cursor: `~/Library/Application Support/Cursor/User/settings.json` + `~/.cursor/mcp.json`
- CodeBuddy CN: `~/.codebuddy/settings.json` + `~/Library/Application Support/CodeBuddy CN/User/settings.json` + `~/.codebuddy/mcp.json`
- TRAE CN: `~/Library/Application Support/Trae CN/User/settings.json` + `~/.trae-cn/skill-config.json` + `~/.trae-cn/plugin-config.json`
- TRAE: `~/Library/Application Support/Trae/User/settings.json`
- Claude Code: `~/.claude/settings.json` + `~/.claude.json`

**Env vars that could relocate paths — all unset on this Mac:**
`CLAUDE_CONFIG_DIR`, `CODEX_HOME`, `CLINE_DIR`, `KIRO_HOME`, `GEMINI_CLI_HOME`, `XDG_DATA_HOME`, `COPILOT_CUSTOM_INSTRUCTIONS_DIRS`, `COPILOT_HOME`, `USERPROFILE`.

## Result: where skills and rules are stored per client

### 1. Cursor

Settings (`~/Library/Application Support/Cursor/User/settings.json`): only `claudeCode.*`, `cursor.composer.*`, `js/ts.*` — **no skills/rules path config**. Uses defaults.

| Artifact | Default path | Exists? | Count | Notes |
| --- | --- | --- | --- | --- |
| Skills (native) | `~/.cursor/skills/` | no | 0 | Renamed to `~/.cursor/skills-cursor/` (25 skills) — not at the default path |
| Skills (compat alias) | `~/.claude/skills/` | yes | 41 | Cursor also reads this as a Claude-compat alias |
| Rules (native) | `~/.cursor/rules/` | no | 0 | Renamed to `~/.cursor/rules.bak/` (11 rules) — not at the default path |
| Rules (project) | `<workspace>/.cursor/rules/` | no | 0 | Not present in this workspace |
| Rules (project, alt) | `<workspace>/AGENTS.md`, `CLAUDE.md` | yes | 2 | Workspace-root markdown files are loaded as rules |
| Agents | `~/.cursor/agents/` | yes | 0 | Empty |
| MCP | `~/.cursor/mcp.json` | yes | — | stdio + HTTP servers |

**Current effective skills source:** `~/.claude/skills/` (41) — the native `~/.cursor/skills/` is empty/renamed.
**Current effective rules source:** workspace `AGENTS.md` + `CLAUDE.md` — the native `~/.cursor/rules/` is empty/renamed.

### 2. CodeBuddy CN

Settings (`~/.codebuddy/settings.json`): only `enabledPlugins` — **no skills/rules path config**. `~/Library/Application Support/CodeBuddy CN/User/settings.json`: only `codingcopilot.*`, `claudeCode.*`, `workbench.*` — **no skills/rules path config**. Uses defaults.

| Artifact | Default path | Exists? | Count | Notes |
| --- | --- | --- | --- | --- |
| Skills (native user) | `~/.codebuddy/skills/` | no | 0 | Does not exist — no user-installed skills |
| Skills (marketplace) | `~/.codebuddy/skills-marketplace/skills/` | yes | 295 | Synced marketplace catalog |
| Skills (plugins) | `~/.codebuddy/plugins/marketplaces/*/plugins/*/skills/` | yes | many | Per-plugin skills dirs (playwright-cli, cloudbase, pdf, find-skills, …) |
| Rules (native user) | `~/.codebuddy/rules/` | yes | 6 | **Supports rules here** — verified by user: copied `rules/` (6 `.mdc` files), reloaded CodeBuddy CN, all rules loaded |
| Rules (project) | `<workspace>/.codebuddy/`, `CODEBUDDY.md` | no | 0 | Not present in this workspace |
| Agents | `~/.codebuddy/agents/` | no | 0 | Does not exist |
| MCP | `~/.codebuddy/mcp.json` | yes | 0 | `{"mcpServers": {}}` — empty |

**Current effective skills source:** marketplace (295) + plugin skills. **Rules system: YES** — CodeBuddy CN reads `~/.codebuddy/rules/*.mdc` (verified empirically).

### 3. TRAE CN

Settings (`~/Library/Application Support/Trae CN/User/settings.json`): only `claudeCode.*`, `cursor.composer.*`, `trae.network.*` — **no skills/rules path config**. `~/.trae-cn/skill-config.json`: only `disabledSkills`/`builtinSkillStatus`/`managedSkills` — **no path config**, only enable/disable state. Uses defaults.

| Artifact | Default path | Exists? | Count | Notes |
| --- | --- | --- | --- | --- |
| Skills (native user) | `~/.trae-cn/skills/` | no | 0 | Does not exist — no user-installed skills |
| Skills (builtin, top) | `~/.trae-cn/builtin_skills/` | yes | 5 | TRAE-code-review, TRAE-debugger, TRAE-generate-mini-app, TRAE-security-review, _shared |
| Skills (builtin, global) | `~/.trae-cn/builtin/global/skills/` | yes | 8 | TRAE-browseruse, dynamic-ui, skill-creator, … |
| Skills (builtin, per-model) | `~/.trae-cn/builtin/code/<model>/skills/` | yes | per-model | medea, default, deidamia, penelope |
| Rules (native user) | `~/.trae-cn/rules/` | no | 0 | **Unverified** — no rules dirs in builtin; needs empirical test (copy `rules/` here, reload TRAE CN) to confirm support |
| Rules (project) | `<workspace>/.trae-cn/` | no | 0 | Not present in this workspace |
| Agents | `~/.trae-cn/agents/` | no | 0 | Does not exist (CN docs say this is the user-agents path; not created yet) |
| MCP | `~/.trae-cn/mcp.json` | no | — | Not present |

**Current effective skills source:** builtin only (5 + 8 + per-model). **Rules system: unverified** — no rules dirs in builtin; needs empirical test (copy `rules/` to `~/.trae-cn/rules/`, reload) to confirm whether TRAE CN reads them.

### 4. TRAE (international)

Settings (`~/Library/Application Support/Trae/User/settings.json`): only `claudeCode.*`, `cursor.composer.*`, `AI.toolcall.*` — **no skills/rules path config**. Barely initialized.

| Artifact | Default path | Exists? | Count | Notes |
| --- | --- | --- | --- | --- |
| Skills (native user) | `~/.trae/skills/` | no | 0 | Does not exist |
| Skills (builtin) | `~/.trae/builtin*/` | no | 0 | Not downloaded yet |
| Rules (native user) | `~/.trae/rules/` | no | 0 | **Unverified** — needs empirical test (copy `rules/` here, reload TRAE) to confirm support |
| Agents | `~/.trae/agents/` | no | 0 | Does not exist |
| MCP | `~/.trae/mcp.json` | no | — | Not present |

**Current effective skills source:** none. **Rules system: unverified** — needs empirical test (copy `rules/` to `~/.trae/rules/`, reload) to confirm whether TRAE reads them.

### 5. Claude Code (standalone, and as a plugin inside Cursor / TRAE / TRAE CN)

Settings (`~/.claude/settings.json`): `env`, `permissions` (incl. `additionalDirectories: ["/Users/ethanhuang/.claude/skills", …]`), `model`, `defaultMode: bypassPermissions` — **no skills/rules path override** (no `CLAUDE_CONFIG_DIR`). `~/.claude.json`: user id + `skillUsage` stats only. Uses default home `~/.claude/`.

| Artifact | Default path | Exists? | Count | Notes |
| --- | --- | --- | --- | --- |
| Skills (native user) | `~/.claude/skills/` | yes | 41 | The real skills root |
| Rules (native user) | `~/.claude/rules/` | no | 0 | Renamed to `~/.claude/Rules.disabled-prefer-cursor/` (6 rules) — not at the default path |
| Rules (project) | `<workspace>/.claude/` | no | 0 | Not present in this workspace |
| Rules (project, alt) | `<workspace>/CLAUDE.md`, `AGENTS.md` | yes | 2 | Workspace-root markdown loaded as rules |
| Agents (native user) | `~/.claude/agents/` | no | 0 | Renamed to `~/.claude/agents.bak/` (160 agents) — not at the default path |
| Commands | `~/.claude/commands/` | no | 0 | Does not exist |
| Plugins (skills) | `~/.claude/plugins/marketplaces/claude-plugins-official/plugins/*/skills/` | yes | many | Per-plugin skills dirs |
| MCP | (per-project `.mcp.json` or `~/.claude.json`) | — | — | — |

**Claude Code plugin installations** (VS Code-style extensions, not Claude Code plugin packages — they run the Claude Code CLI inside the host IDE; they do **not** change skills/rules paths):
- In Cursor: `~/.cursor/extensions/anthropic.claude-code-2.1.81/`
- In TRAE: `~/.trae/extensions/anthropic.claude-code-2.1.81/` + `anthropic.claude-code-2.1.273-darwin-arm64/`
- In TRAE CN: `~/.trae-cn/extensions/anthropic.claude-code-2.1.81/` + `anthropic.claude-code-2.1.273-darwin-arm64/`
- In CodeBuddy CN: `~/.codebuddy/plugins/marketplaces/codebuddy-plugins-official/external_plugins/claude-hud/` (a CodeBuddy plugin with `.codebuddy-plugin/`, not a Claude Code skills provider)

**Current effective skills source:** `~/.claude/skills/` (41) + plugin skills. **Current effective rules source:** workspace `CLAUDE.md` + `AGENTS.md` — native `~/.claude/rules/` is empty/renamed.

## Summary table: current effective skills & rules storage

| Client | Skills stored at | Rules stored at | Path customized? |
| --- | --- | --- | --- |
| Cursor | `~/.claude/skills/` (41, via compat alias; native `~/.cursor/skills/` empty) | workspace `AGENTS.md` + `CLAUDE.md` (native `~/.cursor/rules/` empty) | No |
| CodeBuddy CN | `~/.codebuddy/skills-marketplace/skills/` (295) + plugin skills (native `~/.codebuddy/skills/` does not exist) | `~/.codebuddy/rules/` (verified — reads `.mdc` files; 6 present after copy) | No |
| TRAE CN | `~/.trae-cn/builtin_skills/` (5) + `~/.trae-cn/builtin/global/skills/` (8) + per-model builtin (native `~/.trae-cn/skills/` does not exist) | `~/.trae-cn/rules/` (unverified — needs empirical test) | No |
| TRAE | (none — not initialized) | `~/.trae/rules/` (unverified — needs empirical test) | No |
| Claude Code | `~/.claude/skills/` (41) + plugin skills | workspace `CLAUDE.md` + `AGENTS.md` (native `~/.claude/rules/` empty) | No (`additionalDirectories` grants access but doesn't relocate) |

## Key observations

1. **No client has customized its skills/rules paths.** Every settings file uses defaults; no relocation env vars are set. The "current settings" answer is the default path for each client.

2. **Cursor and Claude Code have empty/renamed native rules dirs.** The user has moved `~/.cursor/rules/` → `rules.bak/` and `~/.claude/rules/` → `Rules.disabled-prefer-cursor/`. Effective rules come from workspace-root `AGENTS.md`/`CLAUDE.md` instead. This means rules are **project-scoped, not user-scoped** on this Mac for these two clients.

3. **Cursor's effective skills come from the Claude compat alias** (`~/.claude/skills/`, 41), not its native `~/.cursor/skills/` (empty/renamed to `skills-cursor/`). The 25 skills in `skills-cursor/` are Cursor-bundled skills, not user skills.

4. **CodeBuddy CN DOES support rules** at `~/.codebuddy/rules/` — verified empirically by the user (copied 6 `.mdc` files, reloaded, all rules loaded). My earlier "no rules system" conclusion was wrong.

5. **TRAE CN and TRAE rules support is unverified.** No rules dirs exist in their builtin, but absence is not evidence of non-support (see method review below). Needs the same empirical test: copy `rules/` to `~/.trae-cn/rules/` (or `~/.trae/rules/`), reload, check whether rules load.

6. **CodeBuddy and TRAE have no native user skills dirs** — skills come from marketplace/plugins (CodeBuddy) or builtin only (TRAE CN). `sdd_install_framework` would need to create `~/.codebuddy/skills/`, `~/.trae-cn/skills/`, or `~/.trae/skills/` before writing.

7. **Claude Code extensions in Cursor/TRAE/TRAE CN are VS Code-style extensions**, not Claude Code plugin packages. They run the Claude Code CLI inside the host IDE; skills/rules always load from `~/.claude/` regardless of host. The host's own skills system is separate.

8. **TRAE CN vs TRAE path split** — `~/.trae-cn/` (CN) vs `~/.trae/` (international). Path detection must distinguish them via `clientInfo.name`.

## Method review: was the read-client-config method correct?

**No — the method had a critical flaw.** I conflated two different questions:

- **"Does the client support a rules system at path X?"** (capability)
- **"Are there currently rule files at path X?"** (state)

I answered the first by checking the second: because `~/.codebuddy/rules/` didn't exist, I concluded "no rules system." That was wrong — CodeBuddy CN does support `~/.codebuddy/rules/`; the dir simply hadn't been populated yet. The user proved this by copying rules there and reloading.

### Why the method failed

1. **Existence ≠ support.** A client reads from a path when files are present. An empty/absent dir means "no rules installed," not "no rules support." Many clients create the dir lazily on first install, or never create it but still read from it if it appears.

2. **Settings files don't declare supported paths.** None of the `settings.json` / `mcp.json` / `skill-config.json` files contain a "supported paths" field. Settings only contain *overrides*; the default supported paths are baked into the client binary. So reading settings can confirm "no override" but cannot enumerate "supported paths."

3. **Bundled extension code is minified**, so grepping for path strings inside `extension.js` / `globalStorage` is unreliable — it returned nothing useful for CodeBuddy even though CodeBuddy clearly reads `~/.codebuddy/rules/`.

### Corrected method

To determine where a client **supports** storing skills/rules, the reliable signals are (in order):

1. **Official client documentation** (primary source of truth for supported paths).
2. **Empirical test** (highest confidence for this machine): create the candidate dir, place a marker file (e.g., a `.mdc` rule or `SKILL.md`), reload the client, and observe whether the client surfaces it. This is what the user did for CodeBuddy CN.
3. **Env vars / settings overrides** — only tell you about *relocations*, not the default supported paths.
4. **Existing files on disk** — only tell you *current state*, not *capability*. Useful for reporting "what's loaded now," but not for "what the client supports."

### What this means for MCPI-05

- The spike should report **both** "supported path" (from docs/empirical test) and "currently populated" (from disk).
- `path-detect.ts` should resolve to the **supported path** even if it's empty — `sdd_install_framework` will then `mkdir -p` and write there.
- For CodeBuddy CN: rules path = `~/.codebuddy/rules/` (supported, verified). Skills path = `~/.codebuddy/skills/` (supported by analogy; verify empirically).
- For TRAE CN / TRAE: rules and skills paths need empirical verification before being marked "supported" in the seed map. Until then, treat as "likely supported at `~/.trae-cn/{skills,rules}/` and `~/.trae/{skills,rules}/`" but unverified.

## Empirical test results (2026-09-17, marker reload)

**Method:** Placed a unique marker file (skill `SKILL.md`, rule `.mdc`, agent `.md`) at every candidate path for every client. User reloaded each client and reported which markers surfaced. All markers cleaned up after the test.

### Skills — which paths loaded

| Client | `~/.<client>/skills/` (native) | `~/.claude/skills/` (compat) | `~/.trae/skills/` (cross-TRAE) |
| --- | --- | --- | --- |
| Cursor | ✅ loaded | ✅ loaded (compat alias) | — |
| CodeBuddy CN | ✅ loaded | ✅ loaded (via ClaudeCode plugin) | — |
| TRAE CN | ✅ loaded (`~/.trae-cn/skills/`) | — | ✅ loaded |
| TRAE | ✅ loaded | — | — |
| Claude Code | ✅ loaded | — | — |

### Rules — which paths loaded

| Client | `~/.<client>/rules/` (native) | Loaded? |
| --- | --- | --- |
| Cursor | `~/.cursor/rules/` | ✅ loaded |
| CodeBuddy CN | `~/.codebuddy/Rules/` (note: capital R) | ✅ loaded |
| TRAE CN | `~/.trae-cn/rules/` | ✅ loaded |
| TRAE | `~/.trae/rules/` | ✅ loaded |
| Claude Code | `~/.claude/rules/` | ✅ loaded |

### Agents — which paths loaded

| Client | `~/.<client>/agents/` (native) | Loaded? |
| --- | --- | --- |
| Cursor | `~/.cursor/agents/` | ✅ loaded |
| CodeBuddy CN | `~/.codebuddy/agents/` | ✅ loaded |
| TRAE CN | `~/.trae-cn/agents/` | ✅ loaded |
| TRAE | `~/.trae/agents/` | ✅ loaded |
| Claude Code | `~/.claude/agents/` | ✅ loaded |

### Commands — which paths loaded

| Client | `~/.claude/commands/` | Loaded? |
| --- | --- | --- |
| Claude Code | `~/.claude/commands/` | not reported (likely not loaded — user did not mention it) |

### Key empirical findings

1. **ALL 5 clients support skills, rules, AND agents at their native default paths.** Every marker surfaced after reload. The earlier "no rules system" conclusion for CodeBuddy/TRAE was wrong — they all have full skills+rules+agents support at `~/.<client>/{skills,rules,agents}/`.

2. **Cursor reads `~/.claude/skills/` as a compat alias** (confirmed). Skills installed at `~/.claude/skills/` appear in Cursor as well as Claude Code.

3. **CodeBuddy CN ALSO reads `~/.claude/skills/`** (confirmed). This is likely because the ClaudeCode plugin is installed in CodeBuddy CN. Skills installed at `~/.claude/skills/` appear in CodeBuddy CN too. This means `~/.claude/skills/` is a **shared skills root** for Cursor, CodeBuddy CN (with plugin), and Claude Code.

4. **TRAE CN reads BOTH `~/.trae-cn/skills/` AND `~/.trae/skills/`** (confirmed). TRAE CN scans the international TRAE path in addition to its own CN path. TRAE (international) only reads `~/.trae/skills/`. So `~/.trae/skills/` is a **shared skills root** for both TRAE and TRAE CN.

   **Follow-up confirmation (user test):**
   - Skills in `~/.trae/skills/` → both TRAE CN and TRAE find them ✅
   - Skills moved to `~/.trae-cn/skills/` only (deleted from `~/.trae/skills/`) → only TRAE CN finds them ✅
   - This proves the asymmetry: `~/.trae/skills/` is shared (TRAE + TRAE CN), `~/.trae-cn/skills/` is CN-only.
   - Install implication: write to `~/.trae/skills/` to cover both; write to `~/.trae-cn/skills/` for CN-only.

5. **CodeBuddy CN rules dir is `Rules/` (capital R)** on this machine — the user originally copied it with that casing. macOS APFS is case-insensitive so it works, but `path-detect.ts` should handle case-insensitive matching for the rules dir name.

6. **Claude Code commands marker did not appear** — either `~/.claude/commands/` is not the correct path, the format was wrong, or the user didn't check. Needs follow-up if commands are in scope for MCPI-05.

### Updated summary: confirmed storage paths for SDD framework artifacts

| Client | Skills | Rules | Agents | Compat / cross-client paths |
| --- | --- | --- | --- | --- |
| Cursor | `~/.cursor/skills/` ✅ | `~/.cursor/rules/` ✅ | `~/.cursor/agents/` ✅ | Also reads `~/.claude/skills/` |
| CodeBuddy CN | `~/.codebuddy/skills/` ✅ | `~/.codebuddy/Rules/` ✅ | `~/.codebuddy/agents/` ✅ | Also reads `~/.claude/skills/` (via ClaudeCode plugin) |
| TRAE CN | `~/.trae-cn/skills/` ✅ | `~/.trae-cn/rules/` ✅ | `~/.trae-cn/agents/` ✅ | Also reads `~/.trae/skills/` |
| TRAE | `~/.trae/skills/` ✅ | `~/.trae/rules/` ✅ | `~/.trae/agents/` ✅ | — |
| Claude Code | `~/.claude/skills/` ✅ | `~/.claude/rules/` ✅ | `~/.claude/agents/` ✅ | Shared with Cursor + CodeBuddy CN (with plugin) |

### Implications for MCPI-05 seed map and `sdd_install_framework`

- **Seed map defaults are all confirmed correct.** Every client supports `~/.<client>/{skills,rules,agents}/`.
- **`sdd_install_framework` should write to the client's native path** (`~/.<client>/skills/`, etc.) — all are confirmed readable.
- **Shared roots reduce install work:**
  - Installing skills to `~/.claude/skills/` covers Cursor + CodeBuddy CN (with plugin) + Claude Code in one write.
  - Installing skills to `~/.trae/skills/` covers TRAE + TRAE CN in one write.
- **`path-detect.ts` should report compat aliases** so the user knows a single install can cover multiple clients.
- **Case-insensitive matching** for the rules dir name (CodeBuddy uses `Rules/`).
- **`mkdir -p` before write** — native dirs may not exist yet (CodeBuddy/TRAE/TRAE CN skills and agents dirs were absent before this test).
