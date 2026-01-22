import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Header() {
  const { data: session } = useSession()
  const router = useRouter()
  const [checkingAdmin, setCheckingAdmin] = useState(false)
  const userEmail = (session as any)?.user?.email

  useEffect(()=>{
    if(!userEmail) return
    // check admin status, if admin redirect to /admin
    let mounted = true
    setCheckingAdmin(true)
    fetch('/api/me', { credentials: 'same-origin' }).then(r=>r.json()).then(data=>{
      if(!mounted) return
      setCheckingAdmin(false)
      if(data?.isAdmin && router.pathname !== '/admin'){
        router.replace('/admin')
      }
    }).catch(()=>setCheckingAdmin(false))
    return ()=>{ mounted = false }
  },[userEmail])

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">Apartment Advisor</Link>
        <nav className="space-x-4 flex items-center">
          <Link href="/guides">Guides</Link>
          <div className="relative group">
            <Link href="/resources">Resources</Link>
            <div className="absolute mt-2 bg-white border rounded shadow-sm hidden group-hover:block" style={{ minWidth: 200 }}>
              <a href="/resources" className="block px-3 py-2 hover:bg-gray-50">All resources</a>
              <a href="/resources#section8-calc" className="block px-3 py-2 hover:bg-gray-50">Section 8 rent calculator</a>
              <a href="/resources#voucher" className="block px-3 py-2 hover:bg-gray-50">Housing voucher tips</a>
            </div>
          </div>
          <Link href="/community">Community</Link>
          <Link href="/chat">Chat</Link>

          {session ? (
            <>
              <span className="ml-4 text-sm flex items-center gap-2">
                {session.user?.email}
                {checkingAdmin && (
                  <svg className="animate-spin w-4 h-4 text-gray-500" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                )}
              </span>
              <button onClick={() => signOut()} className="ml-3 text-sm text-blue-600">Sign out</button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => signIn('github', { callbackUrl: window.location.href })}
                className="ml-3 inline-flex items-center px-3 py-1.5 border rounded text-sm bg-gray-900 text-white hover:bg-black"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2 .37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38C13.71 14.53 16 11.54 16 8c0-4.42-3.58-8-8-8z"></path></svg>
                Sign in with GitHub
              </button>

              <button
                onClick={() => signIn('google', { callbackUrl: window.location.href })}
                className="ml-1 inline-flex items-center px-3 py-1.5 border rounded text-sm bg-white text-gray-900 hover:bg-gray-50"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg"><path d="M533.5 278.4c0-18.5-1.5-36.4-4.3-53.7H272v101.6h147.1c-6.4 34.6-25.6 63.9-54.6 83.5v69.3h88.2c51.6-47.5 81.8-117.7 81.8-200.7z" fill="#4285F4"/><path d="M272 544.3c73.7 0 135.6-24.4 180.8-66.3l-88.2-69.3c-24.5 16.4-55.9 26-92.6 26-71 0-131.2-47.9-152.6-112.2H29.9v70.4C74.9 486.9 167 544.3 272 544.3z" fill="#34A853"/><path d="M119.4 324.5c-10.9-32.9-10.9-68.1 0-101l-89.4-70.4C3.8 190.2 0 231.7 0 272s3.8 81.8 30 119.9l89.4-70.4z" fill="#FBBC05"/><path d="M272 107.7c39.9 0 75.8 13.7 104 40.5l78-78C408.1 24.6 345.7 0 272 0 167 0 74.9 57.4 29.9 142.1l89.4 70.4C140.8 155.6 201 107.7 272 107.7z" fill="#EA4335"/></svg>
                Sign in with Google
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
