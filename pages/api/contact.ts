import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data', 'contact-requests.json')

const isProd = process.env.NODE_ENV === 'production' || !!process.env.VERCEL

async function ensureDataFile(){
  if(isProd) return // avoid writing to project filesystem in production/serverless
  try{
    await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true })
    await fs.access(DB_PATH).catch(async ()=>{ await fs.writeFile(DB_PATH, '[]', 'utf8') })
  }catch(e){ console.error('ensureDataFile error', e) }
}

async function trySendEmail({ name, email, message }: { name?: string | null, email: string, message: string }){
  // Attempt to send email if SMTP is configured
  const to = process.env.CONTACT_TO || process.env.EMAIL_TO
  if(!to) return false
  const subject = `Contact form: ${name||'Anonymous'} <${email}>`
  const body = `From: ${name || 'Anonymous'} <${email}>\n\n${message}`

  // Prefer SendGrid when provided
  if(process.env.SENDGRID_API_KEY){
    try{
      const sg = require('@sendgrid/mail')
      sg.setApiKey(process.env.SENDGRID_API_KEY)
      const from = process.env.SENDGRID_FROM || process.env.SMTP_USER || `no-reply@${process.env.EMAIL_DOMAIN||'example.com'}`
      await sg.send({ to, from, subject, text: body })
      return true
    }catch(e){ console.error('sendgrid send error', e); /* fallthrough to SMTP if configured */ }
  }

  // Fallback to SMTP if configured
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if(!host || !port || !user || !pass) return false
  try{
    const nodemailer = require('nodemailer')
    const transporter = nodemailer.createTransport({ host, port: parseInt(port,10), secure: port === '465', auth: { user, pass } })
    await transporter.sendMail({ from: user, to, subject, text: body })
    return true
  }catch(e){ console.error('sendMail error', e); return false }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method !== 'POST') return res.status(405).end()
  const { name, email, message } = req.body || {}
  if(!message || !email) return res.status(400).json({ error: 'email and message required' })

  // Try to persist locally when running in dev; skip on serverless/production
  let stored = false
  try{
    // Persist to DB when DATABASE_URL is available
    if(process.env.DATABASE_URL){
      try{
        const { PrismaClient } = require('@prisma/client')
        const prisma = new PrismaClient()
        await prisma.contactRequest.create({ data: { name: name||null, email, message } })
        stored = true
        await prisma.$disconnect()
      }catch(e){ console.error('prisma contact create error', e); /* fallback to dev file below */ }
    }

    // When working locally without DATABASE_URL, persist to local JSON for debugging
    if(!stored && !isProd){
      await ensureDataFile()
      const raw = await fs.readFile(DB_PATH, 'utf8').catch(()=> '[]')
      const arr = JSON.parse(raw || '[]')
      const entry = { id: Date.now().toString(36), name: name||null, email, message, createdAt: (new Date()).toISOString() }
      arr.push(entry)
      await fs.writeFile(DB_PATH, JSON.stringify(arr, null, 2), 'utf8')
      stored = true
    }

    // Try to send an email notification (best-effort)
    const emailed = await trySendEmail({ name: name||null, email, message }).catch(()=>false)
    return res.status(201).json({ ok: true, emailed, stored })
  }catch(e){ console.error('contact save error', e); return res.status(500).json({ error: 'failed' }) }
}
