#!/usr/bin/env bash
# TC-2 verification for manual E2E (mcp-tests.md §16). Darwin seed-map roots only.
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: manual-e2e-verify-tc2.sh <client> [workspace_path]

Clients: codebuddy, trae-cn, codex

Checks:
  - GET /install reachable (3040)
  - No .sdd-installed.json before install (optional warn if present)
  - After install: ledger pack_complete, nested templates, skills dir

When workspace_path is set, lists specs/ under it (MC-17: agent must not scaffold workspace).
EOF
}

die() {
  echo "manual-e2e-verify-tc2.sh: $*" >&2
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

skills_dir() {
  case "$1" in
    codebuddy) echo "$HOME/.codebuddy/skills" ;;
    trae-cn) echo "$HOME/.trae-cn/skills" ;;
    codex) echo "$HOME/.agents/skills" ;;
    *) die "unknown client: $1" ;;
  esac
}

main() {
  [[ $# -ge 1 ]] || { usage; exit 1; }
  local client="$1"
  local workspace="${2:-}"
  local root
  root="$(client_root "$client")"
  local ledger="$root/.sdd-installed.json"
  local templates="$root/templates/framework.sdd.works"
  local templates_en="$templates/EN"
  local skills
  skills="$(skills_dir "$client")"

  echo "=== TC-2 verify client=$client root=$root ==="

  local install_code
  install_code="$(curl -sS -o /dev/null -w '%{http_code}' --connect-timeout 3 http://127.0.0.1:3040/install || echo 000)"
  echo "GET http://127.0.0.1:3040/install -> HTTP $install_code"
  [[ "$install_code" == "200" ]] || die "install page not reachable"

  if [[ -f "$ledger" ]]; then
    echo "ledger: present $ledger"
    if command -v python3 >/dev/null 2>&1; then
      python3 - "$ledger" <<'PY'
import json, sys
p = sys.argv[1]
d = json.load(open(p))
pc = d.get("pack_complete")
commit = d.get("package_commit", "")[:12]
print(f"  pack_complete={pc!r} package_commit={commit}…")
if pc is not True:
    sys.exit(1)
PY
    else
      grep -q '"pack_complete": true' "$ledger" || die "pack_complete not true"
    fi
  else
    echo "ledger: MISSING (expected after successful install)"
    exit 1
  fi

  if [[ -d "$templates_en" ]]; then
    echo "templates: ok $templates_en"
    for f in constants.json pack-scrum-in-sdd.md sdd-scrum-practices.md; do
      if [[ -f "$templates/$f" ]]; then
        echo "  found $f"
      else
        echo "  MISSING $templates/$f"
        exit 1
      fi
    done
    if [[ -f "$templates_en/status.md" ]]; then
      echo "  found EN/status.md"
    else
      echo "  MISSING EN/status.md"
      exit 1
    fi
  else
    echo "templates: MISSING $templates_en"
    exit 1
  fi

  if [[ -d "$skills" ]]; then
    local n
    n="$(find "$skills" -mindepth 1 -maxdepth 2 -type d 2>/dev/null | wc -l | tr -d ' ')"
    echo "skills: ok $skills ($n dirs under tree)"
  else
    echo "skills: MISSING $skills"
    exit 1
  fi

  if [[ -n "$workspace" ]]; then
    workspace="$(cd "$workspace" 2>/dev/null && pwd || echo "$workspace")"
    echo "workspace: $workspace"
    if [[ -d "$workspace/specs" ]]; then
      echo "  specs/ exists (if install created it during this run, MC-17 fails — confirm from agent transcript)"
      ls -la "$workspace/specs" 2>/dev/null | head -5
    else
      echo "  specs/ absent (good for MC-17 when workspace is not the product repo)"
    fi
  fi

  echo "=== TC-2 verify: PASS ==="
}

main "$@"
