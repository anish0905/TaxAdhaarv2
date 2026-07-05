import Footer from '@/components/Footer';
import PublicNavbar from '@/components/Navbar';
import Link from 'next/link';

export default function IncomeTaxService() {
  const itrCategories = [
    {
      type: "ITR-1 (Sahaj)",
      target: "Salaried Individuals",
      desc: "For resident individuals having total income up to ₹50 Lakhs from salaries, one house property, and interest income sources.",
    },
    {
      type: "ITR-2",
      target: "Capital Gains & Investors",
      desc: "For individuals and HUFs not carrying out business or profession under proprietorship, but having capital gains from shares or multiple properties.",
    },
    {
      type: "ITR-3 & ITR-4",
      target: "Business & Professionals",
      desc: "Tailored for individuals earning operational income from corporate businesses, independent freelancing, or choosing presumptive taxation schemas.",
    }
  ];

  const features = [
    { title: "Automated Form 26AS/AIS Sync", desc: "Our application securely parses your Annual Information Statement (AIS) and Tax Credit Statement (Form 26AS) to map out TDS entries accurately." },
    { title: "Maximum Tax Optimization", desc: "Advanced validation matching optimization routines across Old vs New Tax Regimes to systematically lower your ultimate tax liabilities." },
    { title: "Expert Panel Evaluation", desc: "Every tax return filed through our premium engine undergoes manual validation checks by certified empanelled Chartered Accountants." }
  ];

  return (
    <main className="bg-white">
      <PublicNavbar />

      {/* Hero Header Section */}
      <section className="py-24 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-sm font-bold text-blue-600 uppercase tracking-[0.4em] mb-4">Direct Tax Administration</h1>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
              E-File Your Income Tax <br />
              <span className="text-blue-600">With Absolute Confidence.</span>
            </h2>
            <p className="text-slate-500 font-medium text-lg leading-relaxed mb-8">
              Navigate Indian direct tax compliance seamlessly. TaxAdhaar simplifies your annual tax returns filing, maximizing your eligible exemptions under the Income Tax Act, 1961 while eliminating errors.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="bg-blue-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all text-sm shadow-md shadow-blue-500/10">
                File Your ITR Now
              </Link>
              <a href="#itr-types" className="bg-white text-slate-700 border border-slate-200 px-6 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all text-sm">
                Compare ITR Forms
              </a>
            </div>
          </div>
          
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl"></div>
            <h3 className="text-xl font-bold mb-6 tracking-tight">Required Onboarding Checklist</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Keep these institutional credentials and files accessible to execute your digital filing process without delay:
            </p>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-start gap-3">
                <span className="text-blue-500 mt-1">✓</span>
                <span><strong>Form 16:</strong> Salary certificate explicitly breaking down allowances, exemptions, and taxes deducted by your employer.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 mt-1">✓</span>
                <span><strong>Investment Proofs:</strong> Deductions details under Section 80C, 80D (Health Insurance), or NPS statements if selecting the Old Regime layout.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 mt-1">✓</span>
                <span><strong>Capital Accounts:</strong> Consolidated capital gains statements from your stockbrokers or crypto exchanges if applicable.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ITR Forms Categorization Grid */}
      <section id="itr-types" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-[0.4em] mb-4">Filing Pathways</h3>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Supported Income Tax Forms</h2>
            <p className="text-slate-500 text-sm mt-3 font-medium">Our dynamic matching system processes your income streams to auto-select the right legal ITR return form structure.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {itrCategories.map((itr, idx) => (
              <div key={idx} className="p-8 border border-slate-200 bg-white rounded-[2rem] flex flex-col justify-between hover:border-blue-500 transition-all shadow-sm group">
                <div>
                  <div className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-md inline-block mb-4">
                    {itr.target}
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{itr.type}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{itr.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features Value Content Section */}
      <section className="py-24 bg-slate-950 text-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <h3 className="text-sm font-bold text-blue-500 uppercase tracking-[0.4em] mb-4">Platform Intelligence</h3>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Engineered for Automated Accuracy</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feat, index) => (
              <div key={index} className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl">
                <h4 className="text-lg font-black mb-3 text-blue-400">{feat.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Advisory Alert Box */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 border border-red-100 bg-red-50/20 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-8">
          <div className="text-4xl text-red-600 bg-white shadow-sm border border-red-50 p-4 rounded-2xl">🚨</div>
          <div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Notice Under Section 139(9) Protection</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Filing your returns with mismatched data parameters (such as omitting dividend income or capital gains visible in your AIS data) triggers automated defective return notices under <strong>Section 139(9)</strong>. TaxAdhaar's pre-verification rules cross-check values before ultimate submission, shielding you from compliance hazards and unexpected penalties.
            </p>
          </div>
        </div>
      </section>

      {/* Final Service CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black mb-4">Experience Frictionless E-Filing Today</h2>
          <p className="text-blue-100 text-sm mb-8 max-w-xl mx-auto font-medium">Don't wait for the July 31st peak traffic jam. File safely with professional supervision and cloud tracking.</p>
          <Link href="/contact" className="bg-slate-900 text-white font-black px-8 py-4 rounded-2xl hover:bg-slate-800 transition-all text-sm inline-block shadow-lg">
            Connect with ITR Specialist
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}