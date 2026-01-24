export default function Home() {
  return (
    <div>
      <div className="rounded-lg p-8 bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-400 text-white mb-8 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold">Find better apartments — smarter</h1>
            <p className="mt-3 text-lg opacity-95">Step-by-step guides, legal resources, helpful tips, and people who care.</p>
            <p className="mt-4 text-base opacity-95">Practical checklists, sample leases, and community-supported advice — all in one place.</p>
            <div className="mt-6">
              <a href="/contact" className="inline-block bg-white text-indigo-700 px-6 py-3 rounded-lg shadow-md transform hover:scale-105 transition">Contact us</a>
              <a href="/resources" className="ml-4 inline-block bg-transparent border border-white text-white px-6 py-3 rounded-lg shadow-sm hover:bg-white/10 transition">Browse Guides</a>
            </div>
          </div>
          <div className="hidden md:block">
            <svg width="220" height="140" viewBox="0 0 220 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-lg shadow-xl">
              <rect width="220" height="140" rx="12" fill="white" />
              <g transform="translate(12,12)">
                <rect width="196" height="116" rx="8" fill="#eef2ff" />
                <circle cx="36" cy="36" r="28" fill="#c7d2fe" />
                <rect x="76" y="18" width="96" height="16" rx="6" fill="#a78bfa" />
                <rect x="76" y="42" width="120" height="10" rx="5" fill="#ddd6fe" />
                <rect x="0" y="76" width="196" height="18" rx="6" fill="#f1f5f9" />
              </g>
            </svg>
          </div>
        </div>
      </div>

      <section className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="p-6 bg-white border rounded-lg shadow hover:shadow-lg transition-shadow transform hover:-translate-y-1">
          <h2 className="font-semibold text-lg">Guides</h2>
          <p className="mt-2 text-sm">Search strategy, budgeting, moving checklists.</p>
        </div>
        <div className="p-6 bg-white border rounded-lg shadow hover:shadow-lg transition-shadow transform hover:-translate-y-1">
          <h2 className="font-semibold text-lg">Resources</h2>
          <p className="mt-2 text-sm">Sample leases, tenant rights, lease-break steps.</p>
        </div>
        <div className="p-6 bg-white border rounded-lg shadow hover:shadow-lg transition-shadow transform hover:-translate-y-1">
          <h2 className="font-semibold text-lg">Community Help</h2>
          <p className="mt-2 text-sm">Connect via Contact — find local support and expert tips.</p>
        </div>
      </section>
    </div>
  )
}

