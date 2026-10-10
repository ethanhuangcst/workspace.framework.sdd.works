#!/usr/bin/env bash
# TC-6 post-check: after update apply from staged old ledger (mcp-tests.md §16). Darwin.
set -euo pipefail

client_root() {
  case "$1" in
    codebuddy) echo "$HOME/.codebuddy" ;;
    trae-cn) echo "$HOME/.trae-cn" ;;
    codex) echo "$HOME/.codex" ;;
    *) echo "unknown client: $1" >&2; exit 1 ;;
  esac
}

skills_dir() {
  case "$1" in
    codebuddy) echo "$HOME/.codebuddy/skills" ;;
    trae-cn) echo "$HOME/.trae-cn/skills" ;;
    codex) echo "$HOME/.agents/skills" ;;
    *) exit 1 ;;
  esac
}

main() {
  [[ $# -eq 1 ]] || { echo "Usage: manual-e2e-verify-tc6.sh <client>" >&2; exit 1; }
  local client="$1"
  local root ledger skills
  root="$(client_root "$client")"
  ledger="$root/.sdd-installed.json"
  skills="$(skills_dir "$client")"

  echo "=== TC-6 verify client=$client (after apply) ==="
  [[ -f "$ledger" ]] || { echo "missing ledger"; exit 1; }

  python3 - "$ledger" <<'PY'
import json, sys, urllib.request
led = json.load(open(sys.argv[1]))
if led.get("pack_complete") is not True:
    sys.exit("pack_complete not true")
commit = led.get("package_commit") or ""
if commit.startswith("sha-v1.0.0") or commit == "sha-v1.0.0-fixture":
    sys.exit("ledger still on staged fixture commit")
with urllib.request.urlopen("http://127.0.0.1:3040/api/sdd/versions", timeout=3) as r:
    server = json.load(r).get("latestCommit") or ""
if commit != server:
    sys.exit(f"commit mismatch ledger={commit[:12]}… server={server[:12]}…")
print(f"ledger commit={commit[:12]}… matches server")
PY

  [[ -d "$skills/sdd-create-skill" ]] || { echo "missing pack skills"; exit 1; }
  [[ -d "$root/templates/framework.sdd.works/EN" ]] || { echo "missing nested templates"; exit 1; }
  echo "pack tree: ok"
  echo "=== TC-6 verify: PASS (disk; pair with agent action apply) ==="
}

main "$@"
