import express from 'express'

import queueRouter from './api/routes/queues.routes.js'
import systemRouter from './api/routes/system.routes.js'
import executionRouter from './api/routes/executions.routes.js'

const app = express()
app.use(express.json())

app.use(queueRouter)
app.use(systemRouter)
app.use(executionRouter)

app.get('/health', (req, res) => {
  res.status(200).send('ok')
})

const PORT = Number(process.env.PORT) || 3002

app.listen(PORT, '0.0.0.0', () => {
  console.log({
    ts: new Date().toISOString(),
    msg: `Infra control plane listening on :${PORT}`,
  })
})
