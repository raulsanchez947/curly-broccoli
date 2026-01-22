export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Find better apartments — smarter</h1>
      <p className="mt-4 text-lg">Step-by-step guides, legal resources, community tips, and a chatbot to answer questions.</p>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="p-4 bg-white border rounded">
          <h2 className="font-semibold">Guides</h2>
          <p className="mt-2 text-sm">Search strategy, budgeting, moving checklists.</p>
        </div>
        <div className="p-4 bg-white border rounded">
          <h2 className="font-semibold">Resources</h2>
          <p className="mt-2 text-sm">Sample leases, tenant rights, lease-break steps.</p>
        </div>
        <div className="p-4 bg-white border rounded">
          <h2 className="font-semibold">Community</h2>
          <p className="mt-2 text-sm">Ask others and share your tips.</p>
        </div>
      </section>
    </div>
  )
}
