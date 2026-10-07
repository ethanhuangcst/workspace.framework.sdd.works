#!/usr/bin/env bash
# Verify product-backlog.md#L{n} links in specs point at pb-N anchor lines.
set -euo pipefail

ROOT="${1:-specs}"
PB="$ROOT/product-backlog.md"

if [[ ! -f "$PB" ]]; then
  echo "check-spec-links: missing $PB" >&2
  exit 1
fi

python3 - "$ROOT" "$PB" <<'PY'
import re, sys
from pathlib import Path

root = Path(sys.argv[1])
pb = Path(sys.argv[2])
lines = pb.read_text().splitlines()
errors = []
for path in root.rglob("*.md"):
    if path.resolve() == pb.resolve():
        continue
    text = path.read_text()
    for m in re.finditer(r"product-backlog\.md#L(\d+)", text):
        ln = int(m.group(1))
        if ln < 1 or ln > len(lines) or '<a id="pb-' not in lines[ln - 1]:
            errors.append(f"{path}:{ln}")
    for m in re.finditer(r"product-backlog\.md#(pb-\d+)", text):
        errors.append(f"{path}:cross-file #{m.group(1)}")

if errors:
    print("check-spec-links: failures", file=sys.stderr)
    for e in errors[:50]:
        print(e, file=sys.stderr)
    if len(errors) > 50:
        print(f"... and {len(errors) - 50} more", file=sys.stderr)
    sys.exit(1)

print(f"check-spec-links: ok ({root})")
PY
