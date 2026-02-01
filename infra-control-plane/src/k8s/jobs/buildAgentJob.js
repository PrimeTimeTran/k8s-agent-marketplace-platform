import { K8S_NAMESPACE } from '../../constants.js'

const DEFAULT_PYTHON_VERSION = '3.11'

// Get the registry from env, or default to empty (for local dev if needed)
// Env var should be set in k8s deployment
const REGISTRY = process.env.CONTAINER_REGISTRY || ''
const REPO_PREFIX = REGISTRY ? `${REGISTRY}/` : ''
const PULL_POLICY = process.env.JOB_IMAGE_PULL_POLICY || 'IfNotPresent'

const PYTHON_IMAGE_MAP = {
  3.11: `${REPO_PREFIX}agent-base-3-11`, // mapped to 'agent-base-3-11' artifact in skaffold
  3.12: `${REPO_PREFIX}agent-base-3-12`, // mapped to 'agent-base-3-12' artifact in skaffold
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
                imagePullPolicy: PULL_POLICY,
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
                imagePullPolicy: PULL_POLICY,
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
