import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

type Post = {
  id: string
  title: string
  content: string
}

export default function Community(){
  return (
    <div>
      <h1 className="text-2xl font-bold">Community</h1>
      <p className="mt-2">Community posting is currently disabled. If you need help, please use the <a href="/contact" className="text-brand underline">Contact</a> page.</p>
      <div className="mt-6">
        <div className="w-full rounded-lg shadow-md bg-white p-1 overflow-hidden">
          <img src="/images/hero-community.jpg" alt="Community" className="w-full h-48 md:h-64 object-cover rounded" />
        </div>
      </div>
    </div>
  )
}
