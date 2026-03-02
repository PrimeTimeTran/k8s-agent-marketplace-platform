interface Execution {
  id: string
  payload: any
  logs: string
  status: string
  createdAt: number
  updatedAt?: number
  jobConfig?: any
}

const executions = new Map<string, Execution>()

export function createExecution({
  id,
  payload,
  logs = '',
  status = 'scheduled',
  createdAt = Date.now(),
  updatedAt,
  jobConfig,
}: Execution) {
  executions.set(id, {
    id,
    logs,
    status,
    payload,
    createdAt,
    updatedAt,
    jobConfig,
  })
}

export function updateExecution(id: string, patch: Partial<Execution>) {
  const ex = executions.get(id)

  if (!ex) return
  executions.set(id, { ...ex, ...patch })
}

export function getExecution(id: string) {
  return executions.get(id)
}

export function getAllExecutions() {
  return Array.from(executions.values())
}
