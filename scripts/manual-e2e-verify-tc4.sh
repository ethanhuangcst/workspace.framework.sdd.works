#!/usr/bin/env bash
# TC-4 verification: nested templates path (mcp-tests.md §16 MC-18, MC-15). Darwin.
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: manual-e2e-verify-tc4.sh <client>

Clients: codebuddy, trae-cn, codex

Checks templates/framework.sdd.works/ (nested) and rejects flat templates/EN/ at client root.
EOF
}

die() {
  echo "manual-e2e-verify-tc4.sh: $*" >&2
  exit 1
}

client_root() {
  case "$1" in
    codebuddy) echo "$HOME/.codebuddy" ;;
    trae-cn) echo "$HOME/.trae-cn" ;;
    codex) echo "$HOME/.codex" ;;
    *) die "unknown client: $1" ;;
  esac
}

main() {
  [[ $# -eq 1 ]] || { usage; exit 1; }
  local client="$1"
  local root
  root="$(client_root "$client")"
  local nested="$root/templates/framework.sdd.works"
  local flat_en="$root/templates/EN"

  echo "=== TC-4 verify client=$client root=$root ==="

  [[ -d "$nested/EN" ]] || die "missing $nested/EN"
  echo "nested EN: ok $nested/EN"

  for loc in HanS HanT; do
    [[ -d "$nested/$loc" ]] || die "missing $nested/$loc"
    echo "nested $loc: ok"
  done

  for f in constants.json pack-scrum-in-sdd.md sdd-scrum-practices.md coach-knowledge.md; do
    [[ -f "$nested/$f" ]] || die "missing $nested/$f"
    echo "  found $f"
  done

  [[ -f "$nested/EN/status.md" ]] || die "missing $nested/EN/status.md"
  echo "  found EN/status.md"

  if [[ -d "$flat_en" ]]; then
    die "flat templates/EN/ must not exist at client root (MC-18): $flat_en"
  fi
  echo "flat templates/EN/: absent (good)"

  echo "=== TC-4 verify: PASS ==="
}

main "$@"
