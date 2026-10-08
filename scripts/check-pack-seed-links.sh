#!/usr/bin/env bash
# Fail when pack seeds link upward to product-repo-only paths (PK-01, OGT 2).
set -euo pipefail

ROOT="${1:-pack.framework.sdd.works}"

if [[ ! -d "$ROOT" ]]; then
  echo "check-pack-seed-links: missing directory $ROOT" >&2
  exit 1
fi

FAILED=0

# Any markdown link into this product repo's ADR or Knowledge trees (OGT 2).
if rg -n '\]\([^)]*specs/(adr|knowledge)/' "$ROOT" 2>/dev/null; then
  echo "check-pack-seed-links: markdown link targets specs/adr/ or specs/knowledge/ under $ROOT" >&2
  FAILED=1
fi

# Parent-relative escape to other product-only docs. Sibling ./adr/ in project templates is allowed.
PATTERN='\]\(\.\./.*(framework-design\.md|seed-artifacts-building-guide|product-backlog\.md)'
if rg -n "$PATTERN" "$ROOT" 2>/dev/null; then
  echo "check-pack-seed-links: parent-relative links to product-only docs under $ROOT" >&2
  FAILED=1
fi

# Legacy parent-relative ADR file links (../../…/adr/ADR-…).
LEGACY_ADR='\]\(\.\./.*(/adr/ADR-|specs/adr/)'
if rg -n "$LEGACY_ADR" "$ROOT" 2>/dev/null; then
  echo "check-pack-seed-links: parent-relative ADR links under $ROOT" >&2
  FAILED=1
fi

if [[ "$FAILED" -ne 0 ]]; then
  exit 1
fi

echo "check-pack-seed-links: ok ($ROOT)"
