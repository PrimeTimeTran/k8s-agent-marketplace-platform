const INFRA_BASE = 'http://infra-control-plane:3000'

export async function fetchExecutions() {
  const res = await fetch(`${INFRA_BASE}/executions`)
  if (!res.ok) throw new Error('Failed to fetch executions')
  return res.json()
}

export async function fetchExecution(id) {
  const res = await fetch(`${INFRA_BASE}/executions/${id}`)
  if (!res.ok) throw new Error('Execution not found')
  return res.json()
}
