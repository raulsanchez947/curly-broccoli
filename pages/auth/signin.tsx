import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function SignIn(){
  const [mode, setMode] = useState<'signin'|'register'>('signin')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const router = useRouter()
  useEffect(()=>{
    if(router.query?.mode === 'register') setMode('register')
  },[router.query])

  async function handleSignIn(e:any){
    e?.preventDefault()
    const res = await signIn('credentials', { redirect: false, identifier, password })
    if(res?.ok) router.replace('/')
    else alert('Sign-in failed')
  }

  async function handleRegister(e:any){
    e?.preventDefault()
    const body: any = { password }
    // detect if identifier is phone or email
    if(identifier.includes('@')) body.email = identifier
    else body.phone = identifier
    if(username) body.username = username
    const r = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(body) })
    if(r.ok){
      // after registering, sign in
      const res = await signIn('credentials', { redirect: false, identifier, password })
      if(res?.ok) router.replace('/')
      else alert('Registered but sign-in failed')
    }else{
      const j = await r.json().catch(()=>null); alert(j?.error || 'Registration failed')
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Sign in</h2>
      <div className="mb-4">
        <button onClick={()=>setMode('signin')} className={`px-3 py-1 ${mode==='signin'? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Sign in</button>
        <button onClick={()=>setMode('register')} className={`px-3 py-1 ml-2 ${mode==='register'? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Register</button>
      </div>

      <form onSubmit={mode==='signin'? handleSignIn : handleRegister}>
        <label className="block text-sm" htmlFor="identifier">Email or phone</label>
        <input id="identifier" name="identifier" value={identifier} onChange={e=>setIdentifier(e.target.value)} className="border p-2 w-full mt-1 mb-3" />
        {mode==='register' && (
          <>
            <label className="block text-sm" htmlFor="username">Choose a username (optional)</label>
            <input id="username" name="username" value={username} onChange={e=>setUsername(e.target.value)} className="border p-2 w-full mt-1 mb-3" />
          </>
        )}
        <label className="block text-sm" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} className="border p-2 w-full mt-1 mb-3" />
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{mode==='signin'? 'Sign in' : 'Register'}</button>
          <button type="button" onClick={()=>signIn('google', { callbackUrl: (router.query?.callbackUrl as string) || window.location.origin })} className="px-4 py-2 bg-gray-100 rounded">Continue with Google</button>
          <button type="button" onClick={()=>signIn('github', { callbackUrl: (router.query?.callbackUrl as string) || window.location.origin })} className="px-4 py-2 bg-gray-100 rounded">Continue with GitHub</button>
        </div>
      </form>
    </div>
  )
}
