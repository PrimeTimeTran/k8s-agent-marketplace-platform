'use client'

import Link from 'next/link'
import { Zap, Code, Check, Shield, Activity, ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { CodeWindow } from '@/components/code-window'

const code = `import { Agent } from '@platform/sdk'

const agent = new Agent({
  name: 'support-bot',
  model: 'gpt-4',
  tools: [search, database],
})

export default agent`

export default function LandingPage() {
  return (
    <div className='flex flex-col min-h-screen bg-background'>
      <section className='relative pt-20 pb-32 overflow-hidden'>
        <div className='container mx-auto px-6 relative z-10'>
          <div className='flex flex-col items-center text-center max-w-4xl mx-auto space-y-8'>
            <div className='inline-flex items-center rounded-full border border-outline-variant px-3 py-1 text-sm font-medium text-primary bg-surface-variant/50 backdrop-blur-sm'>
              <span className='flex h-2 w-2 rounded-full bg-primary mr-2'></span>
              Now in Public Beta
            </div>
            <h1 className='text-5xl md:text-7xl font-bold tracking-tight text-on-surface'>
              The Next Generation <br />
              <span className='text-primary'>AI Agent Platform</span>
            </h1>
            <p className='text-xl text-on-surface-variant max-w-2xl'>
              Build, deploy, and manage autonomous agents with ease. A complete
              marketplace and control plane for the AI era.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 pt-4'>
              <Link href='/home'>
                <Button
                  size='lg'
                  className='rounded-full h-12 px-8 text-base'
                >
                  Get Started <ArrowRight className='ml-2 w-4 h-4' />
                </Button>
              </Link>
              <Link href='/docs'>
                <Button
                  variant='outline'
                  size='lg'
                  className='rounded-full h-12 px-8 text-base'
                >
                  View Documentation
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 pointer-events-none'>
          <div className='absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl' />
          <div className='absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl' />
        </div>
      </section>

      <section className='py-24 bg-surface-variant/5 border-y border-outline-variant/50'>
        <div className='container mx-auto px-6'>
          <div className='text-center mb-16 max-w-2xl mx-auto'>
            <h2 className='text-3xl font-bold mb-4 text-on-surface'>
              Everything you need to ship
            </h2>
            <p className='text-on-surface-variant'>
              Comprehensive tools and infrastructure designed for modern AI
              development workflows.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {[
              {
                icon: Zap,
                title: 'Instant Deployment',
                desc: 'Deploy your agents to a global edge network in seconds, not minutes.',
              },
              {
                icon: Shield,
                title: 'Enterprise Security',
                desc: 'Bank-grade encryption, SOC2 compliance, and granular access controls built-in.',
              },
              {
                icon: Activity,
                title: 'Real-time Observability',
                desc: 'Monitor execution logs, traces, and metrics in real-time as they happen.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className='bg-surface p-8 rounded-2xl border border-outline-variant hover:border-primary/50 transition-all hover:shadow-lg group'
              >
                <div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform'>
                  <feature.icon className='w-6 h-6' />
                </div>
                <h3 className='text-xl font-bold mb-3 text-on-surface'>
                  {feature.title}
                </h3>
                <p className='text-on-surface-variant leading-relaxed'>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='py-24 bg-background overflow-hidden'>
        <div className='container mx-auto px-6'>
          <div className='flex flex-col md:flex-row gap-16 items-center'>
            <div className='flex-1 space-y-8'>
              <div className='inline-flex items-center rounded-lg bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary'>
                <Code className='w-4 h-4 mr-2' />
                Developer Experience
              </div>
              <h2 className='text-4xl font-bold text-on-surface leading-tight'>
                Built by developers, <br />
                for developers.
              </h2>
              <p className='text-lg text-on-surface-variant'>
                We've obsessed over every detail of the developer experience.
                From our type-safe SDKs to our intuitive CLI, everything is
                designed to keep you in the flow.
              </p>
              <ul className='space-y-4 pt-2'>
                {[
                  'TypeScript & Python SDKs',
                  'Local development simulation',
                  'Git-based workflow integration',
                  'Automated versioning & rollbacks',
                ].map((item) => (
                  <li
                    key={item}
                    className='flex items-center gap-3 text-on-surface'
                  >
                    <div className='w-6 h-6 rounded-full bg-success/20 flex items-center justify-center text-success shrink-0'>
                      <Check className='w-3.5 h-3.5' />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className='flex-1 w-full relative'>
              <div className='absolute -inset-4 bg-linear-to-r from-primary/20 to-secondary/20 rounded-3xl blur-2xl opacity-50' />
              <CodeWindow
                filename='agent.ts'
                code={code}
              />
            </div>
          </div>
        </div>
      </section>

      <section className='py-24 bg-primary text-on-primary relative overflow-hidden'>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150"></div>
        <div className='container mx-auto px-6 relative z-10'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12'>
            {[
              { label: 'Active Agents', value: '10k+' },
              { label: 'Daily Executions', value: '2.5M' },
              { label: 'Uptime SLA', value: '99.9%' },
              { label: 'Global Regions', value: '12' },
            ].map((stat, i) => (
              <div
                key={i}
                className='flex flex-col items-center justify-center text-center'
              >
                <div className='text-4xl md:text-6xl font-bold mb-2 tracking-tight opacity-90'>
                  {stat.value}
                </div>
                <div className='text-on-primary/80 font-medium text-lg'>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='py-32 bg-background'>
        <div className='container mx-auto px-6'>
          <div className='bg-surface-variant/10 rounded-3xl border border-outline-variant p-12 md:p-24 text-center relative overflow-hidden'>
            <div className='relative z-10 space-y-8'>
              <h2 className='text-4xl md:text-5xl font-bold text-on-surface'>
                Ready to build the future?
              </h2>
              <p className='text-xl text-on-surface-variant max-w-2xl mx-auto'>
                Join thousands of developers building the next generation of
                intelligent applications on our platform.
              </p>
              <div className='flex flex-col sm:flex-row justify-center gap-4'>
                <Link href='/home'>
                  <Button
                    size='lg'
                    className='rounded-full h-14 px-8 text-lg'
                  >
                    Start Building Now
                  </Button>
                </Link>
                <Link href='/contact'>
                  <Button
                    variant='outline'
                    size='lg'
                    className='rounded-full h-14 px-8 text-lg'
                  >
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>

            <div className='absolute overflow-hidden pointer-events-none'>
              <div className='absolute -top-[50%] -left-[10%] w-[50%] h-full bg-primary/5 blur-3xl rounded-full' />
              <div className='absolute -bottom-[50%] -right-[10%] rounded-full' />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
