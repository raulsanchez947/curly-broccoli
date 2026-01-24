import Link from 'next/link'

export default function Chat(){
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Chat Removed</h1>
      <p className="mb-4">The realtime chat has been removed. Use the <Link href="/contact" className="text-blue-600">Contact</Link> form to reach out, or view <Link href="/landlords" className="text-blue-600">Landlord resources</Link>.</p>
    </main>
  )
}
