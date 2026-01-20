export async function GET() {
  const res = await fetch('http://product-control-plane:3000/executions', {
    cache: 'no-store',
  })

  const executions = await res.json()
  return Response.json(executions)
}
