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
          <h3 className="font-semibold">NYC — CityFHEPS / HPD Section 8 / NYCHA Section 8</h3>
          <p className="mb-2">Agencies: NYC Human Resources Administration (HRA) handles CityFHEPS; NYC Department of Housing Preservation and Development (HPD) and NYCHA manage different voucher programs. Each program has its own landlord packet and inspection rules.</p>
          <p className="mb-2">Landlord packet tips:</p>
          <ul className="list-disc pl-6 mb-2">
            <li>Download the landlord packet from the program's official page (HRA/HPD/NYCHA).</li>
            <li>Include W-9, lease template, and complete unit description.</li>
            <li>Expect a property inspection; ensure all safety items are addressed.</li>
            <li>For CityFHEPS specifically, payments are routed via HRA — confirm bank/ACH details and vendor enrollment requirements.</li>
          </ul>
          <p className="text-sm text-gray-600">Official starting points: <a className="text-blue-600" href="https://www.nyc.gov/" target="_blank" rel="noreferrer">NYC.gov</a>, HRA pages, HPD resources, NYCHA landlord pages.</p>
        </article>

        <article className="mb-6">
          <h3 className="font-semibold">FHEPS / State Programs (example regions)</h3>
          <p className="mb-2">Some cities and states (e.g., Boston, other municipalities) have FHEPS-style or state-administered voucher programs. Check your local housing authority for program names and landlord packet requirements.</p>
          <ul className="list-disc pl-6 mb-2">
            <li>Follow the agency's Landlord Packet checklist strictly.</li>
            <li>Many programs provide PDFs for landlord enrollment and vendor payment setup.</li>
          </ul>
        </article>

        <article className="mb-6">
          <h3 className="font-semibold">Other Local Vouchers (SOTA, Section 8 variants)</h3>
          <p className="mb-2">Different cities/states have variations of Section 8 and local vouchers. Always find the official portal for enrollments and packet submission instructions.</p>
        </article>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Sample Email Template for Submitting a Landlord Packet</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm">
From: [owner@example.com]
To: [agency@example.gov]
Subject: Landlord Packet — [Tenant Name] — [Property Address]

Hello,

Please find attached the landlord packet for tenant [Tenant Name] for the unit at [Property Address]. Attached are: W-9, lease template, unit photos, and vendor payment form.

Please confirm receipt and advise on next steps and inspection scheduling.

Thank you,
[Owner Name]
[Phone]
        </pre>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Need Help?</h2>
        <p>If you'd like, we can provide downloadable landlord packet checklists or a sample W-9 and ACH form to speed submissions. You can also <Link href="/contact"><a className="text-blue-600">contact us</a></Link> for assistance.</p>
      </section>
    </main>
  )
}
