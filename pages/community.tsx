import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

type Reply = { id: string; author?: string | null; content: string; createdAt: number }
type Post = { id: string; title: string; content: string; author?: string | null; createdAt: number; replies?: Reply[] }

export default function Community(){
  const { data: session } = useSession()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [status, setStatus] = useState<string | null>(null)

  async function load(){
    try{
      const r = await fetch('/api/community')
      if(!r.ok) throw new Error('Failed')
      const data = await r.json()
      setPosts(data)
    }catch(e){
      setStatus('Unable to load shared posts; working offline.')
    }
  }

  useEffect(()=>{ load() }, [])

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault()
    if(!title.trim() || !content.trim()){ setStatus('Please provide a title and message.'); return }
    setStatus('Posting...')
    try{
      const r = await fetch('/api/community', { method: 'POST', headers: { 'content-type':'application/json' }, body: JSON.stringify({ title, content, author: session?.user?.name }) })
      if(!r.ok) throw new Error('failed')
      const saved = await r.json()
      setPosts(p => [saved, ...p])
      setTitle('')
      setContent('')
      setStatus('Posted — visible to others.')
      setTimeout(()=>setStatus(null), 3000)
    }catch(e){
      setStatus('Failed to post; try again later.')
    }
  }

  async function addReply(postId:string, replyContent:string){
    if(!replyContent.trim()) return
    try{
      const r = await fetch(`/api/community/${postId}/reply`, { method: 'POST', headers: { 'content-type':'application/json' }, body: JSON.stringify({ content: replyContent, author: session?.user?.name }) })
      if(!r.ok) throw new Error('reply failed')
      const reply = await r.json()
      setPosts(ps => ps.map(p => p.id === postId ? { ...p, replies: [...(p.replies||[]), reply] } : p))
    }catch(e){
      setStatus('Failed to send reply.')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Community</h1>
      <p className="mt-2">Public posts — others can reply to help answer questions.</p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <form onSubmit={handleSubmit} className="bg-white border rounded p-4 space-y-3">
            <label className="block">
              <span className="text-sm font-medium">Title</span>
              <input value={title} onChange={e=>setTitle(e.target.value)} className="mt-1 block w-full border rounded p-2" placeholder="Short headline" />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Message</span>
              <textarea value={content} onChange={e=>setContent(e.target.value)} rows={6} className="mt-1 block w-full border rounded p-2" placeholder="Describe your question or tip" />
            </label>

            <div className="flex items-center gap-3">
              <button type="submit" className="px-4 py-2 bg-brand text-white rounded">Post</button>
              <a href="/contact" className="text-sm text-gray-600 underline">Contact us for help</a>
            </div>
            {status && <div className="text-sm text-gray-700 mt-2">{status}</div>}
          </form>
        </div>

        <div>
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="bg-white border rounded p-4 text-sm text-gray-500">No posts yet.</div>
            ) : posts.map(post => (
              <article key={post.id} className="bg-white border rounded p-4">
                <div className="text-sm text-gray-600">{post.author || 'Anonymous'}</div>
                <h3 className="font-semibold">{post.title}</h3>
                <div className="text-sm mt-2 whitespace-pre-wrap">{post.content}</div>
                <div className="mt-3">
                  <ReplyList post={post} onReply={(text)=>addReply(post.id, text)} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ReplyList({ post, onReply }:{ post:Post, onReply:(s:string)=>void }){
  const [text, setText] = useState('')
  return (
    <div className="mt-3">
      <div className="text-sm font-medium">Replies</div>
      <div className="mt-2 space-y-2">
        {(!post.replies || post.replies.length === 0) ? (
          <div className="text-sm text-gray-500">No replies yet.</div>
        ) : post.replies.map(r => (
          <div key={r.id} className="border rounded p-2 text-sm">
            <div className="text-xs text-gray-600">{r.author || 'Anonymous'}</div>
            <div className="mt-1 whitespace-pre-wrap">{r.content}</div>
          </div>
        ))}
      </div>

      <form onSubmit={(e)=>{ e.preventDefault(); onReply(text); setText('') }} className="mt-3 flex gap-2">
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Write a reply..." className="flex-1 border rounded p-2 text-sm" />
        <button type="submit" className="px-3 py-1 bg-gray-100 rounded text-sm">Reply</button>
      </form>
    </div>
  )
}
