const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const email = process.argv[2]
if(!email){
  console.error('Usage: node scripts/make-admin.js user@example.com')
  process.exit(1)
}

async function main(){
  const user = await prisma.user.findUnique({ where: { email } })
  if(!user){
    console.error('User not found:', email)
    process.exit(1)
  }
  await prisma.user.update({ where: { email }, data: { isAdmin: true } })
  console.log('User marked as admin:', email)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
