import express from 'express'
import { getExecution, getAllExecutions } from '../executions/store.js'

const router = express.Router()

router.get('/executions', (req, res) => {
  res.json(getAllExecutions())
})

router.get('/executions/:id', (req, res) => {
  const ex = getExecution(req.params.id)
  if (!ex) return res.sendStatus(404)
  res.json(ex)
})

router.patch('/executions/:id/status', express.json(), (req, res) => {
  const { status, logs } = req.body

  const ex = getExecution(req.params.id)
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
})

export default router
