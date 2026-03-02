'use client'

import { useState } from 'react'
import {
  User,
  CreditCard,
  Key,
  Bell,
  Shield,
  Camera,
  Plus,
  Trash2,
  Copy,
  Check,
  Download,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

const TABS = [
  {
    id: 'general',
    label: 'General',
    icon: User,
    description: 'Manage your personal details',
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: CreditCard,
    description: 'Manage your plan and invoices',
  },
  {
    id: 'api-keys',
    label: 'API Keys',
    icon: Key,
    description: 'Manage your API access tokens',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    description: 'Configure how you receive alerts',
  },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('general')

  return (
    <div className='min-h-screen bg-surface-variant/10 py-12'>
      <div className='container mx-auto px-6 max-w-6xl'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-on-surface'>Settings</h1>
          <p className='text-on-surface-variant'>
            Manage your account settings and preferences.
          </p>
        </div>

        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Sidebar Navigation */}
          <div className='w-full lg:w-64 shrink-0 space-y-2'>
            {TABS.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                    activeTab === tab.id
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface hover:bg-surface-variant text-on-surface hover:text-primary',
                  )}
                >
                  <Icon className='w-4 h-4' />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Main Content Area */}
          <div className='flex-1'>
            <div className='bg-surface border border-outline-variant rounded-xl p-6 md:p-8 shadow-sm'>
              {activeTab === 'general' && <GeneralSection />}
              {activeTab === 'billing' && <BillingSection />}
              {activeTab === 'api-keys' && <ApiKeysSection />}
              {activeTab === 'notifications' && <NotificationsSection />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function GeneralSection() {
  return (
    <div className='space-y-8 animate-in fade-in duration-500'>
      <div>
        <h2 className='text-xl font-semibold mb-1'>General Information</h2>
        <p className='text-sm text-on-surface-variant'>
          Update your profile information and public profile.
        </p>
      </div>

      <div className='flex items-center gap-6 pb-6 border-b border-outline-variant'>
        <div className='relative group cursor-pointer'>
          <div className='w-24 h-24 rounded-full bg-surface-variant flex items-center justify-center text-3xl font-bold text-primary border-2 border-surface shadow-sm overflow-hidden'>
            JD
          </div>
          <div className='absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
            <Camera className='w-6 h-6 text-white' />
          </div>
        </div>
        <div className='space-y-2'>
          <h3 className='font-medium'>Profile Picture</h3>
          <div className='flex gap-3'>
            <Button
              variant='outline'
              size='sm'
            >
              Change
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className='text-error hover:bg-error/10 hover:text-error'
            >
              Remove
            </Button>
          </div>
          <p className='text-xs text-on-surface-variant'>
            JPG, GIF or PNG. Max size of 800K
          </p>
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        <div className='space-y-2'>
          <label className='text-sm font-medium'>First Name</label>
          <Input defaultValue='John' />
        </div>
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Last Name</label>
          <Input defaultValue='Doe' />
        </div>
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Email Address</label>
          <Input
            defaultValue='john.doe@example.com'
            type='email'
          />
        </div>
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Language</label>
          <Select>
            <option>English (US)</option>
            <option>Spanish</option>
            <option>French</option>
            <option>German</option>
          </Select>
        </div>
        <div className='space-y-2 md:col-span-2'>
          <label className='text-sm font-medium'>Bio</label>
          <textarea
            className='flex min-h-[100px] w-full rounded-md border border-outline bg-surface px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-on-surface placeholder:text-on-surface-variant/50'
            defaultValue="I'm a software engineer based in San Francisco. I love building things with AI."
          />
          <p className='text-xs text-on-surface-variant'>
            Brief description for your profile. URLs are hyperlinked.
          </p>
        </div>
      </div>

      <div className='flex justify-end pt-4 border-t border-outline-variant'>
        <Button>Save Changes</Button>
      </div>
    </div>
  )
}

function BillingSection() {
  return (
    <div className='space-y-8 animate-in fade-in duration-500'>
      <div>
        <h2 className='text-xl font-semibold mb-1'>Billing & Plans</h2>
        <p className='text-sm text-on-surface-variant'>
          Manage your billing information and subscription plan.
        </p>
      </div>

      <div className='p-6 bg-surface-variant/20 rounded-xl border border-outline-variant flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2'>
            <h3 className='font-semibold text-lg'>Pro Plan</h3>
            <span className='px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold'>
              ACTIVE
            </span>
          </div>
          <p className='text-sm text-on-surface-variant'>
            $29/month, billed monthly
          </p>
          <p className='text-xs text-on-surface-variant'>
            Next billing date:{' '}
            <span className='font-medium text-on-surface'>
              February 28, 2026
            </span>
          </p>
        </div>
        <div className='flex gap-3'>
          <Button variant='outline'>Cancel Plan</Button>
          <Button>Upgrade Plan</Button>
        </div>
      </div>

      <div className='space-y-4'>
        <h3 className='font-medium text-lg'>Payment Method</h3>
        <div className='flex items-center justify-between p-4 border border-outline-variant rounded-lg bg-surface'>
          <div className='flex items-center gap-4'>
            <div className='w-12 h-8 bg-surface-variant border border-outline-variant rounded flex items-center justify-center'>
              <span className='font-bold text-xs italic text-on-surface-variant'>
                VISA
              </span>
            </div>
            <div>
              <p className='font-medium'>Visa ending in 4242</p>
              <p className='text-xs text-on-surface-variant'>Expiry 12/2028</p>
            </div>
          </div>
          <Button
            variant='ghost'
            size='sm'
          >
            Edit
          </Button>
        </div>
        <Button
          variant='outline'
          size='sm'
          className='gap-2'
        >
          <Plus className='w-4 h-4' /> Add Payment Method
        </Button>
      </div>

      <div className='space-y-4 pt-4'>
        <h3 className='font-medium text-lg'>Billing History</h3>
        <div className='border border-outline-variant rounded-lg overflow-hidden'>
          <table className='w-full text-sm text-left'>
            <thead className='bg-surface-variant/30 border-b border-outline-variant'>
              <tr>
                <th className='px-4 py-3 font-medium text-on-surface-variant'>
                  Date
                </th>
                <th className='px-4 py-3 font-medium text-on-surface-variant'>
                  Amount
                </th>
                <th className='px-4 py-3 font-medium text-on-surface-variant'>
                  Status
                </th>
                <th className='px-4 py-3 font-medium text-on-surface-variant text-right'>
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-outline-variant'>
              {[
                { date: 'Jan 28, 2026', amount: '$29.00', status: 'Paid' },
                { date: 'Dec 28, 2025', amount: '$29.00', status: 'Paid' },
                { date: 'Nov 28, 2025', amount: '$29.00', status: 'Paid' },
              ].map((invoice, i) => (
                <tr
                  key={i}
                  className='hover:bg-surface-variant/10'
                >
                  <td className='px-4 py-3'>{invoice.date}</td>
                  <td className='px-4 py-3'>{invoice.amount}</td>
                  <td className='px-4 py-3'>
                    <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success/10 text-success'>
                      {invoice.status}
                    </span>
                  </td>
                  <td className='px-4 py-3 text-right'>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-8 w-8 p-0'
                    >
                      <Download className='w-4 h-4' />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ApiKeysSection() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className='space-y-8 animate-in fade-in duration-500'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h2 className='text-xl font-semibold mb-1'>API Keys</h2>
          <p className='text-sm text-on-surface-variant'>
            Manage your API keys for accessing the platform programmatically.
          </p>
        </div>
        <Button className='gap-2'>
          <Plus className='w-4 h-4' /> Create New Key
        </Button>
      </div>

      <div className='space-y-4'>
        {[
          {
            id: '1',
            name: 'Production App',
            prefix: 'pk_live_...',
            created: '2 months ago',
            lastUsed: '2 hours ago',
          },
          {
            id: '2',
            name: 'Development',
            prefix: 'pk_test_...',
            created: '5 months ago',
            lastUsed: '5 days ago',
          },
        ].map((key) => (
          <div
            key={key.id}
            className='flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-outline-variant rounded-lg bg-surface gap-4'
          >
            <div className='space-y-1'>
              <div className='flex items-center gap-2'>
                <h3 className='font-medium'>{key.name}</h3>
                <span className='text-xs text-on-surface-variant bg-surface-variant px-1.5 py-0.5 rounded'>
                  {key.prefix.includes('live') ? 'Production' : 'Test'}
                </span>
              </div>
              <div className='flex items-center gap-2 text-sm font-mono text-on-surface-variant'>
                {key.prefix}****************
                <button
                  onClick={() => copyToClipboard('mock_key_content', key.id)}
                  className='p-1 hover:text-primary transition-colors'
                  title='Copy full key'
                >
                  {copied === key.id ? (
                    <Check className='w-3 h-3 text-success' />
                  ) : (
                    <Copy className='w-3 h-3' />
                  )}
                </button>
              </div>
            </div>
            <div className='flex items-center gap-6 text-sm text-on-surface-variant'>
              <div className='hidden sm:block'>
                <div>Created {key.created}</div>
                <div>Last used {key.lastUsed}</div>
              </div>
              <Button
                variant='ghost'
                size='sm'
                className='text-error hover:text-error hover:bg-error/10'
              >
                <Trash2 className='w-4 h-4' />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className='bg-warning/10 border border-warning/20 rounded-lg p-4 flex gap-3 text-warning-dark'>
        <Shield className='w-5 h-5 shrink-0 mt-0.5' />
        <div className='text-sm'>
          <p className='font-bold mb-1'>Keep your keys secure</p>
          <p className='opacity-90'>
            Your API keys carry many privileges, so be sure to keep them secure!
            Do not share your secret API keys in publicly accessible areas such
            as GitHub, client-side code, and so forth.
          </p>
        </div>
      </div>
    </div>
  )
}

function NotificationsSection() {
  return (
    <div className='space-y-8 animate-in fade-in duration-500'>
      <div>
        <h2 className='text-xl font-semibold mb-1'>Notifications</h2>
        <p className='text-sm text-on-surface-variant'>
          Choose what you want to be notified about.
        </p>
      </div>

      <div className='space-y-6'>
        <div className='space-y-4'>
          <h3 className='font-medium border-b border-outline-variant pb-2'>
            Email Notifications
          </h3>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <label className='font-medium text-sm'>Product Updates</label>
                <p className='text-xs text-on-surface-variant'>
                  Receive emails about new features and improvements.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <label className='font-medium text-sm'>Security Alerts</label>
                <p className='text-xs text-on-surface-variant'>
                  Receive emails about sign-ins and security events.
                </p>
              </div>
              <Switch
                defaultChecked
                disabled
              />
            </div>
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <label className='font-medium text-sm'>
                  Billing & Invoices
                </label>
                <p className='text-xs text-on-surface-variant'>
                  Receive monthly invoices and billing alerts.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        <div className='space-y-4 pt-4'>
          <h3 className='font-medium border-b border-outline-variant pb-2'>
            Push Notifications
          </h3>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <label className='font-medium text-sm'>New Messages</label>
                <p className='text-xs text-on-surface-variant'>
                  Get notified when you receive a new message.
                </p>
              </div>
              <Switch />
            </div>
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <label className='font-medium text-sm'>Task Updates</label>
                <p className='text-xs text-on-surface-variant'>
                  Get notified when a task status changes.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </div>
      <div className='flex justify-end pt-4 border-t border-outline-variant'>
        <Button>Save Preferences</Button>
      </div>
    </div>
  )
}
