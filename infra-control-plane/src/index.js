import express from 'express'
import queueRoutes from './api/routes/queues.routes.js'
import executionRoutes from './api/routes/executions.routes.js'

const app = express()
app.use(express.json())

app.use(queueRoutes)
app.use(executionRoutes)

app.get('/health', (req, res) => {
  res.status(200).send('ok')
})

app.listen(3000, '0.0.0.0', () => {
  console.log({
    ts: new Date().toISOString(),
    msg: 'Infra control plane listening on :3000',
  })
})
