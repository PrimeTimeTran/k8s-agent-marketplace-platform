import express from 'express'
import fetch from 'node-fetch'

const app = express()
app.use(express.json())

app.post('/run-agent', async (req, res) => {
  try {
    console.log('Product CP:', req.body)

    const response = await fetch(
      'http://infra-control-plane:3000/schedule-run',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
      },
    )

    const text = await response.text()

    if (!response.ok) {
      console.error('Infra CP error:', text)
      return res.status(500).json({
        error: 'Infra control plane failed',
        details: text,
      })
    }

    const data = JSON.parse(text)

    res.json({
      executionId: 'exec_123',
      input: req.body,
      result: data,
    })
  } catch (err) {
    console.error('Product CP crash:', err)
    res.status(500).json({ error: 'Product control plane crashed' })
  }
})

app.listen(3000)
