import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import type { Session } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]'
import { prisma } from '../../../../lib/prisma'
import fs from 'fs'
import path from 'path'

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } }

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const session = await getServerSession(req, res, authOptions as any) as Session | null
  if(!session?.user?.email) return res.status(401).json({ error: 'Not signed in' })
  const me = await prisma.user.findUnique({ where: { email: session.user.email } })
  if(!me) return res.status(404).json({ error: 'user not found' })

  const { id } = req.query as { id: string }
  if(req.method !== 'POST') return res.status(405).end()

  const { filename, mimeType, data, content } = req.body as { filename: string, mimeType: string, data: string, content?: string }
  if(!filename || !mimeType || !data) return res.status(400).json({ error: 'filename,mimeType,data required' })

  const buffer = Buffer.from(data, 'base64')
  const uploads = path.join(process.cwd(), 'public', 'uploads')
  if(!fs.existsSync(uploads)) fs.mkdirSync(uploads, { recursive: true })
  const saveName = Date.now() + '-' + filename.replace(/[^a-zA-Z0-9._-]/g,'')
  const full = path.join(uploads, saveName)
  fs.writeFileSync(full, buffer)
  const url = `/uploads/${saveName}`

  // create message with attachment
  const message = await prisma.message.create({ data: { content: content || '', authorId: me.id, conversationId: id } })
  const attachment = await prisma.messageAttachment.create({ data: { messageId: message.id, url, filename, mimeType } })

  // broadcast via Socket.IO if available
  try{
    const io = (global as any).io
    if(io){
      const msg = await prisma.message.findUnique({ where: { id: message.id }, include: { author: { select: { id: true, name: true, email: true } }, attachments: true } })
      io.to(`conv:${id}`).emit('message', msg)
    }
  }catch(e){ console.warn('unable to broadcast attachment', e) }

  return res.status(201).json({ message, attachment: { url, filename, mimeType } })
}
