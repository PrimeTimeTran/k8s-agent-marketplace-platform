import { K8S_NAMESPACE } from '../../constants.js'

export function buildInfraJob({
  executionId,
  image,
}: {
  executionId: string
  image: string
}) {
  const jobName = `infra-${executionId}`

  return {
    apiVersion: 'batch/v1',
    kind: 'Job',
    metadata: {
      name: jobName,
      namespace: K8S_NAMESPACE,
      labels: { executionId },
    },
    spec: {
      backoffLimit: 0,
      template: {
        spec: {
          restartPolicy: 'Never',
          containers: [
            {
              name: 'infra-smoke',
              image: image || 'busybox',
              command: ['sh', '-c', 'echo infra ok'],
            },
          ],
        },
      },
    },
  }
}
