import { queueAgent, queueJob } from '../../infra/infraQueueClient.js'

export async function queueAgentController(req, res) {
  try {
    console.log('Product CP:', req.body)

    const result = await queueAgent(req.body)

    res.json({
      result,
      input: req.body,
      executionId: 'exec_123',
    })
  } catch (err) {
    console.error('Infra CP error:', err.message)

    res.status(500).json({
      error: 'Infra control plane failed',
      details: err.message,
    })
  }
}

export async function queueJobController(req, res) {
  try {
    console.log('Product CP (job):', JSON.stringify(req.body, null, 2))

    const result = await queueJob(req.body)

    res.json({
      executionId: result.executionId,
      status: 'scheduled',
      input: req.body,
    })
  } catch (err) {
    console.error('Infra CP error:', err.message)

    res.status(500).json({
      error: 'Infra control plane failed',
      details: err.message,
    })
  }
}
