## Agent Workload

## Dev

- Recreate Job

```sh
kubectl delete job agent-job -n agent-platform --ignore-not-found
kubectl apply -f k8s/agent-job.yaml

# One Line
kubectl delete job agent-job -n agent-platform --ignore-not-found && kubectl apply -f k8s/agent-job.yaml
```

- Rebuild Image
  Jobs are different class of resource inside of K8s so we have to rebuild manually
  - Does not need skaffold restart

```sh
docker build -t agent-job:dev agent-job
k3d image import agent-job:dev -c agent-mvp

# One Line
docker build -t agent-job:dev agent-job && k3d image import agent-job:dev -c agent-mvp
```
