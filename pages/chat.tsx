import { useEffect, useState } from 'react'

export default function ChatPage() {
  const [url, setUrl] = useState('')

  useEffect(()=>{
    const envUrl = process.env.NEXT_PUBLIC_CHATBOT_URL || '/chatbot'
    setUrl(envUrl)
  },[])

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Chatbot</h1>
      <p className="mb-4">This page embeds the chatbot app. If the chatbot is deployed separately, set `NEXT_PUBLIC_CHATBOT_URL` to its URL.</p>
      <div style={{ height: '70vh', border: '1px solid #e5e7eb' }}>
        {url ? (
          <iframe src={url} title="Chatbot" style={{ width: '100%', height: '100%', border: '0' }} />
        ) : (
          <div className="p-4">Chatbot URL not configured.</div>
        )}
      </div>
    </div>
  )
}
import Link from 'next/link'

export default function Chat(){
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Chat Removed</h1>
      <p className="mb-4">The realtime chat has been removed. Use the <Link href="/contact" className="text-blue-600">Contact</Link> form to reach out, or view <Link href="/landlords" className="text-blue-600">Landlord resources</Link>.</p>
    </main>
  )
}
