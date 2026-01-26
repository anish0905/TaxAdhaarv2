import Footer from '@/components/Footer';
import PublicNavbar from '@/components/Navbar';
import Link from 'next/link';

export default function About() {
  const values = [
    { title: "Transparency", desc: "No hidden charges. You know exactly what you pay for.", icon: "💎" },
    { title: "Security", desc: "Your data is encrypted with bank-grade AES-256 security.", icon: "🛡️" },
    { title: "Expertise", desc: "Every filing is reviewed by a qualified Chartered Accountant.", icon: "🎓" },
  ];

  return (
    <main className="bg-white ">
         <PublicNavbar/>
      {/* Hero Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-sm font-bold text-blue-600 uppercase tracking-[0.4em] mb-4">Our Story</h1>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-8">
            Making Tax Filing <br /> <span className="text-blue-600">Human-Centric.</span>
          </h2>
          <p className="max-w-2xl mx-auto text-slate-500 text-lg leading-relaxed font-medium">
            TaxAdhaar was founded with a simple mission: To bridge the gap between complex Indian tax laws and the common taxpayer through technology.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-square bg-blue-600 rounded-[3rem] rotate-3 absolute inset-0"></div>
            <div className="aspect-square bg-slate-900 rounded-[3rem] -rotate-3 relative z-10 flex items-center justify-center p-12">
               <h3 className="text-4xl font-black text-white italic">"Simplifying taxes, empowering Bharat."</h3>
            </div>
          </div>
          
          <div>
            <h3 className="text-3xl font-black text-slate-900 mb-6">Why we started TaxAdhaar?</h3>
            <p className="text-slate-500 mb-6 leading-relaxed">
              Humne dekha ki ITR file karna aaj bhi bahut se logon ke liye ek darr ka kaam hai. Complex forms aur deadlines ki wajah se log galti kar dete hain ya penalties bharte hain. 
            </p>
            <p className="text-slate-500 mb-8 leading-relaxed">
              **TaxAdhaar** stands for trust. Humne technology aur expert CAs ko ek saath laakar ek aisa system banaya hai jo fast hai, affordable hai, aur sabse zaroori—accurate hai.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="border-l-4 border-blue-600 pl-4">
                <p className="text-2xl font-black text-slate-900">100%</p>
                <p className="text-xs font-bold text-slate-400 uppercase">Digital Process</p>
              </div>
              <div className="border-l-4 border-blue-600 pl-4">
                <p className="text-2xl font-black text-slate-900">Direct</p>
                <p className="text-xs font-bold text-slate-400 uppercase">CA Assistance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-center text-3xl font-black mb-16 tracking-tight">Our Core Values</h3>
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
          <h2 className="text-3xl md:text-4xl font-black mb-6">Ready to file your taxes with TaxAdhaar?</h2>
          <p className="mb-10 text-blue-100 font-medium italic">Join us and experience the future of tax filing in India.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black hover:bg-slate-100 transition-all">
              Contact Us
            </Link>
            <Link href="/" className="bg-blue-700 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-800 transition-all border border-blue-500">
              Get Started
            </Link>
          </div>
        </div>
      </section>
      <Footer/>
    </main>
  );
}