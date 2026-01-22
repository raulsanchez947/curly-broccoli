import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import type { Session } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const session = await getServerSession(req, res, authOptions as any) as Session | null
  if(!session?.user?.email) return res.status(401).json({ error: 'Not signed in' })
  const me = await prisma.user.findUnique({ where: { email: session.user.email } })
  if(!me) return res.status(404).json({ error: 'user not found' })

  const { id } = req.query as { id: string }
  if(req.method === 'GET'){
    // return messages for conversation (supports pagination: ?limit=&skip=)
    const limit = Math.min(parseInt((req.query.limit as string) || '50', 10), 200)
    const skip = parseInt((req.query.skip as string) || '0', 10)
    const total = await prisma.message.count({ where: { conversationId: id } })
    const conv = await prisma.conversation.findUnique({ where: { id }, include: { participants: { include: { user: { select: { id: true, name: true, email: true, image: true } } } }, messages: { orderBy: { createdAt: 'asc' }, skip, take: limit, include: { author: { select: { id: true, name: true, email: true, image: true } }, reads: { include: { user: true } }, reactions: { include: { user: { select: { id: true, name: true } } } }, attachments: true } } } })
    if(!conv) return res.status(404).json({ error: 'conversation not found' })
    // ensure member
    const isMember = conv.participants.some(p => p.userId === me.id)
    if(!isMember) return res.status(403).json({ error: 'not a participant' })
    return res.status(200).json({ ...conv, totalMessages: total })
  }

  if(req.method === 'POST'){
    // send message in conversation
    const { content } = req.body as { content: string }
    if(!content) return res.status(400).json({ error: 'content required' })
    const conv = await prisma.conversation.findUnique({ where: { id }, include: { participants: true } })
    if(!conv) return res.status(404).json({ error: 'conversation not found' })
    const isMember = conv.participants.some(p => p.userId === me.id)
    if(!isMember) return res.status(403).json({ error: 'not a participant' })
    const message = await prisma.message.create({ data: { content, authorId: me.id, conversationId: id } })
    return res.status(201).json(message)
  }

  res.setHeader('Allow', ['GET','POST'])
  res.status(405).end()
}
