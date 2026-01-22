import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import type { Session } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]'
import { prisma } from '../../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const session = await getServerSession(req, res, authOptions as any) as Session | null
  if(!session?.user?.email) return res.status(401).json({ error: 'Not signed in' })
  const me = await prisma.user.findUnique({ where: { email: session.user.email } })
  if(!me) return res.status(404).json({ error: 'user not found' })

  const { id } = req.query as { id: string }
  if(req.method === 'POST'){
    const { type } = req.body as { type: string }
    if(!type) return res.status(400).json({ error: 'type required' })
    // toggle reaction
    const exists = await prisma.messageReaction.findUnique({ where: { messageId_userId_type: { messageId: id, userId: me.id, type } } }).catch(()=>null)
    if(exists) await prisma.messageReaction.delete({ where: { id: exists.id } })
    else await prisma.messageReaction.create({ data: { messageId: id, userId: me.id, type } })
    const reactions = await prisma.messageReaction.findMany({ where: { messageId: id }, include: { user: { select: { id: true, name: true } } } })
    return res.status(200).json({ reactions })
  }

  if(req.method === 'GET'){
    const reactions = await prisma.messageReaction.findMany({ where: { messageId: id }, include: { user: { select: { id: true, name: true } } } })
    return res.status(200).json({ reactions })
  }

  res.setHeader('Allow', ['GET','POST'])
  res.status(405).end()
}
