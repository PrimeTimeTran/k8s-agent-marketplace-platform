import express, { Request, Response } from 'express'
import {
  getExecution,
  getAllExecutions,
} from '../../domain/executions/store.js'
const router = express.Router()

router.get('/executions', (req: Request, res: Response) => {
  res.json(getAllExecutions())
})

router.get('/executions/:id', (req: Request, res: Response) => {
  const ex = getExecution(req.params.id as string)
  if (!ex) return res.sendStatus(404)
  res.json(ex)
})

router.patch(
  '/executions/:id/status',
  express.json(),
  (req: Request, res: Response) => {
    const { status, logs } = req.body

    const ex = getExecution(req.params.id as string)
    if (!ex) return res.sendStatus(404)

    if (status) {
      ex.status = status
    }

    if (logs) {
      const prefix = ex.logs ? ex.logs + '\n' : ''
      ex.logs = `${prefix}[${new Date().toISOString()}] ${logs}`
    }

    ex.updatedAt = Date.now()

    res.json(ex)
  },
)

export default router
