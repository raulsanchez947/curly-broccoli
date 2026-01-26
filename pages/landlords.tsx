import Link from 'next/link'
import { useState } from 'react'

function LandlordCalculator(){
  const [paymentStandard, setPaymentStandard] = useState<number | ''>('')
  const [utilityAllowance, setUtilityAllowance] = useState<number | ''>('')
  const [contractRent, setContractRent] = useState<number | ''>('')

  const ps = Number(paymentStandard || 0)
  const ua = Number(utilityAllowance || 0)
  const cr = Number(contractRent || 0)
  const rentPortion = Math.max(0, cr - ua)
  // estimate tenant share as 30% of the rent portion when tenant income is not provided
  const estimatedTenantShare = Math.round(rentPortion * 0.3)
  const coveredByVoucher = Math.min(ps || rentPortion, rentPortion)
  const subsidy = Math.max(0, coveredByVoucher - estimatedTenantShare)

  return (
    <div className="space-y-2 text-sm">
      <div className="grid grid-cols-2 gap-2">
        <input type="number" placeholder="Payment standard (monthly)" value={paymentStandard as any} onChange={e=>setPaymentStandard(e.target.value?Number(e.target.value):'')} className="p-2 border rounded" />
        <input type="number" placeholder="Utility allowance (monthly)" value={utilityAllowance as any} onChange={e=>setUtilityAllowance(e.target.value?Number(e.target.value):'')} className="p-2 border rounded" />
        <input type="number" placeholder="Contract rent (monthly)" value={contractRent as any} onChange={e=>setContractRent(e.target.value?Number(e.target.value):'')} className="p-2 border rounded col-span-2" />
      </div>

        <div className="bg-gray-50 p-2 rounded">
        <div><strong>Rent portion (contract rent − utility allowance):</strong> ${rentPortion.toFixed(0)}</div>
        <div><strong>Payment standard:</strong> ${ps.toFixed(0)}</div>
        <div><strong>Covered by voucher (max):</strong> ${coveredByVoucher.toFixed(0)}</div>
        <div className="text-xs text-gray-600 mt-1">If rent portion &le; payment standard, the voucher can cover up to that amount (less tenant share). Utility allowance is subtracted from total rent for subsidy calculations in many PHAs.</div>
      </div>
    </div>
  )
}

