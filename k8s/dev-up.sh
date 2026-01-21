#!/usr/bin/env bash
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

CLUSTER_NAME=agent-mvp

echo "▶ Ensuring k3d cluster exists..."
if ! k3d cluster list | grep -q "$CLUSTER_NAME"; then
  k3d cluster create $CLUSTER_NAME
else
  echo "✔ Cluster already exists"
fi

echo "▶ Setting kubectl context..."
kubectl config use-context k3d-$CLUSTER_NAME

echo "▶ Building images..."
docker build -t marketplace:dev "$ROOT_DIR/marketplace"
docker build -t product-control-plane:dev "$ROOT_DIR/product-control-plane"
docker build -t infra-control-plane:dev "$ROOT_DIR/infra-control-plane"
docker build -t agent-runtime:dev "$ROOT_DIR/agent-runtime"
docker build -t agent-job:dev "$ROOT_DIR/agent-job"

echo "▶ Loading images into k3d..."
k3d image import \
  marketplace:dev \
  product-control-plane:dev \
  infra-control-plane:dev \
  agent-runtime:dev \
  -c $CLUSTER_NAME

echo "▶ Applying Kubernetes manifests..."
kubectl apply -f namespaces.yaml
kubectl apply -f marketplace.yaml
kubectl apply -f product-control-plane.yaml
kubectl apply -f infra-control-plane.yaml
kubectl apply -f agent-runtime.yaml
kubectl apply -f agent-job.yaml

echo "▶ Waiting for pods to become ready..."
kubectl wait --for=condition=available --timeout=120s deployment --all -A

echo "▶ Port forwarding marketplace (Ctrl+C to stop)..."
kubectl port-forward svc/marketplace 3000:3000
