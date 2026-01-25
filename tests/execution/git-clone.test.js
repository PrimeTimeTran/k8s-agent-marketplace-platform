import { execSync } from 'node:child_process'
import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FIXTURES_DIR = path.join(__dirname, '../fixtures/execution')
const SOURCE_REPO = path.join(FIXTURES_DIR, 'repos/hello-job')
const REPO_DIR = path.join(FIXTURES_DIR, 'temp-git-repo')

// Clean up previous runs
if (fs.existsSync(REPO_DIR)) {
  fs.rmSync(REPO_DIR, { recursive: true, force: true })
}

console.log('▶ Setting up temp git repo at', REPO_DIR)
// Copy source files to temp dir
fs.cpSync(SOURCE_REPO, REPO_DIR, { recursive: true })

// Initialize git repo
execSync('git init', { cwd: REPO_DIR, stdio: 'ignore' })
// Configure git user for commit
execSync('git config user.email "loi.tran@healthcompiler.com"', {
  cwd: REPO_DIR,
  stdio: 'ignore',
})
execSync('git config user.name "Test User"', { cwd: REPO_DIR, stdio: 'ignore' })

// Commit
execSync('git add .', { cwd: REPO_DIR, stdio: 'ignore' })
execSync('git commit -m "Initial commit"', { cwd: REPO_DIR, stdio: 'ignore' })

console.log('▶ Running execution-base with GIT_REPO_URL')

const IMAGE = 'execution-base:dev'
// Mount REPO_DIR to /repo-source in container.
// Note: We use /repo-source as the git remote.
const cmd = `docker run --rm -v "${REPO_DIR}":/repo-source -e GIT_REPO_URL=/repo-source ${IMAGE} python /app/runner.py`

try {
  const output = execSync(cmd, { encoding: 'utf8' }).trim()
  console.log('📤 Output:', output)
  assert.match(output, /Hello Git Clone Test/)
  console.log('✅ git-clone execution test passed')
} catch (e) {
  console.error('❌ Test failed')
  if (e.stdout) console.log('Output:', e.stdout.toString())
  if (e.stderr) console.error('Error Output:', e.stderr.toString())
  process.exit(1)
} finally {
  // Cleanup
  if (fs.existsSync(REPO_DIR)) {
    fs.rmSync(REPO_DIR, { recursive: true, force: true })
  }
}
