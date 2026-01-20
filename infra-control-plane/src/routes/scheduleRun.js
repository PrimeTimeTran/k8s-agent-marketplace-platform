import express from 'express'
import { scheduleRun, scheduleJob } from '../executions/service.js'

const router = express.Router()

router.post('/schedule-run', async (req, res) => {
  try {
    const result = await scheduleRun(req.body)
    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

router.post('/schedule-job', async (req, res) => {
  try {
    const result = await scheduleJob(req.body)
    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

export default router
