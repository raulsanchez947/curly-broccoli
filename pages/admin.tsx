import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

type Post = { id: string; title: string; content: string; authorId?: string; createdAt: string }

export default function Admin(){
  const { data: session } = useSession()
  const [reports, setReports] = useState<Post[]>([])

  useEffect(()=>{
    fetchReports()
  },[])

  async function fetchReports(){
    const res = await fetch('/api/admin/reports')
    if(res.ok) setReports(await res.json())
  }

  async function unreport(id:string){
    await fetch('/api/admin/reports', {method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({id, action:'unreport'})})
    fetchReports()
  }

  async function del(id:string){
    await fetch(`/api/posts/${id}`, {method:'DELETE'})
    fetchReports()
  }

  if(!session) return <div>Please sign in as an admin to view this page.</div>

  return (
    <div>
      <h1 className="text-2xl font-bold">Admin — Reported Posts</h1>
      <p className="text-sm text-gray-600">Only visible to emails set in `ADMIN_EMAILS`.</p>

      <section className="mt-4 space-y-3">
        {reports.length === 0 && <div className="text-sm text-gray-500">No reported posts.</div>}
        {reports.map(r=> (
          <div key={r.id} className="bg-white border p-3 rounded">
            <h3 className="font-semibold">{r.title}</h3>
            <p className="text-sm mt-1">{r.content}</p>
            <div className="mt-2 flex gap-2">
              <button onClick={()=>unreport(r.id)} className="text-sm text-green-600">Unreport</button>
              <button onClick={()=>del(r.id)} className="text-sm text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
