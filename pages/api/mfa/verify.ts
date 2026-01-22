import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import type { Session } from 'next-auth'
import { prisma } from '../../../lib/prisma'
const speakeasy: any = require('speakeasy')

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const session = await getSession({ req }) as Session | null
  if(!session?.user?.email) return res.status(401).json({ error: 'Unauthorized' })
  const me = await prisma.user.findUnique({ where: { email: session.user.email } })
  if(!me) return res.status(404).json({ error: 'User not found' })

  if(req.method !== 'POST') return res.status(405).end()
  const { token, secret } = req.body || {}
  if(!token || !secret) return res.status(400).json({ error: 'token and secret required' })

  const ok = speakeasy.totp.verify({ secret, encoding: 'base32', token, window: 1 })
  if(!ok) return res.status(400).json({ error: 'Invalid token' })

  await prisma.user.update({ where: { id: me.id }, data: { mfaEnabled: true, mfaSecret: secret } })
  return res.json({ success: true })
}
