import express from 'express'
import {
  queueJobController,
  queueAgentController,
} from '../controllers/queues.controller.js'

const router = express.Router()

router.post('/queue-job', queueJobController)
router.post('/queue-agent', queueAgentController)

export default router
