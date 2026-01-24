import express from 'express'
import { queueJob } from '../../k8s/jobs.js'
import { scheduleRun } from '../../domain/executions/service.js'
import { watchJobLogs } from '../../domain/executions/watcher.js'
import { createExecution } from '../../domain/executions/store.js'

const router = express.Router()

router.post('/queue-agent', async (req, res) => {
  try {
    const result = await scheduleRun(req.body)
    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

router.post('/queue-job', async (req, res) => {
  try {
    console.log('Infra CP (queue-job) body:', JSON.stringify(req.body, null, 2))
    const payload = req.body
    const executionId = `job-exec-${Date.now()}`

    createExecution({
      id: executionId,
      logs: '',
      payload,
      status: 'scheduled',
      createdAt: Date.now(),
    })

    const result = await queueJob({
      ...payload,
      executionId,
    })

    watchJobLogs(executionId, result.jobName).catch((err) => {
      console.error(`Watcher failed for ${executionId}`, err)
    })

    res.status(201).json({
      executionId,
      job: result,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

export default router
