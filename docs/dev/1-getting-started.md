## Getting Started

This project runs on **Kubernetes-first architecture**. The control plane, marketplace, and AI agents all run as containerized workloads inside a cluster.

## Platform

## 1. Dependencies

- [Node](https://nodejs.org/en)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Docker Desktop(with Kubernetes enabled)](https://docs.docker.com/desktop/)
- [K8s](https://kubernetes.io/)
- [kubectl](https://kubernetes.io/docs/reference/kubectl/)
- [Skaffold](https://skaffold.dev/docs/quickstart/)

### 2. Create / Verify Cluster

- Create cluster

```sh
k3d cluster create agent-mvp
```

- Ensure your context is correct:

```bash
$ kubectl config current-context
k3d-agent-mvp

# OR

$ kubectl config get-contexts

CURRENT   NAME             CLUSTER          AUTHINFO              NAMESPACE
          docker-desktop   docker-desktop   docker-desktop
*         k3d-agent-mvp    k3d-agent-mvp    admin@k3d-agent-mvp   agent-platform
```

- Create the namespace used by the platform:

```bash
kubectl create namespace agent-platform
```

---

### 3. Build Container Images

This project uses **multiple images** (marketplace, control plane, infra/agents).

Build them locally so Kubernetes can pull them without a registry:

```bash
docker build -t marketplace:dev ./marketplace
docker build -t infra-control-plane:dev ./infra/control-plane
docker build -t infra-agent:dev ./infra/agent
```

---

### 4. Deploy Core Infrastructure

Apply the Kubernetes manifests in order:

```bash
kubectl apply -f k8s/
```

This typically includes:

- Deployments (marketplace, control plane)
- Services
- RBAC (service accounts, roles, role bindings)
- Job templates for agent execution

Verify everything is running:

```bash
kubectl get pods -n agent-platform
```

---

### 5. Verify Control Plane Access

Port-forward the control plane:

```bash
kubectl port-forward svc/infra-control-plane 3000:3000 -n agent-platform
```

Test:

```bash
curl http://localhost:3000/health
```

---

### 6. Verify marketplace

Port-forward the marketplace service:

```bash
kubectl port-forward svc/marketplace 3001:3000 -n agent-platform
```

Open:

```
http://localhost:3001
```

---

### 7. Run an Agent Job (Smoke Test)

Trigger an execution via the control plane:

```bash
curl -X POST http://localhost:3000/schedule-job \
  -H "Content-Type: application/json" \
  -d '{ "prompt": "hello world" }'
```

Watch jobs execute:

```bash
kubectl get jobs -n agent-platform
kubectl logs -f job/<job-name> -n agent-platform
```

---

### 8. Development Workflow

You have two options:

#### Option A: Manual Rebuild (Clear + Explicit)

Best for understanding the system.

```bash
docker build -t marketplace:dev ./marketplace
kubectl rollout restart deploy/marketplace -n agent-platform
```

#### Option B: Skaffold (Fast Iteration)

Once you understand the flow:

```bash
skaffold dev
```

## Testing
