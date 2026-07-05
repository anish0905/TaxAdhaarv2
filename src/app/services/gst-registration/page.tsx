import Footer from '@/components/Footer';
import PublicNavbar from '@/components/Navbar';
import Link from 'next/link';

export default function GSTRegistrationService() {
  const gstCategories = [
    {
      title: "Regular Taxpayer",
      desc: "Mandatory for businesses with standard intra-state sales exceeding statutory limits. Allows full utilization of Input Tax Credit (ITC) on inputs and services.",
      threshold: "₹40 Lakhs (Goods) / ₹20 Lakhs (Services)"
    },
    {
      title: "Composition Scheme",
      desc: "Designed for small businesses to reduce statutory bookkeeping burdens. Pay GST at a fixed lower percentage of turnover with simplified quarterly filing structures.",
      threshold: "Turnover up to ₹1.5 Crores"
    },
    {
      title: "Casual Taxable Person / SEZ",
      desc: "Temporary registration mandates for businesses operating seasonal counters, exhibitions, or setting up structural units inside Special Economic Zones.",
      threshold: "No Limit (Mandatory before starting operations)"
    }
  ];

  const workflow = [
    { step: "01", name: "TRN Generation", details: "Initial application vetting using your PAN, Mobile, and Email to generate a secure Temporary Reference Number (TRN)." },
    { step: "02", name: "Documentation & ARN", details: "Uploading authorized premises proof and business signatures onto the GSTN portal to secure an Application Reference Number (ARN)." },
    { step: "03", name: "Officer Verification", details: "Vetting of documents by the state/central jurisdictional tax officer. Handling clarifications or clarifications requests instantly if issued." },
    { step: "04", name: "GSTIN & Certificate", details: "Successful allocation of your 15-digit Goods and Services Tax Identification Number (GSTIN) along with the active registration certificate." }
  ];

  return (
    <main className="bg-white">
      <PublicNavbar />

      {/* Hero Header Section */}
      <section className="py-24 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-sm font-bold text-blue-600 uppercase tracking-[0.4em] mb-4">Indirect Tax Administration</h1>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
              Digital GST Registration <br />
              <span className="text-blue-600">Fast-Tracked & Secure.</span>
            </h2>
            <p className="text-slate-500 font-medium text-lg leading-relaxed mb-8">
              Acquire your 15-digit GSTIN with complete precision. TaxAdhaar automates data structure compliance, handles jurisdictional classifications, and manages documentation mapping under central and state GST frameworks.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="bg-blue-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all text-sm shadow-md shadow-blue-500/10">
                Apply for GSTIN
              </Link>
              <a href="#thresholds" className="bg-white text-slate-700 border border-slate-200 px-6 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all text-sm">
                Check Threshold Rules
              </a>
            </div>
          </div>
          
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl"></div>
            <h3 className="text-xl font-bold mb-6 tracking-tight">GST Registration Checklist</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Ensure you have these clear scanned documents to accelerate your processing timelines on the Goods and Services Tax Network (GSTN):
            </p>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-start gap-3">
                <span className="text-blue-500 mt-1">✓</span>
                <span><strong>Promoter Details:</strong> Permanent Account Number (PAN) along with Aadhaar card credentials of the primary promoter/partners.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 mt-1">✓</span>
                <span><strong>Premises Identity:</strong> Electricity bill, municipal khata copy, or property tax papers combined with a valid Consent Letter or Lease Deed.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 mt-1">✓</span>
                <span><strong>Financial Credentials:</strong> Cancelled cheque or current statement copy displaying the active corporate account number, IFSC code, and legal name.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Threshold Matrix Info */}
      <section id="thresholds" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-[0.4em] mb-4">Statutory Categorization</h3>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">GST Registration Threshold Matrix</h2>
            <p className="text-slate-500 text-sm mt-3 font-medium">Select the correct registration criteria based on corporate turnover layouts and supply structures to minimize legal processing overheads.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {gstCategories.map((cat, idx) => (
              <div key={idx} className="p-8 border border-slate-200 bg-white rounded-[2rem] flex flex-col justify-between hover:border-blue-500 transition-all shadow-sm group">
                <div>
                  <h4 className="text-xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">{cat.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">{cat.desc}</p>
                </div>
                <div className="border-t border-slate-100 pt-4 mt-4 text-xs flex justify-between items-center text-slate-700 font-bold">
                  <span>Turnover Limit:</span>
                  <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-lg text-[11px] font-black">{cat.threshold}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Procedural Process Flowchart */}
      <section className="py-24 bg-slate-950 text-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <h3 className="text-sm font-bold text-blue-500 uppercase tracking-[0.4em] mb-4">Filing Framework</h3>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Our Structured GSTN Portal Protocol</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {workflow.map((flow, index) => (
              <div key={index} className="relative p-6 bg-slate-900/50 border border-slate-800 rounded-3xl">
                <div className="text-3xl font-black text-blue-500/30 mb-4">{flow.step}</div>
                <h4 className="text-lg font-black mb-2">{flow.name}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{flow.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Critical YMYL Notice Compliance Box */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 border border-amber-100 bg-amber-50/20 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-8">
          <div className="text-4xl text-amber-600 bg-white shadow-sm border border-amber-50 p-4 rounded-2xl">⚡</div>
          <div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Mandatory Post-Registration Requirements</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Once your GSTIN is allocated, statutory frameworks make it mandatory to **update your corporate bank account profile** within 45 days on the GST portal. Failure to link a valid bank statement inside the allocated framework can lead to sudden automated suspension of your registration profile. TaxAdhaar handles this post-allocation mapping natively.
            </p>
          </div>
        </div>
      </section>

      {/* Execution CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black mb-4">Incorporate Under GST Regulations Streamlined</h2>
          <p className="text-blue-100 text-sm mb-8 max-w-xl mx-auto font-medium">Avoid parsing delays and regulatory notices. Have your platform documents systematically processed by our empanelled advisory network.</p>
          <Link href="/contact" className="bg-slate-900 text-white font-black px-8 py-4 rounded-2xl hover:bg-slate-800 transition-all text-sm inline-block shadow-lg">
            Connect with Advisory Panel
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}