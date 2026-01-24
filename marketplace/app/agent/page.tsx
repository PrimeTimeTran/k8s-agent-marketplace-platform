import { FaRobot, FaCheck } from 'react-icons/fa'
import { DeployForm } from './DeployForm'

function Hero() {
  return (
    <section className='relative overflow-hidden bg-white border-b border-gray-200'>
      <div
        aria-hidden='true'
        className='absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-cyan-50'
      />

      <div className='mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8'>
        <div className='flex flex-col lg:flex-row items-center gap-12'>
          <div className='flex-1 text-center lg:text-left'>
            <div className='mb-6 flex justify-center lg:justify-start gap-2'>
              <span className='inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10'>
                NLP
              </span>
              <span className='inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20'>
                v1.2.0
              </span>
            </div>
            <h1 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6'>
              Sentiment Analysis
            </h1>
            <p className='text-lg leading-8 text-gray-600 mb-8'>
              Accurately determine the emotional tone behind a series of words.
              Used to gain an understanding of the attitudes, opinions and
              emotions expressed within an online mention.
            </p>
            <div className='flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4'>
              <DeployForm />
              <button className='w-full sm:w-auto rounded-md bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'>
                View API Reference
              </button>
            </div>
          </div>
          <div className='flex-1 w-full max-w-md lg:max-w-full'>
            <div className='aspect-square rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center shadow-xl'>
              <FaRobot
                size={120}
                className='text-zinc-300'
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Feature({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className='border rounded-lg p-6 bg-white shadow-sm'>
      <h3 className='font-semibold text-gray-900 mb-2'>{title}</h3>
      <p className='text-sm text-gray-600'>{description}</p>
    </div>
  )
}

export default function Agent({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const name =
    typeof searchParams.name === 'string'
      ? searchParams.name
      : 'Sentiment Analysis'

  return (
    <div className='min-h-screen bg-gray-50'>
      <Hero />

      <main className='mx-auto max-w-7xl px-6 py-12 lg:px-8 space-y-16'>
        {/* About Section */}
        <section>
          <h2 className='text-2xl font-bold tracking-tight text-gray-900 mb-6'>
            About this Agent
          </h2>
          <div className='prose max-w-none text-gray-600'>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p className='mt-4'>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo.
            </p>
          </div>
        </section>

        {/* Features / Capabilities */}
        <section>
          <h2 className='text-2xl font-bold tracking-tight text-gray-900 mb-6'>
            Capabilities
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            <Feature
              title='Multi-language Support'
              description='Supports English, Spanish, French, German, and more.'
            />
            <Feature
              title='Real-time Analysis'
              description='Get results in milliseconds with our optimized inference engine.'
            />
            <Feature
              title='Batch Processing'
              description='Process millions of documents with our batch API.'
            />
          </div>
        </section>

        {/* Pricing & Quotas */}
        <section className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-8'>
            <h2 className='text-2xl font-bold tracking-tight text-gray-900 mb-4'>
              Pricing
            </h2>
            <div className='space-y-4'>
              <div className='flex justify-between items-baseline border-b border-gray-100 pb-4'>
                <span className='text-gray-600'>Per 1k requests</span>
                <span className='text-2xl font-bold text-gray-900'>$0.002</span>
              </div>
              <div className='flex justify-between items-baseline border-b border-gray-100 pb-4'>
                <span className='text-gray-600'>Input tokens</span>
                <span className='text-lg font-medium text-gray-900'>Free</span>
              </div>
              <div className='flex justify-between items-baseline pb-4'>
                <span className='text-gray-600'>Dedicated instance</span>
                <span className='text-lg font-medium text-gray-900'>
                  $50/mo
                </span>
              </div>
            </div>
          </div>
          <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-8'>
            <h2 className='text-2xl font-bold tracking-tight text-gray-900 mb-4'>
              Quotas & Limits
            </h2>
            <ul className='space-y-4 text-gray-600'>
              <li className='flex items-center gap-3'>
                <FaCheck className='text-green-500' />
                100 concurrent requests
              </li>
              <li className='flex items-center gap-3'>
                <FaCheck className='text-green-500' />
                1,000,000 requests per day
              </li>
              <li className='flex items-center gap-3'>
                <FaCheck className='text-green-500' />
                99.9% uptime SLA
              </li>
              <li className='flex items-center gap-3'>
                <FaCheck className='text-green-500' />
                24/7 Support
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}
