import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function run(){
  const email = process.env.DEV_AUTH_EMAIL || 'dev@local'
  let user = await prisma.user.findUnique({ where: { email } })
  if(!user){
    user = await prisma.user.create({ data: { email, name: 'Dev User' } })
    console.log('Created dev user', user.id, user.email)
  } else {
    console.log('Found dev user', user.id, user.email)
  }
  await prisma.$disconnect()
}

run().catch(err=>{ console.error(err); process.exitCode=1 })
