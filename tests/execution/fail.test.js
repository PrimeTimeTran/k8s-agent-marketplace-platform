import { execSync } from 'node:child_process'
import assert from 'node:assert'

const IMAGE = 'execution-fail-exit:dev'

console.log('▶ Running fail-exit image')

try {
  execSync(`docker run --rm ${IMAGE}`, {
    encoding: 'utf8',
    stdio: 'ignore',
  })
  assert.fail('Should have thrown an error')
} catch (error) {
  console.log('✅ Command failed as expected with exit code:', error.status)
  assert.strictEqual(error.status, 1)
}

console.log('✅ fail execution test passed')
