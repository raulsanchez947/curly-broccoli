import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function SetupProfile(){
  const { data: session, status } = useSession()
  const router = useRouter()
  const [me, setMe] = useState<any>(null)
  const [username, setUsername] = useState('')
  const [qr, setQr] = useState<string | null>(null)
  const [secret, setSecret] = useState<string | null>(null)
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [mfaEnabled, setMfaEnabled] = useState(false)

  useEffect(()=>{ if(status === 'authenticated'){
    (async ()=>{
      const r = await fetch('/api/me')
      if(r.ok){ const j = await r.json(); setMe(j); setUsername(j.username || '') ; setMfaEnabled(!!j.mfaEnabled) }
    })()
  } }, [status])

  useEffect(()=>{
    if(me && me.username) router.replace('/')
  }, [me])

  async function saveUsername(){
    const r = await fetch('/api/me', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ username, password }) })
    if(r.ok) router.replace('/')
    else { const j = await r.json().catch(()=>null); alert(j?.error || 'Failed') }
  }

  async function startMfa(){
    const r = await fetch('/api/mfa/generate')
    if(!r.ok) return alert('Failed to generate')
    const j = await r.json()
    setSecret(j.secret); setQr(j.qr)
  }

  async function confirmMfa(){
    if(!secret) return alert('No secret')
    const r = await fetch('/api/mfa/verify', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ token, secret }) })
    if(r.ok){ setMfaEnabled(true); setQr(null); setSecret(null); alert('MFA enabled') }
    else { const j = await r.json().catch(()=>null); alert(j?.error || 'Invalid token') }
  }

  if(status === 'loading') return <div>Loading...</div>
  if(status !== 'authenticated') return <div>Please sign in first.</div>

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Welcome — finish setting up your account</h2>
      <div className="mt-4">
        <label className="block text-sm" htmlFor="setup-username">Choose a username</label>
        <input id="setup-username" name="username" value={username} onChange={e=>setUsername(e.target.value)} className="border p-2 mt-1" />
        <div className="mt-2">
          <label className="block text-sm" htmlFor="setup-password">Choose a password (optional)</label>
          <input id="setup-password" name="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} className="border p-2 mt-1" />
        </div>
        <div className="mt-2">
          <button onClick={saveUsername} className="px-3 py-1 bg-blue-600 text-white rounded">Save username</button>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="font-semibold">Multi-factor Authentication</h4>
        {mfaEnabled ? (
          <div className="text-sm text-green-600">MFA is enabled for your account.</div>
        ) : (
          <div>
            {!qr ? (
              <div className="mt-2">
                <button onClick={startMfa} className="px-3 py-1 bg-gray-700 text-white rounded">Enable MFA</button>
              </div>
            ) : (
              <div className="mt-2">
                <div>Scan this QR with your authenticator app:</div>
                <img src={qr} alt="qr" className="my-2" />
                <div className="text-xs text-gray-500">Or use secret: {secret}</div>
                <input id="mfa-token" name="mfa-token" value={token} onChange={e=>setToken(e.target.value)} placeholder="Enter code from app" className="border p-1 mt-2" />
                <div className="mt-2"><button onClick={confirmMfa} className="px-3 py-1 bg-blue-600 text-white rounded">Confirm</button></div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6">
        <button onClick={()=>signOut()} className="text-sm text-red-600">Sign out</button>
      </div>
    </div>
  )
}
