#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(dirname "$DIR")"
INFRA_DIR="$ROOT/../infra-control-plane"

echo "🧪 Running Infra Control Plane Unit Tests..."

if [[ -d "$INFRA_DIR" ]]; then
  pushd "$INFRA_DIR" > /dev/null
  # Ensure dependencies are installed
  npm install --silent
  # Run tests
  node --test tests/unit/*.test.js
  popd > /dev/null
else
  echo "⚠️  infra-control-plane directory not found at $INFRA_DIR"
  exit 1
fi
