#!/usr/bin/env bash
# TC-9 baseline: unknown client root_required, valid root apply, invalid path (ADR-132). Pair with MCP calls in go-live-test.md.
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$repo_root"

echo "=== TC-9 verify (Vitest unknown-client install) ==="
npx vitest run src/core/tools/install.test.ts -t "unknown_client"
echo "=== TC-9 verify: PASS (automated; pair with three MCP install calls in go-live-test.md) ==="
