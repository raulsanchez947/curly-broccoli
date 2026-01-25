import { useState } from 'react'
import { useSession } from 'next-auth/react'

type Post = {
  id: string
  title: string
  content: string
  author?: string
}

export default function Community(){
  const { data: session } = useSession()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [previews, setPreviews] = useState<Post[]>([])
  const [status, setStatus] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent){
    e.preventDefault()
    if(!title.trim() || !content.trim()){
      setStatus('Please provide a title and message.')
      return
    }

    const p: Post = {
      id: String(Date.now()),
      title: title.trim(),
      content: content.trim(),
      author: session?.user?.name ?? 'You'
    }

    // Add to local preview only; do NOT persist or call any API
    setPreviews(prev => [p, ...prev])
    setTitle('')
    setContent('')
    setStatus('This is a local preview only — your post was NOT saved.')
    setTimeout(()=>setStatus(null), 4000)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Community</h1>
      <p className="mt-2">Share tips and local help — posts below are client-side previews only and are not saved to the server.</p>

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
              <button type="submit" className="px-4 py-2 bg-brand text-white rounded">Preview post</button>
              <a href="/contact" className="text-sm text-gray-600 underline">Contact us for help</a>
            </div>
            {status && <div className="text-sm text-gray-700 mt-2">{status}</div>}
          </form>

          <div className="mt-4 text-xs text-gray-500">Note: Submitting creates a preview only in your browser; nothing is sent to the server.</div>
        </div>

        <div>
          <div className="bg-white border rounded p-4">
            <h3 className="font-semibold">Recent previews</h3>
            {previews.length === 0 ? (
              <p className="text-sm text-gray-500 mt-2">No posts yet — your previews will appear here.</p>
            ) : (
              <ul className="space-y-3 mt-3">
                {previews.map(p => (
                  <li key={p.id} className="border rounded p-3">
                    <div className="text-sm text-gray-600">{p.author}</div>
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-sm mt-1 whitespace-pre-wrap">{p.content}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
