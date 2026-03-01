import type { NextApiRequest, NextApiResponse } from 'next'

// Temporary maintenance endpoint: disable chat API while we debug and fix production.
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Retry-After', '3600')
  res.status(503).json({ error: 'Chat API temporarily disabled for maintenance' })
}
