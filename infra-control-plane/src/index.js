import express from 'express'
import scheduleRunRoutes from './routes/scheduleRun.js'
import executionRoutes from './routes/executions.js'

const app = express()
app.use(express.json())

app.use(executionRoutes)
app.use(scheduleRunRoutes)

app.get('/health', (req, res) => {
  res.status(200).send('ok')
})

app.listen(3000, '0.0.0.0', () => {
  console.log('Infra control plane listening on :3000')
})
