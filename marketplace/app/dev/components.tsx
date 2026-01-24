'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  MdStart,
  MdContentCopy,
  MdCheck,
  MdExpandMore,
  MdExpandLess,
} from 'react-icons/md'
import { FaRegSmile, FaLanguage } from 'react-icons/fa'

export type Execution = {
  id: string
  status: string
  logs: string
  jobConfig?: any
  createdAt: number
  payload: {
    agent: string
    prompt: string
    value: string
  }
}

export const AGENTS = [
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

function JsonHighlighter({ data }: { data: any }) {
  const json = JSON.stringify(data, null, 2)
  if (!json) return null

  const html = json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = 'text-amber-600 dark:text-amber-400' // number
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'text-blue-600 dark:text-blue-400 font-semibold' // key
        } else {
          cls = 'text-emerald-600 dark:text-emerald-400' // string
        }
      } else if (/true|false/.test(match)) {
        cls = 'text-purple-600 dark:text-purple-400' // boolean
      } else if (/null/.test(match)) {
        cls = 'text-zinc-500 dark:text-zinc-500' // null
      }
      return `<span class="${cls}">${match}</span>`
    },
  )

  return (
    <pre
      className='text-xs font-mono overflow-auto p-4'
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  contentToCopy,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  contentToCopy?: string
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (contentToCopy) {
      navigator.clipboard.writeText(contentToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className='border rounded-md border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden mb-4'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='w-full px-4 py-2 flex items-center justify-between text-xs font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors'
      >
        <span className='flex items-center gap-2'>
          {isOpen ? <MdExpandLess size={16} /> : <MdExpandMore size={16} />}
          {title}
        </span>
        {contentToCopy && (
          <div
            onClick={handleCopy}
            className='flex items-center gap-1 px-2 py-1 -my-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors'
            title='Copy content'
          >
            {copied ? (
              <>
                <MdCheck
                  size={14}
                  className='text-green-500'
                />
                <span className='text-[10px]'>Copied</span>
              </>
            ) : (
              <MdContentCopy size={14} />
            )}
          </div>
        )}
      </button>
      {isOpen && (
        <div className='border-t border-zinc-200 dark:border-zinc-800'>
          {children}
        </div>
      )}
    </div>
  )
}

export function AgentCard({
  agent,
  onRun,
}: {
  agent: (typeof AGENTS)[0]
  onRun?: (executionId: string) => void
}) {
  const [repo, setRepo] = useState(
    'https://github.com/PrimeTimeTran/agent-job-2',
  )
  const [configJson, setConfigJson] = useState(
    JSON.stringify(
      {
        pythonVersion: '3.12',
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
  const [activeTab, setActiveTab] = useState<'config' | 'result'>('config')

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
      setActiveTab('result')
      if (onRun && data.executionId) {
        onRun(data.executionId)
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

      <div className='flex gap-2 mb-4 border-b border-zinc-100 dark:border-zinc-800 min-h-[33px]'>
        <button
          onClick={() => setActiveTab('config')}
          className={`px-3 py-1.5 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'config'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400'
          }`}
        >
          Config
        </button>
        {result && (
          <button
            onClick={() => setActiveTab('result')}
            className={`px-3 py-1.5 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'result'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400'
            }`}
          >
            Result
          </button>
        )}
      </div>

      <div className='space-y-3 flex-1 overflow-y-auto min-h-[200px]'>
        {activeTab === 'config' ? (
          <>
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
          </>
        ) : (
          <div className='mt-0 overflow-hidden rounded-md bg-zinc-50 p-2 text-[10px] border border-zinc-100 dark:bg-zinc-800 dark:border-zinc-700'>
            <pre className='whitespace-pre-wrap break-all text-zinc-600 dark:text-zinc-300'>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className='mt-4 flex gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800'>
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
    </div>
  )
}

export function ExecutionList({
  executions,
  selectedId,
  onSelect,
}: {
  executions: Execution[]
  selectedId: string | undefined
  onSelect: (id: string) => void
}) {
  return (
    <div className='grid gap-2'>
      <label className='text-sm font-medium text-zinc-700 dark:text-zinc-300'>
        Select Execution
      </label>
      <select
        className='w-full rounded-md border border-zinc-200 px-3 py-2 text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white'
        value={selectedId ?? ''}
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value=''>
          {executions.length === 0
            ? 'No executions found'
            : 'Select an execution to view logs'}
        </option>
        {executions
          .sort((a, b) => a.createdAt - b.createdAt)
          .map((ex, i) => (
            <option
              key={ex.id}
              value={ex.id}
            >
              {i + 1}. {ex.id} — {ex.status}
              {ex.payload?.agent ? ` (${ex.payload.agent})` : ''}
            </option>
          ))}
      </select>
    </div>
  )
}

export function ExecutionDetails({
  execution,
}: {
  execution: Execution | null
}) {
  if (!execution) return null

  return (
    <div className='rounded-md border border-zinc-200 bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-800'>
      <div className='border-b border-zinc-200 px-4 py-2 flex items-center justify-between bg-zinc-100/50 dark:bg-zinc-900/50 dark:border-zinc-800'>
        <div className='flex gap-4 text-xs text-zinc-500'>
          <span>ID: {execution.id}</span>
          <span>
            Created: {new Date(execution.createdAt).toLocaleTimeString()}
          </span>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold border ${
            execution.status === 'succeeded' || execution.status === 'completed'
              ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
              : execution.status === 'failed'
                ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
                : execution.status === 'running'
                  ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 animate-pulse'
                  : 'bg-white text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700'
          }`}
        >
          {execution.status.toUpperCase()}
        </span>
      </div>

      <div className='p-4'>
        <CollapsibleSection
          title='Payload'
          contentToCopy={JSON.stringify(execution.payload, null, 2)}
        >
          <JsonHighlighter data={execution.payload} />
        </CollapsibleSection>

        {execution.jobConfig && (
          <CollapsibleSection
            title='Job Config (Resolved)'
            contentToCopy={JSON.stringify(execution.jobConfig, null, 2)}
          >
            <JsonHighlighter data={execution.jobConfig} />
          </CollapsibleSection>
        )}

        <CollapsibleSection
          title='Logs'
          defaultOpen={true}
          contentToCopy={execution.logs}
        >
          <div className='relative h-96 resize-y overflow-hidden min-h-[100px] flex flex-col'>
            <div className='flex-1 overflow-y-auto bg-white dark:bg-zinc-900 p-0'>
              {execution.logs ? (
                <pre className='text-xs font-mono whitespace-pre-wrap text-zinc-700 dark:text-zinc-300 p-4'>
                  {execution.logs}
                </pre>
              ) : (
                <p className='text-xs text-zinc-400 italic p-4'>
                  No logs available yet...
                </p>
              )}
            </div>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  )
}