export default function Landlords() {
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Landlord Resources: Housing Vouchers & How to Submit Landlord Packets</h1>

      <p className="mb-4">This page summarizes common housing voucher programs and provides a practical landlord-packet checklist and submission guidance. Always confirm specific requirements on the program's official site before submitting.</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Common Landlord Packet Checklist (use for most voucher programs)</h2>
        <ul className="list-disc pl-6">
          <li>Completed Landlord/Owner Packet form (program-specific)</li>
          <li>Current W-9 (tax identification for payments)</li>
          <li>Signed lease template or sample lease (with voucher clauses if required)</li>
          <li>Certificate of Insurance / Liability (if required)</li>
          <li>Proof of property ownership / deed or management agreement</li>
          <li>Lead paint disclosure (for properties built before 1978, where applicable)</li>
          <li>Tenant application and screening criteria</li>
          <li>Photos of unit or basic unit description (beds, baths, sq ft, utilities included)</li>
          <li>Bank details / ACH form for rent payments</li>
          <li>Contact and routing information (owner or property manager phone/email)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Section 8: Estimate for Landlords</h2>
        <p className="mb-2">This landlord-focused estimator helps you approximate the voucher payment portion that the housing authority may pay to landlords, given the payment standard, utility allowance, contract rent, and tenant share.</p>
        <div className="max-w-3xl">
          <div className="bg-white p-4 border rounded mb-3">
            <LandlordCalculator />
          </div>
          <div className="mt-2 p-3 bg-yellow-50 border-l-4 border-yellow-300 rounded text-sm">
            <strong>Disclaimer (mixed families):</strong> When a mixed family is involved in Section 8 housing assistance, the Housing Assistance Payment (HAP) is adjusted based on the number of eligible family members. The HAP is prorated by dividing the number of eligible family members by the total number in the family to find the proration factor, and multiplying the HAP by this factor. For families with ineligible non-citizens, assistance is prorated by dividing the number of eligible family members by the total family size to determine the member maximum subsidy, and then multiplying by the number of eligible family members to determine the eligible subsidy amount. Contact the administering PHA for exact proration methods and required documentation.
          </div>
          <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-700">
            <strong>Landlord estimate notice:</strong> These tools provide only rough estimates. Final subsidy and payment calculations are performed by the administering PHA and may differ. Always rely on official PHA determinations for payment amounts.
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Submitting a Landlord Packet — Practical Steps</h2>
        <ol className="list-decimal pl-6">
          <li>Collect all required documents from the checklist above and scan them as PDFs.</li>
          <li>Complete any program-specific landlord forms (download from the agency site).</li>
          <li>Confirm acceptable submission channels: many agencies accept email, some require portal upload, others physical mail.</li>
          <li>When emailing, include clear subject: "Landlord Packet — [Tenant Name] — [Property Address]" and attach PDFs in logical order.</li>
          <li>Keep copies of everything and request a confirmation receipt or case number from the agency.</li>
          <li>Prepare the unit for inspection: functioning smoke detectors, working plumbing, safe electrical outlets, and basic cleanliness.</li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Program Quick Guides</h2>

        <article className="mb-6">
          <h3 className="font-semibold">CityFHEPS/FHEPS (HRA)</h3>
          <p className="mb-2">Administered by NYC Human Resources Administration (HRA). CityFHEPS has a landlord enrollment process separate from HPD/NYCHA.</p>
          <p className="mb-2">Documents commonly required:</p>
          <ul className="list-disc pl-6 mb-2">
            <li>Completed CityFHEPS landlord packet (download from HRA)</li>
            <li>W-9 and vendor/bank ACH enrollment form</li>
            <li>Signed lease template or sample lease</li>
            <li>Proof of ownership or management agreement</li>
            <li>Unit description and photos</li>
            <li>Certificate of insurance (if requested)</li>
          </ul>
          <p className="text-sm text-gray-600">Payments for CityFHEPS are routed via HRA — confirm vendor setup and ACH enrollment on the HRA site.</p>
        </article>

        <article className="mb-6">
          <h3 className="font-semibold">HPD Section 8</h3>
          <p className="mb-2">HPD's Section 8 program has its own landlord enrollment and inspection requirements.</p>
          <p className="mb-2">Documents commonly required:</p>
          <ul className="list-disc pl-6 mb-2">
            <li>HPD landlord packet / enrollment form</li>
            <li>W-9 and vendor payment form</li>
            <li>Signed lease template and tenant application</li>
            <li>Unit description, photos, and lead-based paint disclosures (if applicable)</li>
          </ul>
          <p className="text-sm text-gray-600">Refer to HPD's landlord resources for inspection checklists and vendor enrollment steps.</p>
        </article>

        <article className="mb-6">
          <h3 className="font-semibold">NYCHA Section 8 (distinct process)</h3>
          <p className="mb-2">NYCHA's Section 8 process is separate and has additional requirements. Important: NYCHA requires a PIN letter for landlords and the landlord enrollment/certification must be completed online through NYCHA's portal.</p>
          <p className="mb-2">Documents commonly required:</p>
          <ul className="list-disc pl-6 mb-2">
            <li>NYCHA landlord enrollment (online only) — follow NYCHA portal steps</li>
            <li>PIN letter (issued to tenant) — required for NYCHA Section 8 actions</li>
            <li>W-9 and bank/ACH payment setup</li>
            <li>Signed lease template including required NYCHA clauses</li>
            <li>Unit photos and inspection readiness documentation</li>
          </ul>
          <p className="text-sm text-gray-600">NYCHA's PIN-letter requirement means landlords must receive and use that letter when interacting with the NYCHA online systems; this cannot be completed by paper submission.</p>
        </article>

      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Submitting the HPD landlord packet by email</h2>
        <p className="mb-2">To submit the HPD landlord packet, email the completed packet and attachments to <a className="text-blue-600" href="mailto:S8landlords@hpd.nyc.gov">S8landlords@hpd.nyc.gov</a>. Below is a sample email template you can use — copy, fill in the details, attach the required PDFs, and send.</p>
        <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap">From: [owner@example.com]
To: S8landlords@hpd.nyc.gov
Subject: Landlord Packet — [Tenant Name] — [Property Address] - [Voucher Number]

Hello,

Please find attached the landlord packet for tenant [Tenant Name] for the unit at [Property Address]. Attached are the lease, landlord packet, and a preliminary lease.

Please confirm receipt.
Thank you,
[Owner Name]
[Phone]</pre>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Need Help?</h2>
        <p>If you'd like, we can provide downloadable landlord packet checklists or a sample W-9 and ACH form to speed submissions. You can also <Link href="/contact" className="text-blue-600">contact us</Link> for assistance.</p>
      </section>
    </main>
  )
}
