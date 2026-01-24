#!/usr/bin/env bash
set -euo pipefail

echo "🔨 Building execution fixture images..."

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
EXECUTION_DIR="$ROOT/../execution"
IMAGES_DIR="$ROOT/fixtures/execution/images"

# Build base image
if [[ -f "$EXECUTION_DIR/Dockerfile.base" ]]; then
  echo "  • execution-base"
  docker build -t execution-base:dev -f "$EXECUTION_DIR/Dockerfile.base" "$EXECUTION_DIR"
fi

for dir in "$IMAGES_DIR"/*; do
  if [[ -f "$dir/Dockerfile" ]]; then
    IMAGE_NAME="execution-$(basename "$dir")"
    echo "  • $IMAGE_NAME"
    docker build -t "$IMAGE_NAME:dev" "$dir"
  fi
done

echo "✅ Execution fixture images ready"
