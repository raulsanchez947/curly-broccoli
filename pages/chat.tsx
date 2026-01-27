import { useEffect, useState } from 'react'

export default function ChatPage() {
  const [url, setUrl] = useState('')

  useEffect(()=>{
    const envUrl = process.env.NEXT_PUBLIC_CHATBOT_URL || '/chatbot'
    setUrl(envUrl)
  },[])

  return (
    <div style={{ height: '70vh', border: '1px solid #e5e7eb' }}>
      {url ? (
        <iframe src={url} title="Chatbot" style={{ width: '100%', height: '100%', border: '0' }} />
      ) : (
        <div className="p-4">Chatbot URL not configured.</div>
      )}
    </div>
  )
}

