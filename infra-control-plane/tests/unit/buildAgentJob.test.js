import { describe, it } from 'node:test'
import assert from 'node:assert'
import { buildAgentJob } from '../../src/k8s/jobs/buildAgentJob.js'

describe('buildAgentJob Python Version Selection', () => {
  it('defaults to Python 3.11 if version is not specified', () => {
    const { jobImage, env } = buildAgentJob({
      executionId: 'test-default',
      agent: 'test-agent',
      prompt: 'hello',
    })

    assert.strictEqual(jobImage, 'agent-base:3.11')

    const versionEnv = env.find((e) => e.name === 'PYTHON_VERSION_RESOLVED')
    assert.strictEqual(versionEnv.value, '3.11')
  })

  it('selects Python 3.12 image when version 3.12 is requested', () => {
    const { jobImage, env } = buildAgentJob({
      executionId: 'test-3.12',
      agent: 'test-agent',
      prompt: 'hello',
      pythonVersion: '3.12',
    })

    assert.strictEqual(jobImage, 'agent-base:3.12')

    const requestedEnv = env.find((e) => e.name === 'PYTHON_VERSION_REQUESTED')
    assert.strictEqual(requestedEnv.value, '3.12')

    const resolvedEnv = env.find((e) => e.name === 'PYTHON_VERSION_RESOLVED')
    assert.strictEqual(resolvedEnv.value, '3.12')
  })

  it('normalizes version 3.12.1 to 3.12', () => {
    const { jobImage, env } = buildAgentJob({
      executionId: 'test-normalization-1',
      agent: 'test-agent',
      prompt: 'hello',
      pythonVersion: '3.12.1',
    })

    assert.strictEqual(jobImage, 'agent-base:3.12')

    const resolvedEnv = env.find((e) => e.name === 'PYTHON_VERSION_RESOLVED')
    assert.strictEqual(resolvedEnv.value, '3.12')
  })

  it('normalizes version 3.12.19 (latest patch example) to 3.12', () => {
    const { jobImage, env } = buildAgentJob({
      executionId: 'test-normalization-2',
      agent: 'test-agent',
      prompt: 'hello',
      pythonVersion: '3.12.19',
    })

    assert.strictEqual(jobImage, 'agent-base:3.12')
  })

  it('falls back to default if version is unknown/unsupported by map (but normalization happens)', () => {
    // Current implementation: normalizePythonVersion returns '3.13' for '3.13.1'
    // But PYTHON_IMAGE_MAP does not have '3.13'.
    // code: jobImage = image || PYTHON_IMAGE_MAP[normalizedVersion] || PYTHON_IMAGE_MAP[DEFAULT_PYTHON_VERSION]

    const { jobImage, env } = buildAgentJob({
      executionId: 'test-unsupported',
      agent: 'test-agent',
      prompt: 'hello',
      pythonVersion: '3.13.5',
    })

    // 3.13 is not in map, so it falls back to DEFAULT (3.11 image)
    assert.strictEqual(jobImage, 'agent-base:3.11')

    // But resolved version in env might be the normalized one?
    // Let's check the code:
    // const normalizedVersion = normalizePythonVersion(pythonVersion) -> "3.13"
    // { name: 'PYTHON_VERSION_RESOLVED', value: normalizedVersion },

    const resolvedEnv = env.find((e) => e.name === 'PYTHON_VERSION_RESOLVED')
    assert.strictEqual(resolvedEnv.value, '3.13')
  })
})
