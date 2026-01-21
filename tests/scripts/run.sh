#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Running platform checks in $DIR"
echo

for script in "$DIR"/[0-9][0-9]-*.sh; do
  echo "▶️  $(basename "$script")"
  bash "$script"
  echo "✅ $(basename "$script") passed"
  echo
done

echo "🎉 All platform checks passed"
