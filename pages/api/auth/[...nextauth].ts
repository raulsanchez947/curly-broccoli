import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '../../../lib/prisma'

const githubClientId = process.env.GITHUB_ID || process.env.GITHUB_CLIENT_ID || ''
const githubClientSecret = process.env.GITHUB_SECRET || process.env.GITHUB_CLIENT_SECRET || ''
const googleClientId = process.env.GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || ''
const googleClientSecret = process.env.GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET || ''

if (!googleClientId || !googleClientSecret) {
  console.warn('[next-auth] Google provider CLIENT_ID/SECRET missing in env (checked GOOGLE_ID/GOOGLE_CLIENT_ID)')
}

const providers: any[] = [
  GithubProvider({ clientId: githubClientId, clientSecret: githubClientSecret }),
  GoogleProvider({ clientId: googleClientId, clientSecret: googleClientSecret }),
]

// Add a credentials provider to allow sign-in with email or phone + password
providers.push(
  CredentialsProvider({
    name: 'Credentials',
    credentials: {
      identifier: { label: 'Email or Phone', type: 'text', placeholder: 'you@example.com or +15551234567' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      const identifier = (credentials?.identifier || '').toString()
      const password = (credentials?.password || '').toString()
      console.log('[nextauth] Credentials authorize called for identifier=', identifier)
      try { fs.appendFileSync('./nextauth-debug.log', `[${new Date().toISOString()}] authorize called for ${identifier}\n`) } catch(e) { }
      if(!identifier || !password) return null

      // try find user by email or phone
      const user = await prisma.user.findFirst({ where: { OR: [{ email: identifier }, { phone: identifier }] } })
      console.log('[nextauth] Found user for identifier:', !!user, user ? { id: user.id, email: user.email, hasPassword: !!user.passwordHash } : null)
      try { fs.appendFileSync('./nextauth-debug.log', `[${new Date().toISOString()}] foundUser=${!!user} id=${user?.id || ''} hasPassword=${!!user?.passwordHash}\n`) } catch(e) { }
      if(!user || !user.passwordHash) return null
      const ok = await bcrypt.compare(password, user.passwordHash)
      console.log('[nextauth] Password compare result for', identifier, ok)
      try { fs.appendFileSync('./nextauth-debug.log', `[${new Date().toISOString()}] passwordCompare=${ok}\n`) } catch(e) { }
      if(!ok) return null
      return { id: user.id, name: user.name || undefined, email: user.email || undefined }
    }
  })
)

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  session: { strategy: 'jwt' },
  pages: { signIn: '/auth/signin', newUser: '/setup-profile' },
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret',
  debug: process.env.NEXTAUTH_DEBUG === 'true',
  callbacks: {
    async session({ session, token, user }){
      // include username and mfaEnabled in session.user for client checks
      if(session?.user?.email){
        const dbUser = await prisma.user.findUnique({ where: { email: session.user.email }, select: { username: true, mfaEnabled: true } })
        if(dbUser){ (session as any).user = { ...session.user, username: dbUser.username, mfaEnabled: dbUser.mfaEnabled } }
      }
      return session
    }
  }
}
try{ fs.appendFileSync('./nextauth-debug.log', `[${new Date().toISOString()}] authOptions.secret=${process.env.NEXTAUTH_SECRET || 'undefined'}\n`) }catch(e){}
try{ fs.appendFileSync('./nextauth-debug.log', `[${new Date().toISOString()}] authOptions.session=${JSON.stringify((authOptions as any).session)}\n`) }catch(e){}

export default NextAuth(authOptions)
