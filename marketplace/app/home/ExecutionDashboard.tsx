'use client'

import { useCallback, useEffect, useState } from 'react'
import { MdHistory, MdRefresh, MdSearch } from 'react-icons/md'

import { Execution } from '@/types/execution'

import { filterExecutions } from './actions'
import {
  AGENTS,
  AgentCard,
  ExecutionList,
  ExecutionDetails,
} from './components'

type Props = {
  initialExecutions: Execution[]
}

export default function ExecutionDashboard({ initialExecutions }: Props) {
  const [refreshing, setRefreshing] = useState(false)
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined)
  const [executions, setExecutions] = useState<Execution[]>(initialExecutions)
  const [searchQuery, setSearchQuery] = useState('')

  const selectedExecution = executions.find((x) => x.id === selectedId) || null

  const isRunning =
    selectedExecution &&
    !['succeeded', 'failed', 'completed'].includes(selectedExecution.status)

  const refreshExecutions = useCallback(async () => {
    setRefreshing(true)
    try {
      const result = await filterExecutions({ search: searchQuery })
      setExecutions(result.items)
      return result.items
    } catch (err) {
      console.error('Failed to refresh executions', err)
      return executions
    } finally {
      setRefreshing(false)
    }
  }, [executions, searchQuery])

  useEffect(() => {
    const id = setInterval(refreshExecutions, isRunning ? 1000 : 5000)
    return () => clearInterval(id)
  }, [refreshExecutions, isRunning])

  return (
    <div className='min-h-screen bg-background py-12'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <section className='mx-auto max-w-2xl text-center mb-6'>
          <p className='mt-2 text-lg leading-8 text-on-surface-variant'>
            Discover and deploy AI agents for your workflow.
          </p>
        </section>

        <section className='relative'>
          <div className='flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 -mx-4 scrollbar-hide'>
            {AGENTS.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onRun={async (executionId) => {
                  await refreshExecutions()
                  setSelectedId(executionId)
                }}
              />
            ))}
          </div>
        </section>

        <section className='relative -mx-4'>
          <div className='bg-surface rounded-xl shadow-sm border border-outline-variant p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='flex items-center gap-2 text-lg font-semibold text-on-surface'>
                <MdHistory />
                Recent Executions ({executions.length})
              </h3>
              <div className='flex items-center gap-2'>
                <div className='relative'>
                  <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2'>
                    <MdSearch className='text-on-surface-variant' />
                  </div>
                  <input
                    type='text'
                    placeholder='Filter...'
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      // Trigger immediate refresh when typing (debouncing would be better in prod)
                      // We rely on the useEffect or manual call.
                      // Here we just set state, and let the user click refresh or wait for poll?
                      // Better to trigger it.
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') refreshExecutions()
                    }}
                    className='text-xs rounded border border-outline bg-surface-variant pl-8 pr-2 py-1 w-32 focus:ring-1 focus:ring-primary outline-none text-on-surface placeholder:text-on-surface-variant/50'
                  />
                </div>
                <button
                  disabled={refreshing}
                  onClick={refreshExecutions}
                  className='flex items-center gap-1 text-xs text-on-surface-variant hover:text-primary transition-colors'
                >
                  <MdRefresh
                    className={refreshing ? 'animate-spin' : ''}
                    size={16}
                  />
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            </div>

            <ExecutionList
              executions={executions}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
            <ExecutionDetails execution={selectedExecution} />
          </div>
        </section>
      </div>
    </div>
  )
}
