import { k8sGet } from './k8s.js'

import { k8sFetch } from './client.js'

export async function getJobPod(namespace, jobName) {
  const data = await k8sGet(
    `/api/v1/namespaces/${namespace}/pods?labelSelector=job-name=${jobName}`,
  )

  if (!data.items?.length) return null

  return data.items.sort(
    (a, b) =>
      new Date(b.metadata.creationTimestamp) -
      new Date(a.metadata.creationTimestamp),
  )[0]
}

export async function getPodLogs(namespace, podName) {
  try {
    const res = await k8sFetch(
      `/api/v1/namespaces/${namespace}/pods/${podName}/log?container=agent`,
    )
    return res.text()
  } catch (e) {
    console.error(`Failed to get logs for ${podName}:`, e.message)
    return ''
  }
}
