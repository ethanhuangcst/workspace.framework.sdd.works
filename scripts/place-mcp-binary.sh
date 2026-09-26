#!/usr/bin/env bash
# Copy the host-matching MCP binary from dist/ to ~/.sdd/sdd-mcp.
# Build first: npm run mcp:build
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="${OUT_DIR:-$ROOT/dist}"
DEST_DIR="${HOME}/.sdd"
DEST="${DEST_DIR}/sdd-mcp"

os="$(uname -s | tr '[:upper:]' '[:lower:]')"
arch="$(uname -m)"
case "$os" in
  darwin) os_key=darwin ;;
  linux) os_key=linux ;;
  mingw*|msys*|cygwin*) os_key=windows ;;
  *)
    echo "Unsupported OS: $os" >&2
    exit 1
    ;;
esac
case "$arch" in
  arm64|aarch64) arch_key=arm64 ;;
  x86_64|amd64) arch_key=x64 ;;
  *)
    echo "Unsupported CPU: $arch" >&2
    exit 1
    ;;
esac

if [[ "$os_key" == "windows" ]]; then
  SRC="${OUT_DIR}/sdd-mcp-${os_key}-${arch_key}.exe"
else
  SRC="${OUT_DIR}/sdd-mcp-${os_key}-${arch_key}"
fi

if [[ ! -f "$SRC" ]]; then
  echo "Missing $SRC — run: npm run mcp:build" >&2
  exit 1
fi

mkdir -p "$DEST_DIR"
cp "$SRC" "$DEST"
chmod +x "$DEST"
echo "Placed $SRC -> $DEST"
