#!/usr/bin/env bash
#
# Platform Pulse
# ---------------------------------------------------------------------
# * This script checks for basic liveness only.
# * It is NOT a correctness test.
# * It should stay shallow and forgiving.
# ---------------------------------------------------------------------
# This script validates that the local dev Kubernetes environment
# (e.g. `skaffold dev`) is wired correctly end-to-end.
#
# What this confirms:
# 1. All core deployments are up and Ready:
#    - marketplace
#    - product-control-plane
#    - infra-control-plane
#
# 2. Cluster networking + DNS work:
#    - Services are resolvable by name inside the cluster
#    - Pods can reach each other over ClusterIP
#
# 3. Control-plane APIs are healthy:
#    - product-control-plane responds to health checks
#    - infra-control-plane responds to health checks
#
# 4. Infra control plane can queue work:
#    - POST /queue-job succeeds
#    - A Kubernetes Job is created with a unique name
#
# 5. Kubernetes job lifecycle works:
#    - Job is discoverable via the API
#    - Job runs to completion successfully
#
# If this script passes, it means:
# - Your manifests, images, services, and RBAC are correctly aligned
# - The system is functionally sound before adding customization,
#   workflows, or higher-level logic
#
# This is NOT a unit or integration test.
# It is a fast "does the system breathe?" sanity check.
#

set -euo pipefail

NAMESPACE=agent-platform

curl_in_cluster() {
  local url="$1"
  POD_NAME="smoke-curl-$(date +%s)"
  kubectl run "$POD_NAME" \
    -n "$NAMESPACE" \
    --rm -i \
    --restart=Never \
    --image=curlimages/curl \
    --quiet \
    -- \
    curl -sf "$url"
}

echo "🔎 Waiting for deployments..."
kubectl wait --for=condition=Available deploy/marketplace -n "$NAMESPACE" --timeout=60s
kubectl wait --for=condition=Available deploy/product-control-plane -n "$NAMESPACE" --timeout=60s
kubectl wait --for=condition=Available deploy/infra-control-plane -n "$NAMESPACE" --timeout=60s

echo "🌐 Checking service health..."
curl_in_cluster http://product-control-plane:3000/health
echo
curl_in_cluster http://infra-control-plane:3000/health
echo

echo "⚙️  Queuing agent job..."

POD_NAME="smoke-curl-$(date +%s)"

JOB_JSON=$(kubectl run "$POD_NAME" \
  -n "$NAMESPACE" \
  --rm -i \
--restart=Never \
  --image=curlimages/curl \
  --quiet \
  -- \
  curl -sf http://infra-control-plane:3000/queue-job \
    -H "Content-Type: application/json" \
    -d '{
      "type": "infra",
      "reason": "smoke-test"
    }'
)

echo "📦 Job response:"
echo "$JOB_JSON"

if ! echo "$JOB_JSON" | jq -e . >/dev/null; then
  echo "❌ Invalid JSON returned from queue-job"
  exit 1
fi

JOB_NAME=$(echo "$JOB_JSON" | jq -r '.job.jobName')

if [[ -z "$JOB_NAME" || "$JOB_NAME" == "null" ]]; then
  echo "❌ job.jobName missing in response"
  exit 1
fi

echo "⏳ Waiting for job $JOB_NAME..."
kubectl wait \
  --for=condition=complete \
  job/"$JOB_NAME" \
  -n "$NAMESPACE" \
  --timeout=60s

echo "✅ Smoke test passed"
