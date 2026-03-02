import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const docsDirectory = path.join(process.cwd(), 'content/docs')

export type Doc = {
  slug: string
  meta: {
    title: string
    description?: string
    [key: string]: any
  }
  content: string
}

export function getAllDocs(): Doc[] {
  if (!fs.existsSync(docsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(docsDirectory)
  const docs = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '')
      const fullPath = path.join(docsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        meta: {
          title: data.title,
          description: data.description,
          ...data,
        },
        content,
      }
    })

  return docs
}

export function getDocBySlug(slug: string): Doc | null {
  try {
    const fullPath = path.join(docsDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      meta: {
        title: data.title,
        description: data.description,
        ...data,
      },
      content,
    }
  } catch (error) {
    return null
  }
}
