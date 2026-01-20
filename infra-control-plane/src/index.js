import express from 'express'
import scheduleRunRoutes from './routes/scheduleRun.js'
import executionRoutes from './routes/executions.js'

const app = express()

app.get('/health', (req, res) => {
  res.status(200).send('ok')
})

app.use(express.json())

app.use(scheduleRunRoutes)
app.use(executionRoutes)

app.listen(3000, '0.0.0.0', () => {
  console.log('Infra control plane listening on :3000')
})
