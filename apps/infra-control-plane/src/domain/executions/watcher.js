import { getJobPod, getPodLogs } from '../../k8s/pods.js'
import { getExecution, updateExecution } from './store.js'
import { K8S_NAMESPACE } from '../../constants.js'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export async function watchJobLogs(executionId, jobName) {
  let podName = null
  let lastLogs = ''

  while (!podName) {
    console.log(`[Watcher] Looking for pod for job ${jobName}...`)
    const pod = await getJobPod(K8S_NAMESPACE, jobName)
    if (pod?.metadata?.name) {
      console.log(`[Watcher] Found pod ${pod.metadata.name}`)
      podName = pod.metadata.name
      updateExecution(executionId, { status: 'running' })
      break
    }
    await sleep(1000)
  }

  while (true) {
    const pod = await getJobPod(K8S_NAMESPACE, jobName)
    if (!pod) {
      console.log(`[Watcher] Pod lost for ${jobName}`)
      await sleep(1000)
      continue
    }

    const phase = pod.status?.phase
    console.log(`[Watcher] Pod phase: ${phase}`)

    const logs = await getPodLogs(K8S_NAMESPACE, podName)
    console.log(`[Watcher] Logs length: ${logs?.length || 0}`)

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
