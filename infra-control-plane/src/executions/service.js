import { executeAgent } from '../clients/agentRuntimeClient.js'
import { createJob } from '../k8s/jobs.js'

export async function scheduleRun(payload) {
  return executeAgent(payload)
}

export async function scheduleJob(payload) {
  const jobName = await createJob(payload)

  return {
    executionId: jobName,
    mode: 'job',
    status: 'scheduled',
  }
}
