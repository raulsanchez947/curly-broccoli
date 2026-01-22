import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { getServerSession } from 'next-auth'
import type { Session } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const session = await getServerSession(req, res, authOptions as any) as Session | null
  if(!session?.user?.email) return res.status(401).json({ error: 'Not authorized' })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(s=>s.trim()).filter(Boolean)
  const isAdmin = !!(user?.isAdmin || adminEmails.includes(session.user.email))
  if(!isAdmin) return res.status(401).json({ error: 'Not authorized' })

  if(req.method === 'GET'){
    const reported = await prisma.post.findMany({ where: { reported: true }, orderBy: { createdAt: 'desc' } })
    return res.status(200).json(reported)
  }

  if(req.method === 'POST'){
    const { id, action } = req.body
    if(!id) return res.status(400).json({ error: 'missing id' })
    if(action === 'unreport'){
      await prisma.post.update({ where: { id }, data: { reported: false } })
      return res.status(200).json({ ok: true })
    }
  }

  res.setHeader('Allow', ['GET','POST'])
  res.status(405).end()
}
