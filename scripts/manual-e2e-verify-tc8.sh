#!/usr/bin/env bash
# TC-8 baseline: sdd_get_key not_found vs invalid_input (MC-09). Pair with one IDE MCP call (mcp-tests.md §16).
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$repo_root"

echo "=== TC-8 verify (Vitest MC-09 contract) ==="
npx vitest run src/mcp/create-server.test.ts -t "get_key"
echo "=== TC-8 verify: PASS (automated; record one client MCP transcript in go-live-test.md) ==="
