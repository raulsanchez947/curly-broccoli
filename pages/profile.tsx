import { getServerSession } from 'next-auth'
import type { Session } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]'
import { GetServerSideProps } from 'next'

export default function Profile({ user }:{user:any}){
  return (
    <div>
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="mt-4 bg-white border p-4 rounded">
        <p><strong>Email:</strong> {user?.email || '—'}</p>
        <p><strong>Name:</strong> {user?.name || '—'}</p>
        <p className="mt-2 text-sm text-gray-600">This page is server-side protected and requires sign-in.</p>
      </div>
    </div>
  )
}

export const getServerSideProps:GetServerSideProps = async (ctx) =>{
  const session = await getServerSession(ctx.req, ctx.res, authOptions as any) as Session | null
  if(!session?.user?.email){
    return { redirect: { destination: '/api/auth/signin', permanent: false } }
  }
  return { props: { user: session.user } }
}
