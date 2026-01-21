'use client'
import { useEffect, useState } from 'react'

type Execution = {
  id: string
  status: string
  payload: {
    agent: string
    prompt: string
    value: string
  }
  logs: string
  createdAt: number
}

export default function Home() {
  const [agent, setAgent] = useState<'classify' | 'translate'>('classify')
  const [prompt, setPrompt] = useState('Im doing great!')
  const [value, setValue] = useState('abc-123')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [executions, setExecutions] = useState<Execution[]>([])
  const [selectedExecution, setSelectedExecution] = useState<Execution | null>(
    null,
  )
  const [loadingExecutions, setLoadingExecutions] = useState(false)
  async function loadExecutions() {
    setLoadingExecutions(true)

    const res = await fetch('/api/executions', {
      cache: 'no-store',
    })
    const data = await res.json()

    const executions = Array.isArray(data) ? data : (data?.executions ?? [])

    setExecutions(executions)
    setLoadingExecutions(false)
  }

  useEffect(() => {
    loadExecutions()
  }, [])

  async function runAgent() {
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/queue-agent', {
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
    } finally {
      setLoading(false)
    }
  }

  async function runJob() {
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/queue-job', {
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
      setTimeout(() => {
        loadExecutions()
      }, 8000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex justify-center items-center flex-col w-full space-y-5 py-16 bg-zinc-50 dark:bg-black'>
      <input className='border w-64 p-4 text-2xl' />
      <div className='flex min-h-screen items-center justify-center '>
        <div className='max-w-md space-y-4 rounded-xl bg-white p-6 shadow dark:bg-zinc-900'>
          <h1 className='text-lg font-semibold'>Sentiment Classifier</h1>
          <label className='text-sm font-medium'>Agent</label>
          <select
            value={agent}
            onChange={(e) => setAgent(e.target.value as any)}
            className='w-full rounded-md border px-3 py-2 text-sm dark:bg-zinc-800'
          >
            <option value='classify'>Sentiment Classifier</option>
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
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Executions</label>
            <select
              className='w-full rounded-md border px-3 py-2 text-sm dark:bg-zinc-800'
              value={selectedExecution?.id ?? ''}
              onChange={(e) => {
                const ex = executions.find((x) => x.id === e.target.value)
                setSelectedExecution(ex ?? null)
              }}
            >
              <option value=''>
                {loadingExecutions ? 'Loading…' : 'Select execution'}
              </option>

              {executions &&
                executions.map((ex) => (
                  <option
                    key={ex.id}
                    value={ex.id}
                  >
                    {ex.id} — {ex.status}
                  </option>
                ))}
            </select>
            {selectedExecution && (
              <div className='rounded-md border bg-zinc-50 p-3 text-xs dark:bg-zinc-900'>
                <div className='mb-2 flex items-center justify-between'>
                  <span className='font-medium'>Execution Details</span>
                  <span className='rounded bg-zinc-200 px-2 py-0.5 text-[10px] dark:bg-zinc-700'>
                    {selectedExecution.status}
                  </span>
                </div>

                <pre className='overflow-x-auto whitespace-pre-wrap'>
                  {selectedExecution.logs}
                </pre>
              </div>
            )}
          </div>
        </div>

        <span className='w-16' />

        <div className='max-w-md space-y-4 rounded-xl bg-white p-6 shadow dark:bg-zinc-900'>
          <h1 className='text-lg font-semibold'>Translation Agent</h1>
          <label className='text-sm font-medium'>Agent</label>
          <select
            value={agent}
            onChange={(e) => setAgent(e.target.value as any)}
            className='w-full rounded-md border px-3 py-2 text-sm dark:bg-zinc-800'
          >
            <option value='translate_hi'>English → Hindi Translator</option>
            <option value='translate_vi'>
              English → Vietnamese Translator
            </option>
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
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Executions</label>
            <select
              className='w-full rounded-md border px-3 py-2 text-sm dark:bg-zinc-800'
              value={selectedExecution?.id ?? ''}
              onChange={(e) => {
                const ex = executions.find((x) => x.id === e.target.value)
                setSelectedExecution(ex ?? null)
              }}
            >
              <option value=''>
                {loadingExecutions ? 'Loading…' : 'Select execution'}
              </option>

              {executions &&
                executions.map((ex) => (
                  <option
                    key={ex.id}
                    value={ex.id}
                  >
                    {ex.id} — {ex.status}
                  </option>
                ))}
            </select>
            {selectedExecution && (
              <div className='rounded-md border bg-zinc-50 p-3 text-xs dark:bg-zinc-900'>
                <div className='mb-2 flex items-center justify-between'>
                  <span className='font-medium'>Execution Details</span>
                  <span className='rounded bg-zinc-200 px-2 py-0.5 text-[10px] dark:bg-zinc-700'>
                    {selectedExecution.status}
                  </span>
                </div>

                <pre className='overflow-x-auto whitespace-pre-wrap'>
                  {selectedExecution.logs}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
