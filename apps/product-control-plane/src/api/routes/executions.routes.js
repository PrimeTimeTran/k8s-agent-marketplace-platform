import express from 'express'
import * as controller from '../controllers/executions.controller.js'

const router = express.Router()

router.get('/executions', controller.listExecutions)
router.get('/executions/:id', controller.getExecution)

export default router
