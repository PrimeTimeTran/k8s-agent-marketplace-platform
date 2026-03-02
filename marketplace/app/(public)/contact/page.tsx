'use client'

import { useState } from 'react'
import { Mail, MessageSquare, MapPin, Phone, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center p-6'>
        <div className='max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-500'>
          <div className='w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto'>
            <Send className='w-10 h-10' />
          </div>
          <h1 className='text-3xl font-bold text-on-surface'>Message Sent!</h1>
          <p className='text-on-surface-variant text-lg'>
            Thanks for reaching out. Our team will get back to you within 24
            hours.
          </p>
          <Button
            onClick={() => setSubmitted(false)}
            variant='outline'
          >
            Send another message
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background'>
      {/* Hero Header */}
      <section className='bg-surface-variant/20 py-20 border-b border-outline-variant'>
        <div className='container mx-auto px-6 text-center space-y-4'>
          <h1 className='text-4xl md:text-5xl font-bold text-on-surface'>
            Get in Touch
          </h1>
          <p className='text-xl text-on-surface-variant max-w-2xl mx-auto'>
            Have questions about our enterprise plans, custom integrations, or
            just want to say hello? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <div className='container mx-auto px-6 py-16'>
        <div className='max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24'>
          {/* Contact Info Side */}
          <div className='space-y-12'>
            <div>
              <h2 className='text-2xl font-bold mb-6 text-on-surface'>
                Contact Information
              </h2>
              <p className='text-on-surface-variant mb-8 leading-relaxed'>
                Fill out the form and our team will be in touch shortly. For
                technical support, please visit our{' '}
                <a
                  href='/help'
                  className='text-primary hover:underline'
                >
                  Help Center
                </a>
                .
              </p>

              <div className='space-y-6'>
                <div className='flex items-start gap-4'>
                  <div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1'>
                    <Mail className='w-5 h-5' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-on-surface'>Email Us</h3>
                    <p className='text-on-surface-variant'>
                      sales@platform.com
                    </p>
                    <p className='text-on-surface-variant'>
                      support@platform.com
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1'>
                    <Phone className='w-5 h-5' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-on-surface'>Call Us</h3>
                    <p className='text-on-surface-variant'>+1 (555) 123-4567</p>
                    <p className='text-xs text-on-surface-variant mt-1'>
                      Mon-Fri from 9am to 6pm PST
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1'>
                    <MapPin className='w-5 h-5' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-on-surface'>Visit Us</h3>
                    <p className='text-on-surface-variant'>
                      123 Innovation Drive
                      <br />
                      San Francisco, CA 94103
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='p-6 rounded-2xl bg-surface-variant/10 border border-outline-variant'>
              <h3 className='font-semibold mb-2 flex items-center gap-2'>
                <MessageSquare className='w-4 h-4 text-primary' />
                Live Chat
              </h3>
              <p className='text-sm text-on-surface-variant mb-4'>
                Available weekdays for Pro and Enterprise customers.
              </p>
              <Button
                variant='secondary'
                size='sm'
              >
                Start Chat
              </Button>
            </div>
          </div>

          {/* Form Side */}
          <div className='bg-surface p-8 rounded-2xl border border-outline-variant shadow-sm'>
            <form
              onSubmit={handleSubmit}
              className='space-y-6'
            >
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-on-surface'>
                    First Name
                  </label>
                  <Input
                    placeholder='John'
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-on-surface'>
                    Last Name
                  </label>
                  <Input
                    placeholder='Doe'
                    required
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-on-surface'>
                  Email
                </label>
                <Input
                  type='email'
                  placeholder='john@company.com'
                  required
                />
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-on-surface'>
                  Subject
                </label>
                <select className='flex h-10 w-full rounded-md border border-outline bg-surface px-3 py-2 text-sm text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'>
                  <option>Sales Inquiry</option>
                  <option>Technical Support</option>
                  <option>Partnership Opportunity</option>
                  <option>Other</option>
                </select>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-on-surface'>
                  Message
                </label>
                <textarea
                  className='flex min-h-37.5 w-full rounded-md border border-outline bg-surface px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y'
                  placeholder='Tell us more about your project...'
                  required
                />
              </div>

              <Button
                type='submit'
                className='w-full h-12 text-base'
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </Button>

              <p className='text-xs text-center text-on-surface-variant mt-4'>
                By submitting this form, you agree to our Terms of Service and
                Privacy Policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
