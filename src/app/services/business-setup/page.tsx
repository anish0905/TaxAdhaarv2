import Footer from '@/components/Footer';
import PublicNavbar from '@/components/Navbar';
import Link from 'next/link';

export default function BusinessSetupService() {
  const corporateEntities = [
    {
      type: "Private Limited Company (Pvt Ltd)",
      desc: "The most credible corporate structure for startups looking to raise venture capital. Offers limited liability protection and distinct legal identity.",
      timeline: "7-10 Working Days",
      requirement: "Minimum 2 Directors & 2 Shareholders"
    },
    {
      type: "Limited Liability Partnership (LLP)",
      desc: "An ideal hybrid layout combining corporate flexibility with operational simplicity. Best suited for service providers, professionals, and small partnerships.",
      timeline: "10-12 Working Days",
      requirement: "Minimum 2 Designated Partners"
    },
    {
      type: "One Person Company (OPC)",
      desc: "Allows solo entrepreneurs to operate a corporate entity with limited liability protection while retaining 100% control over operational management.",
      timeline: "8-10 Working Days",
      requirement: "1 Director, 1 Shareholder & 1 Nominee"
    }
  ];

  const onboardingSteps = [
    { num: "01", label: "Digital Signature & DIN", details: "Procurement of Digital Signature Certificates (DSC) and Director Identification Numbers (DIN) for all proposed founders." },
    { num: "02", label: "Name Approval (RUN)", details: "Drafting, refining, and filing for corporate name availability through the MCA Reserve Unique Name (RUN) web application platform." },
    { num: "03", label: "SPICe+ Incorporation", details: "Drafting of Memorandum of Association (MOA) and Articles of Association (AOA) and submission of integrated SPICe+ form data." },
    { num: "04", label: "PAN, TAN & Corporate Kit", details: "Issuance of Certificate of Incorporation (COI) along with dedicated PAN, TAN, and bank-account setup credentials." }
  ];

  return (
    <main className="bg-white">
      <PublicNavbar />

      {/* Hero Header Section */}
      <section className="py-24 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-sm font-bold text-blue-600 uppercase tracking-[0.4em] mb-4">Corporate Incorporation Engine</h1>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
              Launch Your Enterprise <br />
              <span className="text-blue-600">With Legal Precision.</span>
            </h2>
            <p className="text-slate-500 font-medium text-lg leading-relaxed mb-8">
              Incorporate your business in India smoothly. TaxAdhaar handles the end-to-end documentation, MCA registration approvals, and institutional licensing so you can focus on building your business operations.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="bg-blue-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all text-sm shadow-md shadow-blue-500/10">
                Initiate Business Setup
              </Link>
              <a href="#structures" className="bg-white text-slate-700 border border-slate-200 px-6 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all text-sm">
                Compare Entity Types
              </a>
            </div>
          </div>
          
          <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-xl">
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-slate-900/10 rounded-full blur-3xl"></div>
            <h3 className="text-xl font-bold mb-6 tracking-tight">Essential Documents Required</h3>
            <p className="text-blue-100 text-sm mb-6 leading-relaxed">
              To expedite the corporate incorporation filing under the Ministry of Corporate Affairs guidelines, keep the following documentation accessible:
            </p>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-start gap-3">
                <span className="text-slate-900 mt-1">✓</span>
                <span><strong>Identity Verification:</strong> PAN Card of all directors (Mandatory) along with Aadhaar, Passport, or Voter ID.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-slate-900 mt-1">✓</span>
                <span><strong>Address Proof:</strong> Recent Bank Statement, Electricity Bill, or Mobile Bill (Not older than 2 months).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-slate-900 mt-1">✓</span>
                <span><strong>Registered Premises:</strong> Utility bill of the proposed office workspace along with an explicit No-Objection Certificate (NOC) from the property landlord.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Corporate Structure Grid */}
      <section id="structures" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-[0.4em] mb-4">Structuring Choices</h3>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Choose Your Corporate Legal Structure</h2>
            <p className="text-slate-500 text-sm mt-3 font-medium">Align your operational framework with the correct statutory structure to optimize fundraising parameters and future compliance taxes.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {corporateEntities.map((entity, idx) => (
              <div key={idx} className="p-8 border border-slate-200 bg-white rounded-[2rem] flex flex-col justify-between hover:border-blue-500 transition-all shadow-sm group">
                <div>
                  <h4 className="text-xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">{entity.type}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">{entity.desc}</p>
                </div>
                <div className="border-t border-slate-100 pt-4 mt-4 text-xs space-y-2 text-slate-700 font-bold">
                  <p className="flex justify-between"><span>Processing Timeline:</span> <span className="text-blue-600">{entity.timeline}</span></p>
                  <p className="flex justify-between"><span>Minimum Criteria:</span> <span className="text-slate-900">{entity.requirement}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Onboarding Workflow Tracker */}
      <section className="py-24 bg-slate-950 text-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <h3 className="text-sm font-bold text-blue-500 uppercase tracking-[0.4em] mb-4">Incorporation Framework</h3>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Our Structured Setup Methodology</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {onboardingSteps.map((step, index) => (
              <div key={index} className="relative p-6 bg-slate-900/50 border border-slate-800 rounded-3xl">
                <div className="text-3xl font-black text-blue-500/30 mb-4">{step.num}</div>
                <h4 className="text-lg font-black mb-2">{step.label}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{step.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Advisory Alert */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 border border-blue-100 bg-blue-50/20 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-8">
          <div className="text-4xl text-blue-600 bg-white shadow-sm border border-blue-50 p-4 rounded-2xl">📋</div>
          <div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Post-Incorporation Compliance Checklist</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Once your entity is successfully registered, statutory rules require the corporation to execute post-incorporation parameters within specified timelines—including the <strong>Commencement of Business Certificate (Form INC-20A)</strong> within 180 days and appointing an initial statutory auditor. Our system tracks these timelines automatically to safeguard you from steep operational penalties.
            </p>
          </div>
        </div>
      </section>

      {/* Operational CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black mb-4">Ready to Setup Your Registered Corporate Entity?</h2>
          <p className="text-blue-100 text-sm mb-8 max-w-xl mx-auto font-medium">Incorporate with professional support. Get direct assistance from our regulatory panel and empanelled compliance professionals.</p>
          <Link href="/contact" className="bg-slate-900 text-white font-black px-8 py-4 rounded-2xl hover:bg-slate-800 transition-all text-sm inline-block shadow-lg">
            Consult Registration Desk
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}