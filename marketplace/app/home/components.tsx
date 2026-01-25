'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FaRegSmile, FaLanguage, FaGithub } from 'react-icons/fa'

import {
  MdStart,
  MdSettings,
  MdTerminal,
  MdDataObject,
  MdContentCopy,
} from 'react-icons/md'

import { Execution, ExecutionResponse } from '@/types/execution'

import {
  LogViewer,
  stripAnsi,
  CodeEditor,
  getStatusEmoji,
  JsonHighlighter,
  CollapsibleSection,
} from './ui'

export const AGENTS = [
  {
    id: 'agent-1',
    name: 'Dynamic Agent Repo',
    type: 'custom-git-agent',
    icon: <FaGithub size={24} />,
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

export function AgentCard({
  agent,
  onRun,
}: {
  agent: (typeof AGENTS)[0]
  onRun?: (executionId: string) => void
}) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ExecutionResponse | null>(null)
  const [activeTab, setActiveTab] = useState<'config' | 'result'>('config')
  const [repo, setRepo] = useState(
    'https://github.com/PrimeTimeTran/agent-job-2',
  )
  const [configJson, setConfigJson] = useState(
    JSON.stringify(
      {
        pythonVersion: '3.12',
        env: {
          API_KEY: '123-abc',
          CUSTOM_VAR: 'Hello from UI',
          ENABLE_LOG_TIMESTAMPS: true,
        },
        args: ['--verbose', '--dry-run'],
      },
      null,
      2,
    ),
  )

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
      console.log({ data })
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
    <div className='w-80 h-150 shrink-0 snap-center rounded-xl bg-surface p-5 shadow-sm border border-outline-variant flex flex-col'>
      <div className='flex items-center gap-3 mb-3'>
        <div className='p-2 rounded-lg bg-surface-variant text-on-surface'>
          {agent.icon}
        </div>
        <div>
          <h3 className='font-semibold text-sm text-on-surface'>
            {agent.name}
          </h3>
          <p className='text-xs text-on-surface-variant'>{agent.type}</p>
        </div>
      </div>

      <p className='text-xs text-on-surface-variant mb-4 h-8'>
        {agent.description}
      </p>

      <div className='flex gap-2 mb-4 border-b border-outline-variant min-h-8.25'>
        <button
          onClick={() => setActiveTab('config')}
          className={`px-3 py-1.5 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'config'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Config
        </button>
        {result && (
          <button
            onClick={() => setActiveTab('result')}
            className={`px-3 py-1.5 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'result'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Result
          </button>
        )}
      </div>

      <div className='space-y-3 flex-1 overflow-y-auto min-h-50'>
        {activeTab === 'config' ? (
          <>
            {agent.type == 'custom-git-agent' && (
              <div>
                <label className='text-xs font-medium text-on-surface-variant mb-1 block'>
                  Repo
                </label>
                <input
                  type='text'
                  placeholder={agent.placeholder}
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  className='w-full rounded-md border border-outline px-3 py-1.5 text-xs bg-surface text-on-surface placeholder:text-on-surface-variant/50'
                />
              </div>
            )}
            <div>
              <label className='text-xs font-medium text-on-surface-variant mb-1 block'>
                Configuration (JSON)
              </label>
              <CodeEditor
                value={configJson}
                onChange={setConfigJson}
                className='w-full min-h-75 rounded-md border border-outline bg-surface-variant/20'
              />
            </div>
          </>
        ) : (
          <div className='relative mt-0 overflow-hidden rounded-md bg-surface-variant/20 border border-outline-variant group'>
            <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigator.clipboard.writeText(JSON.stringify(result, null, 2))
                }}
                className='p-1.5 bg-surface/80 backdrop-blur-sm text-on-surface-variant hover:text-on-surface rounded border border-outline shadow-sm'
                title='Copy result'
              >
                <MdContentCopy size={14} />
              </button>
            </div>
            <JsonHighlighter data={result} />
          </div>
        )}
      </div>

      <div className='mt-4 flex gap-2 pt-4 border-t border-outline-variant'>
        <Link
          href={`/agent?name=${agent.type}`}
          className='flex items-center justify-center rounded-md border border-outline px-3 py-1.5 text-xs font-medium text-on-surface hover:bg-surface-variant transition-colors'
        >
          View
        </Link>
        <button
          onClick={runJob}
          disabled={loading}
          className='flex-1 flex items-center justify-center gap-1.5 rounded-md bg-on-surface px-3 py-1.5 text-xs font-medium text-surface hover:bg-on-surface/90 disabled:opacity-50 transition-colors'
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
  const selectedExecution = executions.find((ex) => ex.id === selectedId)

  return (
    <div className='grid gap-2'>
      <label className='text-sm font-medium text-on-surface'>
        Select Execution
      </label>
      <div className='flex gap-2 mb-2'>
        <select
          className='flex-1 rounded-md border border-outline px-3 py-2 text-sm bg-surface text-on-surface font-mono'
          value={selectedId ?? ''}
          onChange={(e) => onSelect(e.target.value)}
        >
          <option
            value=''
            className='bg-surface text-on-surface'
          >
            {executions.length === 0
              ? 'No executions found'
              : 'Select an execution to view logs'}
          </option>
          {executions
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((ex, i) => {
              const time = new Date(ex.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })
              return (
                <option
                  key={ex.id}
                  value={ex.id}
                >
                  {getStatusEmoji(ex.status)} {i + 1}.{' '}
                  {ex.id.replace('job-exec-', '')} —{' '}
                  {ex.payload?.agent || 'Unknown'} ({time})
                </option>
              )
            })}
        </select>
        {selectedExecution && (
          <span
            className={`flex items-center rounded-full px-3 text-xs font-semibold border shrink-0 ${
              selectedExecution.status === 'completed'
                ? 'bg-success-container text-on-success-container border-success/20'
                : selectedExecution.status === 'failed'
                  ? 'bg-error-container text-on-error-container border-error/20'
                  : selectedExecution.status === 'running'
                    ? 'bg-warning-container text-on-warning-container border-warning/20 animate-pulse'
                    : 'bg-info-container text-on-info-container border-info/20'
            }`}
          >
            {selectedExecution.status.toUpperCase()}
          </span>
        )}
      </div>
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
    <div className='rounded-md border border-outline-variant bg-surface-variant/20'>
      <div className='p-4'>
        <CollapsibleSection
          title='Payload'
          icon={MdDataObject}
          contentToCopy={JSON.stringify(execution.payload, null, 2)}
        >
          <JsonHighlighter data={execution.payload} />
        </CollapsibleSection>

        <CollapsibleSection
          title='Job Config (Resolved)'
          icon={MdSettings}
          contentToCopy={JSON.stringify(execution.jobConfig || {}, null, 2)}
        >
          <JsonHighlighter data={execution.jobConfig || {}} />
        </CollapsibleSection>

        <CollapsibleSection
          title='Logs'
          icon={MdTerminal}
          defaultOpen={true}
          contentToCopy={execution.logs ? stripAnsi(execution.logs) : ''}
        >
          <div className='relative h-1/4 resize-y overflow-hidden min-h-25 flex flex-col'>
            <div className='flex-1 overflow-y-auto bg-surface p-0'>
              <LogViewer logs={execution.logs} />
            </div>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  )
}
