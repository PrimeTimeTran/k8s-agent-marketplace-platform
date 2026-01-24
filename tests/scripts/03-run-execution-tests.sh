#!/usr/bin/env bash
# Build fixtures for testing execution layer
# Then run all of the tests of the execution layer

set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(dirname "$DIR")"

# Ensure fixtures are built
echo "🏗️  Ensuring execution fixtures are built..."
"$DIR/build-execution-fixtures.sh"
echo

echo "🧪 Running execution tests..."
# Run all .test.js files in tests/execution/
for test in "$ROOT"/execution/*.test.js; do
  if [[ -f "$test" ]]; then
    echo "  • Running $(basename "$test")"
    node "$test"
  fi
done
