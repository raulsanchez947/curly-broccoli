import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data', 'contact-requests.json')

async function ensureDataFile(){
  try{
    await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true })
    await fs.access(DB_PATH).catch(async ()=>{ await fs.writeFile(DB_PATH, '[]', 'utf8') })
  }catch(e){ console.error('ensureDataFile error', e) }
}

async function trySendEmail({ name, email, message }: { name?: string | null, email: string, message: string }){
  // Attempt to send email if SMTP is configured
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const to = process.env.CONTACT_TO || process.env.EMAIL_TO
  if(!host || !port || !user || !pass || !to) return false
  try{
    const nodemailer = require('nodemailer')
    const transporter = nodemailer.createTransport({ host, port: parseInt(port,10), secure: port === '465', auth: { user, pass } })
    const subject = `Contact form: ${name||'Anonymous'} <${email}>`
    const body = `From: ${name || 'Anonymous'} <${email}>\n\n${message}`
    await transporter.sendMail({ from: user, to, subject, text: body })
    return true
  }catch(e){ console.error('sendMail error', e); return false }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method !== 'POST') return res.status(405).end()
  const { name, email, message } = req.body || {}
  if(!message || !email) return res.status(400).json({ error: 'email and message required' })

  await ensureDataFile()
  try{
    const raw = await fs.readFile(DB_PATH, 'utf8').catch(()=> '[]')
    const arr = JSON.parse(raw || '[]')
    const entry = { id: Date.now().toString(36), name: name||null, email, message, createdAt: (new Date()).toISOString() }
    arr.push(entry)
    await fs.writeFile(DB_PATH, JSON.stringify(arr, null, 2), 'utf8')

    // Try to send an email notification (best-effort)
    const emailed = await trySendEmail({ name: name||null, email, message }).catch(()=>false)
    return res.status(201).json({ ok: true, emailed })
  }catch(e){ console.error('contact save error', e); return res.status(500).json({ error: 'failed' }) }
}
