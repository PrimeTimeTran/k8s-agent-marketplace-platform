import fetch from 'node-fetch'
import { K8S_API, httpsAgent, authHeaders } from './client.js'

export async function k8sPost(path, body) {
  const res = await fetch(`${K8S_API}${path}`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(body),
    agent: httpsAgent,
  })

  if (!res.ok) {
    throw new Error(await res.text())
  }

  return res.json()
}
