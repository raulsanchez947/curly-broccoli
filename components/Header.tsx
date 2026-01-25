import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function Header() {
  const { data: session } = useSession()
  const [checkingAdmin, setCheckingAdmin] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const userEmail = (session as any)?.user?.email

  useEffect(()=>{
    if(!userEmail) {
      setIsAdmin(false)
      return
    }
    let mounted = true
    setCheckingAdmin(true)
    fetch('/api/me', { credentials: 'same-origin' }).then(r=>r.json()).then(data=>{
      if(!mounted) return
      setIsAdmin(!!data?.isAdmin)
      setCheckingAdmin(false)
    }).catch(()=>{
      setIsAdmin(false)
      setCheckingAdmin(false)
    })
    return ()=>{ mounted = false }
  },[userEmail])

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">Apartment Advisor</Link>
        <nav className="space-x-4 flex items-center">
          <Link href="/guides" className="font-medium">Guides</Link>
          <Link href="/chat" className="font-medium">Chat</Link>
          <div className="relative group">
            <Link href="/resources">Resources</Link>
            <div className="absolute mt-2 bg-white border rounded shadow-sm hidden group-hover:block" style={{ minWidth: 200 }}>
              <a href="/resources" className="block px-3 py-2 hover:bg-gray-50">All resources</a>
              <a href="/resources#section8-calc" className="block px-3 py-2 hover:bg-gray-50">Section 8 rent calculator</a>
              <a href="/resources#voucher" className="block px-3 py-2 hover:bg-gray-50">Housing voucher tips</a>
            </div>
          </div>
          <Link href="/landlords" className="font-medium">Landlords</Link>
          <Link href="/contact" className="font-medium bg-brand/10 text-brand px-3 py-1 rounded">Contact</Link>

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
              {isAdmin && <Link href="/admin" className="ml-3 text-sm text-brand">Admin</Link>}
              <button onClick={() => signOut()} className="ml-3 text-sm text-brand">Sign out</button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/signin" className="inline-flex items-center px-3 py-1.5 border rounded text-sm bg-brand text-white hover:brightness-95">Log in</Link>
              <Link href={{ pathname: '/auth/signin', query: { mode: 'register' } }} className="inline-flex items-center px-3 py-1.5 border rounded text-sm bg-white text-gray-900 hover:bg-gray-50">Register</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
