import assert from 'node:assert'
import { describe, it } from 'node:test'
import { queueJob } from '../../src/k8s/jobs/index.js'

describe('queueJob', () => {
  it('should use agent-base:3.11 image by default', async () => {
    let capturedJob = null
    const mockPost = async (path, job) => {
      capturedJob = job
      return { metadata: { name: 'mock-job' } }
    }

    await queueJob(
      { executionId: '123', agent: 'test', prompt: 'hi' },
      { post: mockPost },
    )

    assert.equal(
      capturedJob.spec.template.spec.containers[0].image,
      'agent-base:3.11',
    )
  })

  it('should use agent-base:3.11 if repoUrl is provided', async () => {
    let capturedJob = null
    const mockPost = async (path, job) => {
      capturedJob = job
      return { metadata: { name: 'mock-job' } }
    }

    await queueJob(
      {
        executionId: '123',
        agent: 'test',
        repoUrl: 'http://git',
      },
      { post: mockPost },
    )

    assert.equal(
      capturedJob.spec.template.spec.containers[0].image,
      'agent-base:3.11',
    )
  })

  it('should inject GIT_REPO_URL env var', async () => {
    let capturedJob = null
    const mockPost = async (path, job) => {
      capturedJob = job
      return { metadata: { name: 'mock-job' } }
    }

    await queueJob(
      {
        executionId: '123',
        agent: 'test',
        repoUrl: 'http://git',
      },
      { post: mockPost },
    )

    const env = capturedJob.spec.template.spec.containers[0].env
    const repoEnv = env.find((e) => e.name === 'GIT_REPO_URL')
    assert.ok(repoEnv)
    assert.equal(repoEnv.value, 'http://git')
  })

  it('should handle custom env vars', async () => {
    let capturedJob = null
    const mockPost = async (path, job) => {
      capturedJob = job
      return { metadata: { name: 'mock-job' } }
    }

    await queueJob(
      {
        executionId: '123',
        agent: 'test',
        env: { MY_VAR: 'hello' },
      },
      { post: mockPost },
    )

    const env = capturedJob.spec.template.spec.containers[0].env
    const myVar = env.find((e) => e.name === 'MY_VAR')
    assert.ok(myVar)
    assert.equal(myVar.value, 'hello')
  })

  it('should pass args to command', async () => {
    let capturedJob = null
    const mockPost = async (path, job) => {
      capturedJob = job
      return { metadata: { name: 'mock-job' } }
    }

    await queueJob(
      {
        executionId: '123',
        agent: 'test',
        args: ['--flag', 'value'],
      },
      { post: mockPost },
    )

    const command = capturedJob.spec.template.spec.containers[0].command
    assert.deepEqual(command, [
      'python',
      '/platform/runner.py',
      'main.py',
      '--flag',
      'value',
    ])
  })
})
