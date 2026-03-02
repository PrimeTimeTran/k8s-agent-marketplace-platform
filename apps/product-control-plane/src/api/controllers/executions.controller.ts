import { Request, Response } from 'express'
import { getErrorMessage } from '@hc/utils'
import { fetchExecution, fetchExecutions } from '../../infra/infraClient.js'

export async function listExecutions(req: Request, res: Response) {
  try {
    const executions = await fetchExecutions()
    res.json(executions)
  } catch (err) {
    res.status(500).json({ error: getErrorMessage(err) })
  }
}

export async function getExecution(req: Request, res: Response) {
  try {
    const execution = await fetchExecution(req.params.id as string)
    res.json(execution)
  } catch (err) {
    res.status(404).json({ error: getErrorMessage(err) })
  }
}
