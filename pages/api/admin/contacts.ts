import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import path from 'path'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import { prisma } from '../../../lib/prisma'

const DB_PATH = path.join(process.cwd(), 'data', 'contact-requests.json')

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const session = await getServerSession(req, res, authOptions as any)
  if(!session?.user?.email) return res.status(401).json({ error: 'Unauthorized' })
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(s=>s.trim()).filter(Boolean)
  const isAdmin = !!(user?.isAdmin || adminEmails.includes(session.user.email))
  if(!isAdmin) return res.status(403).json({ error: 'Forbidden' })

  if(req.method === 'GET'){
    try{
      const raw = await fs.readFile(DB_PATH, 'utf8').catch(()=> '[]')
      const arr = JSON.parse(raw || '[]')
      return res.json(arr)
    }catch(e){ console.error('admin contacts read error', e); return res.status(500).json({ error: 'failed' }) }
  }

  res.setHeader('Allow', 'GET')
  res.status(405).end('Method Not Allowed')
}
