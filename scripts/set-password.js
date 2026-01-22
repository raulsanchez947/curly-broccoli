'use strict'
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const email = process.argv[2] || 'raulsanchez947@gmail.com'
const password = process.argv[3] || 'devpassword'
const prisma = new PrismaClient()
;(async ()=>{
  const user = await prisma.user.findUnique({ where: { email } })
  if(!user){ console.error('User not found:', email); process.exit(2) }
  const hash = await bcrypt.hash(password, 10)
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hash } })
  console.log('Password updated for', email)
  await prisma.$disconnect()
  process.exit(0)
})().catch(e=>{ console.error(e); process.exit(1) })
