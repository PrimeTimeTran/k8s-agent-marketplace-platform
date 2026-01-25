'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export function Navbar() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <nav className='w-full border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black transition-colors duration-300'>
      <div className='mx-auto max-w-6xl px-6 h-16 flex items-center justify-between'>
        <Link href='/'>
          <div className='font-semibold text-zinc-900 dark:text-zinc-100'>
            AI Agent Marketplace
          </div>
        </Link>

        <div className='flex items-center gap-6'>
          <a
            href='/design-kit'
            className='text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
          >
            Design Kit
          </a>

          {mounted && (
            <button
              onClick={toggleTheme}
              className='relative rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors'
              aria-label='Toggle theme'
            >
              <Sun className='h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500' />
              <Moon className='absolute top-2 left-2 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-indigo-400' />
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
