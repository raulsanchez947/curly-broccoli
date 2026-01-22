import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method === 'GET'){
    const posts = await prisma.post.findMany({orderBy:{createdAt:'desc'}})
    return res.status(200).json(posts)
  }

  if(req.method === 'POST'){
    const { title, content, authorEmail } = req.body
    if(!title || !content) return res.status(400).json({error:'missing fields'})
    let authorId = undefined
    if(authorEmail){
      const user = await prisma.user.findUnique({ where: { email: authorEmail } })
      if(user) authorId = user.id
    }
    const post = await prisma.post.create({data:{title,content, authorId}})
    return res.status(201).json(post)
  }

  res.setHeader('Allow', ['GET','POST'])
  res.status(405).end()
}
