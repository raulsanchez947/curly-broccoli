import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import type { Session } from 'next-auth'
import { prisma } from '../../../lib/prisma'
const speakeasy: any = require('speakeasy')
const QRCode: any = require('qrcode')

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const session = await getSession({ req }) as Session | null
  if(!session?.user?.email) return res.status(401).json({ error: 'Unauthorized' })
  const me = await prisma.user.findUnique({ where: { email: session.user.email } })
  if(!me) return res.status(404).json({ error: 'User not found' })

  const secret = speakeasy.generateSecret({ name: `ApartmentAdvisor (${me.email})` })
  const otpauth = secret.otpauth_url || ''
  const qr = await QRCode.toDataURL(otpauth)
  // return secret.base32 to client temporarily; do not store until verified
  return res.json({ secret: secret.base32, otpauth, qr })
}
