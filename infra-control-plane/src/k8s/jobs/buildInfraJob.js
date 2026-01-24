export function buildInfraJob({ executionId, image }) {
  const jobName = `infra-${executionId}`

  return {
    apiVersion: 'batch/v1',
    kind: 'Job',
    metadata: {
      name: jobName,
      namespace: 'agent-platform',
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
