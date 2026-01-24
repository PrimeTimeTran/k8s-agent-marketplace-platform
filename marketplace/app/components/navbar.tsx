import Link from 'next/link'

export function Navbar() {
  return (
    <nav className='w-full border-b border-zinc-200 dark:border-zinc-800'>
      <div className='mx-auto max-w-6xl px-6 h-16 flex items-center justify-between'>
        <Link href='/'>
          <div className='font-semibold'>AI Agent Marketplace</div>
        </Link>

        <div className='flex gap-6'>
          <a>New Releases</a>
          <a>Favorites</a>
          <a>Account</a>
        </div>
      </div>
    </nav>
  )
}
