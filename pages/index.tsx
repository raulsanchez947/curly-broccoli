export default function Home() {
  return (
    <div>
      <div className="rounded-lg p-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white mb-8">
        <h1 className="text-4xl font-extrabold">Find better apartments — smarter</h1>
        <p className="mt-3 text-lg opacity-90">Step-by-step guides, legal resources, community tips, and real people who can help.</p>
        <p className="mt-4 text-base opacity-95">Hi — I'm here to give you the best resources for landlords and tenants alike. Please contact us if you need any assistance; we're happy to help.</p>
        <div className="mt-6">
          <a href="/contact" className="inline-block bg-white text-indigo-600 px-5 py-2 rounded shadow-md hover:scale-105 transition-transform">Contact us 💬</a>
        </div>
      </div>

      <section className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="p-6 bg-white border rounded shadow-sm hover:shadow-md transition-shadow">
          <h2 className="font-semibold">Guides</h2>
          <p className="mt-2 text-sm">Search strategy, budgeting, moving checklists.</p>
        </div>
        <div className="p-6 bg-white border rounded shadow-sm hover:shadow-md transition-shadow">
          <h2 className="font-semibold">Resources</h2>
          <p className="mt-2 text-sm">Sample leases, tenant rights, lease-break steps.</p>
        </div>
        <div className="p-6 bg-white border rounded shadow-sm hover:shadow-md transition-shadow">
          <h2 className="font-semibold">Community</h2>
          <p className="mt-2 text-sm">Ask others and share your tips.</p>
        </div>
      </section>
    </div>
  )
}
