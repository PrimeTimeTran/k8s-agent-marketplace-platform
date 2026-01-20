import fetch from 'node-fetch'

export async function executeAgent(payload) {
  const res = await fetch('http://agent-runtime:8000/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const text = await res.text()

  if (!res.ok) {
    throw new Error(`Agent runtime failed: ${text}`)
  }

  return JSON.parse(text)
}
