import express from 'express'
import { watchJobLogs } from '../executions/watcher.js'
import { createExecution } from '../executions/store.js'
import { scheduleRun, scheduleJob } from '../executions/service.js'

const router = express.Router()

router.post('/schedule-run', async (req, res) => {
  try {
    const result = await scheduleRun(req.body)
    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

router.post('/schedule-job', async (req, res) => {
  try {
    const payload = req.body
    const executionId = `job-exec-${Date.now()}`

    createExecution({
      id: executionId,
      logs: '',
      payload,
      status: 'scheduled',
      createdAt: Date.now(),
    })

    const result = await scheduleJob({
      ...payload,
      executionId,
    })

    watchJobLogs(executionId, executionId).catch((err) => {
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
