import { FaRobot, FaCheck } from 'react-icons/fa'
import { DeployForm } from './DeployForm'

function Hero() {
  return (
    <section className='relative overflow-hidden bg-surface border-b border-outline-variant'>
      <div
        aria-hidden='true'
        className='absolute inset-0 -z-10 bg-gradient-to-br from-primary-container/20 via-surface to-secondary-container/20'
      />

      <div className='mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8'>
        <div className='flex flex-col lg:flex-row items-center gap-12'>
          <div className='flex-1 text-center lg:text-left'>
            <div className='mb-6 flex justify-center lg:justify-start gap-2'>
              <span className='inline-flex items-center rounded-full bg-primary-container px-2 py-1 text-xs font-medium text-on-primary-container ring-1 ring-inset ring-on-primary-container/10'>
                NLP
              </span>
              <span className='inline-flex items-center rounded-full bg-success-container px-2 py-1 text-xs font-medium text-on-success-container ring-1 ring-inset ring-on-success-container/20'>
                v1.2.0
              </span>
            </div>
            <h1 className='text-4xl font-bold tracking-tight text-on-surface sm:text-6xl mb-6'>
              Sentiment Analysis
            </h1>
            <p className='text-lg leading-8 text-on-surface-variant mb-8'>
              Accurately determine the emotional tone behind a series of words.
              Used to gain an understanding of the attitudes, opinions and
              emotions expressed within an online mention.
            </p>
            <div className='flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4'>
              <DeployForm />
              <button className='w-full sm:w-auto rounded-md bg-surface px-6 py-3 text-sm font-semibold text-on-surface shadow-sm ring-1 ring-inset ring-outline-variant hover:bg-surface-variant transition-colors'>
                View API Reference
              </button>
            </div>
          </div>
          <div className='flex-1 w-full max-w-md lg:max-w-full'>
            <div className='aspect-square rounded-2xl bg-surface-variant/30 border border-outline-variant flex items-center justify-center shadow-xl'>
              <FaRobot
                size={120}
                className='text-on-surface-variant/50'
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
    <div className='border rounded-lg p-6 bg-surface shadow-sm border-outline-variant'>
      <h3 className='font-semibold text-on-surface mb-2'>{title}</h3>
      <p className='text-sm text-on-surface-variant'>{description}</p>
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
    <div className='min-h-screen bg-background'>
      <Hero />

      <main className='mx-auto max-w-7xl px-6 py-12 lg:px-8 space-y-16'>
        {/* About Section */}
        <section>
          <h2 className='text-2xl font-bold tracking-tight text-on-surface mb-6'>
            About this Agent
          </h2>
          <div className='prose max-w-none text-on-surface-variant'>
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
          <h2 className='text-2xl font-bold tracking-tight text-on-surface mb-6'>
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
          <div className='bg-surface rounded-xl shadow-sm border border-outline-variant p-8'>
            <h2 className='text-2xl font-bold tracking-tight text-on-surface mb-4'>
              Pricing
            </h2>
            <div className='space-y-4'>
              <div className='flex justify-between items-baseline border-b border-outline-variant pb-4'>
                <span className='text-on-surface-variant'>Per 1k requests</span>
                <span className='text-2xl font-bold text-on-surface'>
                  $0.002
                </span>
              </div>
              <div className='flex justify-between items-baseline border-b border-outline-variant pb-4'>
                <span className='text-on-surface-variant'>Input tokens</span>
                <span className='text-lg font-medium text-on-surface'>
                  Free
                </span>
              </div>
              <div className='flex justify-between items-baseline pb-4'>
                <span className='text-on-surface-variant'>
                  Dedicated instance
                </span>
                <span className='text-lg font-medium text-on-surface'>
                  $50/mo
                </span>
              </div>
            </div>
          </div>
          <div className='bg-surface rounded-xl shadow-sm border border-outline-variant p-8'>
            <h2 className='text-2xl font-bold tracking-tight text-on-surface mb-4'>
              Quotas & Limits
            </h2>
            <ul className='space-y-4 text-on-surface-variant'>
              <li className='flex items-center gap-3'>
                <FaCheck className='text-success' />
                100 concurrent requests
              </li>
              <li className='flex items-center gap-3'>
                <FaCheck className='text-success' />
                1,000,000 requests per day
              </li>
              <li className='flex items-center gap-3'>
                <FaCheck className='text-success' />
                99.9% uptime SLA
              </li>
              <li className='flex items-center gap-3'>
                <FaCheck className='text-success' />
                24/7 Support
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}
