import { k8sGet, k8sPost } from './k8s.js'

const DEFAULT_PYTHON_VERSION = '3.11'
const PYTHON_IMAGE_MAP = {
  3.11: 'agent-base:3.11',
  3.12: 'agent-base:3.12',
}

function normalizePythonVersion(version) {
  if (!version) return DEFAULT_PYTHON_VERSION

  // "3.12.1" → "3.12"
  const match = version.match(/^(\d+)\.(\d+)/)
  if (!match) return DEFAULT_PYTHON_VERSION

  return `${match[1]}.${match[2]}`
}

export async function getJob(namespace, name) {
  return k8sGet(`/apis/batch/v1/namespaces/${namespace}/jobs/${name}`)
}

export async function queueJob(
  {
    agent,
    prompt,
    image,
    repoUrl,
    args = [],
    executionId,
    env: customEnv = {},
    pythonVersion = DEFAULT_PYTHON_VERSION,
  },
  { post = k8sPost } = {},
) {
  const jobName = `infra-${executionId}`
  const normalizedVersion = normalizePythonVersion(pythonVersion)
  const jobImage =
    image ||
    PYTHON_IMAGE_MAP[normalizedVersion] ||
    PYTHON_IMAGE_MAP[DEFAULT_PYTHON_VERSION]

  const env = [
    { name: 'EXECUTION_MODE', value: 'agent' },
    { name: 'EXECUTION_ID', value: executionId },
    { name: 'AGENT', value: agent },
    { name: 'PROMPT', value: prompt || '' },
    {
      name: 'CONTROL_PLANE_URL',
      value: 'http://infra-control-plane:3000',
    },
    { name: 'PYTHONPATH', value: '/platform:/app' },
    { name: 'PYTHON_VERSION_REQUESTED', value: pythonVersion },
    { name: 'PYTHON_VERSION_RESOLVED', value: normalizedVersion },
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
          volumes: [{ name: 'platform-tools', emptyDir: {} }],
          initContainers: [
            {
              name: 'install-platform',
              image: jobImage,
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
