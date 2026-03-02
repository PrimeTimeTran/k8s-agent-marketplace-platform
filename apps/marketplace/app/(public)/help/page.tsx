'use client'

import {
  Search,
  HelpCircle,
  MessageCircle,
  Mail,
  FileText,
  CreditCard,
  User,
  Shield,
  Zap,
  ArrowRight,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const FAQ_CATEGORIES = [
  {
    icon: User,
    title: 'Account & Profile',
    articles: [
      'Managing your profile',
      'Two-factor authentication',
      'Deleting your account',
    ],
  },
  {
    icon: CreditCard,
    title: 'Billing & Subscriptions',
    articles: ['Updating payment methods', 'Invoice history', 'Refund policy'],
  },
  {
    icon: Zap,
    title: 'Platform Usage',
    articles: [
      'Creating your first agent',
      'Understanding quotas',
      'Best practices',
    ],
  },
  {
    icon: Shield,
    title: 'Security & Privacy',
    articles: ['Data protection', 'GDPR compliance', 'API security'],
  },
]

export default function HelpPage() {
  return (
    <div className='min-h-screen bg-background'>
      {/* Hero Search Section */}
      <section className='bg-surface-variant/20 border-b border-outline-variant py-20 px-6'>
        <div className='container mx-auto max-w-4xl text-center space-y-8'>
          <h1 className='text-4xl font-bold text-on-surface'>
            How can we help you?
          </h1>
          <div className='relative max-w-2xl mx-auto'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant' />
            <Input
              className='h-14 pl-12 text-lg bg-surface shadow-2xl border focus:border-primary rounded-full'
              placeholder='Search for answers...'
            />
          </div>
          <div className='flex items-center justify-center gap-2 text-sm text-on-surface-variant'>
            <span>Popular:</span>
            <button className='hover:text-primary hover:underline'>
              API Keys
            </button>
            <span>•</span>
            <button className='hover:text-primary hover:underline'>
              Billing
            </button>
            <span>•</span>
            <button className='hover:text-primary hover:underline'>
              Webhooks
            </button>
          </div>
        </div>
      </section>

      <div className='container mx-auto max-w-6xl px-6 py-16 space-y-16'>
        {/* Categories Grid */}
        <section>
          <h2 className='text-2xl font-semibold mb-8 text-on-surface'>
            Browse by Topic
          </h2>
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {FAQ_CATEGORIES.map((cat, i) => (
              <div
                key={i}
                className='p-6 rounded-xl border border-outline-variant bg-surface hover:border-primary/50 transition-all duration-300 hover:shadow-md group cursor-pointer'
              >
                <div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform'>
                  <cat.icon className='w-6 h-6' />
                </div>
                <h3 className='font-semibold text-lg mb-4'>{cat.title}</h3>
                <ul className='space-y-2'>
                  {cat.articles.map((article, j) => (
                    <li
                      key={j}
                      className='text-sm text-on-surface-variant hover:text-primary flex items-center gap-2'
                    >
                      <div className='w-1 h-1 rounded-full bg-current opacity-50' />
                      {article}
                    </li>
                  ))}
                </ul>
                <div className='mt-4 pt-4 border-t border-outline-variant/50 text-sm font-medium text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                  View all <ArrowRight className='w-4 h-4' />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Support Banner */}
        <section className='bg-surface rounded-2xl border border-outline-variant p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden'>
          <div className='absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2' />

          <div className='space-y-4 relative z-10 text-center md:text-left'>
            <h2 className='text-2xl font-bold'>Still need help?</h2>
            <p className='text-on-surface-variant max-w-lg'>
              Our support team is available 24/7 to assist you with any issues
              or questions you might have about the platform.
            </p>
          </div>

          <div className='flex flex-col sm:flex-row gap-4 relative z-10'>
            <Button
              size='lg'
              className='gap-2'
            >
              <MessageCircle className='w-4 h-4' />
              Chat with Support
            </Button>
            <Button
              size='lg'
              variant='outline'
              className='gap-2'
            >
              <Mail className='w-4 h-4' />
              Email Us
            </Button>
          </div>
        </section>

        {/* Community Section */}
        <section className='text-center space-y-6'>
          <h2 className='text-2xl font-semibold'>Join the Community</h2>
          <p className='text-on-surface-variant max-w-2xl mx-auto'>
            Connect with other developers, share your projects, and get help
            from the community.
          </p>
          <div className='grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto'>
            {[
              { label: 'Discord Community', count: '5.2k Members' },
              { label: 'GitHub Discussions', count: '1.8k Threads' },
              { label: 'Stack Overflow', count: '500+ Solutions' },
            ].map((item, i) => (
              <div
                key={i}
                className='p-4 rounded-lg bg-surface-variant/20 border border-outline-variant'
              >
                <div className='font-semibold'>{item.label}</div>
                <div className='text-sm text-on-surface-variant'>
                  {item.count}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
