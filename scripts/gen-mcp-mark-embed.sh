#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

SRC="$ROOT/public/sdd-mark.png"
ASSET="$ROOT/src/mcp/assets/sdd-mark.png"
OUT="$ROOT/src/mcp/generated/mcp-mark-base64.ts"

if [[ ! -f "$SRC" ]]; then
  echo "Missing $SRC" >&2
  exit 1
fi

mkdir -p "$(dirname "$ASSET")" "$(dirname "$OUT")"
cp "$SRC" "$ASSET"

python3 - <<PY
import base64, pathlib
b = pathlib.Path("$SRC").read_bytes()
pathlib.Path("$OUT").write_text(
    "// Generated from public/sdd-mark.png — run scripts/gen-mcp-mark-embed.sh to refresh.\\n"
    + f'export const MCP_MARK_BASE64 = "{base64.b64encode(b).decode()}";\\n'
)
print(f"Updated {pathlib.Path('$OUT').name} ({len(b)} byte PNG)")
PY
