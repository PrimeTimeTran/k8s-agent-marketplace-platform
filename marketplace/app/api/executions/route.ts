import { env } from '@/config/env'

export async function GET() {
  const res = await fetch(`${env.PRODUCT_CONTROL_PLANE_URL}/executions`, {
    cache: 'no-store',
  })

  const executions = await res.json()
  return Response.json(executions)
}
