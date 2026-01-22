import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function run(){
  try{
    console.log('Connected to DB')

    // ensure test user
    const email = 'smoke@test.local'
    let user = await prisma.user.findUnique({ where: { email } })
    if(!user){
      user = await prisma.user.create({ data: { email, name: 'Smoke Tester' } })
      console.log('Created test user', user.id)
    } else {
      console.log('Found test user', user.id)
    }

    // create a message
    const msg = await prisma.message.create({ data: { content: 'Smoke test message', authorId: user.id } })
    console.log('Created message', msg.id)

    // fetch messages
    const messages = await prisma.message.findMany({ where: {}, orderBy: { createdAt: 'asc' }, include: { author: true } })
    console.log(`Messages count: ${messages.length}`)
    const last = messages[messages.length-1]
    console.log('Last message:', { id: last.id, content: last.content, authorEmail: last.author?.email })

    // create a post
    const post = await prisma.post.create({ data: { title: 'Smoke test post', content: 'Created during smoke test', authorId: user.id } })
    console.log('Created post', post.id)

    const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' }, take: 5 })
    console.log(`Recent posts count: ${posts.length}`)

    console.log('Smoke tests completed successfully')
  }catch(err){
    console.error('Smoke test error', err)
    process.exitCode = 1
  }finally{
    await prisma.$disconnect()
  }
}

run()
