import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

const DATA_PATH = path.join(process.cwd(), 'data', 'community.json')

async function readLocal(){
  try{
    const raw = await fs.promises.readFile(DATA_PATH, 'utf8')
    return JSON.parse(raw)
  }catch(e){
    return []
  }
}

async function writeLocal(data:any){
  await fs.promises.mkdir(path.dirname(DATA_PATH), { recursive: true })
  await fs.promises.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf8')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  // Try to use Firebase Admin if available
  try{
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { firestoreAdmin } = require('../../../../lib/firebaseAdmin')
    const postsRef = firestoreAdmin.collection('community_posts')

    if(req.method === 'GET'){
      const snap = await postsRef.orderBy('createdAt', 'desc').get()
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      return res.status(200).json(items)
    }

    if(req.method === 'POST'){
      const { title, content, author } = req.body
      if(!title || !content) return res.status(400).json({ error: 'title and content required' })
      const createdAt = Date.now()
      const doc = await postsRef.add({ title, content, author: author || null, createdAt, replies: [] })
      const saved = { id: doc.id, title, content, author: author || null, createdAt, replies: [] }
      return res.status(201).json(saved)
    }
  }catch(e){
    // Fall back to local file store
      if(req.method === 'GET'){
        const items = await readLocal()
        return res.status(200).json(items.sort((a:any,b:any)=>b.createdAt - a.createdAt))
      }

      if(req.method === 'POST'){
        const { title, content, author } = req.body
        if(!title || !content) return res.status(400).json({ error: 'title and content required' })
        const items = await readLocal()
        const newItem = { id: String(Date.now()), title, content, author: author || null, createdAt: Date.now(), replies: [] }
        items.push(newItem)
        await writeLocal(items)
        return res.status(201).json(newItem)
      }
  }

  res.setHeader('Allow', 'GET,POST')
  res.status(405).end('Method not allowed')
}
