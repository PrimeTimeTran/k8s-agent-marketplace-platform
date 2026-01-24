import { k8sGet, k8sPost } from './k8s.js'

export async function getJob(namespace, name) {
  return k8sGet(`/apis/batch/v1/namespaces/${namespace}/jobs/${name}`)
}

export async function queueJob(
  {
    executionId,
    agent,
    prompt,
    image,
    repoUrl,
    env: customEnv = {},
    args = [],
  },
  { post = k8sPost } = {},
) {
  const jobName = `infra-${executionId}`
  const jobImage = image || (repoUrl ? 'agent-base:dev' : 'agent-job:dev')

  const env = [
    { name: 'EXECUTION_MODE', value: 'agent' },
    { name: 'EXECUTION_ID', value: executionId },
    { name: 'AGENT', value: agent },
    { name: 'PROMPT', value: prompt || '' },
    {
      name: 'CONTROL_PLANE_URL',
      value: 'http://infra-control-plane:3000',
    },
    // Ensure the runner can find the common library in /platform
    { name: 'PYTHONPATH', value: '/platform:/app' },
  ]

  // Add custom environment variables
  for (const [key, value] of Object.entries(customEnv)) {
    env.push({ name: key, value: String(value) })
  }

  if (repoUrl) {
    env.push({ name: 'GIT_REPO_URL', value: repoUrl })
  }

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
          // 1. Create a shared volume to hold platform tools
          volumes: [
            {
              name: 'platform-tools',
              emptyDir: {},
            },
          ],
          initContainers: [
            {
              // 2. Use the platform base image to copy tools into the shared volume
              name: 'install-platform',
              image: 'agent-base:dev',
              imagePullPolicy: 'IfNotPresent',
              command: [
                'sh',
                '-c',
                'cp -r /app/common /platform/ && cp /app/runner.py /platform/',
              ],
              volumeMounts: [
                {
                  name: 'platform-tools',
                  mountPath: '/platform',
                },
              ],
            },
          ],
          containers: [
            {
              name: 'agent',
              image: jobImage,
              imagePullPolicy: 'IfNotPresent',
              // 3. Override the command to run the platform runner instead of the default entrypoint
              command: ['python', '/platform/runner.py', 'main.py', ...args],
              volumeMounts: [
                {
                  name: 'platform-tools',
                  mountPath: '/platform',
                },
              ],
              env,
            },
          ],
        },
      },
    },
  }

  await post('/apis/batch/v1/namespaces/agent-platform/jobs', job)

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
      namespace: 'agent-platform',
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

  await k8sPost('/apis/batch/v1/namespaces/agent-platform/jobs', job)

  return { image: imageTag }
}
