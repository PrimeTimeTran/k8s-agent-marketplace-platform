# Overview

Agents are defined using a PEAS-style contract stored in the control plane,
while MCP governs runtime reasoning and behavior within sand-boxed execution.

## Demo

1. Spaces Demo
   1. User models
   2. User spaces
   3. "Generative AI"

- Image Detection: ""
  https://huggingface.co/spaces/Qwen/Qwen-Image-2512
- Object Classification
  https://huggingface.co/spaces/antokun/Cat_and_dog_breed_real_time_detection

## PEAs and MCP

PEAS belongs in your Product Control Plane
MCP belongs inside the Agent Runtime + Agent Code

PEAS defines what is allowed
MCP defines how decisions are made within those bounds

### PEAS

- Think of PEAS as structured metadata for an agent.
- Comparability between agents
- Safer execution (know what it can touch)
- Pricing models (performance-based)
- Marketplace filtering (“agents that can write but not email”)

You can translate PEAS into:

- Allowed secrets
- Allowed network access
- Allowed tools
- Resource limits

### MCP

```md
Model: GPT-4.1
Context: CRM records + last 5 emails
Policy:

- Never email twice in 24h
- Escalate to human if sentiment < 0.2
```

- User’s agent repo
- Or structured config the runtime loads

Your platform:

- Loads MCP config
- Enforces constraints
- Executes safely

## Agent Contracts

The Agent Contract defines what an agent is allowed to do (PEAS),
how it thinks (MCP), and how the platform safely executes it.

The Agent Contract is a versioned, runtime-resolved agreement composed from
Agent identity, versioned cognition, execution constraints, and access policy — not a single model.

```yml
agent:
  id: sales-outreach-v1
  name: Sales Outreach Agent
  version: 1.0.0
  owner:
    user_id: user_123
    org_id: org_456
  source:
    type: github
    repo: https://github.com/user/sales-agent
    ref: main
```

## PEAS Specification(Agent Intent)

```yml
peas:
  performance:
    metrics:
      - reply_rate
      - meeting_booked
      - cost_per_lead

  environment:
    allowed_services:
      - gmail_api
      - crm_db
      - calendar_api

  actuators:
    actions:
      - send_email
      - create_crm_contact
      - schedule_meeting

  sensors:
    inputs:
      - incoming_email
      - crm_updates
      - calendar_events
```

### MCP Configuration

```yml
mcp:
  model:
    provider: openai
    name: gpt-4.1
    temperature: 0.3

  context:
    sources:
      - crm_last_30_days
      - email_thread_history
      - user_profile
    max_tokens: 8000

  policy:
    rules:
      - id: no_spam
        description: 'Do not send more than one email per lead per 24 hours'

      - id: sentiment_guard
        description: 'Escalate to human if sentiment < 0.2'

      - id: compliance
        description: 'Never generate medical or legal advice'
```

### Runtime Requirements

```yml
runtime:
  entrypoint: run.py
  language: python
  runtime_version: '3.11'

  resources:
    cpu: '1'
    memory: '2Gi'
    gpu: false

  execution:
    mode: job # job | service | interactive
    timeout_seconds: 300
    retries: 1
```

### Security & Isolation

```yml
security:
  secrets:
    required:
      - GMAIL_API_KEY
      - CRM_DB_URL

  network:
    egress:
      allow:
        - gmail.googleapis.com
        - crm.internal
      deny_all_other: true

  filesystem:
    writable: /tmp
    read_only_root: true
```

### Data Access & State

```yml
data:
  persistence:
    type: scoped
    scope: per_agent

  storage:
    read:
      - crm_db
    write:
      - agent_state_db

  retention_days: 30
```

### Observability

```yml
observability:
  logs:
    level: info

  metrics:
    emit:
      - executions_count
      - success_rate
      - avg_latency
      - token_usage

  events:
    notify_on:
      - policy_violation
      - execution_failure
```

### Quotas & Limits

```yml
quotas:
  executions_per_day: 1000
  max_concurrent_runs: 10
  monthly_token_budget: 5_000_000
```

### UI & Exposure

```yml
ui:
  type: none # none | hosted | embedded
  port: 7860
  public: false
```

### Lifecycle

```yml
lifecycle:
  states:
    - draft
    - active
    - paused
    - disabled
    - deprecated

  transitions:
    draft: [active]
    active: [paused, disabled]
    paused: [active, disabled]
```

### How the platform uses this contract

| Section       | Used by                |
| ------------- | ---------------------- |
| Identity      | Marketplace            |
| PEAS          | Marketplace + Security |
| MCP           | Runtime                |
| Runtime       | Kubernetes             |
| Security      | Infra Control Plane    |
| Data          | Data Plane             |
| Observability | Monitoring             |
| Quotas        | Billing                |
| Lifecycle     | Governance             |

## Review

Why this is powerful (investor-level)

- Enables a real marketplace
- Makes agents comparable
- Makes execution safe
- Decouples infra from intelligence
- Scales across many agent types
