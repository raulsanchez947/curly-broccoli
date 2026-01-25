import { useState } from 'react'

const SECTIONS = [
  {
    id: 'search',
    title: 'How to look for apartments',
    body: (
      <div className="text-sm space-y-2">
        <p><strong>Budget:</strong> Calculate rent + utilities + transit + one-time move costs. Aim for rent ≤ 30–40% of take-home pay depending on your local market.</p>
        <p><strong>Neighborhood selection:</strong> Choose 2–3 neighborhoods, then research transit times, safety, grocery options, and commute costs. Use Google Maps, local Facebook groups, and neighborhood subreddits.</p>
        <p><strong>Listing sources:</strong> Set alerts on StreetEasy, Zillow, Apartments.com, and Craigslist. Join local housing groups on Facebook and Slack for faster leads.</p>
        <p><strong>Application prep:</strong> Keep a folder with a photo ID, recent pay stubs or employment letter, bank statements, references, and a short cover note introducing yourself and explaining stable income or voucher status if applicable.</p>
        <p><strong>During tours:</strong> Test water pressure, check windows and locks, look for signs of pests or mold, ask about included utilities, parking, and any building rules. If possible, visit at different times of day.</p>
        <p><strong>Red flags:</strong> landlords who rush you, refuse to provide a written lease, ask for unusually large cash payments, or have inconsistent contact details.</p>
      </div>
    )
  },
  {
    id: 'negotiate',
    title: 'Negotiating rent',
    body: (
      <div className="text-sm space-y-2">
        <p><strong>Timing:</strong> Landlords may be more flexible during slow leasing seasons (winter) or when a unit has been empty for a while.</p>
        <p><strong>Leverage:</strong> If you have multiple strong application materials (good credit, steady job, references) or can move quickly, use that to ask for rent concessions.</p>
        <p><strong>Ask for alternatives:</strong> If a rent reduction isn't possible, negotiate for a free month, capped utilities, parking, or a small repair/upgrade before move-in.</p>
        <p><strong>Be professional:</strong> Put offers in writing, and avoid aggressive bargaining—maintain a cooperative tone.</p>
      </div>
    )
  },
  {
    id: 'moving',
    title: 'Moving checklist',
    body: (
      <div className="text-sm space-y-2">
        <p><strong>Before move-in:</strong> Schedule utilities, internet, and renter's insurance. Confirm move-in logistics (elevator reservation, loading dock, parking).</p>
        <p><strong>On move-in day:</strong> Walk each room and take timestamped photos/videos of the unit condition, including any damage. Email copies to the landlord as a record.</p>
        <p><strong>Lease review:</strong> Carefully read clauses on subletting, guests, pets, security deposit return, maintenance responsibilities, and termination notice periods.</p>
        <p><strong>Paperwork:</strong> Keep signed lease, proof of payments, receipts, and correspondence in a dedicated folder or cloud storage.</p>
      </div>
    )
  }
]

export default function Guides(){
  const [open, setOpen] = useState<string | null>(SECTIONS[0].id)

  return (
    <div>
      <div className="mb-6">
          <div className="w-full rounded-lg shadow-md bg-white p-1 overflow-hidden">
          <img src="/images/hero-guides-wikimedia.jpg" alt="Guides hero" className="w-full h-48 md:h-64 object-cover rounded" />
        </div>
      </div>
      <h1 className="text-2xl font-bold">Guides</h1>
      <p className="mt-3">Practical, interactive guides to find apartments, negotiate rent, and move in smoothly.</p>

      <div className="mt-6 space-y-3">
        {SECTIONS.map(s => (
          <div key={s.id} className="bg-white border rounded">
            <button onClick={() => setOpen(open === s.id ? null : s.id)} className="w-full text-left p-4 flex justify-between items-center">
              <span className="font-semibold">{s.title}</span>
              <span className="text-sm text-gray-500">{open === s.id ? '−' : '+'}</span>
            </button>
            {open === s.id && <div className="p-4 border-t">{s.body}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
