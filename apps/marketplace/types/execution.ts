import { ExecutionStatus } from '@hc/types'
export { ExecutionStatus }

export type Execution = {
  id: string
  status: ExecutionStatus
  logs: string
  jobConfig?: Record<string, unknown>
  createdAt: number
  payload: {
    agent: string
    prompt: string
    value: string
  }
}

export type ExecutionInput = {
  agent: string
  repoUrl: string
  pythonVersion: string
  env: Record<string, string | boolean | number>
  args: string[]
}

export type ExecutionResponse = {
  executionId: string
  status: ExecutionStatus
  input: ExecutionInput
}
