## Requirements

- Docker Desktop
- Kubernetes
- Skaffold
- k3d

## Installation

- Setup K8s
  brew install k3d
  k3d cluster create agent-mvp
  kubectl get nodes

- Check pods running
  kubectl get pods -n agent-platform

- After updating any k8s config
  kubectl apply -f k8s/frontend.yaml

## Development

- Start Cluster Pods in dev mode(enables hot reload)

```sh
skaffold dev
```

- Create new images & roll them out to the cluster

```sh
docker build -t frontend:dev ./frontend && k3d image import frontend:dev -c agent-mvp && kubectl rollout restart deployment frontend -n agent-platform
docker build -t product-control-plane:dev ./product-control-plane && k3d image import product-control-plane:dev -c agent-mvp && kubectl rollout restart deployment product-control-plane -n agent-platform
docker build -t infra-control-plane:dev ./infra-control-plane && k3d image import infra-control-plane:dev -c agent-mvp && kubectl rollout restart deployment infra-control-plane -n agent-platform
docker build -t agent-runtime:dev ./agent-runtime && k3d image import agent-runtime:dev -c agent-mvp && kubectl rollout restart deployment agent-runtime -n agent-platform
```

- Create job from CLI. Spins up pod/container to process it and then tears it down once completed.

```sh
kubectl apply -f k8s/test-job.yaml
```

- Proxy next/frontend pod to host

```sh
kubectl port-forward svc/frontend 3000:3000 -n agent-platform
```

## Logging/Debugging/Environment

- View Services & Endpoints. Internal

```sh
kubectl get svc -n agent-platform
kubectl get endpoints -n agent-platform
```

- Describe a pod (gold for debugging)

```sh
kubectl describe pod frontend-79c4b7dbc-28qcv -n agent-platform
```

- Print pods information

```sh
kubectl get pods -n agent-platform
```

- View logs from single pod/job

```sh
kubectl logs -n agent-platform -f frontend-79c4b7dbc-28qcv
```

- Fetch the stdout/stderr logs produced by the containers running in the pods

```sh
kubectl logs -n agent-platform deployment/agent-runtime
kubectl logs -n agent-platform deployment/product-control-plane
```

- Tail logs live:

```sh
kubectl logs -n agent-platform -f deployment/product-control-plane
kubectl logs -n agent-platform -f deployment/infra-control-plane
kubectl logs -n agent-platform -f deployment/agent-runtime
```

- SSH into a pod/container to view it's content

```sh
kubectl exec -n agent-platform -it deployment/agent-runtime -- bash
pip show sentencepiece
```

- Check pod image

```sh
kubectl get pod product-control-plane-6b4cd6b7bb-qlvnb -n agent-platform -o jsonpath='{.spec.containers[0].image}'
kubectl get pod product-control-plane-6b4cd6b7bb-qlvnb -n agent-platform -o jsonpath='{.spec.containers[0].command}'
```

- View the entrypoint

```sh
docker inspect product-control-plane:dev --format='Entrypoint={{.Config.Entrypoint}} Cmd={{.Config.Cmd}}'
```

- View rollout status

```sh
kubectl rollout status deployment/agent-runtime -n agent-platform
kubectl rollout status deployment/product-control-plane -n agent-platform
```

- Restart without rebuilding (fast dev loop)

```sh
kubectl rollout restart deployment/agent-runtime -n agent-platform
```

## Dashboard

- View Dashboard

```sh
# Creates the kubernetes-dashboard namespace
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml

# Starts a local HTTP proxy on your machine,
# Authenticates to the cluster using your kubeconfig,
# Forwards browser traffic → Kubernetes API
kubectl proxy http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/#/login

# Create a Servie Account
kubectl create serviceaccount dashboard-admin -n kubernetes-dashboard

# Grant cluster-admin (this is the big hammer)
kubectl create clusterrolebinding dashboard-admin \
  --clusterrole=cluster-admin \
  --serviceaccount=kubernetes-dashboard:dashboard-admin

# Generate Login Token
kubectl -n kubernetes-dashboard create token dashboard-admin
```

## K8s

- View all pods in all namespaces

```sh
kubectl get pods -A
```

- Get all resources in a namespace

```sh
kubectl get all -n agent-platform
kubectl get pods -n agent-platform
# More details, restarts, node, age
kubectl get pods -n agent-platform -o wide

```

- See Jobs status

```sh
kubectl get jobs -n agent-platform
kubectl describe job test-job -n agent-platform
kubectl logs -n agent-platform job/test-job
```

- See events (cluster truth serum)

```sh
kubectl get events -n agent-platform --sort-by=.lastTimestamp
```

- Cleanup stuck resources

```sh
kubectl delete pod frontend-79c4b7dbc-28qcv -n agent-platform
kubectl delete job test-job -n agent-platform
```
