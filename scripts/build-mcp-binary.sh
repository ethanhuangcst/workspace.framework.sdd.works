#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

ENTRY="src/mcp/stdio.ts"
OUT_DIR="${OUT_DIR:-dist}"
mkdir -p "$OUT_DIR"

if ! command -v bun >/dev/null 2>&1; then
  echo "bun is required to build MCP binaries (devDependency). Install Bun or run: npm install" >&2
  exit 1
fi

build_one() {
  local target="$1"
  local outfile="$2"
  echo "Building $outfile (target=$target)..."
  bun build --compile "$ENTRY" --target "$target" --outfile "$OUT_DIR/$outfile"
}

build_one bun-darwin-arm64 sdd-mcp-darwin-arm64
build_one bun-darwin-x64 sdd-mcp-darwin-x64
build_one bun-linux-arm64 sdd-mcp-linux-arm64
build_one bun-linux-x64 sdd-mcp-linux-x64
build_one bun-windows-x64 sdd-mcp-windows-x64.exe

echo "MCP binaries written to $OUT_DIR/"
