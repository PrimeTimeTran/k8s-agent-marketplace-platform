// Enums (Shared Values)
export const AgentVisibility = {
  PRIVATE: 'private',
  ORG: 'org',
  PUBLIC: 'public',
} as const

export type AgentVisibility =
  (typeof AgentVisibility)[keyof typeof AgentVisibility]

export const AgentStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  DISABLED: 'disabled',
  DEPRECATED: 'deprecated',
} as const

export type AgentStatus = (typeof AgentStatus)[keyof typeof AgentStatus]

export const Runtime = {
  PYTHON: 'python',
  NODE: 'node',
  CUSTOM: 'custom',
} as const

export type Runtime = (typeof Runtime)[keyof typeof Runtime]

export const ExecutionStatus = {
  SCHEDULED: 'scheduled',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const

export type ExecutionStatus =
  (typeof ExecutionStatus)[keyof typeof ExecutionStatus]

// Interfaces (Shared Shapes)

export interface Agent {
  id: string
  name: string
  description: string
  owner_user_id: string
  owner_org_id?: string | null
  visibility: AgentVisibility
  status: AgentStatus
  created_at: string
  updated_at: string
}

export interface AgentVersion {
  id: string
  agent_id: string
  version: string
  image_ref: string
  entrypoint: string
  runtime: Runtime
  is_active: boolean
  repo_url?: string | null
  commit_hash?: string | null
  created_at: string
}

export interface Execution {
  id: string
  status: ExecutionStatus
  agent_id: string
  agent_version_id: string
  logs?: string
  payload?: Record<string, any>
  created_at: string
  updated_at: string
}

// API DTOs (Data Transfer Objects)

export interface CreateAgentDTO {
  name: string
  description?: string
  visibility?: AgentVisibility
}

export interface CreateExecutionDTO {
  agent_id: string
  prompt: string
  env?: Record<string, string>
}
