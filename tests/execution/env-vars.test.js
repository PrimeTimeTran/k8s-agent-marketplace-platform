import { execSync } from 'node:child_process'
import assert from 'node:assert'

const IMAGE = 'execution-env-echo:dev'
const TEST_VALUE = 'test_value_123'

console.log('▶ Running env-echo image')

const output = execSync(`docker run --rm -e TEST_VAR=${TEST_VALUE} ${IMAGE}`, {
  encoding: 'utf8',
}).trim()

console.log('📤 Output:', output)

assert.strictEqual(output, TEST_VALUE)

console.log('✅ env-vars execution test passed')
