import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()

  const res = await fetch('http://product-control-plane:3000/queue-job', {
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
