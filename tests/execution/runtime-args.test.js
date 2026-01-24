import { execSync } from 'node:child_process'
import assert from 'node:assert'

const IMAGE = 'execution-args-printer:dev'
const ARGS = 'arg1 arg2 arg3'

console.log('▶ Running args-printer image')

const output = execSync(`docker run --rm ${IMAGE} ${ARGS}`, {
  encoding: 'utf8',
}).trim()

console.log('📤 Output:', output)

assert.strictEqual(output, ARGS)

console.log('✅ runtime-args execution test passed')
