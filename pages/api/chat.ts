import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import type { Session } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import { prisma } from '../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  // This endpoint only supports direct messaging between authenticated users.
  if (req.method === 'GET') {
    const { userId } = req.query as { userId?: string }
    const session = await getServerSession(req, res, authOptions as any) as Session | null
    if (!session?.user?.email) return res.status(401).json({ error: 'Not signed in' })
    if (!userId) return res.status(400).json({ error: 'userId query param required' })

    const me = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!me) return res.status(404).json({ error: 'user not found' })

    // find conversation containing both users
    const conv = await prisma.conversation.findFirst({ where: { AND: [ { participants: { some: { userId: me.id } } }, { participants: { some: { userId } } } ] } })
    if(!conv) return res.status(200).json([])
    const messages = await prisma.message.findMany({ where: { conversationId: conv.id }, orderBy: { createdAt: 'asc' }, include: { author: { select: { id: true, name: true, email: true, image: true } }, attachments: true, reactions: true } })
    return res.status(200).json(messages)
  }

  // POST: create a direct message to a recipientId (requires authentication)
  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions as any) as Session | null
    if (!session?.user?.email) return res.status(401).json({ error: 'Not signed in' })
    const { content, recipientId } = req.body
    if (!content) return res.status(400).json({ error: 'missing content' })
    if (!recipientId) return res.status(400).json({ error: 'recipientId required' })

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    const data: any = { content }
    if (user) data.authorId = user.id
    data.recipientId = recipientId
    const message = await prisma.message.create({ data })
    return res.status(201).json(message)
  }

  res.setHeader('Allow', ['GET','POST'])
  res.status(405).end()
}
