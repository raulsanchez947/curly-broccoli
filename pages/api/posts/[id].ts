import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { getServerSession } from 'next-auth'
import type { Session } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const { id } = req.query as { id: string }

  if(req.method === 'DELETE'){
    const session = await getServerSession(req, res, authOptions as any) as Session | null
    if(!session) return res.status(401).json({ error: 'Not authenticated' })

    // allow delete only by the author or an admin (admin check not implemented)
    const post = await prisma.post.findUnique({ where: { id } })
    if(!post) return res.status(404).end()
    if(post.authorId && session.user?.email){
      const user = await prisma.user.findUnique({ where: { email: session.user.email }})
      if(!user || user.id !== post.authorId) return res.status(403).json({ error: 'Not allowed' })
    }

    await prisma.post.delete({ where: { id } })
    return res.status(204).end()
  }

  if(req.method === 'POST'){
    // used to mark as reported
    const { action } = req.body
    if(action === 'report'){
      await prisma.post.update({ where: { id }, data: { reported: true } })
      return res.status(200).json({ ok: true })
    }
  }

  res.setHeader('Allow', ['DELETE','POST'])
  res.status(405).end()
}
