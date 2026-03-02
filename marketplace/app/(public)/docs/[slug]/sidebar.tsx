'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, ChevronRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const SIDEBAR_ITEMS = [
  {
    title: 'Getting Started',
    items: [
      { href: '/docs/introduction', label: 'Introduction' },
      { href: '/docs/quickstart', label: 'Quickstart Guide' },
      { href: '/docs/concepts', label: 'Core Concepts' },
    ],
  },
  {
    title: 'API Reference',
    items: [
      { href: '/docs/auth', label: 'Authentication' },
      { href: '/docs/endpoints', label: 'Endpoints' },
      { href: '/docs/errors', label: 'Error Handling' },
    ],
  },
  {
    title: 'Platform',
    items: [
      { href: '/docs/webhooks', label: 'Webhooks' },
      { href: '/docs/security', label: 'Security' },
      { href: '/docs/limits', label: 'Rate Limits' },
    ],
  },
]

export function DocsSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Toggle */}
      <div className='lg:hidden fixed bottom-6 right-6 z-50'>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className='rounded-full h-12 w-12 shadow-lg'
          size='icon'
        >
          {isOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-surface border-r border-outline-variant transform transition-transform duration-300 lg:translate-x-0 lg:static lg:h-auto lg:min-h-screen',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className='p-6'>
          <div className='font-bold text-xl mb-8 px-2'>Docs</div>
          <nav className='space-y-8'>
            {SIDEBAR_ITEMS.map((section, i) => (
              <div key={i}>
                <h4 className='font-semibold text-sm text-on-surface-variant mb-2 px-2 uppercase tracking-wider'>
                  {section.title}
                </h4>
                <ul className='space-y-0.5'>
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'block px-2 py-1.5 rounded-md text-sm transition-colors',
                          pathname === item.href
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-on-surface hover:bg-surface-variant/50 hover:text-primary',
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Backdrop */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-30 lg:hidden'
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
