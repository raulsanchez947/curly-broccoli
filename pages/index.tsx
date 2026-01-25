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
              <a href="/contact" className="inline-block bg-white text-brand px-6 py-3 rounded-lg shadow-md transform hover:scale-105 transition">Contact us</a>
              <a href="/resources" className="ml-4 inline-block bg-transparent border border-white text-white px-6 py-3 rounded-lg shadow-sm hover:bg-white/10 transition">Browse Guides</a>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-full md:w-[520px] h-40 md:h-56 rounded-lg shadow-xl bg-white p-1 overflow-hidden">
              <img src="/images/hero-home-wikimedia.jpg" alt="Apartments and housing" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      <section className="mt-8 grid gap-6 md:grid-cols-3">
        <a href="/guides" className="block p-6 bg-white border rounded-lg shadow hover:shadow-lg transition-shadow transform hover:-translate-y-1">
          <div className="flex items-start gap-4">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
              <path d="M3 11.5L12 4l9 7.5v6.5a1 1 0 0 1-1 1h-4v-6H8v6H4a1 1 0 0 1-1-1v-6.5z" fill="#ff4d6d" />
            </svg>
            <div>
              <h2 className="font-semibold text-lg">Guides</h2>
              <p className="mt-2 text-sm">Search strategy, budgeting, moving checklists.</p>
            </div>
          </div>
        </a>

        <a href="/resources" className="block p-6 bg-white border rounded-lg shadow hover:shadow-lg transition-shadow transform hover:-translate-y-1">
          <div className="flex items-start gap-4">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
              <rect x="3" y="5" width="18" height="14" rx="2" fill="#ff4d6d" />
              <path d="M7 9h10v2H7z" fill="#fff" />
              <path d="M7 13h6v2H7z" fill="#fff" />
            </svg>
            <div>
              <h2 className="font-semibold text-lg">Resources</h2>
              <p className="mt-2 text-sm">Sample leases, tenant rights, lease-break steps.</p>
            </div>
          </div>
        </a>

        <a href="/community" className="block p-6 bg-white border rounded-lg shadow hover:shadow-lg transition-shadow transform hover:-translate-y-1">
          <div className="flex items-start gap-4">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
              <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" fill="#ff4d6d" />
              <path d="M4 20a8 8 0 0 1 16 0v0H4z" fill="#ff9aa2" />
            </svg>
            <div>
              <h2 className="font-semibold text-lg">Community Help</h2>
              <p className="mt-2 text-sm">Connect via Contact — find local support and expert tips.</p>
            </div>
          </div>
        </a>
      </section>
    </div>
  )
}

