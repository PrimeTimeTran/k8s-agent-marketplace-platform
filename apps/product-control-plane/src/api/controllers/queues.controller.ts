import { Request, Response } from 'express'
import { getErrorMessage } from '@hc/utils'
import { queueJob } from '../../infra/infraQueueClient.js'

export async function queueJobController(req: Request, res: Response) {
  try {
    console.log('Product CP (job):', JSON.stringify(req.body, null, 2))

    const result = await queueJob(req.body)

    res.json({
      executionId: result.executionId,
      status: 'scheduled',
      input: req.body,
    })
  } catch (err) {
    const msg = getErrorMessage(err)
    console.error('Infra CP error:', msg)

    res.status(500).json({
      error: 'Infra control plane failed',
      details: msg,
    })
  }
}
