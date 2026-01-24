export type Execution = {
  id: string
  status: string
  logs: string
  jobConfig?: any
  createdAt: number
  payload: {
    agent: string
    prompt: string
    value: string
  }
}
