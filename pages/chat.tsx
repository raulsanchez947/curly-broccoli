import Link from 'next/link'

export default function Chat(){
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Chat Removed</h1>
      <p className="mb-4">The realtime chat has been removed. Use the <Link href="/contact" className="text-blue-600">Contact</Link> form to reach out, or view <Link href="/landlords" className="text-blue-600">Landlord resources</Link>.</p>
    </main>
  )
}
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
                  {m.readBy && m.readBy.length > 0 && (
                    // show seen indicator for messages authored by the current user when others have read
                    (m.author?.id && currentUserId && m.author.id === currentUserId && (m.readBy || []).some(rid => rid !== m.author?.id)) ? (
                      <div className="text-xs text-green-600 mt-1">Seen</div>
                    ) : null
                  )}
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
            <label htmlFor="message-input" className="sr-only">Message</label>
            <input id="message-input" name="message" value={input} onChange={e=>setInput(e.target.value)} className="flex-1 p-2 border rounded" placeholder={session ? "Write a message..." : "Sign in to message"} />
            <input id="attachment" name="attachment" ref={el => { fileInputRef.current = el }} type="file" className="ml-2" onChange={e=>{ if(e.target.files && e.target.files[0]) uploadAttachment(e.target.files[0]) }} />
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
