/**
 * ARCHITECTURE NOTE: Server Components vs Client Fetching
 *
 * This file (`page.tsx`) is a React Server Component (RSC).
 * It runs EXCLUSIVELY on the server.
 *
 * 1. SERVER FETCHING (Here)
 *    - WHEN: Initial page load.
 *    - WHY:
 *      a) Performance: Fetch data closer to the source (DB/Service) before sending HTML.
 *      b) Security: Access `process.env` secrets directly. No API keys sent to browser.
 *      c) Bundle Size: Heavy data-processing libraries remain on the server.
 *
 * 2. CLIENT FETCHING (Inside ExecutionDashboard / Server Actions)
 *    - WHEN: User interaction (Search, Pagination) or Live Polling.
 *    - WHY: We cannot re-run the entire page reload for every small interaction.
 *           We use Server Actions (RPC) to fetch fresh data without a full page refresh.
 *
 * SUMMARY:
 * - Load initial state here (Server).
 * - Pass it as `initialData` to Client Components.
 * - Client Components then take over for updates/interactivity.
 */

import ExecutionDashboard from './execution-dashboard'
import { getExecutions } from '@/services/control-plane.service'

export default async function Home() {
  // 1. Fetch initial data on the server
  // This happens before the user sees anything.
  const { items } = await getExecutions({ page: 1, limit: 10 })

  // 2. Pass data to the Client Component
  // This "hydrates" the client with the initial state so it doesn't need to fetch immediately.
  return <ExecutionDashboard initialExecutions={items} />
}
