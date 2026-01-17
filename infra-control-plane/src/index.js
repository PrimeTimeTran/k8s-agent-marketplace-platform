import express from 'express'
import fetch from 'node-fetch'

const app = express()
app.use(express.json())

app.post('/schedule-run', async (req, res) => {
  try {
    console.log('Infra CP:', req.body)

    const response = await fetch('http://agent-runtime:8000/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    })

    const text = await response.text()

    if (!response.ok) {
      console.error('Agent runtime error:', text)
      return res.status(500).json({
        error: 'Agent runtime failed',
        details: text,
      })
    }

    res.json(JSON.parse(text))
  } catch (err) {
    console.error('Infra CP crash:', err)
    res.status(500).json({ error: 'Infra control plane crashed' })
  }
})

app.listen(3000)
