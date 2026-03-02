import { MdDataObject, MdSettings, MdTerminal } from 'react-icons/md'

import { Execution } from '@/types/execution'
import { CollapsibleSection, JsonHighlighter, LogViewer, stripAnsi } from './ui'

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
