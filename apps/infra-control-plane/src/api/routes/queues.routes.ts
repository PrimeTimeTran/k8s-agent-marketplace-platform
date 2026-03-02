import express, { Request, Response } from 'express'
import { getErrorMessage } from '@hc/utils'
import { queueJob } from '../../k8s/jobs/index.js'
import { watchJobLogs } from '../../domain/executions/watcher.js'
import {
  createExecution,
  updateExecution,
} from '../../domain/executions/store.js'

const router = express.Router()

router.post('/queue-job', async (req: Request, res: Response) => {
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

    // Save the actual job configuration used
    updateExecution(executionId, {
      jobConfig: result.jobConfig,
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
    res.status(500).json({ error: getErrorMessage(err) })
  }
})

export default router
