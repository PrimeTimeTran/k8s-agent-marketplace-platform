import { fetchExecution, fetchExecutions } from '../../infra/infraClient.js'

export async function listExecutions(req, res) {
  try {
    const executions = await fetchExecutions()
    res.json(executions)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function getExecution(req, res) {
  try {
    const execution = await fetchExecution(req.params.id)
    res.json(execution)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}
