# AI Agent Marketplace

[![Preview](./docs/architecture-diagram.png)](https://github.com/PrimeTimeTran/k8s-agent-marketplace-platform)

## Layered Architecture

- Marketplace
- Product Control Plane
- Infra Control Plane
- Agent Jobs/Runtime

## **Layers**

Instead of building a monolithic system that becomes bloated, brittle, and difficult to evolve, this architecture is organized around four clearly defined layers: **Marketplace**, **Product Control Plane**, **Infra Control Plane**, and **Agent Runtime**. Each layer owns a single, well-scoped responsibility, allowing business concerns, product intent, infrastructure orchestration, and execution to evolve independently. This separation enables the platform to support many agents, users, and execution models without coupling commercial logic to operational reality or runtime behavior to policy decisions.

Together, these cornerstones form a system that is resilient by design. Marketplace workflows such as discovery, pricing, and access control can change without impacting execution safety. Product-level decisions about what should run are enforced consistently across all agents, regardless of where or how they execute. Infrastructure concerns are delegated to Kubernetes, ensuring reliability, isolation, and scalability without custom scheduling logic. Finally, agent execution is isolated into narrow runtimes that can safely run untrusted or third-party code at scale. This layered approach creates a foundation that supports rapid iteration today while remaining robust enough to accommodate governance, monetization, and operational complexity as the marketplace grows.

### Marketplace

> “Who can create, discover, purchase, and access agents.”

The Marketplace is the commercial and access-control layer of the platform. It defines who is allowed to see an agent, under what conditions it may be used, and how usage is governed from a business perspective. This includes agent discovery, listing visibility, pricing models, usage limits, and entitlement checks. The Marketplace does not decide how an agent runs or where it runs — it decides who is allowed to request execution and under what contractual terms.

From a user’s perspective, the Marketplace is where agents are published, configured for public or private access, monetized, and shared across organizations or teams. Publishing an agent in the Marketplace makes it discoverable and purchasable, but does not guarantee that it will execute — execution is still subject to downstream control planes and platform governance. This separation allows agents to be listed for preview, staged rollout, or pre-purchase without immediately consuming infrastructure resources.

Critically, the Marketplace operates independently of runtime health. An agent may be visible and purchasable while temporarily unavailable due to capacity, failures, or policy enforcement. This allows the platform to decouple business workflows (billing, discovery, permissions) from operational concerns, while still enforcing strict access control and usage limits before any execution is attempted.

### Product Control Plane

> “What should run.”

The Product Control Plane is the decision-making layer that translates marketplace intent into concrete execution instructions. It determines what should be executed in response to a valid request, which agent definition applies, under which policies, and with what constraints. This layer is responsible for interpreting agent configuration, ownership, registry state, quotas, and permissions into a precise execution plan.

Where the Marketplace answers “who is allowed to request this agent,” the Product Control Plane answers “is this request valid right now, and what exactly does it mean to run this agent?” It resolves agent versions, validates that the agent is permitted to run, enforces organizational and user-level limits, and creates a formal execution record that can be tracked, billed, retried, or audited. The Product Control Plane does not concern itself with Kubernetes manifests, nodes, or pods — it produces intent, not infrastructure.

This layer is also where platform-level policy is enforced: concurrency limits, execution modes (sync vs async), resource envelopes, tool access, secrets exposure, and lifecycle transitions. By centralizing these decisions, the platform ensures that execution behavior is consistent regardless of where or how the agent ultimately runs. The Product Control Plane is therefore the bridge between product semantics and infrastructure reality, enabling the system to scale safely across many users, agents, and execution environments.

### Infra Control Plane

> “Where and how it runs.”

The Infra Control Plane is the execution orchestration layer responsible for turning high-level execution intent into concrete infrastructure actions. It determines where an agent runs, how it is scheduled, and under what operational constraints. This layer translates decisions from the Product Control Plane into Kubernetes-native primitives such as Jobs, Pods, Services, and resource limits, relying on Kubernetes to handle placement, retries, scaling, and isolation.

This control plane does not make product or business decisions. It assumes that all permissions, policies, and validations have already been resolved upstream. Its responsibility is to execute reliably, observe runtime signals, and report outcomes back to the system. Health checks, retries, timeouts, and failure detection all live here, enabling the platform to react to transient infrastructure issues without leaking those concerns into higher-level layers.

By delegating scheduling and lifecycle management to Kubernetes, the Infra Control Plane avoids custom infrastructure logic while remaining flexible enough to support different execution models. It acts as the system’s operational backbone, ensuring that agent executions are isolated, resource-bounded, observable, and resilient to failure.

### Agent Jobs/Runtime

> “What actually executes the agent.”

The Agent Runtime is the isolated execution environment in which an individual agent invocation runs. It is responsible for loading the agent code, resolving its dependencies, executing the agent’s logic, and producing outputs in response to a single request. Each execution is treated as a discrete unit of work with its own lifecycle, logs, resource limits, and failure modes.

The runtime is intentionally narrow in scope. It does not handle authentication, billing, marketplace logic, or scheduling decisions. Instead, it focuses on safe and deterministic execution: enforcing tool access, applying secrets policies, honoring resource constraints, and exposing health and execution status back to the Infra Control Plane. This makes the runtime interchangeable and extensible, allowing different agent implementations or execution strategies without altering the rest of the platform.

By isolating agent execution from control-plane concerns, the platform can safely run untrusted or third-party agents at scale. Multiple users may invoke the same agent concurrently, with each invocation running in its own runtime context. The Agent Runtime is therefore the point of truth for execution behavior, while remaining fully governed by upstream control planes.

## Dependencies

- [Node](https://nodejs.org/en)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Docker Desktop(with Kubernetes enabled)](https://docs.docker.com/desktop/)
- [K8s](https://kubernetes.io/)
- [kubectl](https://kubernetes.io/docs/reference/kubectl/)
- [Skaffold](https://skaffold.dev/docs/quickstart/)

### Getting Started

Yeah — **“Getting Started” should describe the _journey_, not a single command**. For this AI marketplace, you’re onboarding someone into:

- a Kubernetes-based control plane
- a job-execution model
- local + cluster-aware development
- infra + app + agent images

Below is a **clean, realistic Getting Started section** that matches what we’ve actually built and discussed.

You can copy-paste this into the README and tweak naming as needed.

---

## Getting Started

This project runs on **Kubernetes-first architecture**. The control plane, marketplace, and AI agents all run as containerized workloads inside a cluster.

### 1. Prerequisites

Make sure you have the following installed:

- Node.js (LTS)
- Docker Desktop **with Kubernetes enabled**
- kubectl
- (Optional) Skaffold for local dev iteration

Verify Kubernetes is running:

```bash
kubectl cluster-info
```

---

### 2. Create / Verify Cluster

For local development, we assume **Docker Desktop Kubernetes**.

Ensure your context is correct:

```bash
kubectl config current-context
```

You should see something like:

```text
docker-desktop
```

Create the namespace used by the platform:

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

> If using Docker Desktop, these images are immediately available to the cluster.

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

---

## Mental Model (Important)

- **marketplace** → user interaction
- **Control Plane** → schedules executions
- **Agent Jobs** → ephemeral Kubernetes Jobs
- **Kubernetes** → _is the execution engine_

This is not a traditional backend — Kubernetes _is the backend_.
