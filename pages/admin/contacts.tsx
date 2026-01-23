import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function AdminContacts(){
  const { data: session } = useSession()
  const [items, setItems] = useState<any[] | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(()=>{
    fetch('/api/admin/contacts', { credentials: 'same-origin' })
      .then(r=>{ if(!r.ok) throw new Error(`${r.status}`); return r.json() })
      .then(d=>setItems(d))
      .catch(e=>setErr(e.message))
  },[])

  if(!session) return (
    <main className="container mx-auto p-8">
      <p>Please sign in to view admin contacts.</p>
      <Link href="/auth/signin">Sign in</Link>
    </main>
  )

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Contact Requests</h1>
      {err && <div className="text-red-600 mb-4">Error: {err}</div>}
      {items === null ? (
        <div>Loading…</div>
      ) : (
        <div className="space-y-4">
          {items.length === 0 && <div>No contact requests found.</div>}
          {items.map(i=> (
            <div key={i.id} className="border rounded p-3">
              <div className="text-sm text-gray-600">{new Date(i.createdAt).toLocaleString()}</div>
              <div className="font-semibold">{i.name || 'Anonymous'}</div>
              <div className="text-sm">{i.email}</div>
              <div className="mt-2 whitespace-pre-wrap">{i.message}</div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
