#!/usr/bin/env bash
# TC-3 verification: seed-map root vs workspace (mcp-tests.md §16 MC-16). Darwin.
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: manual-e2e-verify-tc3.sh <client> <workspace_path>

Clients: codebuddy, trae-cn, codex

Checks pack and ledger live under the seed-map client root, not under workspace.
Tool fields resolution_source / root_warning are confirmed from the TC-2 install
transcript (same sdd_install_framework call with omitted root).
EOF
}

die() {
  echo "manual-e2e-verify-tc3.sh: $*" >&2
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
  [[ $# -eq 2 ]] || { usage; exit 1; }
  local client="$1"
  local workspace="$2"
  [[ -d "$workspace" ]] || die "workspace not a directory: $workspace"

  workspace="$(cd "$workspace" && pwd)"
  local root
  root="$(client_root "$client")"
  local skills
  skills="$(skills_dir "$client")"
  local ledger="$root/.sdd-installed.json"

  echo "=== TC-3 verify client=$client ==="
  echo "seed-map root: $root"
  echo "workspace:     $workspace"

  [[ -f "$ledger" ]] || die "ledger missing at seed root: $ledger"
  echo "ledger: ok at seed root"

  [[ -d "$skills/sdd-create-skill" || -d "$skills/sdd-update-project" ]] || die "expected pack skills under $skills"
  echo "skills: ok under seed root ($skills)"

  if [[ -f "$workspace/.sdd-installed.json" ]]; then
    die "workspace must not contain .sdd-installed.json (MC-16)"
  fi
  echo "workspace: no .sdd-installed.json"

  if [[ -d "$workspace/skills/sdd-create-skill" ]]; then
    die "pack skills must not appear under workspace"
  fi
  if [[ -d "$workspace/templates/framework.sdd.works" ]]; then
    die "pack templates must not appear under workspace"
  fi
  echo "workspace: no pack tree (skills/templates)"

  case "$client" in
    codebuddy)
      [[ "$root" == "$HOME/.codebuddy" ]] || die "unexpected root path"
      ;;
    trae-cn)
      [[ "$root" == "$HOME/.trae-cn" ]] || die "unexpected root path"
      [[ ! -f "$HOME/.trae-cn/mcp.json" ]] && echo "note: ~/.trae-cn/mcp.json not used for TRAE CN user MCP list" || true
      ;;
    codex)
      [[ "$root" == "$HOME/.codex" ]] || die "unexpected root path"
      ;;
  esac

  echo "=== TC-3 verify: PASS (disk). Match tool result root to seed-map in TC-2 transcript. ==="
}

main "$@"
