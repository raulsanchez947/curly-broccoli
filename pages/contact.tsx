import { useState } from 'react'

export default function Contact(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle')

  async function handleSubmit(e:any){
    e.preventDefault()
    setStatus('sending')
    try{
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, message }) })
      if(res.ok){ setStatus('sent'); setName(''); setEmail(''); setMessage('') }
      else { setStatus('error') }
    }catch(e){ console.error(e); setStatus('error') }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">Contact Us</h1>
      <p className="mt-2 text-gray-600">Have feedback or need help? Send us a message and we'll get back to you.</p>

      <form onSubmit={handleSubmit} className="mt-6 bg-white border p-6 rounded shadow-sm">
        <label className="block">
          <span className="text-sm font-medium">Name</span>
          <input value={name} onChange={e=>setName(e.target.value)} className="mt-1 block w-full p-2 border rounded" placeholder="Your name" />
        </label>

        <label className="block mt-4">
          <span className="text-sm font-medium">Email</span>
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" className="mt-1 block w-full p-2 border rounded" placeholder="you@example.com" />
        </label>

        <label className="block mt-4">
          <span className="text-sm font-medium">Message</span>
          <textarea value={message} onChange={e=>setMessage(e.target.value)} className="mt-1 block w-full p-2 border rounded" rows={6} placeholder="How can we help?" />
        </label>

        <div className="mt-4 flex items-center gap-3">
          <button type="submit" disabled={status==='sending'} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{status==='sending' ? 'Sending...' : 'Send message'}</button>
          {status === 'sent' && <div className="text-sm text-green-600">Thanks — we'll reply soon.</div>}
          {status === 'error' && <div className="text-sm text-red-600">Failed to send — try again later.</div>}
        </div>
      </form>

      <section className="mt-8 text-sm text-gray-600">
        <p>Prefer email? Write to hello@apartment-advisor.local (dev only).</p>
      </section>
    </div>
  )
}
