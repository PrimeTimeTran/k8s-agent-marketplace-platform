import fs from 'fs'
import https from 'https'

export const K8S_API = 'https://kubernetes.default.svc'

const token = fs.readFileSync(
  '/var/run/secrets/kubernetes.io/serviceaccount/token',
  'utf8',
)

const ca = fs.readFileSync(
  '/var/run/secrets/kubernetes.io/serviceaccount/ca.crt',
)

export const httpsAgent = new https.Agent({ ca })

export const authHeaders = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
}
