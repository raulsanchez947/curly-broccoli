import { useState } from 'react'

function Card({title, children, link}:{title:string, children:any, link?:string}){
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white border rounded">
      <button onClick={()=>setOpen(o=>!o)} className="w-full text-left p-4 flex justify-between items-center">
        <span className="font-semibold">{title}</span>
        <span className="text-sm text-gray-500">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="p-4 border-t text-sm">{children}{link && <div className="mt-2"><a className="text-blue-600 underline" href={link} target="_blank" rel="noreferrer">Open resource</a></div>}</div>}
    </div>
  )
}

export default function Resources(){
  const [query, setQuery] = useState('')

  const items = [
      {
        id: 'lease-template',
        title: 'Sample Lease Agreement',
        body: (
          <div className="space-y-2">
            <p>Download sample lease templates and a checklist to review key clauses before signing.</p>
            <ul className="list-disc list-inside mt-2 text-sm space-y-1">
              <li><strong>Parties & term:</strong> Names, start/end dates, automatic renewal.</li>
              <li><strong>Rent & fees:</strong> Amount, due date, grace period, late fees, accepted payment methods.</li>
              <li><strong>Security deposit:</strong> Amount, permitted uses, and timeline for return.</li>
              <li><strong>Utilities & additional charges:</strong> Who pays for heat, water, electricity, internet, parking.</li>
              <li><strong>Maintenance & repairs:</strong> How to report repairs and landlord response time.</li>
              <li><strong>Entry & notice:</strong> Landlord access rules and notice required for entry.</li>
              <li><strong>Termination & early break:</strong> Notice periods, penalties, and any buyout clause.</li>
            </ul>
            <div className="mt-3">
              <a className="text-blue-600 underline mr-4" href="/downloads/lease-template.html" target="_blank" rel="noreferrer">Open printable lease template</a>
              <a className="text-blue-600 underline" href="/downloads/lease-review-checklist.html" target="_blank" rel="noreferrer">Open review checklist</a>
              <a className="text-blue-600 underline ml-4" href="/downloads/lease-template.md" target="_blank" rel="noreferrer">Download .md</a>
            </div>
          </div>
        )
      },
      {
        id: 'lease-break',
        title: 'Lease Breaks & Rights',
        body: (
          <div className="space-y-2">
            <p>Detailed options and practical steps to end a lease early. Always document issues and consult legal aid if possible.</p>
            <h4 className="font-semibold">Common legal/allowed reasons</h4>
            <ul className="list-disc list-inside text-sm">
              <li><strong>Habitability / landlord breach:</strong> Serious unresolved repairs (no heat, water leaks, mold) that make the unit uninhabitable may allow termination under local laws.</li>
              <li><strong>Domestic violence / safety protections:</strong> Many jurisdictions allow early termination for victims with documentation (advocate letter, restraining order).</li>
              <li><strong>Military service:</strong> Federal protections allow active-duty service members to break leases in many cases.</li>
            </ul>
            <h4 className="font-semibold">Practical ways to break a lease</h4>
            <ol className="list-decimal list-inside text-sm">
              <li><strong>Mutual termination:</strong> Negotiate with landlord for a buyout or mutual release (offer to pay a set fee or help find a replacement tenant).</li>
              <li><strong>Assign/sublet:</strong> If allowed by lease, find a qualified replacement tenant and get landlord approval; provide a strong application package.</li>
              <li><strong>Constructive eviction/landlord breach:</strong> Document conditions (photos, repair requests) and follow local procedures; sometimes courts allow termination if landlord fails to remedy.</li>
              <li><strong>Use protected-status termination:</strong> Provide required documentation (e.g., for domestic violence or military) and follow statutory notice requirements.</li>
              <li><strong>Negotiated buyout:</strong> Offer a reasonable one-time payment (e.g., one or two months' rent) as a settlement to avoid further liability.</li>
            </ol>
            <p className="text-sm mt-2">Suggested steps: 1) Document everything (photos, messages), 2) Notify landlord in writing, 3) Seek legal aid or tenant advice, 4) If negotiating, get mutual termination in writing.</p>
            <div className="mt-2"><a className="text-blue-600 underline" href="/downloads/lease-break-templates.html" target="_blank" rel="noreferrer">Open break-letter templates</a></div>
          </div>
        )
      },
      {
        id: 'dv',
        title: 'Resources for Domestic Violence Victims',
        body: (
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <p>If you or someone you know is fleeing violence, immediate safety is the priority. National Hotline: <strong>1-800-799-7233</strong>.</p>
                <p className="mt-2">Local shelters, emergency relocation programs, and legal protections (restraining orders, lease termination exceptions) may be available — contact the hotline or local domestic violence organizations for confidential help.</p>
              </div>
              <div className="ml-4">
                <button onClick={() => { if (typeof window !== 'undefined') window.location.href = 'https://www.google.com' }} className="px-3 py-1 bg-gray-200 rounded text-sm">Quick exit</button>
              </div>
            </div>
            <div>
              <p className="mt-1">NYC support and shelters (examples):</p>
              <ul className="list-disc list-inside text-sm mt-2">
                <li><a className="text-blue-600 underline" href="https://www1.nyc.gov/site/ocdv/index.page" target="_blank" rel="noreferrer">NYC Mayor's Office to End Domestic and Gender-Based Violence</a></li>
                <li><a className="text-blue-600 underline" href="https://www.domesticviolencehelp.org/" target="_blank" rel="noreferrer">Local shelter listings and resources</a></li>
              </ul>
            </div>
          </div>
        )
      },
      {
        id: 'voucher',
        title: 'Searching with a Housing Voucher (NYC)',
        body: (
          <div className="text-sm space-y-2">
            <p>If you have a Housing Choice Voucher (Section 8) or other voucher in NYC:</p>
            <ul className="list-disc list-inside mt-2">
              <li>Contact your administering agency (NYC HRA/Department of Social Services or local PHA) to confirm voucher portability and landlord requirements.</li>
              <li>Search listings for landlords who accept vouchers, and ask landlords directly whether they accept Section 8.</li>
              <li>Use NYC resources and local housing navigators — some listings and lotteries on NYC Housing Connect indicate voucher-friendly options.</li>
            </ul>
          </div>
        )
      },
      {
        id: 'section8-calc',
        title: 'How to Calculate Section 8 Rent (Estimate)',
        body: (
          <div className="text-sm space-y-2">
            <p>Section 8 (Housing Choice Voucher) participant rent is typically calculated based on the tenant's portion of rent after applying income-based payment standards. Exact formulas vary by Public Housing Agency (PHA), but a common approach:</p>
            <ol className="list-decimal list-inside mt-2">
              <li><strong>Determine gross annual income:</strong> Add up all household gross pay (before taxes) and other countable income. For monthly, divide annual by 12.</li>
              <li><strong>Apply deductions:</strong> PHAs apply allowable deductions (dependents, medical expenses for elderly/disabled, childcare, etc.). This yields adjusted income.</li>
              <li><strong>Calculate tenant payment:</strong> Tenant share is commonly 30% of adjusted monthly income (some PHAs use 30% of gross income or a minimum rent). Example: adjusted monthly income $2,000 → tenant portion = $600.</li>
              <li><strong>Compare to Payment Standard:</strong> The PHA has a payment standard (approximate market rent for unit size). Subsidy = payment standard − tenant share. If contract rent is lower than payment standard, subsidy adjusts to contract rent − tenant share.</li>
              <li><strong>Example:</strong> Gross monthly income $3,000 → adjusted $2,400 → tenant pays 30% = $720. If PHA payment standard for the unit = $1,800 and contract rent = $1,700, subsidy = $1,700 − $720 = $980. Tenant pays $720 to landlord; housing authority pays $980 to landlord.</li>
            </ol>
            <p className="text-sm">Important: Local rules vary widely. Contact your administering PHA for exact calculation rules, allowable deductions, utility responsibilities (tenant vs. PHA), and payment standards. Keep pay stubs, proof of deductions, and documentation ready when applying.</p>
          </div>
        )
      },
      {
        id: 'discrimination',
        title: 'Fair Housing & Rental Discrimination',
        body: (
          <div>
            <p>Rental discrimination occurs when a landlord treats applicants or tenants differently because of a protected characteristic (race, color, national origin, religion, sex, familial status, disability, sexual orientation, or other protected classes under state/local law).</p>
            <div className="mt-2 space-y-2">
              <p><strong>Document:</strong> Keep ads, messages, screenshots, and notes about conversations (dates, times, names).</p>
              <p><strong>NYC resource:</strong> File a complaint or learn about tenant protections at the NYC Commission on Human Rights: <a className="text-blue-600 underline" href="https://www.nyc.gov/site/cchr/index.page" target="_blank" rel="noreferrer">https://www.nyc.gov/site/cchr/index.page</a></p>
              <p><strong>Federal resource:</strong> File with HUD's Fair Housing office: <a className="text-blue-600 underline" href="https://www.hud.gov/program_offices/fair_housing_equal_opp" target="_blank" rel="noreferrer">HUD Fair Housing</a></p>
            </div>
          </div>
        )
      }
    ]

    const filtered = items.filter(i => {
      const q = query.trim().toLowerCase()
      if(!q) return true
      const text = (i.title + ' ' + (typeof i.body === 'string' ? i.body : '')).toLowerCase()
      return text.includes(q) || i.title.toLowerCase().includes(q)
    })

    return (
      <div>
        <h1 className="text-2xl font-bold">Resources</h1>
        <p className="mt-3">Templates and legal resources to help with leases, safety, and tenant rights.</p>

        <div className="mt-4">
          <label htmlFor="resources-query" className="sr-only">Search resources</label>
          <input id="resources-query" name="query" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search resources..." className="p-2 border rounded w-full max-w-md" />
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          {filtered.map(it=> (
            <Card key={it.id} title={it.title}>{it.body}</Card>
          ))}
        </section>
      </div>
    )
    }

