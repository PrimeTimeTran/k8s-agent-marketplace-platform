'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MdStart } from 'react-icons/md'
import { FaRegSmile, FaLanguage } from 'react-icons/fa'

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

const AGENTS = [
  {
    id: 'agent-1',
    name: 'Dynamic Agent Repo',
    type: 'custom-git-agent',
    icon: <FaRegSmile size={24} />,
    description: 'Clone and run an agent from a Git repo.',
    placeholder: 'https://github.com/user/repo.git',
  },
  {
    id: 'sentiment-1',
    name: 'Sentiment Classifier',
    type: 'classify',
    icon: <FaRegSmile size={24} />,
    description: 'Analyze the emotional tone of text.',
    placeholder: 'Enter text to classify',
  },
  {
    id: 'translation-hi',
    name: 'Hindi Translator',
    type: 'translate_hi',
    icon: <FaLanguage size={24} />,
    description: 'Translate English text to Hindi.',
    placeholder: 'Enter English text',
  },
  {
    id: 'translation-vi',
    name: 'Vietnamese Translator',
    type: 'translate_vi',
    icon: <FaLanguage size={24} />,
    description: 'Translate English text to Vietnamese.',
    placeholder: 'Enter English text',
  },
]

function AgentCard({
  agent,
  onRun,
}: {
  agent: (typeof AGENTS)[0]
  onRun?: () => void
}) {
  const [repo, setRepo] = useState('https://github.com/PrimeTimeTran/agent-job')
  const [configJson, setConfigJson] = useState(
    JSON.stringify(
      {
        env: {
          CUSTOM_VAR: 'Hello from UI',
          API_KEY: '123-abc',
        },
        args: ['--verbose', '--dry-run'],
      },
      null,
      2,
    ),
  )
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  async function runJob() {
    setLoading(true)
    setResult(null)

    try {
      let parsedConfig = {}
      try {
        parsedConfig = JSON.parse(configJson)
      } catch (e) {
        alert('Invalid JSON config')
        setLoading(false)
        return
      }

      const res = await fetch('/api/queue-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent: agent.type,
          repoUrl: repo || undefined,
          ...parsedConfig,
        }),
      })

      const data = await res.json()
      setResult(data)
      if (onRun) {
        onRun()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-80 shrink-0 snap-center rounded-xl bg-white p-5 shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 flex flex-col'>
      <div className='flex items-center gap-3 mb-3'>
        <div className='p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white'>
          {agent.icon}
        </div>
        <div>
          <h3 className='font-semibold text-sm text-zinc-900 dark:text-zinc-100'>
            {agent.name}
          </h3>
          <p className='text-xs text-zinc-500 dark:text-zinc-400'>
            {agent.type}
          </p>
        </div>
      </div>

      <p className='text-xs text-zinc-600 dark:text-zinc-300 mb-4 h-8'>
        {agent.description}
      </p>

      <div className='space-y-3 flex-1'>
        {agent.type == 'custom-git-agent' && (
          <div>
            <label className='text-xs font-medium text-zinc-500 mb-1 block'>
              Repo
            </label>
            <input
              type='text'
              placeholder={agent.placeholder}
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              className='w-full rounded-md border border-zinc-200 px-3 py-1.5 text-xs dark:bg-zinc-800 dark:border-zinc-700'
            />
          </div>
        )}
        <div>
          <label className='text-xs font-medium text-zinc-500 mb-1 block'>
            Configuration (JSON)
          </label>
          <textarea
            rows={8}
            placeholder='{ "env": {}, "args": [] }'
            value={configJson}
            onChange={(e) => setConfigJson(e.target.value)}
            className='w-full rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-mono dark:bg-zinc-800 dark:border-zinc-700'
          />
        </div>
      </div>

      <div className='mt-4 flex gap-2'>
        <Link
          href={`/agent?name=${agent.type}`}
          className='flex items-center justify-center rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors'
        >
          View
        </Link>
        <button
          onClick={runJob}
          disabled={loading}
          className='flex-1 flex items-center justify-center gap-1.5 rounded-md bg-black px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors'
        >
          {loading ? (
            'Running...'
          ) : (
            <>
              Run Job
              <MdStart size={14} />
            </>
          )}
        </button>
      </div>

      {result && (
        <div className='mt-3 overflow-hidden rounded-md bg-zinc-50 p-2 text-[10px] border border-zinc-100 dark:bg-zinc-800 dark:border-zinc-700'>
          <pre className='whitespace-pre-wrap break-all text-zinc-600 dark:text-zinc-300'>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default function Dev() {
  const [executions, setExecutions] = useState<Execution[]>([])
  const [selectedExecution, setSelectedExecution] = useState<Execution | null>(
    null,
  )
  const [loadingExecutions, setLoadingExecutions] = useState(false)

  async function loadExecutions() {
    setLoadingExecutions(true)
    try {
      const res = await fetch('/api/executions', { cache: 'no-store' })
      const data = await res.json()
      const list = Array.isArray(data) ? data : (data?.executions ?? [])
      setExecutions(list)
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingExecutions(false)
    }
  }

  useEffect(() => {
    loadExecutions()
    const interval = setInterval(loadExecutions, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className='min-h-screen bg-zinc-50 dark:bg-black py-12'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mx-auto max-w-2xl text-center mb-12'>
          <h2 className='text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white'>
            Marketplace
          </h2>
          <p className='mt-2 text-lg leading-8 text-zinc-600 dark:text-zinc-400'>
            Discover and deploy AI agents for your workflow.
          </p>
        </div>

        <div className='relative mb-16'>
          <div className='flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 px-4 -mx-4 scrollbar-hide'>
            {AGENTS.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onRun={() => {
                  setTimeout(loadExecutions, 1000)
                }}
              />
            ))}
          </div>
        </div>

        {/* Executions / Logs Section */}
        <div className='mx-auto max-w-3xl'>
          <div className='bg-white rounded-xl shadow-sm border border-zinc-200 p-6 dark:bg-zinc-900 dark:border-zinc-800'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-zinc-900 dark:text-white'>
                Recent Executions
              </h3>
              <button
                onClick={() => loadExecutions()}
                disabled={loadingExecutions}
                className='text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
              >
                {loadingExecutions ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            <div className='space-y-4'>
              <div className='grid gap-2'>
                <label className='text-sm font-medium text-zinc-700 dark:text-zinc-300'>
                  Select Execution
                </label>
                <select
                  className='w-full rounded-md border border-zinc-200 px-3 py-2 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white'
                  value={selectedExecution?.id ?? ''}
                  onChange={(e) => {
                    const ex = executions.find((x) => x.id === e.target.value)
                    setSelectedExecution(ex ?? null)
                  }}
                >
                  <option value=''>
                    {executions.length === 0
                      ? 'No executions found'
                      : 'Select an execution to view logs'}
                  </option>
                  {executions.map((ex) => (
                    <option
                      key={ex.id}
                      value={ex.id}
                    >
                      {ex.id} — {ex.status} ({ex.payload.agent})
                    </option>
                  ))}
                </select>
              </div>

              {selectedExecution && (
                <div className='rounded-md border border-zinc-200 bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-800'>
                  <div className='border-b border-zinc-200 px-4 py-2 flex items-center justify-between bg-zinc-100/50 dark:bg-zinc-900/50 dark:border-zinc-800'>
                    <div className='flex gap-4 text-xs text-zinc-500'>
                      <span>ID: {selectedExecution.id}</span>
                      <span>
                        Created:{' '}
                        {new Date(
                          selectedExecution.createdAt,
                        ).toLocaleTimeString()}
                      </span>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        selectedExecution.status === 'succeeded'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : selectedExecution.status === 'failed'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}
                    >
                      {selectedExecution.status}
                    </span>
                  </div>

                  <div className='p-4 overflow-x-auto'>
                    <div className='mb-4'>
                      <h4 className='text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1'>
                        Payload
                      </h4>
                      <pre className='text-xs text-zinc-600 dark:text-zinc-400 font-mono'>
                        {JSON.stringify(selectedExecution.payload, null, 2)}
                      </pre>
                    </div>

                    <div>
                      <h4 className='text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1'>
                        Logs
                      </h4>
                      {selectedExecution.logs ? (
                        <pre className='text-xs font-mono whitespace-pre-wrap text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 p-3 rounded border border-zinc-100 dark:border-zinc-800'>
                          {selectedExecution.logs}
                        </pre>
                      ) : (
                        <p className='text-xs text-zinc-400 italic'>
                          No logs available yet...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
