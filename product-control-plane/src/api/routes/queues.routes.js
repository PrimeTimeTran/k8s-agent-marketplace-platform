import express from 'express'
import { queueJobController } from '../controllers/queues.controller.js'

const router = express.Router()

router.post('/queue-job', queueJobController)

export default router
