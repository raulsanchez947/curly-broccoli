import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const email = process.argv[2] || 'raulsanchez947@gmail.com'

async function run(){
  const user = await prisma.user.findUnique({ where: { email } })
  if(!user) console.log('User not found:', email)
  else console.log('User:', JSON.stringify(user, null, 2))
  await prisma.$disconnect()
}

run().catch(err=>{ console.error(err); process.exitCode=1 })
