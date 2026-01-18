#!/usr/bin/env bash
set -e

CLUSTER=agent-mvp
NAMESPACE=agent-platform

build_and_deploy () {
  local NAME=$1
  local PATH=$2

  echo "🚀 Building $NAME"
  docker build -t $NAME:dev $PATH

  echo "📦 Importing $NAME into k3d"
  k3d image import $NAME:dev -c $CLUSTER

  echo "♻️ Restarting deployment $NAME"
  kubectl rollout restart deployment $NAME -n $NAMESPACE
}

build_and_deploy frontend ./frontend
build_and_deploy product-control-plane ./product-control-plane
build_and_deploy infra-control-plane ./infra-control-plane
build_and_deploy agent-runtime ./agent-runtime

echo "✅ All services redeployed"
