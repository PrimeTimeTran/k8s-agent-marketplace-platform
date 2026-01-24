import { execSync } from 'node:child_process'
import assert from 'node:assert'

const IMAGE = 'execution-base:dev'

console.log('▶ Checking Python version in execution-base')

try {
  const output = execSync(
    `docker run --rm --entrypoint python ${IMAGE} --version`,
    {
      encoding: 'utf8',
    },
  ).trim()

  console.log('📤 Output:', output)

  // We expect "Python 3.12.x"
  // assert that it starts with Python 3.12
  const versionRegex = /^Python 3\.12\./

  if (versionRegex.test(output)) {
    console.log(`✅ Python version is 3.12 (${output})`)
  } else {
    console.error(`❌ Python version mismatch. Expected 3.12.x, got ${output}`)
    process.exit(1)
  }
} catch (error) {
  console.error('❌ Failed to check python version:', error.message)
  process.exit(1)
}
