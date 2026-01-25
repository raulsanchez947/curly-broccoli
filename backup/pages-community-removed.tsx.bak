import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

type Post = {
  id: string
  title: string
  content: string
}

export default function Community(){
  const { data: session } = useSession()
  const [posts, setPosts] = useState<Post[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(()=>{
    fetch('/api/posts').then(r=>r.json()).then(data=>setPosts(data || []))
  },[])

  async function submit(e:any){
    e.preventDefault()
    await fetch('/api/posts', {
      method:'POST',
      headers:{'content-type':'application/json'},
      body: JSON.stringify({title,content, authorEmail: session?.user?.email})
    })
    setTitle('')
    setContent('')
    const res = await fetch('/api/posts')
    setPosts(await res.json())
  }

  async function report(id:string){
    await fetch(`/api/posts/${id}`, {method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({action:'report'})})
    const res = await fetch('/api/posts')
    setPosts(await res.json())
  }

  async function del(id:string){
    await fetch(`/api/posts/${id}`, {method:'DELETE'})
    const res = await fetch('/api/posts')
    setPosts(await res.json())
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Community</h1>
      <p className="mt-2">Share advice and ask questions.</p>

      <form onSubmit={submit} className="mt-4 space-y-2">
        <label htmlFor="post-title" className="sr-only">Post title</label>
        <input id="post-title" name="title" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded" />
        <label htmlFor="post-content" className="sr-only">Post content</label>
        <textarea id="post-content" name="content" value={content} onChange={e=>setContent(e.target.value)} placeholder="Your advice or question" className="w-full p-2 border rounded" />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Post</button>
      </form>

      <section className="mt-6 space-y-4">
        {posts.map(p=> (
          <article key={p.id} className="bg-white border p-3 rounded">
            <h3 className="font-semibold">{p.title}</h3>
            <p className="text-sm mt-1">{p.content}</p>
            <div className="mt-2 flex gap-2">
              <button onClick={()=>report(p.id)} className="text-sm text-yellow-600">Report</button>
              {session?.user?.email && (
                <button onClick={()=>del(p.id)} className="text-sm text-red-600">Delete</button>
              )}
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
