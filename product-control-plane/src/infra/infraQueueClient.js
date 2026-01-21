import { INFRA_BASE } from '../config/constants.js'

async function post(path, body) {
  const res = await fetch(`${INFRA_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const text = await res.text()

  if (!res.ok) {
    const err = new Error(text || 'Infra control plane failed')
    err.status = res.status
    throw err
  }

  return JSON.parse(text)
}

export function queueAgent(payload) {
  return post('/queue-agent', payload)
}

export function queueJob(payload) {
  return post('/queue-job', payload)
}
