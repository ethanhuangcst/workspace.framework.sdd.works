#!/usr/bin/env bash
# TC-7 post-check: real/bundled pack, not fixture stub (mcp-tests.md §16 MC-06). Darwin.
set -euo pipefail

client_root() {
  case "$1" in
    codebuddy) echo "$HOME/.codebuddy" ;;
    trae-cn) echo "$HOME/.trae-cn" ;;
    codex) echo "$HOME/.codex" ;;
    *) echo "unknown client: $1" >&2; exit 1 ;;
  esac
}

main() {
  [[ $# -eq 1 ]] || { echo "Usage: manual-e2e-verify-tc7.sh <client>" >&2; exit 1; }
  local client="$1"
  local root
  root="$(client_root "$client")"
  local ledger="$root/.sdd-installed.json"

  echo "=== TC-7 verify client=$client ==="
  [[ -f "$ledger" ]] || { echo "missing ledger (run install first)"; exit 1; }

  python3 - "$ledger" <<'PY'
import json, sys
led = json.load(open(sys.argv[1]))
commit = led.get("package_commit") or ""
if commit == "sha-v1.0.0":
    sys.exit("ledger still on fixture commit sha-v1.0.0")
if led.get("pack_complete") is not True:
    sys.exit("pack_complete not true")
files = led.get("files") or {}
n = sum(len(v) for v in files.values() if isinstance(v, list))
if n < 20:
    sys.exit(f"too few ledger file entries ({n}); fixture stub has ~6")
print(f"ledger ok: {n} file entries, package_commit={commit!r}")
PY

  if [[ -f "$root/skills/tdd/SKILL.md" ]]; then
    if head -1 "$root/skills/tdd/SKILL.md" | grep -q '^# tdd v1.0.0'; then
      echo "FAIL: fixture stub skill tdd present"
      exit 1
    fi
  fi
  [[ -d "$root/skills/sdd-create-skill" ]] || { echo "missing real pack skill sdd-create-skill"; exit 1; }
  echo "no fixture stub tree; real pack skills present"
  echo "=== TC-7 verify: PASS (disk; agent must report pack_source bundled) ==="
}

main "$@"
