import Footer from '@/components/Footer';
import PublicNavbar from '@/components/Navbar';
import Link from 'next/link';

export default function TaxAuditService() {
  const compliancePoints = [
    {
      title: "Section 44AB Mandate",
      desc: "Comprehensive evaluation and reporting under the Income Tax Act, 1961 for businesses exceeding the statutory turnover limits.",
      code: "Form 3CB-3CD"
    },
    {
      title: "Presumptive Taxation Validation",
      desc: "Detailed evaluation for professionals and digital business owners under Section 44AD and 44ADA to verify lower net-profit declaration eligibility.",
      code: "Section 44AD / 44ADA"
    },
    {
      title: "Financial Statements Auditing",
      desc: "Rigorous verification of Balance Sheets, Profit & Loss Statements, Ledger balancing, and internal financial controls to safeguard against penalties.",
      code: "Form 3CA-3CD"
    }
  ];

  const auditProcess = [
    { step: "01", title: "Data Ingestion & Verification", desc: "Upload your transaction logs, ledger exports, and current financial balance statements securely through our cloud interface." },
    { step: "02", title: "Discrepancy Check & Analysis", desc: "Our system runs automated logic diagnostics to isolate mismatched inputs, unexpected deductions, or compliance anomalies." },
    { step: "03", title: "Chartered Accountant Sign-off", desc: "A certified empanelled Chartered Accountant manually reviews the final audited books and signs off on Form 3CA/CB and 3CD reports." },
    { step: "04", title: "E-Filing & Receipt Generation", desc: "The verified tax audit report is electronically transmitted directly to the Income Tax Department portal with zero manual tracking hassle." }
  ];

  return (
    <main className="bg-white">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="py-24 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-sm font-bold text-blue-600 uppercase tracking-[0.4em] mb-4">Corporate Compliance Hub</h1>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
              Corporate Tax Audits <br />
              <span className="text-blue-600">Simplified with Precision.</span>
            </h2>
            <p className="text-slate-500 font-medium text-lg leading-relaxed mb-8">
              Stay compliant with the Income Tax Department guidelines. TaxAdhaar provides seamless end-to-end processing, validation, and professional e-filing for structural tax audits under Section 44AB.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="bg-blue-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all text-sm shadow-md shadow-blue-500/10">
                Book an Audit Session
              </Link>
              <a href="#provisions" className="bg-white text-slate-700 border border-slate-200 px-6 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all text-sm">
                View Threshold Rules
              </a>
            </div>
          </div>
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl"></div>
            <h3 className="text-xl font-bold mb-4 tracking-tight">Who Needs a Tax Audit?</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              According to statutory Indian tax mandates, individuals or businesses matching any of the following parameters are legally required to execute a tax audit:
            </p>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-start gap-3">
                <span className="text-blue-500 mt-1">✓</span>
                <span><strong>Business Turnover:</strong> Gross sales or turnover exceeding ₹1 Crore (or up to ₹10 Crores if cash transactions are less than 5%).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 mt-1">✓</span>
                <span><strong>Professional Income:</strong> Gross receipts in a profession exceeding ₹50 Lakhs.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 mt-1">✓</span>
                <span><strong>Loss Claims:</strong> Businesses claiming lower net-profits than presumptive tax expectations under Section 44AD.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Audit Matrix Info / Core Value Content */}
      <section id="provisions" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-[0.4em] mb-4">Regulatory Framework</h3>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Structured Corporate Audit Modules</h2>
            <p className="text-slate-500 text-sm mt-3 font-medium">Our platform maps out every operational ledger parameter against valid statutory rules to guarantee mistake-free compliance filing.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {compliancePoints.map((item, idx) => (
              <div key={idx} className="p-8 border border-slate-200 bg-white rounded-[2rem] hover:border-blue-500 transition-all shadow-sm group">
                <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider rounded-lg mb-6">
                  {item.code}
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{item.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Procedural Audit Workflow */}
      <section className="py-24 bg-slate-950 text-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <h3 className="text-sm font-bold text-blue-500 uppercase tracking-[0.4em] mb-4">Execution Protocol</h3>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">How the Audit Architecture Functions</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {auditProcess.map((proc, index) => (
              <div key={index} className="relative p-6 bg-slate-900/50 border border-slate-800 rounded-3xl">
                <div className="text-3xl font-black text-blue-500/30 mb-4">{proc.step}</div>
                <h4 className="text-lg font-black mb-2">{proc.title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{proc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notice Protection Block (Strong YMYL Strategy) */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 border border-red-100 bg-red-50/30 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-8">
          <div className="text-4xl text-red-500 bg-white shadow-sm border border-red-50 p-4 rounded-2xl">⚠️</div>
          <div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Consequences of Delayed Filing or Non-Compliance</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Failure to get financial books audited or failure to submit the report on or before the due date under Section 44AB can attract a penalty of <strong>0.5% of the total sales/turnover</strong>, or <strong>₹1,500,000 (₹1.5 Lakhs)</strong>, whichever is lower. Our automated deadline tracking dashboard prevents critical structural slip-ups.
            </p>
          </div>
        </div>
      </section>

      {/* Service CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black mb-4">Ensure 100% Tax Audit Accuracy Today</h2>
          <p className="text-blue-100 text-sm mb-8 max-w-xl mx-auto font-medium">Protect your enterprise from notices and penalties. Let certified financial professionals review your account statements.</p>
          <Link href="/contact" className="bg-slate-900 text-white font-black px-8 py-4 rounded-2xl hover:bg-slate-800 transition-all text-sm inline-block shadow-lg">
            Consult Empanelled CA
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}