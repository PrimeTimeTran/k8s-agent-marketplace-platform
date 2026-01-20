import express from 'express'
import scheduleRunRoutes from './routes/scheduleRun.js'

const app = express()
app.use(express.json())

app.use(scheduleRunRoutes)

app.listen(3000, () => {
  console.log('Infra control plane listening on :3000')
})
