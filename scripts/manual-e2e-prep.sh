#!/usr/bin/env bash
# Manual E2E prep for MCP install tests (mcp-tests.md §16). Darwin paths only.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
MANIFEST="${SDD_PACKAGE_CACHE_DIR:-$REPO_ROOT/.data/sdd-packages}/manifest.json"
FIXTURE_COMMIT="sha-v1.0.0"

usage() {
  cat <<'EOF'
Usage: manual-e2e-prep.sh <flag> [client]

Flags:
  --clean <client>         Remove pack dirs and .sdd-installed.json for client
  --stage-ledger <client>  Write simulated older-commit ledger at client root
  --backup-mcp <client>    Copy MCP config to .bak (does not edit original)
  --restore-mcp <client>   Restore MCP config from .bak
  --fixture-on             Point manifest latestCommit at fixture SHA (TC-7)
  --fixture-off            Restore manifest from manifest.json.real

Clients: codebuddy, trae-cn, codex

Run from repo root. Does not modify MCP configs except --restore-mcp.
EOF
}

die() {
  echo "manual-e2e-prep: $*" >&2
  exit 1
}

require_home_path() {
  local path="$1"
  python3 - "$path" <<'PY' || die "refusing path outside home: $path"
import os, sys
p = os.path.normpath(os.path.expanduser(sys.argv[1]))
home = os.path.realpath(os.path.expanduser("~"))
if os.path.exists(p):
    p = os.path.realpath(p)
if p == home or p.startswith(home + os.sep):
    sys.exit(0)
sys.exit(1)
PY
}

client_root() {
  case "$1" in
    codebuddy) echo "$HOME/.codebuddy" ;;
    trae-cn) echo "$HOME/.trae-cn" ;;
    codex) echo "$HOME/.codex" ;;
    *) die "unknown client: $1 (use codebuddy, trae-cn, codex)" ;;
  esac
}

mcp_config() {
  case "$1" in
    codebuddy) echo "$HOME/.codebuddy/mcp.json" ;;
    trae-cn) echo "$HOME/Library/Application Support/Trae CN/User/mcp.json" ;;
    codex) echo "$HOME/.codex/config.toml" ;;
    *) die "unknown client: $1" ;;
  esac
}

do_clean() {
  local client="$1"
  local root
  root="$(client_root "$client")"
  require_home_path "$root"

  echo "clean: client=$client root=$root"

  case "$client" in
    codebuddy)
      rm -rf "$root/skills" "$root/Rules" "$root/agents" "$root/workflows" "$root/sdd" "$root/templates"
      rm -f "$root/.sdd-installed.json"
      ;;
    trae-cn)
      rm -rf "$root/skills" "$root/rules" "$root/agents" "$root/workflows" "$root/sdd" "$root/templates"
      rm -f "$root/.sdd-installed.json"
      ;;
    codex)
      rm -rf "$HOME/.agents/skills" "$root/rules" "$root/agents" "$root/workflows" "$root/sdd" "$root/templates"
      rm -f "$root/.sdd-installed.json"
      ;;
  esac
  echo "clean: done"
}

do_stage_ledger() {
  local client="$1"
  local root
  root="$(client_root "$client")"
  require_home_path "$root"
  mkdir -p "$root"
  local ledger="$root/.sdd-installed.json"
  cat >"$ledger" <<'JSON'
{
  "version": 1,
  "package_version": "v0.0.0-fixture",
  "package_commit": "sha-v1.0.0",
  "installed_at": "2026-01-01T00:00:00.000Z",
  "pack_complete": true,
  "files": {
    "skills": [],
    "rules": [],
    "agents": [],
    "workflows": [],
    "templates": []
  }
}
JSON
  echo "stage-ledger: wrote $ledger"
}

do_backup_mcp() {
  local client="$1"
  local cfg
  cfg="$(mcp_config "$client")"
  require_home_path "$cfg"
  if [[ ! -f "$cfg" ]]; then
    echo "backup-mcp: no file at $cfg (skip)"
    return 0
  fi
  cp -p "$cfg" "${cfg}.bak"
  echo "backup-mcp: ${cfg} -> ${cfg}.bak"
}

do_restore_mcp() {
  local client="$1"
  local cfg
  cfg="$(mcp_config "$client")"
  require_home_path "$cfg"
  if [[ ! -f "${cfg}.bak" ]]; then
    die "missing backup ${cfg}.bak"
  fi
  mv "${cfg}.bak" "$cfg"
  echo "restore-mcp: restored $cfg"
}

do_fixture_on() {
  [[ -f "$MANIFEST" ]] || die "missing manifest: $MANIFEST"
  if [[ ! -f "${MANIFEST}.real" ]]; then
    cp -p "$MANIFEST" "${MANIFEST}.real"
    echo "fixture-on: saved ${MANIFEST}.real"
  fi
  python3 - "$MANIFEST" "$FIXTURE_COMMIT" <<'PY'
import json, sys
path, sha = sys.argv[1], sys.argv[2]
data = json.load(open(path))
data["latestCommit"] = sha
for v in data.get("versions", []):
    if v.get("id") == data.get("latestVersion") or v.get("id") == "main":
        v["commitSha"] = sha
json.dump(data, open(path, "w"), indent=2)
print(f"fixture-on: latestCommit -> {sha}")
PY
}

do_fixture_off() {
  [[ -f "${MANIFEST}.real" ]] || die "missing ${MANIFEST}.real (run --fixture-on first)"
  cp -p "${MANIFEST}.real" "$MANIFEST"
  echo "fixture-off: restored manifest from ${MANIFEST}.real"
}

main() {
  [[ $# -ge 1 ]] || { usage; exit 1; }
  case "$1" in
    --clean)
      [[ $# -eq 2 ]] || die "--clean requires client"
      do_clean "$2"
      ;;
    --stage-ledger)
      [[ $# -eq 2 ]] || die "--stage-ledger requires client"
      do_stage_ledger "$2"
      ;;
    --backup-mcp)
      [[ $# -eq 2 ]] || die "--backup-mcp requires client"
      do_backup_mcp "$2"
      ;;
    --restore-mcp)
      [[ $# -eq 2 ]] || die "--restore-mcp requires client"
      do_restore_mcp "$2"
      ;;
    --fixture-on)
      do_fixture_on
      ;;
    --fixture-off)
      do_fixture_off
      ;;
    -h | --help)
      usage
      ;;
    *)
      usage
      exit 1
      ;;
  esac
}

main "$@"
