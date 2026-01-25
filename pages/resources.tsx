import { useState } from 'react'

function TenantCalculator(){
  const [gross, setGross] = useState<number | ''>('')
  const [deductions, setDeductions] = useState<number | ''>('')
  const [paymentStandard, setPaymentStandard] = useState<number | ''>('')
  const [contractRent, setContractRent] = useState<number | ''>('')
  const [utilityAllowance, setUtilityAllowance] = useState<number | ''>('')

  const g = Number(gross || 0)
  const d = Number(deductions || 0)
  const adj = Math.max(0, g - d)
  const tenantShare = Math.round(adj * 0.3)
  const ps = Number(paymentStandard || 0)
  const cr = Number(contractRent || 0)
  const ua = Number(utilityAllowance || 0)
  const applicableRent = cr > 0 ? cr : ps
  const rentPortion = Math.max(0, applicableRent - ua)
  const subsidy = Math.max(0, Math.min(ps || applicableRent, rentPortion) - tenantShare)

  return (
    <div className="space-y-2 text-sm">
      <div className="grid grid-cols-2 gap-2">
        <input type="number" placeholder="Gross monthly income" value={gross as any} onChange={e=>setGross(e.target.value?Number(e.target.value):'')} className="p-2 border rounded" />
        <input type="number" placeholder="Deductions (monthly)" value={deductions as any} onChange={e=>setDeductions(e.target.value?Number(e.target.value):'')} className="p-2 border rounded" />
        <input type="number" placeholder="Payment standard (monthly)" value={paymentStandard as any} onChange={e=>setPaymentStandard(e.target.value?Number(e.target.value):'')} className="p-2 border rounded" />
        <input type="number" placeholder="Utility allowance (monthly)" value={utilityAllowance as any} onChange={e=>setUtilityAllowance(e.target.value?Number(e.target.value):'')} className="p-2 border rounded" />
        <input type="number" placeholder="Contract rent (optional)" value={contractRent as any} onChange={e=>setContractRent(e.target.value?Number(e.target.value):'')} className="p-2 border rounded col-span-2" />
      </div>

      <div className="bg-gray-50 p-2 rounded">
        <div><strong>Adjusted monthly income:</strong> ${adj.toFixed(0)}</div>
        <div><strong>Estimated tenant share (30%):</strong> ${tenantShare}</div>
        <div><strong>Rent portion (rent minus utilities):</strong> ${rentPortion.toFixed(0)}</div>
        <div><strong>Estimated subsidy (approx):</strong> ${subsidy.toFixed(0)}</div>
        <div className="text-xs text-gray-600 mt-1">Notes: This is an estimate. PHAs apply local deductions and rules. If contract rent &lt; payment standard, subsidy uses contract rent.</div>
      </div>
    </div>
  )
}

function LandlordCalculator(){
  const [paymentStandard, setPaymentStandard] = useState<number | ''>('')
  const [utilityAllowance, setUtilityAllowance] = useState<number | ''>('')
  const [contractRent, setContractRent] = useState<number | ''>('')
  const [tenantShare, setTenantShare] = useState<number | ''>('')

  const ps = Number(paymentStandard || 0)
  const ua = Number(utilityAllowance || 0)
  const cr = Number(contractRent || 0)
  const ts = Number(tenantShare || 0)
  const rentPortion = Math.max(0, cr - ua)
  const coveredByVoucher = Math.min(ps || rentPortion, rentPortion)
  const subsidy = Math.max(0, coveredByVoucher - ts)

  return (
    <div className="space-y-2 text-sm">
      <div className="grid grid-cols-2 gap-2">
        <input type="number" placeholder="Payment standard (monthly)" value={paymentStandard as any} onChange={e=>setPaymentStandard(e.target.value?Number(e.target.value):'')} className="p-2 border rounded" />
        <input type="number" placeholder="Utility allowance (monthly)" value={utilityAllowance as any} onChange={e=>setUtilityAllowance(e.target.value?Number(e.target.value):'')} className="p-2 border rounded" />
        <input type="number" placeholder="Contract rent (monthly)" value={contractRent as any} onChange={e=>setContractRent(e.target.value?Number(e.target.value):'')} className="p-2 border rounded col-span-2" />
        <input type="number" placeholder="Estimated tenant share (monthly)" value={tenantShare as any} onChange={e=>setTenantShare(e.target.value?Number(e.target.value):'')} className="p-2 border rounded col-span-2" />
      </div>

      <div className="bg-gray-50 p-2 rounded">
        <div><strong>Rent portion (contract rent − utility allowance):</strong> ${rentPortion.toFixed(0)}</div>
        <div><strong>Payment standard:</strong> ${ps.toFixed(0)}</div>
        <div><strong>Covered by voucher (max):</strong> ${coveredByVoucher.toFixed(0)}</div>
        <div><strong>Estimated subsidy to landlord:</strong> ${subsidy.toFixed(0)}</div>
        <div className="text-xs text-gray-600 mt-1">If rent portion &le; payment standard, the voucher can cover up to that amount (less tenant share). Utility allowance is subtracted from total rent for subsidy calculations in many PHAs.</div>
      </div>
    </div>
  )
}

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

            <h4 className="font-semibold mt-2">Apartment search tips for voucher holders</h4>
            <div className="text-sm space-y-2">
              <p><strong>Target neighborhoods:</strong> pick 2–3 areas and expand radius; be flexible on unit size when possible.</p>
              <p><strong>Prepare materials:</strong> have a package with voucher docs, ID, proof of income, references, and a short cover note explaining voucher portability and timeliness.</p>
              <p><strong>Use direct scripts:</strong> when contacting landlords, be brief and clear — see sample below.</p>
            </div>

            <h4 className="font-semibold mt-2">Sample script to speak with landlords</h4>
            <div className="bg-gray-50 p-3 rounded text-sm">
              <p>Hi — my name is [First Last]. I have a Housing Choice Voucher and steady income. The voucher covers a portion of rent through the housing authority and I can provide all documentation and references. Are you open to renting to a tenant with a voucher? I can move quickly and provide the required paperwork.</p>
              <p className="mt-2"><em>Tip:</em> If the landlord is unsure, offer to share the PHA contact or the landlord packet from your agency.</p>
            </div>
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
        <div className="mb-6">
          <div className="w-full rounded-lg shadow-md bg-white p-1 overflow-hidden">
            <img src="/images/hero-guides-wikimedia.jpg" alt="Resources hero" className="w-full h-48 md:h-64 object-cover rounded" />
          </div>
        </div>
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

