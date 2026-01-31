import { k8sGet, k8sPost } from '../../../infra/k8s/index.js'

import { buildAgentJob } from './buildAgentJob.js'
import { buildInfraJob } from './buildInfraJob.js'
import { K8S_NAMESPACE } from '../../constants.js'

export async function getJob(namespace, name) {
  return k8sGet(`/apis/batch/v1/namespaces/${namespace}/jobs/${name}`)
}

export async function queueJob(input, { post = k8sPost } = {}) {
  if (input.type === 'infra') {
    const job = buildInfraJob(input)
    await post(`/apis/batch/v1/namespaces/${K8S_NAMESPACE}/jobs`, job)

    return {
      jobName: job.metadata.name,
      jobConfig: {
        image: job.spec.template.spec.containers[0].image,
        command: job.spec.template.spec.containers[0].command,
        env: {},
      },
    }
  }

  const { job, jobName, jobImage, env } = buildAgentJob(input)

  await post(`/apis/batch/v1/namespaces/${K8S_NAMESPACE}/jobs`, job)

  return {
    jobName,
    jobConfig: {
      image: jobImage,
      command: job.spec.template.spec.containers[0].command,
      env: env.reduce(
        (acc, { name, value }) => ({ ...acc, [name]: value }),
        {},
      ),
    },
  }
}

export async function queueBuildImageJob({
  executionId,
  repoUrl,
  ref = 'main',
}) {
  const imageTag = `agent-job:${executionId}`

  const job = {
    apiVersion: 'batch/v1',
    kind: 'Job',
    metadata: {
      name: `build-${executionId}`,
      namespace: K8S_NAMESPACE,
    },
    spec: {
      backoffLimit: 0,
      template: {
        spec: {
          restartPolicy: 'Never',
          containers: [
            {
              name: 'builder',
              image: 'gcr.io/kaniko-project/executor:latest',
              args: [
                `--dockerfile=/workspace/Dockerfile`,
                `--context=git://${repoUrl}#${ref}`,
                `--destination=${imageTag}`,
              ],
              env: [
                // registry auth if needed
              ],
            },
          ],
        },
      },
    },
  }

  await k8sPost(`/apis/batch/v1/namespaces/${K8S_NAMESPACE}/jobs`, job)

  return { image: imageTag }
}
