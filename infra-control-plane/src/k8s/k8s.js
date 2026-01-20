import { k8sFetch } from './client.js'

export async function k8sPost(path, body) {
  const res = await k8sFetch(path, {
    method: 'POST',
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw new Error(await res.text())
  }

  return res.json()
}

export async function k8sGet(path) {
  const res = await k8sFetch(path, { method: 'GET' })

  if (!res.ok) {
    throw new Error(await res.text())
  }

  return res.json()
}

export async function k8sDelete(path) {
  const res = await k8sFetch(path, { method: 'DELETE' })

  if (!res.ok) {
    throw new Error(await res.text())
  }

  return res.json()
}
