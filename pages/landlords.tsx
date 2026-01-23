import Link from 'next/link'

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
