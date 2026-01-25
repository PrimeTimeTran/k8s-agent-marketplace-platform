# AI Agent Marketplace

[![Preview](./docs/architecture-diagram.png)](https://github.com/PrimeTimeTran/k8s-agent-marketplace-platform)

## Architecture

### Mental Model

- **Marketplace** → user interaction
- **Product Control Plane** → schedules executions
- **Infra Control Plane** → ephemeral Kubernetes Jobs
- **Execution** → _is the execution engine_

## **Layers**

Instead of building a monolithic system that becomes bloated, brittle, and difficult to evolve, this architecture is organized around four clearly defined layers: **Marketplace**, **Product Control Plane**, **Infra Control Plane**, and **Execution**. Each layer owns a single, well-scoped responsibility, allowing business concerns, product intent, infrastructure orchestration, and execution to evolve independently. This separation enables the platform to support many agents, users, and execution models without coupling commercial logic to operational reality or runtime behavior to policy decisions.

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

### Execution (Ephemeral Jobs)

> “What actually executes the agent.”

The Execution layer instantiates an isolated, ephemeral environment for each individual agent invocation. It is responsible for loading the agent code (e.g., via Git clone), resolving its dependencies, executing the logic, and producing outputs. Unlike a standing server, these environments exist only for the duration of the request, ensuring complete isolation and efficient resource usage.

The environment is intentionally narrow in scope. It does not handle authentication, billing, marketplace logic, or scheduling decisions. Instead, it focuses on safe and deterministic execution: enforcing tool access, applying secrets policies, honoring resource constraints, and exposing health and execution status back to the Infra Control Plane. This makes the execution layer interchangeable and extensible, allowing different agent implementations or execution strategies (e.g., Firecracker microVMs, Wasm) without altering the rest of the platform.

By isolating agent execution from control-plane concerns, the platform can safely run untrusted or third-party agents at scale. Multiple users may invoke the same agent concurrently, with each invocation running in its own fresh context. This is the point of truth for execution behavior, while remaining fully governed by upstream control planes.
