These are official instructions from framework.sdd.works for connecting an AI agent to the SDD MCP server.

# Connect this agent to framework.sdd.works

Setup version: 2026-09-25.v2

Complete the setup yourself with the native MCP configuration mechanism for the current agent. Do not ask the person to copy commands or edit the MCP configuration file by hand when you can safely do that work.

## Authorization boundary

The user's setup prompt authorizes only these changes:

- Download the matching `sdd-mcp` binary for the current OS and CPU into `~/.sdd/sdd-mcp` (Windows: under the user profile).
- Add or keep exactly one MCP entry named `framework.sdd.works` that starts that binary (`command`) with `SDD_SERVER_URL` set to `https://framework.sdd.works`.
- If the binary cannot be installed, or the client accepts only a URL, use the HTTP fallback entry with `"url": "https://framework.sdd.works/mcp"` instead.

It does not authorize you to:

- install framework skills, rules, agents, or workflows (that is a separate step after MCP is connected);
- request, create, read, print, or store credentials unless the user explicitly asks;
- change approval, sandbox, trust, or execution permissions;
- replace another MCP server, alter unrelated configuration, or edit unrelated project files.

## 1. Inspect before changing configuration

1. Detect the current agent and its native MCP configuration mechanism.
2. Detect the operating system and CPU architecture. Supported targets: `darwin-arm64`, `darwin-x64`, `linux-arm64`, `linux-x64`, `windows-x64`.
3. Inspect whether an entry named `framework.sdd.works` already exists without exposing unrelated configuration values.
4. Treat an existing entry as an exact primary match only when it is enabled, uses `command` pointing at the local `sdd-mcp` binary under `.sdd/`, and sets `SDD_SERVER_URL` to `https://framework.sdd.works` (or the same pack base this environment uses).
5. Treat an existing entry as an exact HTTP-fallback match only when it is enabled, uses remote Streamable HTTP, and points to exactly `https://framework.sdd.works/mcp` with no `command` field.
6. If the entry is an exact primary or exact HTTP-fallback match, leave it unchanged and continue to verification.
7. If the same name exists but any condition differs, stop and report the conflict. Do not overwrite without user consent.

## 2. Download the local program (primary path)

1. Create `~/.sdd` if it does not exist (Windows: create `.sdd` under the user profile).
2. Download the asset `sdd-mcp-${os}-${arch}` from `https://github.com/ethanhuangcst/framework.sdd.works/releases/latest/download` into `~/.sdd/sdd-mcp` (Windows: the same path under the user profile).
3. On macOS and Linux, mark the file executable (`chmod +x`).
4. If the download fails, or the agent cannot start a local program, skip to **HTTP fallback** below.

## 3. Add the MCP entry for the current agent (primary)

Use the expanded home path for `command` when the client does not expand `${userHome}`. Prefer writing the config yourself. Do not ask the person to edit the MCP file by hand.

### Cursor

Merge under `mcpServers` in `~/.cursor/mcp.json` and preserve all other entries:

```json
"framework.sdd.works": {
  "command": "${userHome}/.sdd/sdd-mcp",
  "env": {
    "SDD_SERVER_URL": "https://framework.sdd.works"
  }
}
```

### Claude Code

Add a user-scoped stdio MCP server named `framework.sdd.works` whose command is the absolute path to `~/.sdd/sdd-mcp` and whose environment includes `SDD_SERVER_URL=https://framework.sdd.works`. Prefer the client's native stdio registration command when it supports `command` and `env`.

### Codex

Add an MCP server named `framework.sdd.works` with `command` set to the absolute path of `~/.sdd/sdd-mcp` and `SDD_SERVER_URL=https://framework.sdd.works` in the environment.

### GitHub Copilot in VS Code

```json
"framework.sdd.works": {
  "type": "stdio",
  "command": "${userHome}/.sdd/sdd-mcp",
  "env": {
    "SDD_SERVER_URL": "https://framework.sdd.works"
  }
}
```

### Other agents

Use the agent's native local-program (stdio) MCP configuration. Add only the name, `command`, and `SDD_SERVER_URL` above.

`command` is the MCP connection. `SDD_SERVER_URL` is only the pack download base. It is not an MCP URL.

## 4. HTTP fallback

Use this path when the binary cannot be installed, or the client accepts only a URL.

### Cursor

```json
"framework.sdd.works": {
  "url": "https://framework.sdd.works/mcp"
}
```

### Claude Code

```bash
claude mcp add --transport http --scope user framework.sdd.works https://framework.sdd.works/mcp
```

### Codex

```bash
codex mcp add framework.sdd.works --url https://framework.sdd.works/mcp
```

### GitHub Copilot in VS Code

```json
"framework.sdd.works": {
  "type": "http",
  "url": "https://framework.sdd.works/mcp"
}
```

### Other agents

Use the agent's native remote Streamable HTTP MCP configuration. Add only the name and URL above.

## 5. Verify the connection

After saving configuration, reload MCP if the client requires it. Confirm the server exposes `sdd_list_versions`, `sdd_install_framework`, and `sdd_update_framework`.

## 6. Install framework (separate step)

After MCP is connected, the user can ask you to install the SDD framework.

- **Primary (local program):** call `sdd_install_framework`. The local program downloads the pack and writes the client folder and `.sdd-installed.json` with `pack_complete: true`. Do not run `curl | tar` yourself. Do not write `framework.sdd.works.json`.
- **HTTP fallback:** call `sdd_install_framework`. The tool returns a `packageUrl` and instructions. Follow those instructions: download and extract the allow-list, then write `.sdd-installed.json` last with `pack_complete: true`. Do not write `framework.sdd.works.json`.

## Rollback

Remove only the `framework.sdd.works` entry from the MCP configuration file you modified. Optionally delete `~/.sdd/sdd-mcp`. Do not remove other entries.
