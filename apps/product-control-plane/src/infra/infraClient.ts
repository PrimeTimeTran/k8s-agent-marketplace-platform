import { INFRA_BASE } from '../config/constants.js'

export async function fetchExecutions() {
  const res = await fetch(`${INFRA_BASE}/executions`)
  if (!res.ok) throw new Error('Failed to fetch executions')
  return res.json()
}

export async function fetchExecution(id: string) {
  const res = await fetch(`${INFRA_BASE}/executions/${id}`)
  if (!res.ok) throw new Error('Execution not found')
  return res.json()
}
