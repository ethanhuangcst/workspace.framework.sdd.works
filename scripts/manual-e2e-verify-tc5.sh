#!/usr/bin/env bash
# TC-5 post-check: ledger still present, commit matches server (after agent noop). Darwin.
set -euo pipefail

client_root() {
  case "$1" in
    codebuddy) echo "$HOME/.codebuddy" ;;
    trae-cn) echo "$HOME/.trae-cn" ;;
    codex) echo "$HOME/.codex" ;;
    *) echo "manual-e2e-verify-tc5.sh: unknown client: $1" >&2; exit 1 ;;
  esac
}

main() {
  [[ $# -eq 1 ]] || { echo "Usage: manual-e2e-verify-tc5.sh <client>" >&2; exit 1; }
  local client="$1"
  local root ledger
  root="$(client_root "$client")"
  ledger="$root/.sdd-installed.json"
  echo "=== TC-5 verify client=$client (disk after noop) ==="
  [[ -f "$ledger" ]] || { echo "missing ledger"; exit 1; }
  python3 - "$ledger" <<'PY'
import json, sys, urllib.request
led = json.load(open(sys.argv[1]))
commit = led.get("package_commit") or ""
if led.get("pack_complete") is not True:
    sys.exit("pack_complete not true")
try:
    with urllib.request.urlopen("http://127.0.0.1:3040/api/sdd/versions", timeout=3) as r:
        server = json.load(r).get("latestCommit") or ""
except OSError as e:
    sys.exit(f"versions API: {e}")
if not commit or not server:
    sys.exit("missing commit on ledger or server")
if commit != server:
    sys.exit(f"commit mismatch ledger={commit[:12]}… server={server[:12]}…")
print(f"ledger ok pack_complete=true commit={commit[:12]}… matches server")
PY
  echo "=== TC-5 verify: PASS (disk; pair with agent action noop) ==="
}

main "$@"
