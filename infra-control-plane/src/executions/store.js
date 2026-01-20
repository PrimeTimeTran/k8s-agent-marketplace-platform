const executions = new Map()

export function createExecution({
  id,
  payload,
  logs = '',
  status = 'scheduled',
  createdAt = Date.now(),
}) {
  executions.set(id, {
    id,
    logs,
    status,
    payload,
    createdAt,
  })
}

export function updateExecution(id, patch) {
  const ex = executions.get(id)

  if (!ex) return
  executions.set(id, { ...ex, ...patch })
}

export function getExecution(id) {
  return executions.get(id)
}

export function getAllExecutions() {
  return Array.from(executions.values())
}
