import { execSync } from 'node:child_process'
import assert from 'node:assert'

const IMAGE = 'execution-hello:dev'

console.log('▶ Running hello image')

const output = execSync(`docker run --rm ${IMAGE}`, {
  encoding: 'utf8',
}).trim()

console.log('📤 Output:', output)

assert.strictEqual(output, 'hello')

console.log('✅ hello execution test passed')
