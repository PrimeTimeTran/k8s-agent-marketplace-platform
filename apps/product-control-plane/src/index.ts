import express from 'express'

import queueRouter from './api/routes/queues.routes.js'
import systemRouter from './api/routes/system.routes.js'
import executionRouter from './api/routes/executions.routes.js'
import { connectDB } from './db/sequelize.js'

const app = express()
app.use(express.json())

app.use(queueRouter)
app.use(systemRouter)
app.use(executionRouter)

const PORT = Number(process.env.PORT) || 3001

await connectDB()

app.listen(PORT, '0.0.0.0', () => {
  console.log({
    ts: new Date().toISOString(),
    msg: `Product control plane listening on :${PORT}`,
  })
})
