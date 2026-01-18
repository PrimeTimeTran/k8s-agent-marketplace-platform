# Models

Models which will encapsulate our business logic.

```ts
Agent {
  id: UUID
  name: string
  description: string

  owner_user_id: UUID
  owner_org_id: UUID | null

  visibility: enum('private', 'org', 'public')

  status: enum(
    'draft',
    'active',
    'disabled',
    'deprecated'
  )

  created_at: timestamp
  updated_at: timestamp
}


AgentVersion {
  id: UUID
  agent_id: UUID

  version: string            // "v1.0.0", "2026-01-15"
  image_ref: string           // container image / artifact
  entrypoint: string

  runtime: enum('python', 'node', 'custom')

  is_active: boolean

  created_at: timestamp

  // MCP
  reasoning_style: enum('reactive', 'planner', 'tool-using')
  memory_type: enum('none', 'ephemeral', 'persistent')
  planning_depth: number | null
}


AgentConfig {
  agent_version_id: UUID

  cpu_limit: number
  memory_limit_mb: number
  timeout_seconds: number

  max_concurrent_runs: number

  allowed_tools: string[]     // logical tools, not secrets
  allowed_network: enum('none', 'internal', 'external')
}

AgentAccessPolicy {
  id: UUID
  agent_id: UUID

  subject_type: enum('user', 'org')
  subject_id: UUID

  can_execute: boolean
  can_view: boolean

  created_at: timestamp
}

ExecutionRequest {
  id: UUID

  agent_id: UUID
  agent_version_id: UUID

  requester_user_id: UUID

  status: enum(
    'pending',
    'accepted',
    'rejected',
    'running',
    'completed',
    'failed'
  )

  reason: string | null       // rejection / failure reason

  created_at: timestamp
  updated_at: timestamp
}

AgentExecutionLimits {
  agent_id: UUID

  max_concurrent_runs: number
  max_cpu_seconds_per_run: number
  max_memory_mb: number
  max_timeout_seconds: number

  enforced: boolean
}

AgentEntitlement {
  id: UUID

  agent_id: UUID
  user_id: UUID

  plan: enum('free', 'pro', 'enterprise')

  max_runs_per_day: number
  max_cpu_seconds_per_day: number
  max_tokens_per_day: number | null

  starts_at: timestamp
  ends_at: timestamp | null

  created_at: timestamp
}

AgentProvidedCredential {
  id
  agent_id
  user_id

  credential_type
  secret_ref

  created_at
  revoked_at
}

AgentRequiredCredential {
  agent_id
  credential_type   // 'google_maps_api_key'
  required: boolean
}

// ① Sustained execution failures (most common)
//  - Multiple failures
//  - Over a window
//  - Same root cause
//  - 5 failures in 10 minutes
//  - Or 3 consecutive failures
// ② Hard execution blockers (immediate)
//  - Image pull failure
//  - Invalid entrypoint
//  - Missing required secret
//  - Permission denied (agent-level, not user-level)
// ③ Explicit recovery signal
//  - A successful execution after degradation
//  - A redeploy / new version
//  - Manual owner action (“Mark healthy”)

AgentHealth {
  id
  agent_id
  agent_version_id | null

  window_start
  window_end

  execution_count
  success_count
  failure_count
  timeout_count

  avg_latency_ms
  p95_latency_ms

  error_rate
  health_status  // HEALTHY | DEGRADED | UNHEALTHY

  last_error_code | null
  last_error_at | null

  created_at
}


AgentUsageDaily {
  agent_id: UUID
  owner_user_id: UUID

  date: date

  executions: number
  cpu_seconds: number
  tokens_used: number | null

  created_at: timestamp
}

```

The contract is emergent, not stored.

```
Agent = who
AgentVersion = what
AgentConfig = limits
AccessPolicy = who may
Contract = the resolved agreement at run time
```
