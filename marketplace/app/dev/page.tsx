'use client'

import { MdHistory, MdRefresh } from 'react-icons/md'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AGENTS,
  AgentCard,
  Execution,
  ExecutionList,
  ExecutionDetails,
} from './components'

export default function Dev() {
  const [executions, setExecutions] = useState<Execution[]>([])
  const [selectedExecution, setSelectedExecution] = useState<Execution | null>(
    null,
  )
  const [loadingExecutions, setLoadingExecutions] = useState(false)

  const selectedIdRef = useRef<string | null>(null)

  useEffect(() => {
    selectedIdRef.current = selectedExecution?.id ?? null
  }, [selectedExecution])

  const loadExecutions = useCallback(async () => {
    setLoadingExecutions(true)
    try {
      const res = await fetch('/api/executions', { cache: 'no-store' })
      const data = await res.json()
      const list = Array.isArray(data) ? data : (data?.executions ?? [])
      setExecutions(list)

      setSelectedExecution((prev) => {
        if (!prev) return null
        const updated = list.find((x: Execution) => x.id === prev.id)
        return updated || prev
      })

      return list
    } catch (e) {
      console.error(e)
      return []
    } finally {
      setLoadingExecutions(false)
    }
  }, [])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    let isMounted = true

    const loop = async () => {
      const list = await loadExecutions()

      if (!isMounted) return

      let intervalMs = 5000
      const currentId = selectedIdRef.current
      if (currentId) {
        const ex = list.find((x: Execution) => x.id === currentId)
        if (
          ex &&
          ex.status !== 'succeeded' &&
          ex.status !== 'failed' &&
          ex.status !== 'completed'
        ) {
          intervalMs = 1000
        }
      }

      timeoutId = setTimeout(loop, intervalMs)
    }

    loop()

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
  }, [loadExecutions])

  return (
    <div className='min-h-screen bg-zinc-50 dark:bg-black py-12'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <section className='mx-auto max-w-2xl text-center mb-6'>
          <h2 className='text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white'>
            Marketplace
          </h2>
          <p className='mt-2 text-lg leading-8 text-zinc-600 dark:text-zinc-400'>
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
                  const list = await loadExecutions()
                  const newExec = list.find(
                    (x: Execution) => x.id === executionId,
                  )
                  if (newExec) {
                    setSelectedExecution(newExec)
                  }
                }}
              />
            ))}
          </div>
        </section>

        <section className='relative -mx-4'>
          <div className='bg-white rounded-xl shadow-sm border border-zinc-200 p-6 dark:bg-zinc-900 dark:border-zinc-800'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-white'>
                <MdHistory />
                Recent Executions
              </h3>
              <button
                onClick={() => loadExecutions()}
                disabled={loadingExecutions}
                className='flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors'
              >
                <MdRefresh
                  className={loadingExecutions ? 'animate-spin' : ''}
                  size={16}
                />
                {loadingExecutions ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            <ExecutionList
              executions={executions}
              selectedId={selectedExecution?.id}
              onSelect={(id) => {
                const ex = executions.find((x: Execution) => x.id === id)
                setSelectedExecution(ex ?? null)
              }}
            />
            <ExecutionDetails execution={selectedExecution} />
          </div>
        </section>
      </div>
    </div>
  )
}
