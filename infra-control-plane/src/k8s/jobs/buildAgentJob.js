import { K8S_NAMESPACE } from '../../constants.js'

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

export function buildAgentJob({
  type,
  image,
  agent,
  prompt,
  repoUrl,
  args = [],
  executionId,
  env: customEnv = {},
  pythonVersion = DEFAULT_PYTHON_VERSION,
}) {
  const normalizedVersion = normalizePythonVersion(pythonVersion)
  const jobImage =
    image ||
    PYTHON_IMAGE_MAP[normalizedVersion] ||
    PYTHON_IMAGE_MAP[DEFAULT_PYTHON_VERSION]

  const env = [
    { name: 'AGENT', value: agent },
    { name: 'PROMPT', value: prompt || '' },
    { name: 'EXECUTION_MODE', value: 'agent' },
    { name: 'EXECUTION_ID', value: executionId },
    { name: 'PYTHONPATH', value: '/platform:/app' },
    { name: 'PYTHON_VERSION_REQUESTED', value: pythonVersion },
    { name: 'PYTHON_VERSION_RESOLVED', value: normalizedVersion },
    { name: 'CONTROL_PLANE_URL', value: 'http://infra-control-plane:3000' },
  ]

  for (const [k, v] of Object.entries(customEnv ?? {})) {
    env.push({ name: k, value: String(v) })
  }

  if (repoUrl) {
    env.push({ name: 'GIT_REPO_URL', value: repoUrl })
  }

  const jobName =
    type === 'infra' ? `infra-${executionId}` : `agent-${executionId}`

  return {
    jobName,
    jobImage,
    env,
    job: {
      apiVersion: 'batch/v1',
      kind: 'Job',
      metadata: {
        name: jobName,
        namespace: K8S_NAMESPACE,
        labels: { executionId },
      },
      spec: {
        backoffLimit: 0,
        ttlSecondsAfterFinished: 3600,
        template: {
          spec: {
            restartPolicy: 'Never',
            volumes: [{ name: 'platform-tools', emptyDir: {} }],
            initContainers: [
              {
                name: 'install-platform',
                image: jobImage,
                command: [
                  'sh',
                  '-c',
                  'cp -r /app/common /platform/ && cp /app/runner.py /platform/',
                ],
                volumeMounts: [
                  { name: 'platform-tools', mountPath: '/platform' },
                ],
              },
            ],
            containers: [
              {
                name: 'agent',
                image: jobImage,
                command: ['python', '/platform/runner.py', 'main.py', ...args],
                env,
                volumeMounts: [
                  { name: 'platform-tools', mountPath: '/platform' },
                ],
              },
            ],
          },
        },
      },
    },
  }
}
