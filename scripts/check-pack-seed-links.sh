#!/usr/bin/env bash
# Fail when pack seeds link upward to product-repo-only paths (PK-01 close check).
set -euo pipefail

ROOT="${1:-specs/framework/seeds}"

if [[ ! -d "$ROOT" ]]; then
  echo "check-pack-seed-links: missing directory $ROOT" >&2
  exit 1
fi

# Parent-relative markdown links only (../). Sibling ./product-backlog.md and ./adr/ in project templates are allowed.
PATTERN='\]\(\.\./.*(/adr/ADR-|framework-design\.md|seed-artifacts-building-guide|product-backlog\.md)'

if rg -n "$PATTERN" "$ROOT" 2>/dev/null; then
  echo "check-pack-seed-links: parent-relative links to product-only docs under $ROOT" >&2
  exit 1
fi

echo "check-pack-seed-links: ok ($ROOT)"
