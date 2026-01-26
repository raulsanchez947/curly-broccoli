const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

async function main() {
  const prisma = new PrismaClient()
  try {
    const email = process.env.TEST_USER_EMAIL || 'test-neon@example.com'
    const username = process.env.TEST_USER_USERNAME || 'test_neon_user'
    const password = process.env.TEST_USER_PASSWORD || 'Password123!'

    const exists = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    })

    if (exists) {
      console.log('User already exists:', { id: exists.id, email: exists.email, username: exists.username })
      return
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
      },
    })

    console.log('Created user:', { id: user.id, email: user.email, username: user.username })
  } catch (err) {
    console.error('Error creating test user:', err)
    process.exitCode = 1
  } finally {
    await (new PrismaClient()).$disconnect()
  }
}

main()
