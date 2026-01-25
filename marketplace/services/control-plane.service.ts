import { env } from '@/config/env'
import { Execution } from '@/types/execution'

export type FetchParams = {
  page?: number
  limit?: number
  search?: string
  status?: string
}

export type PaginatedResult<T> = {
  items: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export async function getExecutions(
  params: FetchParams = {},
): Promise<PaginatedResult<Execution>> {
  const { page = 1, limit = 10, search, status } = params
  const url = new URL(`${env.CONTROL_PLANE_URL}/executions`)

  // 1. Map generic params to backend-specific query strings
  url.searchParams.set('page', page.toString())
  url.searchParams.set('limit', limit.toString())
  if (search) url.searchParams.set('q', search)
  if (status) url.searchParams.set('status', status)

  try {
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${process.env.TOKEN}` },
      cache: 'no-store',
    })

    if (!res.ok) throw new Error(`Backend error: ${res.status}`)

    const rawData = await res.json()

    // 2. Normalize backend response to our standard PaginatedResult
    // (Assuming backend returns { data: [], total: 100 } or similar)
    // If backend only returns array, we simulate pagination for now:
    let allItems = Array.isArray(rawData)
      ? rawData
      : (rawData?.executions ?? [])

    // -- SIMULATED FILTERING/PAGINATION (Remove if backend handles it) --
    if (search) {
      allItems = allItems.filter(
        (ex: Execution) => ex.id.includes(search) || ex.status.includes(search),
      )
    }
    const total = allItems.length
    const start = (page - 1) * limit
    const items = allItems.slice(start, start + limit)
    // ------------------------------------------------------------------

    const response = {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
    console.log({ response })
    return response
  } catch (error) {
    console.error('getExecutions failed:', error)
    return {
      items: [],
      meta: { page, limit, total: 0, totalPages: 0 },
    }
  }
}
