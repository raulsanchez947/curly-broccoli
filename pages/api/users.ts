import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import type { Session } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import { prisma } from '../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const session = await getServerSession(req, res, authOptions as any) as Session | null
  if(!session?.user?.email) return res.status(401).json({ error: 'Not signed in' })

  // Return basic user list (id, name, email, isAdmin) for messaging UI
  const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, isAdmin: true } })
  res.status(200).json(users)
}
