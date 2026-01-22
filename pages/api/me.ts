import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import type { Session } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import { prisma } from '../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const session = await getServerSession(req, res, authOptions as any) as Session | null
  if(!session?.user?.email) return res.status(401).json({ error: 'Unauthorized' })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if(!user) return res.status(404).json({ error: 'User not found' })

  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(s=>s.trim()).filter(Boolean)
  const isAdmin = !!(user?.isAdmin || adminEmails.includes(session.user.email))

  if(req.method === 'GET'){
    return res.json({ id: user.id, name: user.name, email: user.email, username: user.username, mfaEnabled: user.mfaEnabled, isAdmin })
  }

  if(req.method === 'POST'){
    const { username, password } = req.body || {}
    if(!username && !password) return res.status(400).json({ error: 'username or password required' })
    try{
      const data: any = {}
      if(username) data.username = username
      if(password){
        const bcrypt = require('bcryptjs')
        data.passwordHash = await bcrypt.hash(password, 10)
      }
      const updated = await prisma.user.update({ where: { id: user.id }, data })
      return res.json({ id: updated.id, username: updated.username })
    }catch(e:any){
      return res.status(409).json({ error: 'Username taken or invalid' })
    }
  }

  res.setHeader('Allow', 'GET,POST')
  res.status(405).end('Method Not Allowed')
}
