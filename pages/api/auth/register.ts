import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method !== 'POST') return res.status(405).end()
  const { email, phone, password, username } = req.body || {}
  if(!password) return res.status(400).json({ error: 'password required' })
  if(!email && !phone) return res.status(400).json({ error: 'email or phone required' })
  if(!username) return res.status(400).json({ error: 'username required' })

  try{
    const exists = await prisma.user.findFirst({ where: { OR: [{ email }, { phone }] } })
    // ensure username is not taken
    const nameTaken = await prisma.user.findUnique({ where: { username } })
    if(nameTaken) return res.status(409).json({ error: 'username taken' })
    const hash = await bcrypt.hash(password, 10)
    if (exists) {
      // If user exists but was created via OAuth (no passwordHash), allow completing account
      if (!exists.passwordHash) {
        const updated = await prisma.user.update({ where: { id: exists.id }, data: { passwordHash: hash, username: username || exists.username } })
        return res.status(200).json({ id: updated.id, email: updated.email, phone: updated.phone })
      }
      return res.status(409).json({ error: 'User already exists' })
    }

    const user = await prisma.user.create({ data: { email: email || undefined, phone: phone || undefined, passwordHash: hash, username } })
    return res.status(201).json({ id: user.id, email: user.email, phone: user.phone })
  }catch(e:any){
    console.error('register error', e)
    // Prisma unique constraint error (e.g., username/email/phone already taken)
    if(e?.code === 'P2002'){
      const target = e?.meta?.target || 'unique field'
      return res.status(409).json({ error: `Unique constraint failed: ${target}` })
    }
    return res.status(500).json({ error: 'Failed to create user' })
  }
}
