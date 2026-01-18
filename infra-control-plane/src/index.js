import fs from 'fs'
import https from 'https'
import express from 'express'
import fetch from 'node-fetch'

const app = express()
app.use(express.json())

app.post('/schedule-run', async (req, res) => {
  try {
    console.log('Infra CP:', req.body)

    const response = await fetch('http://agent-runtime:8000/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    })

    const text = await response.text()

    if (!response.ok) {
      console.error('Agent runtime error:', text)
      return res.status(500).json({
        error: 'Agent runtime failed',
        details: text,
      })
    }

    res.json(JSON.parse(text))
  } catch (err) {
    console.error('Infra CP crash:', err)
    res.status(500).json({ error: 'Infra control plane crashed' })
  }
})

const K8S_API = 'https://kubernetes.default.svc'
const token = fs.readFileSync(
  '/var/run/secrets/kubernetes.io/serviceaccount/token',
  'utf8',
)
const ca = fs.readFileSync(
  '/var/run/secrets/kubernetes.io/serviceaccount/ca.crt',
)

const httpsAgent = new https.Agent({ ca })

app.post('/schedule-job', async (req, res) => {
  try {
    const jobName = `agent-job-${Date.now()}`

    const job = {
      apiVersion: 'batch/v1',
      kind: 'Job',
      metadata: {
        name: jobName,
        namespace: 'agent-platform',
      },
      spec: {
        backoffLimit: 0,
        ttlSecondsAfterFinished: 60,
        template: {
          spec: {
            restartPolicy: 'Never',
            containers: [
              {
                name: 'agent',
                image: 'test-job:latest',
                imagePullPolicy: 'IfNotPresent',
                env: [
                  {
                    name: 'PAYLOAD',
                    value: JSON.stringify(req.body),
                  },
                ],
              },
            ],
          },
        },
      },
    }

    const response = await fetch(
      `${K8S_API}/apis/batch/v1/namespaces/agent-platform/jobs`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(job),
        agent: httpsAgent,
      },
    )

    if (!response.ok) {
      const text = await response.text()
      console.error(text)
      return res.status(500).json({ error: text })
    }

    res.json({
      executionId: jobName,
      mode: 'job',
      status: 'scheduled',
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to schedule job' })
  }
})

app.listen(3000)
