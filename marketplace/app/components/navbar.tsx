export function Navbar() {
  return (
    <nav className='w-full border-b border-zinc-200 dark:border-zinc-800'>
      <div className='mx-auto max-w-6xl px-6 h-16 flex items-center justify-between'>
        <div className='font-semibold'>MyApp</div>

        <div className='flex gap-6'>
          <a>Docs</a>
          <a>Pricing</a>
        </div>
      </div>
    </nav>
  )
}
