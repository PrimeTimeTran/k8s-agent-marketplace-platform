'use client'

import React, { useState, useRef } from 'react'
import {
  MdCheck,
  MdExpandMore,
  MdExpandLess,
  MdContentCopy,
} from 'react-icons/md'

import { ExecutionStatus } from '@/types/execution'

function useSelectionTrap<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)

  const handleKeyDown = (e: React.KeyboardEvent<T>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
      e.preventDefault()

      if (ref.current) {
        const selection = window.getSelection()
        const range = document.createRange()

        range.selectNodeContents(ref.current)
        selection?.removeAllRanges()
        selection?.addRange(range)
      }
    }
  }

  return {
    ref,
    tabIndex: 0,
    onKeyDown: handleKeyDown,
  }
}

export function stripAnsi(text: string) {
  return text.replace(/\x1b\[[0-9;]*m/g, '')
}

export function JsonHighlighter({
  data,
  jsonString,
  className = 'text-xs font-mono overflow-auto p-4',
}: {
  data?: unknown
  jsonString?: string
  className?: string
}) {
  const { ref, tabIndex, onKeyDown } = useSelectionTrap<HTMLPreElement>()
  const json = jsonString ?? JSON.stringify(data, null, 2)
  if (!json) return null

  const html = json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = 'text-amber-600 dark:text-amber-400'
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'text-blue-600 dark:text-blue-400 font-semibold'
        } else {
          cls = 'text-emerald-600 dark:text-emerald-400'
        }
      } else if (/true|false/.test(match)) {
        cls = 'text-purple-600 dark:text-purple-400'
      } else if (/null/.test(match)) {
        cls = 'text-zinc-500 dark:text-zinc-500'
      }
      return `<span class="${cls}">${match}</span>`
    },
  )

  return (
    <pre
      ref={ref}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
      className={`${className} outline-none focus:ring-1 focus:ring-primary/50 rounded`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export function CodeEditor({
  value,
  onChange,
  className,
}: {
  value: string
  onChange: (val: string) => void
  className?: string
}) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  return (
    <div className={`relative ${className}`}>
      <div
        ref={wrapperRef}
        className='absolute inset-0 pointer-events-none p-3 overflow-hidden font-mono text-xs'
        aria-hidden='true'
      >
        <JsonHighlighter
          jsonString={value}
          className='m-0 p-0 whitespace-pre text-xs font-mono'
        />
      </div>
      <textarea
        value={value}
        spellCheck={false}
        onChange={(e) => onChange(e.target.value)}
        onScroll={(e) => {
          if (wrapperRef.current) {
            wrapperRef.current.scrollTop = e.currentTarget.scrollTop
            wrapperRef.current.scrollLeft = e.currentTarget.scrollLeft
          }
        }}
        className='absolute inset-0 w-full h-full bg-transparent text-transparent caret-primary p-3 font-mono text-xs resize-none focus:outline-none border-none whitespace-pre overflow-auto'
      />
    </div>
  )
}

export function AnsiToHtml({ text }: { text: string }) {
  if (!text) return null

  // Split by escape codes
  const parts = text.split(/(\x1b\[\d+m)/g)

  let currentColor = 'text-on-surface'
  let currentDecor = ''

  const spans = []
  let i = 0

  for (const part of parts) {
    if (!part) continue

    if (part.match(/^\x1b\[\d+m$/)) {
      const code = part.match(/\d+/)?.[0]
      switch (code) {
        case '0':
          currentColor = 'text-on-surface'
          currentDecor = ''
          break
        case '1':
          currentDecor += ' font-bold'
          break
        case '4':
          currentDecor += ' underline'
          break
        case '90':
          currentColor = 'text-zinc-400 dark:text-zinc-500'
          break
        case '91':
          currentColor = 'text-red-500'
          break
        case '92':
          currentColor = 'text-green-500'
          break
        case '93':
          currentColor = 'text-yellow-500'
          break
        case '94':
          currentColor = 'text-blue-500'
          break
        case '95':
          currentColor = 'text-purple-500'
          break
        case '96':
          currentColor = 'text-cyan-500'
          break
      }
    } else {
      spans.push(
        <span
          key={i++}
          className={`${currentColor} ${currentDecor}`}
        >
          {part}
        </span>,
      )
    }
  }

  return <>{spans}</>
}

export function LogViewer({ logs }: { logs: string }) {
  const { ref, tabIndex, onKeyDown } = useSelectionTrap()

  if (!logs)
    return (
      <p className='text-xs text-on-surface-variant italic p-4'>
        No logs available yet...
      </p>
    )

  const lineCount = logs.split('\n').length

  return (
    <div className='flex text-xs font-mono bg-surface p-4 min-h-full'>
      <div className='flex-none text-right pr-4 text-on-surface-variant/50 select-none border-r border-outline-variant mr-4'>
        {Array.from({ length: lineCount }).map((_, i) => (
          <div
            key={i}
            className='leading-relaxed'
          >
            {i + 1}
          </div>
        ))}
      </div>
      <div
        ref={ref as any}
        tabIndex={tabIndex}
        onKeyDown={onKeyDown}
        className='flex-1 whitespace-pre overflow-x-auto leading-relaxed outline-none focus:ring-1 focus:ring-primary/50 rounded'
      >
        <AnsiToHtml text={logs} />
      </div>
    </div>
  )
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  contentToCopy,
  icon: Icon,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  contentToCopy?: string
  icon?: React.ComponentType<{ className?: string }>
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
    <div className='border rounded-md border-outline-variant bg-surface overflow-hidden mb-1'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='w-full px-4 py-2 flex items-center justify-between text-xs font-semibold text-on-surface bg-surface-variant hover:bg-surface-variant/80 transition-colors'
      >
        <span className='flex items-center gap-2'>
          {isOpen ? <MdExpandLess size={16} /> : <MdExpandMore size={16} />}
          {Icon && <Icon className='text-on-surface-variant' />}
          {title}
        </span>
        {contentToCopy && (
          <div
            onClick={handleCopy}
            className='flex items-center gap-1 px-2 py-1 -my-1 text-on-surface-variant hover:text-on-surface rounded hover:bg-surface-variant/50 transition-colors'
            title='Copy content'
          >
            {copied ? (
              <>
                <MdCheck
                  size={14}
                  className='text-success'
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
        <div className='border-t border-outline-variant'>{children}</div>
      )}
    </div>
  )
}

export function getStatusEmoji(status: ExecutionStatus): string {
  switch (status) {
    case 'scheduled':
      return '🔵'
    case 'running':
      return '🌕'
    case 'completed':
      return '🟢'
    case 'failed':
      return '🔴'
  }
}
