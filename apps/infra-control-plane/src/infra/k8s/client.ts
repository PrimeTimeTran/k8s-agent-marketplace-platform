import fs from 'fs'
import { Agent } from 'undici'

export const K8S_API_BASE = 'https://kubernetes.default.svc'

let token = ''
let ca: Buffer | null | undefined = null

try {
  token = fs.readFileSync(
    '/var/run/secrets/kubernetes.io/serviceaccount/token',
    'utf8',
  )
  ca = fs.readFileSync('/var/run/secrets/kubernetes.io/serviceaccount/ca.crt')
} catch (e) {
  // Ignore error if running locally/testing
}

export const dispatcher = new Agent({
  connect: {
    ca: ca as any,
  },
})

export const authHeaders = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
}

export async function k8sFetch(path: string, options: any = {}) {
  const fetchOptions: any = {
    dispatcher,
    headers: {
      ...authHeaders,
      ...(options.headers || {}),
    },
    ...options,
  }

  const res = await fetch(`${K8S_API_BASE}${path}`, fetchOptions)

  if (!res.ok) {
    throw new Error(await res.text())
  }

  return res
}
