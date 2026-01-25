import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method !== 'POST') return res.status(405).end()
  let { email, phone, password, username } = req.body || {}
  email = typeof email === 'string' ? email.trim() : undefined
  phone = typeof phone === 'string' ? phone.trim() : undefined
  username = typeof username === 'string' ? username.trim() : undefined
  if(!password) return res.status(400).json({ error: 'password required' })
  if(typeof password === 'string' && password.length < 6) return res.status(400).json({ error: 'password must be at least 6 characters' })
  if(!email && !phone) return res.status(400).json({ error: 'email or phone required' })
  if(!username) return res.status(400).json({ error: 'username required' })

  try{
    console.log('register payload', { email, phone, username: username ? '[redacted]' : null })
    // Build safe OR filter only with provided identifiers
    const or: any[] = []
    if(email) or.push({ email })
    if(phone) or.push({ phone })
    const exists = or.length ? await prisma.user.findFirst({ where: { OR: or } }) : null
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
    // Return structured error info to aid debugging (limited exposure)
    const body: any = { error: 'Failed to create user' }
    if(e?.code) body.code = e.code
    if(e?.message) body.message = e.message
    return res.status(500).json(body)
  }
}
