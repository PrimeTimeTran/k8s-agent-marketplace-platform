import '@/styles/highlight.css'
import rehypeSlug from 'rehype-slug'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypeHighlight from 'rehype-highlight'

import { Button } from '@/components/ui/button'
import { Callout } from '@/components/mdx/callout'
import { CodeEditor } from '@/components/mdx/code-editor'
import { getDocBySlug, getAllDocs } from '@/lib/docs'

import { DocsSidebar } from './sidebar'

// Map of components available in MDX files
const components = {
  Callout,
  Button,
  CodeEditor,
}

export async function generateStaticParams() {
  const docs = getAllDocs()
  return docs.map((doc) => ({
    slug: doc.slug,
  }))
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const doc = getDocBySlug(slug)

  if (!doc) {
    notFound()
  }

  return (
    <div className='min-h-screen bg-background flex flex-col lg:flex-row'>
      <DocsSidebar />

      <main className='flex-1 min-w-0 py-12 px-6 lg:px-12'>
        <div className='max-w-4xl mx-auto'>
          <div className='mb-8'>
            <h1 className='text-4xl font-bold text-on-surface mb-2'>
              {doc.meta.title}
            </h1>
            {doc.meta.description && (
              <p className='text-xl text-on-surface-variant'>
                {doc.meta.description}
              </p>
            )}
          </div>

          <div className='prose prose-slate dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-primary prose-code:text-primary prose-pre:bg-surface-variant/10 prose-pre:border prose-pre:border-outline-variant'>
            <MDXRemote
              source={doc.content}
              components={components}
              options={{
                mdxOptions: {
                  rehypePlugins: [rehypeHighlight, rehypeSlug],
                },
              }}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
