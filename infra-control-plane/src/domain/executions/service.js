import { executeAgent } from '../../clients/agentRuntimeClient.js'

export async function scheduleRun(payload) {
  return executeAgent(payload)
}
