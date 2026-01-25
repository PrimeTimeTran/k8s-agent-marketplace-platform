import { NextResponse } from 'next/server'

import { env } from '@/config/env'

export async function POST(req: Request) {
  const body = await req.json()

  const res = await fetch(`${env.PRODUCT_CONTROL_PLANE_URL}/queue-job`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const text = await res.text()

  if (!res.ok) {
    return NextResponse.json(
      { error: 'Product CP failed', details: text },
      { status: 500 },
    )
  }

  return NextResponse.json(JSON.parse(text))
}
