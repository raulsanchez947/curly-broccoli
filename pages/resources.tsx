import { useState } from 'react'

function TenantCalculator(){
  const [gross, setGross] = useState<number | ''>('')
  const [paymentStandard, setPaymentStandard] = useState<number | ''>('')
  const [contractRent, setContractRent] = useState<number | ''>('')
  const [utilityAllowance, setUtilityAllowance] = useState<number | ''>('')
  const [allCitizens, setAllCitizens] = useState<'yes' | 'no' | null>(null)
  const [totalHousehold, setTotalHousehold] = useState<number | ''>('')
  const [eligibleMembers, setEligibleMembers] = useState<number | ''>('')
  const [showModal, setShowModal] = useState(false)

  // gross is treated as ANNUAL gross income for this calculator
  const g = Number(gross || 0)
  const adjMonthly = Math.max(0, g / 12)
  const tenantShare = Math.round(adjMonthly * 0.3)
  const ps = Number(paymentStandard || 0)
  const cr = Number(contractRent || 0)
  const ua = Number(utilityAllowance || 0)
  const applicableRent = cr > 0 ? cr : ps
  const rentPortion = Math.max(0, applicableRent - ua)
  
  // Pro-ration calculations
  const totalHH = Number(totalHousehold || 0)
  const eligible = Number(eligibleMembers || 0)
  const hasProration = allCitizens === 'no' && totalHH > 0 && eligible > 0
  const prorationType = hasProration && eligible > 0 ? 'member-max' : 'full'
  
  let baseMemberMax = Math.max(0, Math.min(ps || applicableRent, rentPortion) - tenantShare)
  let proratedSubsidy = baseMemberMax
  
  if (hasProration) {
    // Proration factor = eligible members / total household
    const prorFactor = eligible / totalHH
    proratedSubsidy = Math.max(0, baseMemberMax * prorFactor)
  }

  const subsidy = proratedSubsidy
  
  // Reset modal when allCitizens changes to 'yes'
  const handleCitizenYes = () => {
    setAllCitizens('yes')
    setShowModal(false)
    setTotalHousehold('')
    setEligibleMembers('')
  }

  const handleCitizenNo = () => {
    setAllCitizens('no')
    setShowModal(true)
  }

  return (
    <div className="space-y-2 text-sm">
      {/* Citizenship Question */}
      <div className="bg-blue-50 p-3 border border-blue-200 rounded">
        <p className="font-semibold mb-2">Are all household members U.S. citizens or have eligible immigration status?</p>
        <div className="flex gap-2">
          <button onClick={handleCitizenYes} className={`px-4 py-2 rounded ${allCitizens === 'yes' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>Yes</button>
          <button onClick={handleCitizenNo} className={`px-4 py-2 rounded ${allCitizens === 'no' ? 'bg-red-600 text-white' : 'bg-white border'}`}>No</button>
        </div>
      </div>

      {/* Pro-ration Modal */}
      {showModal && (
        <div className="border-l-4 border-orange-400 bg-orange-50 p-3 rounded">
          <p className="font-semibold mb-2">Household Composition (for pro-ration)</p>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" placeholder="Total household members" value={totalHousehold as any} onChange={e=>setTotalHousehold(e.target.value?Number(e.target.value):'')} className="p-2 border rounded" min="1" />
            <input type="number" placeholder="Eligible members (citizens)" value={eligibleMembers as any} onChange={e=>setEligibleMembers(e.target.value?Number(e.target.value):'')} className="p-2 border rounded" min="0" />
          </div>
          <p className="text-xs text-gray-600 mt-2">The Housing Assistance Payment (HAP) will be pro-rated based on the ratio of eligible family members to total household size.</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <input type="number" placeholder="Gross annual Household income" value={gross as any} onChange={e=>setGross(e.target.value?Number(e.target.value):'')} className="p-2 border rounded" />
        <div className="p-2 text-sm text-gray-600">(annual)</div>
        <input type="number" placeholder="Payment standard (monthly)" value={paymentStandard as any} onChange={e=>setPaymentStandard(e.target.value?Number(e.target.value):'')} className="p-2 border rounded" />
        <input type="number" placeholder="Utility allowance (monthly)" value={utilityAllowance as any} onChange={e=>setUtilityAllowance(e.target.value?Number(e.target.value):'')} className="p-2 border rounded" />
        <input type="number" placeholder="Contract rent (optional)" value={contractRent as any} onChange={e=>setContractRent(e.target.value?Number(e.target.value):'')} className="p-2 border rounded col-span-2" />
      </div>

      <div className="bg-gray-50 p-2 rounded">
        <div><strong>Adjusted monthly income:</strong> ${adjMonthly.toFixed(0)}</div>
        <div><strong>Estimated tenant share (30% monthly):</strong> ${tenantShare}</div>
        <div><strong>Rent portion (rent minus utilities):</strong> ${rentPortion.toFixed(0)}</div>
        {hasProration && (
          <>
            <div><strong>Proration factor:</strong> {eligible}/{totalHH} = {(eligible/totalHH).toFixed(3)}</div>
            <div><strong>Member maximum subsidy:</strong> ${baseMemberMax.toFixed(0)}</div>
            <div><strong>Estimated subsidy (pro-rated):</strong> ${proratedSubsidy.toFixed(0)}</div>
          </>
        )}
        {allCitizens === 'yes' && (
          <div><strong>Estimated subsidy (approx):</strong> ${subsidy.toFixed(0)}</div>
        )}
        <div className="text-xs text-gray-600 mt-1">Notes: This is an estimate. PHAs apply local deductions and rules. If contract rent &lt; payment standard, subsidy uses contract rent. For mixed families with non-citizens, the subsidy is pro-rated by the eligible member ratio.</div>
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

function Card({title, children, link, defaultOpen}:{title:string, children:any, link?:string, defaultOpen?:boolean}){
  return (
    <div className="bg-white border rounded">
      <div className="w-full text-left p-4 flex justify-between items-center">
        <span className="font-semibold">{title}</span>
      </div>
      <div className="p-4 border-t text-sm">{children}{link && <div className="mt-2"><a className="text-blue-600 underline" href={link} target="_blank" rel="noreferrer">Open resource</a></div>}</div>
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
          <div className="text-sm space-y-4">
            <p>Below are two simple estimators — one from the tenant perspective and one for landlords. These are estimates; contact your PHA for exact rules.</p>
            <div>
              <div className="bg-white p-4 border rounded">
                <div className="mb-2 font-semibold">Tenant calculator</div>
                <TenantCalculator />
              </div>
            </div>
            <p className="text-sm">Important: Local rules vary widely. Contact your administering PHA for exact calculation rules, allowable deductions, utility responsibilities (tenant vs. PHA), and payment standards. Keep pay stubs and documentation ready.</p>
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
              <strong>💡 Resource: Exception Payment Standards (NYC)</strong>
              <p className="mt-1">If your rent is higher than the standard payment amount, your PHA may use an Exception Payment Standard (EPS). View <a className="text-blue-600 underline" href="https://www.nyc.gov/assets/hpd/downloads/pdfs/services/ps-and-eps-values.pdf" target="_blank" rel="noreferrer">NYC's Payment Standard and Exception Payment Standard values</a> to see if your unit qualifies for a higher subsidy under EPS rules.</p>
            </div>
            <div className="mt-2 p-3 bg-yellow-50 border-l-4 border-yellow-300 rounded text-sm">
              <strong>Disclaimer (mixed families):</strong> When a mixed family is involved in Section 8 housing assistance, the Housing Assistance Payment (HAP) is adjusted based on the number of eligible family members. The HAP is prorated by dividing the number of eligible family members by the total number in the family to find the proration factor, and multiplying the HAP by this factor. For families with ineligible non-citizens, assistance is prorated by dividing the number of eligible family members by the total family size to determine the member maximum subsidy, and then multiplying by the number of eligible family members to determine the eligible subsidy amount. Contact your PHA for exact proration methods and required documentation.
            </div>
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
            <Card key={it.id} title={it.title} defaultOpen={it.id === 'section8-calc'}>{it.body}</Card>
          ))}
        </section>
      </div>
    )
    }

