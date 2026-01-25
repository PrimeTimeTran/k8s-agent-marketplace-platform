'use server'

import { getExecutions, FetchParams } from '@/services/control-plane.service'

export async function filterExecutions(params: FetchParams) {
  return getExecutions(params)
}
