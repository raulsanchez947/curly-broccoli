import type { NextApiRequest, NextApiResponse } from 'next'

function mask(v?: string){
  if(!v) return null
  const len = v.length
  if(len <= 8) return '****'
  return '****' + v.slice(-4)
}

export default function handler(req: NextApiRequest, res: NextApiResponse){
  const googleId = process.env.GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || null
  const googleSecret = process.env.GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET || null
  const githubId = process.env.GITHUB_ID || process.env.GITHUB_CLIENT_ID || null
  const githubSecret = process.env.GITHUB_SECRET || process.env.GITHUB_CLIENT_SECRET || null
  const nextauth = process.env.NEXTAUTH_SECRET || null

  res.status(200).json({
    google: {
      present: !!googleId && !!googleSecret,
      id: googleId ? mask(googleId) : null,
      secretPresent: !!googleSecret,
    },
    github: {
      present: !!githubId && !!githubSecret,
      id: githubId ? mask(githubId) : null,
      secretPresent: !!githubSecret,
    },
    nextauthSecretPresent: !!nextauth,
    nodeEnv: process.env.NODE_ENV || null,
  })
}
