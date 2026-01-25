import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

const DATA_PATH = path.join(process.cwd(), 'data', 'community.json')

async function readLocal(){
  try{ const raw = await fs.promises.readFile(DATA_PATH, 'utf8'); return JSON.parse(raw) }catch(e){ return [] }
}
async function writeLocal(data:any){ await fs.promises.mkdir(path.dirname(DATA_PATH), { recursive: true }); await fs.promises.writeFile(DATA_PATH, JSON.stringify(data, null,2),'utf8') }

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const { id } = req.query
  if(!id) return res.status(400).json({ error: 'missing id' })

  try{
    const { firestoreAdmin } = require('../../../../../lib/firebaseAdmin')
    const postRef = firestoreAdmin.collection('community_posts').doc(String(id))
    if(req.method === 'POST'){
      const { author, content } = req.body
      if(!content) return res.status(400).json({ error: 'content required' })
      const reply = { id: String(Date.now()), author: author || null, content, createdAt: Date.now() }
      await postRef.update({ replies: firestoreAdmin.FieldValue.arrayUnion(reply) })
      return res.status(201).json(reply)
    }
    if(req.method === 'GET'){
      const doc = await postRef.get()
      if(!doc.exists) return res.status(404).json({ error: 'not found' })
      const data = doc.data()
      return res.status(200).json(data?.replies || [])
    }
  }catch(e){
    // fallback to file
    const items = await readLocal()
    const idx = items.findIndex((p:any)=>String(p.id) === String(id))
    if(idx === -1) return res.status(404).json({ error: 'not found' })
    if(req.method === 'POST'){
      const { author, content } = req.body
      if(!content) return res.status(400).json({ error: 'content required' })
      const reply = { id: String(Date.now()), author: author || null, content, createdAt: Date.now() }
      items[idx].replies = items[idx].replies || []
      items[idx].replies.push(reply)
      await writeLocal(items)
      return res.status(201).json(reply)
    }
    if(req.method === 'GET'){
      return res.status(200).json(items[idx].replies || [])
    }
  }

  res.setHeader('Allow', 'GET,POST')
  res.status(405).end('Method not allowed')
}
