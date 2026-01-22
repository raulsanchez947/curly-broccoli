const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main(){
  console.log('Seeding database...')

  // create example posts
  const posts = [
    {
      title: 'How I found a great apartment under budget',
      content: 'I prioritized neighborhoods, used alerts, and visited on weekdays to negotiate.'
    },
    {
      title: 'Lease break tips',
      content: 'Read your lease for early termination clauses, document issues, and communicate early with the landlord.'
    }
  ]

  for(const p of posts){
    await prisma.post.create({ data: p })
  }

  console.log('Created sample posts.')

  // optional: create a sample guide record (if you want to expand schema later)

  console.log('Seeding complete.')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
