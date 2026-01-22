import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()
const base = 'http://localhost:3000'

async function http(path, opts={}){
  const res = await fetch(base + path, opts)
  const text = await res.text()
  let body
  try{ body = JSON.parse(text) }catch(e){ body = text }
  return { status: res.status, body }
}

function randToken(){ return crypto.randomBytes(32).toString('hex') }

async function run(){
  console.log('Starting API tests against', base)
  // public GET chat
  const chatGet = await http('/api/chat')
  console.log('/api/chat GET', chatGet.status, Array.isArray(chatGet.body) ? `messages=${chatGet.body.length}` : '')

  // public GET posts
  const postsGet = await http('/api/posts')
  console.log('/api/posts GET', postsGet.status, Array.isArray(postsGet.body) ? `posts=${postsGet.body.length}` : '')

  // public POST posts
  const postCreate = await http('/api/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 'API test post', content: 'Created by api-tests' }) })
  console.log('/api/posts POST', postCreate.status, postCreate.body?.id ? `id=${postCreate.body.id}` : '')

  // create test user
  const email = 'apitest+user@local'
  let user = await prisma.user.findUnique({ where: { email } })
  if(!user){ user = await prisma.user.create({ data: { email, name: 'API Test User' } }); console.log('Created user', user.id) } else { console.log('Found user', user.id) }

  // create session
  const sessionToken = randToken()
  const expires = new Date(Date.now() + 1000*60*60*24) // 1 day
  await prisma.session.create({ data: { sessionToken, userId: user.id, expires } })
  console.log('Created session token')

  const cookie = `next-auth.session-token=${sessionToken}`

  // authenticated POST /api/chat
  const chatPost = await http('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Cookie': cookie }, body: JSON.stringify({ content: 'Hello from api-tests' }) })
  console.log('/api/chat POST', chatPost.status, chatPost.body?.id ? `id=${chatPost.body.id}` : JSON.stringify(chatPost.body))

  // create reported post and test admin endpoint
  const reportedPost = await prisma.post.create({ data: { title: 'Reported', content: 'Please review', reported: true, authorId: user.id } })
  console.log('Created reported post', reportedPost.id)

  // make user admin
  await prisma.user.update({ where: { id: user.id }, data: { isAdmin: true } })
  console.log('User marked admin')

  const adminGet = await http('/api/admin/reports', { headers: { 'Cookie': cookie } })
  console.log('/api/admin/reports GET', adminGet.status, Array.isArray(adminGet.body) ? `reports=${adminGet.body.length}` : JSON.stringify(adminGet.body))

  // cleanup: leave test data for inspection

  await prisma.$disconnect()
  console.log('API tests completed')
}

run().catch(err=>{ console.error(err); process.exitCode=1 })
