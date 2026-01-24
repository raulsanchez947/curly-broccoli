import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession, Session } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import { prisma } from '../../lib/prisma'
import fs from 'fs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions as any) as Session | null
  console.log('API /api/contacts session:', session)
  console.log('API /api/contacts cookies:', req.headers.cookie)
  console.log('API /api/contacts authOptions secret?', !!(authOptions as any).secret)
  try{ fs.appendFileSync('./nextauth-debug.log', `[${new Date().toISOString()}] /api/contacts session=${JSON.stringify(session)} cookie=${req.headers.cookie}\n`) }catch(e){}
  if(!session || !session.user || !session.user.email) return res.status(401).json({ error: 'Unauthorized' })

  const me = await prisma.user.findUnique({ where: { email: (session.user as any).email } })
  if(!me) return res.status(404).json({ error: 'User not found' })

  if(req.method === 'GET'){
    const contacts = await prisma.contact.findMany({ where: { ownerId: me.id }, include: { contact: { select: { id: true, name: true, email: true, image: true } } } })
    return res.json(contacts.map(c => ({ id: c.id, user: c.contact })))
  }

  if(req.method === 'POST'){
    const { contactId } = req.body || {}
    if(!contactId) return res.status(400).json({ error: 'contactId required' })
    if(contactId === me.id) return res.status(400).json({ error: 'Cannot add yourself' })

    try{
      const c = await prisma.contact.create({ data: { ownerId: me.id, contactId } })
      const user = await prisma.user.findUnique({ where: { id: contactId }, select: { id: true, name: true, email: true, image: true } })
      return res.status(201).json({ id: c.id, user })
    }catch(e){
      return res.status(409).json({ error: 'Already added or invalid contact' })
    }
  }

  if(req.method === 'DELETE'){
    const { contactId } = req.query || {}
    if(!contactId || typeof contactId !== 'string') return res.status(400).json({ error: 'contactId required' })
    await prisma.contact.deleteMany({ where: { ownerId: me.id, contactId } })
    return res.status(204).end()
  }

  res.setHeader('Allow', 'GET,POST,DELETE')
  res.status(405).end('Method Not Allowed')
}
