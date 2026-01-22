'use strict'
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
;(async ()=>{
  const users = await prisma.user.findMany({ select: { id:true, email:true, phone:true, username:true, passwordHash: true } })
  console.log('users:', users)
  await prisma.$disconnect()
  process.exit(0)
})().catch(e=>{ console.error(e); process.exit(1) })
