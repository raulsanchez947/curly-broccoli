import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import type { Session } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import { prisma } from '../../../lib/prisma'
const { firestoreAdmin } = require('../../../lib/firebaseAdmin') as any

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const session = await getServerSession(req, res, authOptions as any) as Session | null
  if(!session?.user?.email) return res.status(401).json({ error: 'Unauthorized' })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(s=>s.trim()).filter(Boolean)
  const isAdmin = !!(user?.isAdmin || adminEmails.includes(session.user.email))
  if(!isAdmin) return res.status(403).json({ error: 'Forbidden' })

  try{
    const data = { createdAt: new Date().toISOString(), userId: user?.id || null }
    const ref = await firestoreAdmin.collection('admin_test').add(data)
    const snap = await ref.get()
    return res.json({ id: ref.id, data: snap.data() })
  }catch(e:any){
    console.error('test-firestore error', e)
    return res.status(500).json({ error: e.message || 'firestore error' })
  }
}
