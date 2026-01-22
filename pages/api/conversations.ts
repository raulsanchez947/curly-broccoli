import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import type { Session } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import { prisma } from '../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const session = await getServerSession(req, res, authOptions as any) as Session | null
  console.log('/api/conversations session:', session)
  if(!session?.user?.email) return res.status(401).json({ error: 'Not signed in' })
  const me = await prisma.user.findUnique({ where: { email: session.user.email } })
  if(!me) return res.status(404).json({ error: 'user not found' })

  if(req.method === 'GET'){
    // list conversations for user, include last message and unread counts
    const convs = await prisma.conversation.findMany({
      where: { participants: { some: { userId: me.id } } },
      include: { participants: { include: { user: { select: { id: true, name: true, email: true, image: true } } } }, messages: { orderBy: { createdAt: 'desc' }, take: 1, include: { author: { select: { id: true, name: true, email: true } } } } }
    })
    const out = []
    for(const c of convs){
      // count messages in c that are authored by other users and not read by me
      const unread = await prisma.message.count({ where: { conversationId: c.id, authorId: { not: me.id }, reads: { none: { userId: me.id } } } })
      out.push({ id: c.id, lastMessage: c.messages[0] || null, participants: c.participants.map(p=>p.user), unreadCount: unread })
    }
    return res.status(200).json(out)
  }

  if(req.method === 'POST'){
    // create conversation between participants
    const { participantIds } = req.body as { participantIds: string[] }
    if(!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) return res.status(400).json({ error: 'participantIds required' })
    // ensure me included
    const ids = Array.from(new Set([...participantIds, me.id]))
    const conv = await prisma.conversation.create({ data: {}, include: { participants: true } })
    for(const uid of ids){
      await prisma.conversationParticipant.create({ data: { conversationId: conv.id, userId: uid } })
    }
    const created = await prisma.conversation.findUnique({ where: { id: conv.id }, include: { participants: { include: { user: { select: { id: true, name: true, email: true } } } } } })
    return res.status(201).json(created)
  }

  res.setHeader('Allow', ['GET','POST'])
  res.status(405).end()
}
