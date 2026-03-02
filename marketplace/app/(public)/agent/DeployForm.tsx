'use client'

import { useState } from 'react'

export function DeployForm() {
  const [repoUrl, setRepoUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/queue-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoUrl: repoUrl || undefined, // Send undefined if empty to trigger default agent-job
          prompt: 'Run custom agent',
          agent: 'custom-git-agent',
        }),
      })

      if (!res.ok) {
        throw new Error(`Failed: ${res.status} ${res.statusText}`)
      }

      const data = await res.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full max-w-md'>
      <form
        onSubmit={handleSubmit}
        className='space-y-4'
      >
        <div>
          <label
            htmlFor='repoUrl'
            className='block text-sm font-medium text-gray-700'
          >
            Git Repository URL (Optional)
          </label>
          <div className='mt-1'>
            <input
              type='text'
              name='repoUrl'
              id='repoUrl'
              className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-3 border'
              placeholder='https://github.com/username/repo.git'
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
            />
          </div>
          <p className='mt-2 text-sm text-gray-500'>
            Leave empty to run the default internal agent.
          </p>
        </div>

        <button
          type='submit'
          disabled={loading}
          className='w-full rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {loading ? 'Deploying...' : 'Deploy Agent'}
        </button>
      </form>

      {error && (
        <div className='mt-4 p-4 bg-red-50 text-red-700 rounded-md'>
          {error}
        </div>
      )}

      {result && (
        <div className='mt-4 p-4 bg-green-50 text-green-700 rounded-md'>
          <p className='font-bold'>Success!</p>
          <pre className='text-xs mt-2 overflow-auto'>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
