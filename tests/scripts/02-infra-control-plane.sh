#!/usr/bin/env bash
set -euo pipefail

NAMESPACE=agent-platform
CONTROL_PLANE_URL="http://infra-control-plane.agent-platform.svc.cluster.local:3000"

echo "🔎 Verifying infra control plane is reachable..."

kubectl run infra-curl \
  -n "$NAMESPACE" \
  -i \
  --rm \
  --restart=Never \
  --image=curlimages/curl \
  -- \
  curl -sf "$CONTROL_PLANE_URL/executions" >/dev/null

echo "✅ infra control plane /executions reachable"
