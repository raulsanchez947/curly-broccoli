import { useEffect, useState, useRef } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { io, Socket } from 'socket.io-client'

type Message = {
  id: string
  content: string
  createdAt: string
  author?: { id?: string; name?: string | null; email?: string | null }
  conversationId?: string
  reactions?: any[]
  attachments?: { id: string; url: string; filename: string; mimeType: string }[]
}

type User = { id: string; name?: string | null; email?: string | null; isAdmin?: boolean }

export default function Chat(){
  const { data: session, status } = useSession()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [contacts, setContacts] = useState<{ id: string; user: User }[]>([])
  const [showManageContacts, setShowManageContacts] = useState(false)
  const [conversations, setConversations] = useState<any[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [totalMessages, setTotalMessages] = useState<number>(0)
  const [loadingOlder, setLoadingOlder] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const socketRef = useRef<Socket | null>(null)

  async function loadUsers(){
    const res = await fetch('/api/users', { credentials: 'same-origin' })
    if(res.ok) setUsers(await res.json())
  }

  async function loadContacts(){
    const res = await fetch('/api/contacts', { credentials: 'same-origin' })
    if(res.ok) setContacts(await res.json())
  }

  useEffect(()=>{ if(selected){
    // when opening a conversation, mark messages read
    (async ()=>{
      const res = await fetch(`/api/conversations/${selected}`, { credentials: 'same-origin' })
      if(res.ok){
        const conv = await res.json()
        const ids = (conv.messages || []).map((m:any)=>m.id)
        if(ids.length) socketRef.current?.emit('read', { conversationId: selected, messageIds: ids })
        // reload conversations list to reflect unread counts
        loadConversations()
      }
    })()
  } }, [selected])

  async function loadConversations(){
    const res = await fetch('/api/conversations', { credentials: 'same-origin' })
    if(res.ok){
      const convs = await res.json()
      convs.sort((a:any,b:any)=>{
        const ta = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0
        const tb = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0
        return tb - ta
      })
      setConversations(convs)
    }
  }

  async function loadConversation(convId?: string, opts: { limit?: number, skip?: number, prepend?: boolean } = {}){
    if(!convId) { setMessages([]); setTotalMessages(0); return }
    const limit = opts?.limit ?? 25
    let skip: number
    if(typeof opts?.skip === 'number') skip = opts!.skip
    else {
      // fetch total count quickly
      const head = await fetch(`/api/conversations/${convId}?limit=1&skip=0`, { credentials: 'same-origin' })
      if(!head.ok) { setMessages([]); setTotalMessages(0); return }
      const headJson = await head.json()
      const total = headJson.totalMessages || 0
      skip = Math.max(0, total - limit)
    }
    const res = await fetch(`/api/conversations/${convId}?limit=${limit}&skip=${skip}`, { credentials: 'same-origin' })
    if(res.ok){
      const conv = await res.json()
      const msgs = conv.messages || []
      setTotalMessages(conv.totalMessages || 0)
      if(opts?.prepend) setMessages(prev => [...msgs, ...prev])
      else setMessages(msgs)
    }
  }
  async function loadOlder(){
    if(!selected) return
    setLoadingOlder(true)
    const limit = 25
    const current = messages.length
    const total = totalMessages
    const nextSkip = Math.max(0, total - (current + limit))
    // if no more older messages, nothing to do
    if(nextSkip >= total) { setLoadingOlder(false); return }
    await loadConversation(selected, { limit, skip: nextSkip, prepend: true })
    setLoadingOlder(false)
  }

  useEffect(()=>{
    console.log('chat useSession status', status, session)
    const allowAnon = process.env.NEXT_PUBLIC_ALLOW_ANON_SOCKETS === 'true' || process.env.NODE_ENV !== 'production'
    if(status === 'loading') return
    if(!session?.user?.email && !allowAnon) return

    loadUsers()
    loadContacts()
    loadConversations()
    loadConversation(selected || undefined)

    socketRef.current = io(window.location.origin, { transports: ['websocket'], path: '/socket.io', withCredentials: true, reconnectionAttempts: 5, timeout: 20000 })
    socketRef.current.on('connect', () => console.log('socket connected', socketRef.current?.id))
    socketRef.current.on('message', (m: Message) => {
      // append message if it belongs to the currently opened conversation
      if(!selected) return
      if(m && m.conversationId === selected) {
        setMessages((prev)=>[...prev, m])
        setConversations(prev => prev.map(c => c.id === selected ? { ...c, lastMessage: m, unreadCount: c.unreadCount || 0 } : c))
        setTotalMessages(t => t + 1)
      }
    })
    socketRef.current.on('typing', (data: any) => console.log('typing', data))
    socketRef.current.on('reactions', (data: any) => {
      // update reactions for message
      const { messageId, reactions } = data || {}
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, reactions } : m))
    })
    socketRef.current.on('conversationUnread', (data: any) => {
      const { conversationId, unreadCount } = data || {}
      setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, unreadCount } : c))
    })
    socketRef.current.on('connect_error', (err) => console.error('socket connect error', err))
    return () => { socketRef.current?.disconnect() }
  }, [status, selected])

  async function send(e?: any){
    e?.preventDefault()
    if(!input) return
    if(status === 'unauthenticated'){ signIn(); return }
    if(!selected){ alert('Select a conversation (conversation id) to message'); return }
    // ensure we've joined the conversation room
    socketRef.current?.emit('sendMessage', { conversationId: selected, content: input })
    // optimistically increment unread for other participants (server will correct)
    setConversations(prev => prev.map(c => c.id === selected ? { ...c, lastMessage: { content: input, createdAt: new Date().toISOString() }, unreadCount: 0 } : c))
    setInput('')
  }

  async function toggleReaction(messageId: string, type = '❤️'){
    const res = await fetch(`/api/messages/${messageId}/reactions`, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type }) })
    if(res.ok){
      const j = await res.json()
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, reactions: j.reactions } : m))
    }
  }

  async function uploadAttachment(file?: File){
    if(!selected) return alert('Open a conversation first')
    if(!file) return
    const reader = new FileReader()
    reader.onload = async () => {
      const dataUrl = reader.result as string
      const base64 = dataUrl.split(',')[1]
      const res = await fetch(`/api/conversations/${selected}/attachments`, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filename: file.name, mimeType: file.type, data: base64, content: '' }) })
      if(!res.ok) return alert('upload failed')
      // server will broadcast new message; no further action required
    }
    reader.readAsDataURL(file)
  }

  async function addContact(contactId: string){
    const res = await fetch('/api/contacts', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contactId }) })
    if(res.ok){ await loadContacts(); setShowManageContacts(false) }
    else { const j = await res.json().catch(()=>null); alert(j?.error || 'Failed to add contact') }
  }

  async function removeContact(contactId: string){
    const res = await fetch(`/api/contacts?contactId=${contactId}`, { method: 'DELETE', credentials: 'same-origin' })
    if(res.ok || res.status === 204) await loadContacts()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Messages</h1>
      <p className="mt-2">Direct messages — pick a user and send an instant message. Use the admin toggle to message admins.</p>

      <div className="mt-4 flex gap-4">
        <div className="w-64 bg-white border p-3 rounded">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Contacts</h3>
            <button onClick={()=>{ setShowManageContacts(true); loadUsers(); }} className="text-sm text-blue-600">Manage</button>
          </div>
          <ul className="mt-2 space-y-1">
            {contacts.length === 0 && <li className="text-sm text-gray-500">No contacts yet — click Manage to add people.</li>}
            {contacts.map(c => (
              <li key={c.id}>
                  <button onClick={async ()=>{ 
                  if(selected) socketRef.current?.emit('leaveConversation', selected)
                  const r = await fetch('/api/conversations', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ participantIds: [c.user.id] }) })
                  if(!r.ok) return alert('failed to create conversation')
                  const conv = await r.json()
                  const convId = conv.id
                  setSelected(convId); loadConversation(convId)
                  socketRef.current?.emit('joinConversation', convId)
                }} className={`w-full text-left p-2 rounded`}>
                  <div className="text-sm">{c.user.name || c.user.email}</div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 bg-white border p-4 rounded">
          <div className="h-64 overflow-auto mb-3">
            {messages.length < totalMessages && (
              <div className="mb-2 text-center">
                <button onClick={loadOlder} disabled={loadingOlder} className="px-3 py-1 text-sm bg-gray-100 rounded">{loadingOlder ? 'Loading...' : 'Load older'}</button>
              </div>
            )}
            {messages.map(m=> (
              <div key={m.id} className="mb-2">
                <div className="text-xs text-gray-500">{m.author?.name || m.author?.email} · <span className="text-xs">{new Date(m.createdAt).toLocaleString()}</span></div>
                <div className="mt-1 inline-block bg-gray-100 p-2 rounded">{m.content}</div>
                  <div className="mt-1 flex gap-2 items-center">
                    <button onClick={()=>toggleReaction(m.id)} className="text-sm">❤️</button>
                    <div className="text-xs text-gray-500">{m.reactions?.length || 0}</div>
                  </div>
                  {m.attachments?.map(a=> (
                    <div key={a.id} className="mt-2">
                      {a.mimeType.startsWith('image/') ? (
                        <img src={a.url} alt={a.filename} className="max-w-xs rounded" />
                      ) : (
                        <a href={a.url} className="text-sm text-blue-600" target="_blank" rel="noreferrer">{a.filename}</a>
                      )}
                    </div>
                  ))}
              </div>
            ))}
          </div>

          <form onSubmit={send} className="flex gap-2 items-center">
            <input value={input} onChange={e=>setInput(e.target.value)} className="flex-1 p-2 border rounded" placeholder={session ? "Write a message..." : "Sign in to message"} />
            <input ref={el => { fileInputRef.current = el }} type="file" className="ml-2" onChange={e=>{ if(e.target.files && e.target.files[0]) uploadAttachment(e.target.files[0]) }} />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Send</button>
          </form>
        </div>
        {showManageContacts && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-4 rounded w-96">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Manage Contacts</h4>
                <button onClick={()=>setShowManageContacts(false)} className="text-sm text-gray-600">Close</button>
              </div>
              <div className="max-h-64 overflow-auto">
                {users.filter(u=>u.email !== session?.user?.email).map(u=>{
                  const already = contacts.find(c=>c.user.id === u.id)
                  return (
                    <div key={u.id} className="flex items-center justify-between p-2 border-b">
                      <div className="text-sm">{u.name || u.email}</div>
                      <div>
                        {already ? (
                          <button onClick={()=>removeContact(u.id)} className="text-sm text-red-600">Remove</button>
                        ) : (
                          <button onClick={()=>addContact(u.id)} className="text-sm text-blue-600">Add</button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
