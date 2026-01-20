#!/usr/bin/env bash
# Rebuilds and redeploys all local services into k3d
# Safe, idempotent, no false errors

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

CLUSTER=agent-mvp
NAMESPACE=agent-platform
K8S_DIR="$ROOT_DIR/k8s"

build_and_load () {
  local NAME=$1
  local CONTEXT=$2
  local TAG=${3:-dev}

  echo "🚀 Building $NAME:$TAG"
  docker build -t $NAME:$TAG "$CONTEXT"

  echo "📦 Importing $NAME:$TAG into k3d"
  k3d image import "$NAME:$TAG" -c "$CLUSTER"
}

apply_manifest () {
  local FILE=$1
  echo "📄 Applying $FILE"
  kubectl apply -f "$FILE"
}

# ---- Build images ----
build_and_load frontend "$ROOT_DIR/frontend"
build_and_load product-control-plane "$ROOT_DIR/product-control-plane"
build_and_load infra-control-plane "$ROOT_DIR/infra-control-plane"
build_and_load agent-runtime "$ROOT_DIR/agent-runtime"
build_and_load agent-job "$ROOT_DIR/agent-job"

# ---- Apply manifests ----
apply_manifest "$K8S_DIR/namespaces.yaml"
apply_manifest "$K8S_DIR/frontend.yaml"
apply_manifest "$K8S_DIR/product-control-plane.yaml"
apply_manifest "$K8S_DIR/infra-control-plane.yaml"
apply_manifest "$K8S_DIR/agent-runtime.yaml"
apply_manifest "$K8S_DIR/agent-job.yaml"

echo "✅ All services built and applied"
