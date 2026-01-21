import { k8sGet, k8sPost } from './k8s.js'

export async function getJob(namespace, name) {
  return k8sGet(`/apis/batch/v1/namespaces/${namespace}/jobs/${name}`)
}

export async function queueJob({ executionId, agent, prompt }) {
  const jobName = `infra-${executionId}`

  const job = {
    apiVersion: 'batch/v1',
    kind: 'Job',
    metadata: {
      name: jobName,
      namespace: 'agent-platform',
      labels: {
        executionId,
      },
    },
    spec: {
      backoffLimit: 0,
      ttlSecondsAfterFinished: 3600,
      template: {
        metadata: {
          labels: {
            executionId,
            'job-name': jobName,
          },
        },
        spec: {
          restartPolicy: 'Never',
          containers: [
            {
              name: 'agent',
              image: 'agent-job:dev',
              imagePullPolicy: 'IfNotPresent',
              env: [
                { name: 'EXECUTION_MODE', value: 'agent' },
                { name: 'EXECUTION_ID', value: executionId },
                { name: 'AGENT', value: agent },
                { name: 'PROMPT', value: prompt },
                {
                  name: 'CONTROL_PLANE_URL',
                  value: 'http://infra-control-plane:3000',
                },
              ],
            },
          ],
        },
      },
    },
  }

  await k8sPost('/apis/batch/v1/namespaces/agent-platform/jobs', job)

  return { jobName }
}
