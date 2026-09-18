#!/usr/bin/env sh
# framework.sdd.works — one-line installer for the SDD MCP stdio binary.
# Usage:  curl -fsSL https://framework.sdd.works/install | sh
#
# What it does:
#   1. Detects OS + arch
#   2. Downloads the correct binary from GitHub Releases
#   3. Places it at ~/.sdd/sdd-mcp (chmod +x)
#   4. Adds the MCP server entry to ~/.cursor/mcp.json using ${userHome} (same for everyone)
#   5. Prints "done" — user reloads Cursor and calls sdd_install_framework
#
# No Node, no npm, no git clone. One binary, one config entry, one command.
# The mcp.json entry uses ${userHome} — identical for every user, no customized path.

set -eu

INSTALL_DIR="${SDD_INSTALL_DIR:-$HOME/.sdd}"
BINARY_NAME="sdd-mcp"
RELEASES_URL="${SDD_RELEASES_URL:-https://github.com/ethanhuangcst/framework.sdd.works/releases/latest/download}"
SERVER_URL="${SDD_SERVER_URL:-https://framework.sdd.works}"
MCP_JSON="${MCP_JSON:-$HOME/.cursor/mcp.json}"

err() { printf "sdd install: %s\n" "$*" >&2; exit 1; }

# --- 1. Detect OS + arch ---
OS="$(uname -s)"
ARCH="$(uname -m)"

case "$OS" in
  Darwin) OS="darwin" ;;
  Linux)  OS="linux" ;;
  *) err "Unsupported OS: $OS (use macOS or Linux)" ;;
esac

case "$ARCH" in
  arm64|aarch64) ARCH="arm64" ;;
  x86_64|amd64)  ARCH="x64" ;;
  *) err "Unsupported arch: $ARCH" ;;
esac

TARGET="sdd-mcp-${OS}-${ARCH}"

echo "Detected: ${OS}/${ARCH} → ${TARGET}"

# --- 2. Download binary ---
mkdir -p "$INSTALL_DIR"
BINARY_PATH="$INSTALL_DIR/$BINARY_NAME"
URL="$RELEASES_URL/$TARGET"

echo "Downloading $URL ..."
if command -v curl >/dev/null 2>&1; then
  curl -fsSL -o "$BINARY_PATH" "$URL" || err "Download failed"
elif command -v wget >/dev/null 2>&1; then
  wget -qO "$BINARY_PATH" "$URL" || err "Download failed"
else
  err "Need curl or wget to download"
fi

chmod +x "$BINARY_PATH"
echo "Installed: $BINARY_PATH"

# --- 3. Update ~/.cursor/mcp.json ---
# Uses ${userHome} — Cursor resolves this variable, so the entry is identical
# for every user. No username, no customized path.
mkdir -p "$(dirname "$MCP_JSON")"

if [ ! -f "$MCP_JSON" ]; then
  echo '{"mcpServers":{}}' > "$MCP_JSON"
fi

# The command path uses ${userHome} which Cursor expands to the user's home dir.
MCP_COMMAND='${userHome}/.sdd/sdd-mcp'

# Idempotent merge: use node if available, else python3, else manual instructions
if command -v node >/dev/null 2>&1; then
  node -e "
    const fs = require('fs');
    const path = '$MCP_JSON';
    const cmd = '$MCP_COMMAND';
    const url = '$SERVER_URL';
    let cfg = {};
    try { cfg = JSON.parse(fs.readFileSync(path, 'utf8')); } catch {}
    if (!cfg.mcpServers) cfg.mcpServers = {};
    cfg.mcpServers['framework.sdd.works'] = { command: cmd, env: { SDD_SERVER_URL: url } };
    fs.writeFileSync(path, JSON.stringify(cfg, null, 2) + '\n');
    console.log('Updated: ' + path);
  "
elif command -v python3 >/dev/null 2>&1; then
  python3 -c "
import json
path = '$MCP_JSON'
cmd = '$MCP_COMMAND'
url = '$SERVER_URL'
try:
    with open(path) as f: cfg = json.load(f)
except: cfg = {}
cfg.setdefault('mcpServers', {})['framework.sdd.works'] = {'command': cmd, 'env': {'SDD_SERVER_URL': url}}
with open(path, 'w') as f: json.dump(cfg, f, indent=2)
print('Updated: ' + path)
"
else
  echo ""
  echo "Add this to $MCP_JSON manually:"
  echo '  "framework.sdd.works": {'
  echo '    "command": "${userHome}/.sdd/sdd-mcp",'
  echo "    \"env\": { \"SDD_SERVER_URL\": \"$SERVER_URL\" }"
  echo '  }'
fi

# --- 4. Done ---
echo ""
echo "Done. Reload MCP in Cursor (Settings → MCP → restart), then call sdd_install_framework."
