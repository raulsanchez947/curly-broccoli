import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const argv = process.argv.slice(2)
if(argv.length < 1){
  console.error('Usage: node scripts/create-user.mjs user@example.com "Full Name" [--admin]')
  process.exit(1)
}

const email = argv[0]
const name = argv[1] || email.split('@')[0]
const isAdmin = argv.includes('--admin') || argv.includes('-a')

async function run(){
  let user = await prisma.user.findUnique({ where: { email } })
  if(!user){
    user = await prisma.user.create({ data: { email, name } })
    console.log('Created user:', user.id, user.email)
  } else {
    console.log('Found existing user:', user.id, user.email)
  }

  if(isAdmin){
    await prisma.user.update({ where: { email }, data: { isAdmin: true } })
    console.log('Marked user as admin')
  }

  await prisma.$disconnect()
}

run().catch(err=>{ console.error(err); process.exitCode=1 })
