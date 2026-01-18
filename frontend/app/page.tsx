'use client'
import { useState, useEffect } from 'react'

export default function Home() {
  const [agent, setAgent] = useState<'classify' | 'translate'>('classify')
  const [prompt, setPrompt] = useState('')
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  async function runAgent() {
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/run-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent,
          prompt,
          value,
        }),
      })

      const data = await res.json()
      setResult(data)
      console.log(data)
    } finally {
      setLoading(false)
    }
  }

  async function runJob() {
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/run-agent-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent,
          prompt,
          value,
        }),
      })

      const data = await res.json()
      setResult(data)
      console.log(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        console.log('ENV CHECK:', data)
      })
  }, [])

  return (
    <div className='flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black'>
      <div className='w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow dark:bg-zinc-900'>
        <h1 className='text-lg font-semibold'>Agent Runner</h1>
        <ul>
          <li>K8s</li>
          <li>Docker</li>
          <li>Next</li>
          <li>Node</li>
          <li>FastAPI</li>
          <li>Python</li>
          <li>JS</li>
          <li>TS</li>
        </ul>

        <label className='text-sm font-medium'>Agent</label>
        <select
          value={agent}
          onChange={(e) => setAgent(e.target.value as any)}
          className='w-full rounded-md border px-3 py-2 text-sm dark:bg-zinc-800'
        >
          <option value='classify'>Sentiment Classifier</option>
          <option value='translate_hi'>English → Hindi Translator</option>
          <option value='translate_cn'>English → Chinese Translator</option>
          <option value='translate_vi'>English → Vietnamese Translator</option>
        </select>

        <label className='text-sm font-medium'>Prompt</label>
        <input
          type='text'
          placeholder={
            agent === 'translate'
              ? 'Enter English text to translate'
              : 'Enter text to classify sentiment'
          }
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className='w-full rounded-md border px-3 py-2 text-sm dark:bg-zinc-800'
        />

        <label className='text-sm font-medium'>API Key / Value</label>
        <input
          type='text'
          placeholder='Enter variable to pass through'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className='w-full rounded-md border px-3 py-2 text-sm dark:bg-zinc-800'
        />

        <button
          onClick={runAgent}
          disabled={loading || !prompt}
          className='w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50 dark:bg-white dark:text-black'
        >
          {loading ? 'Running…' : 'Run Agent'}
        </button>
        <button
          onClick={runJob}
          disabled={loading || !prompt}
          className='w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50 dark:bg-white dark:text-black'
        >
          {loading ? 'Scheduling…' : 'Schedule Job'}
        </button>

        {result && (
          <pre className='rounded-md bg-zinc-100 p-3 text-xs dark:bg-zinc-800'>
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}
