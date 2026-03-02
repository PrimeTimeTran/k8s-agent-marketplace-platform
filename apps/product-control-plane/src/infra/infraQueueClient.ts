import { INFRA_BASE } from '../config/constants.js'

async function post(path: string, body: any) {
  const res = await fetch(`${INFRA_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const text = await res.text()

  if (!res.ok) {
    const err = new Error(text || 'Infra control plane failed') as Error & {
      status?: number
    }
    err.status = res.status
    throw err
  }

  return JSON.parse(text)
}

export function queueJob(payload: any) {
  return post('/queue-job', payload)
}
