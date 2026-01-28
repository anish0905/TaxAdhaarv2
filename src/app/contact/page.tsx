import Footer from '@/components/Footer';
import PublicNavbar from '@/components/Navbar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact TaxAdhaar | Get Expert Tax & Business Consultation",
  description: "Have questions about ITR, GST, or Company Registration? Contact TaxAdhaar for professional CA-assisted support. Reach us via WhatsApp, Email, or visit our Sasaram and Mumbai offices.",
  keywords: ["TaxAdhaar contact", "Tax consultant WhatsApp", "GST registration help", "ITR filing support India", "Sasaram tax office"],
  alternates: { canonical: "https://www.taxadhaar.in/contact" },
};

export default function Contact() {
  const contactMethods = [
    { title: "Email Us", detail: "contact@taxadhaar.com", icon: "📧", sub: "Response within 4 hours" },
    { title: "WhatsApp", detail: "+91 7557721426", icon: "💬", sub: "Instant chat support" },
    { title: "Office", detail: "Sasaram, Bihar | Mumbai", icon: "📍", sub: "Mon-Sat, 10am-7pm" }
  ];

  return (
    <main className="bg-white min-h-screen selection:bg-blue-100 text-slate-900">
      <PublicNavbar />
      
      {/* Header Section */}
      <header className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <span className="bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block border border-blue-500/20">
            India&apos;s Trusted Compliance Partner
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 italic">
            Let&apos;s Talk <span className="text-blue-500">Tax.</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto font-medium text-lg leading-relaxed">
            Have questions about ITR, GST, or Business registration? <br className="hidden md:block" />
            Our expert CA team is ready to assist you nationwide.
          </p>
        </div>
      </header>

      {/* Main Form Section */}
      <section className="py-24 -mt-16 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Left Column: Contact Cards */}
            <div className="lg:col-span-1 space-y-6">
              {contactMethods.map((method, i) => (
                <div key={i} className="p-10 bg-white rounded-[2.5rem] border border-slate-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/5 transition-all group">
                  <div className="text-4xl mb-6 group-hover:scale-110 transition-transform origin-left">{method.icon}</div>
                  <h4 className="font-black text-slate-900 text-xl tracking-tight">{method.title}</h4>
                  <p className="text-blue-600 font-bold text-lg my-2">{method.detail}</p>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{method.sub}</p>
                </div>
              ))}
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-2 bg-white p-8 md:p-16 rounded-[3.5rem] shadow-2xl shadow-blue-900/5 border border-slate-50">
              <div className="mb-10 text-center md:text-left">
                 <h2 className="text-3xl font-black text-slate-900 italic">Send an Enquiry</h2>
                 <p className="text-slate-500 font-medium mt-2">Professional response guaranteed within one business day.</p>
              </div>
              
              <form className="grid md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 text-left">Full Name</label>
                  <input type="text" placeholder="Anish Kumar" className="bg-slate-50 border-none p-5 rounded-2xl outline-none focus:ring-2 ring-blue-500/20 transition-all font-medium text-slate-900" />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 text-left">Email Address</label>
                  <input type="email" placeholder="name@example.com" className="bg-slate-50 border-none p-5 rounded-2xl outline-none focus:ring-2 ring-blue-500/20 transition-all font-medium text-slate-900" />
                </div>
                <div className="flex flex-col gap-3 md:col-span-2 text-left">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Service Required</label>
                  <select className="bg-slate-50 border-none p-5 rounded-2xl outline-none focus:ring-2 ring-blue-500/20 transition-all appearance-none cursor-pointer font-medium text-slate-900">
                    <option>Income Tax Filing (ITR)</option>
                    <option>GST Registration/Return</option>
                    <option>Company Incorporation</option>
                    <option>Trademark & Legal</option>
                    <option>Export Compliance (IEC/LUT)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-3 md:col-span-2 text-left">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Message</label>
                  <textarea rows={4} placeholder="How can we help you today?" className="bg-slate-50 border-none p-5 rounded-2xl outline-none focus:ring-2 ring-blue-500/20 transition-all resize-none font-medium text-slate-900" />
                </div>
                <button type="submit" className="md:col-span-2 bg-blue-600 text-white font-black py-6 rounded-3xl hover:bg-slate-900 transition-all active:scale-95 shadow-xl shadow-blue-600/20 text-xs uppercase tracking-widest">
                  Send Enquiry
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Presence Section */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto h-[500px] bg-slate-50 rounded-[4rem] overflow-hidden relative group border border-slate-100 flex items-center justify-center">
           <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/world-map.png')]" />
           
           <div className="text-center relative z-10 p-8">
              <span className="text-blue-600 text-5xl mb-6 block">🌍</span>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-4">Our Presence</p>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4 italic">Serving Clients PAN India</h3>
              <p className="text-slate-500 max-w-md mx-auto font-medium text-lg leading-relaxed">
                While we operate digitally nationwide, you can reach our physical desks in <span className="text-slate-900 font-bold">Sasaram, Bihar</span> and <span className="text-slate-900 font-bold">Mumbai</span>.
              </p>
           </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}