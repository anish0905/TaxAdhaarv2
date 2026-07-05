import Footer from '@/components/Footer';
import PublicNavbar from '@/components/Navbar';
import Link from 'next/link';

export default function About() {
  const values = [
    { title: "Transparency", desc: "No hidden charges or surprise commissions. You know exactly what services you pay for.", icon: "💎" },
    { title: "Security", desc: "Your financial data is protected with enterprise-grade, bank-level AES-256 encryption protocol.", icon: "🛡️" },
    { title: "Expert Verification", desc: "Every tax return and compliance filing undergoes verification by qualified financial professionals.", icon: "🎓" },
  ];

  // AdSense YMYL compliance requires explicit expert accountability
  const leaders = [
    {
      name: "Chartered Accountant & Advisors",
      role: "Compliance Verification Panel",
      bio: "Our panel consists of senior Chartered Accountants (CAs) and corporate legal experts registered with the ICAI, ensuring 100% precision in tax compliance, audit reporting, and regulatory adherence.",
      imgPlaceholder: "💼"
    }
  ];

  return (
    <main className="bg-white ">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-sm font-bold text-blue-600 uppercase tracking-[0.4em] mb-4">Corporate Overview</h1>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-8">
            Making Tax Compliance <br /> <span className="text-blue-600">Human-Centric & Digital.</span>
          </h2>
          <p className="max-w-3xl mx-auto text-slate-500 text-lg leading-relaxed font-medium">
            TaxAdhaar was founded with a definitive mission: To bridge the critical gap between complex Indian tax legislations and the everyday taxpayer through high-performance software architecture and seasoned financial expertise.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-square bg-blue-600 rounded-[3rem] rotate-3 absolute inset-0"></div>
            <div className="aspect-square bg-slate-900 rounded-[3rem] -rotate-3 relative z-10 flex items-center justify-center p-12">
              <h3 className="text-4xl font-black text-white italic text-center">"Simplifying compliance, empowering enterprises."</h3>
            </div>
          </div>
          
          <div>
            <h3 className="text-3xl font-black text-slate-900 mb-6">The Genesis of TaxAdhaar</h3>
            <p className="text-slate-500 mb-6 leading-relaxed">
              We recognized that tax filing and statutory regulatory compliances remain a persistent source of confusion and friction for modern businesses and salaried individuals across India. Intricate procedural frameworks and strict deadlines frequently result in preventable penalties.
            </p>
            <p className="text-slate-500 mb-8 leading-relaxed">
              <strong>TaxAdhaar</strong> operates as an elite platform built on transparency. By unifying cloud automation systems with licensed advisory experts, we have designed a high-speed ecosystem that ensures complete regulatory accuracy and reliable filing mechanisms.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="border-l-4 border-blue-600 pl-4">
                <p className="text-2xl font-black text-slate-900">100%</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Automated Workflows</p>
              </div>
              <div className="border-l-4 border-blue-600 pl-4">
                <p className="text-2xl font-black text-slate-900">Professional</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">CA Supervision</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* E-E-A-T/Credibility Section (Crucial for AdSense YMYL Approval) */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-[0.4em] mb-4">Expert Accountability</h3>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Professional Leadership & Advisory Panel</h2>
          </div>
          
          <div className="max-w-3xl mx-auto bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm flex flex-col md:flex-row gap-8 items-center">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl shrink-0 font-bold">
              {leaders[0].imgPlaceholder}
            </div>
            <div>
              <h4 className="text-2xl font-black text-slate-900">{leaders[0].name}</h4>
              <p className="text-sm font-bold text-blue-600 mb-3">{leaders[0].role}</p>
              <p className="text-slate-500 text-sm leading-relaxed">{leaders[0].bio}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-center text-3xl font-black mb-16 tracking-tight">Our Core Operational Values</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-all">
                <div className="text-4xl mb-6">{v.icon}</div>
                <h4 className="text-xl font-bold mb-4">{v.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6 bg-blue-600 rounded-[3rem] p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-black mb-6">Streamline Your Compliance Architecture</h2>
          <p className="mb-10 text-blue-100 font-medium max-w-2xl mx-auto">Experience precise, secure, and end-to-end tax solutions engineered for modern enterprises and professionals.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black hover:bg-slate-100 transition-all">
              Contact Licensing Desk
            </Link>
            <Link href="/" className="bg-blue-700 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-800 transition-all border border-blue-500">
              Launch Portal
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}