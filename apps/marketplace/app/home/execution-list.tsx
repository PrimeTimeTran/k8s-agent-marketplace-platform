import { Execution } from '@/types/execution'

import { getStatusEmoji } from './ui'

export function ExecutionList({
  onSelect,
  executions,
  selectedId,
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
                  suppressHydrationWarning
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
