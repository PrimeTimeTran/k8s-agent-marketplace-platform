import { k8sPost } from './k8s.js'

export async function createJob(payload) {
  const jobName = `infra-agent-job-${Date.now()}`

  const job = {
    apiVersion: 'batch/v1',
    kind: 'Job',
    metadata: {
      name: jobName,
      namespace: 'agent-platform',
    },
    spec: {
      backoffLimit: 0,
      ttlSecondsAfterFinished: 3600,
      template: {
        spec: {
          restartPolicy: 'Never',
          containers: [
            {
              name: 'agent',
              image: 'agent-job:latest',
              imagePullPolicy: 'Never',
              env: [
                {
                  name: 'PAYLOAD',
                  value: JSON.stringify(payload),
                },
              ],
            },
          ],
        },
      },
    },
  }

  await k8sPost('/apis/batch/v1/namespaces/agent-platform/jobs', job)

  return jobName
}
