import { getJobPod, getPodLogs } from '../k8s/pods.js'
import { getExecution, updateExecution } from './store.js'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export async function watchJobLogs(executionId, jobName) {
  let podName = null
  let lastLogs = ''

  while (!podName) {
    const pod = await getJobPod('agent-platform', jobName)
    if (pod?.metadata?.name) {
      podName = pod.metadata.name
      updateExecution(executionId, { status: 'running' })
      break
    }
    await sleep(1000)
  }

  while (true) {
    const pod = await getJobPod('agent-platform', jobName)
    if (!pod) {
      await sleep(1000)
      continue
    }

    const phase = pod.status?.phase

    const logs = await getPodLogs('agent-platform', podName)

    if (logs && logs.length > lastLogs.length) {
      const newLogs = logs.slice(lastLogs.length)
      lastLogs = logs

      const exec = getExecution(executionId)
      updateExecution(executionId, {
        logs: (exec.logs || '') + newLogs,
      })
    }

    if (phase === 'Succeeded') {
      updateExecution(executionId, { status: 'completed' })
      break
    }

    if (phase === 'Failed') {
      updateExecution(executionId, { status: 'failed' })
      break
    }

    await sleep(1000)
  }
  console.log(`✅ Execution ${executionId} updated from watcher`)
}
