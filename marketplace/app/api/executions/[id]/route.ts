import { NextRequest } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const res = await fetch(
    `http://product-control-plane:3000/executions/${id}`,
    {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    },
  )

  if (!res.ok) {
    return new Response(JSON.stringify({ error: 'Execution not found' }), {
      status: 404,
    })
  }

  const data = await res.json()
  return Response.json(data)
}
