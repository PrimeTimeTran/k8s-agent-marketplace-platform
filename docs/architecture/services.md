# Service Architecture Cheat Sheet

A quick reference guide to keep the codebase clean and the separation of concerns clear.

## 🛍️ Marketplace (`/marketplace`)

**Role:** The Frontend & User Experience Layer.  
**Tech:** Next.js (React), Server Actions, Tailwind.

Think of this as the "Storefront". It talks to the **Product Control Plane** via APIs. It should **NOT** talk to the database directly (except for NextAuth tables if co-located).

| Responsibility     | Examples                                                |
| :----------------- | :------------------------------------------------------ |
| **Authentication** | Sign up, Login, NextAuth, OAuth providers.              |
| **User Profile**   | Settings, Avatar, Billing UI, API Key generation UI.    |
| **Catalog UI**     | Searching agents, filtering, "Agent Details" page.      |
| **Dashboard**      | Showing execution history, logs console, charts.        |
| **Forms**          | "Submit new Agent", "Run Agent" forms.                  |
| **Notifications**  | Emails, In-app toasts.                                  |
| **Proxying**       | Forwarding user requests to the Control Plane securely. |

**❌ Anti-Patterns (Don't do this here):**

- Directly querying `AgentExecution` tables.
- Running docker containers.
- Deciding if a user has enough credits (Ask Product CP instead).

---

## 🧠 Product Control Plane (`/product-control-plane`)

**Role:** The Business Logic & Data Owner.  
**Tech:** Node.js (Express), Postgres (Sequelize).

Think of this as the "Brain". It owns the Truth.

| Responsibility       | Examples                                                        |
| :------------------- | :-------------------------------------------------------------- |
| **Data Models**      | `Agent`, `Version`, `Execution`, `Entitlement`, `Usage`.        |
| **Business Rules**   | "Can User A run Agent B?", "Is this agent verified?"            |
| **Billing & Quotas** | Decrementing credits, checking rate limits.                     |
| **CRUD API**         | `POST /agents`, `GET /executions`, `PATCH /agents/:id/verify`.  |
| **Orchestration**    | Deciding _to_ run a job, then telling Infra CP _how_ to run it. |
| **Secrets Mgmt**     | Storing (encrypted) references to user secrets.                 |

**❌ Anti-Patterns (Don't do this here):**

- Running `kubectl apply`.
- Talking directly to Kubernetes.
- Hosting the UI HTML.

---

## 🏗️ Infra Control Plane (`/infra-control-plane`)

**Role:** The Muscle & Infrastructure Abstraction.  
**Tech:** Node.js (Express), Kubernetes Client.

Think of this as the "Mechanic". It doesn't care _who_ the user is, only _what_ needs to run.

| Responsibility     | Examples                                            |
| :----------------- | :-------------------------------------------------- |
| **Kubernetes Ops** | Creating Jobs, Pods, ConfigMaps, Secrets.           |
| **Log Streaming**  | Watching K8s pod logs and streaming them back.      |
| **Resource Mgmt**  | Enforcing CPU/Memory limits at the container level. |
| **Image Building** | Triggering Kaniko/Docker builds for new agents.     |
| **Cleanup**        | Deleting old jobs, garbage collecting pods.         |

**❌ Anti-Patterns (Don't do this here):**

- Checking if a user is on the "Pro Plan".
- Storing "Agent Names" or "Descriptions".
- Authentication (It trusts the Product CP via mTLS/Internal Network).

---

## ⚡ Execution / Runner (`/execution`)

**Role:** The Sandboxed Runtime.  
**Tech:** Python/Node.js Base Images.

Think of this as the "Engine". It runs the untrusted code.

| Responsibility   | Examples                                          |
| :--------------- | :------------------------------------------------ |
| **Agent Code**   | Running the user's `run.py` or `index.js`.        |
| **MCP Protocol** | Hosting the Model Context Protocol server.        |
| **Sandboxing**   | Restricted network access, read-only filesystems. |
| **Reporting**    | Sending final results/artifacts back to storage.  |

---

## 🔄 The Flow of a "Run"

1.  **User** clicks "Run" on **Marketplace**.
2.  **Marketplace** calls `POST /executions` on **Product CP**.
3.  **Product CP**:
    - Authenticates user.
    - Checks `AgentEntitlement` (Quota).
    - Fetches `AgentConfig` (CPU limits, Docker image).
    - Creates `ExecutionRequest` record (Status: `pending`).
    - Calls `POST /queue-job` on **Infra CP**.
4.  **Infra CP**:
    - Generates K8s Job YAML.
    - Applies to Cluster.
    - Returns `job_id`.
5.  **Product CP** updates record to `queued`.
6.  **Infra CP** watches Pod -> updates Product CP with `running` -> `completed`.
