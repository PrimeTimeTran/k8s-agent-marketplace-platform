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
docker build -t agent-runtime:dev "$ROOT_DIR/agent_runtime"
docker build -t infra-control-plane:dev "$ROOT_DIR/infra-control-plane"
docker build -t product-control-plane:dev "$ROOT_DIR/product-control-plane"
docker build -t frontend:dev "$ROOT_DIR/frontend"

echo "▶ Loading images into k3d..."
k3d image import \
  agent-runtime:dev \
  infra-control-plane:dev \
  product-control-plane:dev \
  frontend:dev \
  -c $CLUSTER_NAME

echo "▶ Applying Kubernetes manifests..."
kubectl apply -f namespaces.yaml
kubectl apply -f agent-runtime.yaml
kubectl apply -f infra-control-plane.yaml
kubectl apply -f product-control-plane.yaml
kubectl apply -f frontend.yaml

echo "▶ Waiting for pods to become ready..."
kubectl wait --for=condition=available --timeout=120s deployment --all -A

echo "▶ Port forwarding frontend (Ctrl+C to stop)..."
kubectl port-forward svc/frontend 3000:3000
