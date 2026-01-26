"use client";
import Footer from '@/components/Footer';
import PublicNavbar from '@/components/Navbar';
import { useState } from 'react';

export default function Contact() {
  const [status, setStatus] = useState('');

  const contactMethods = [
    { title: "Email Us", detail: "support@taxadhaar.in", icon: "📧", sub: "Response within 4 hours" },
    { title: "WhatsApp", detail: "+91 7557721426", icon: "💬", sub: "Instant chat support" },
    { title: "Office", detail: "Sasaram, Bihar | Mumbai", icon: "📍", sub: "Mon-Sat, 10am-7pm" }
  ];

  return (
    <main className="bg-white min-h-screen">
         <PublicNavbar />
      {/* Header Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Let's Talk <span className="text-blue-500">Tax.</span></h1>
          <p className="text-white max-w-xl mx-auto font-medium ">Have questions about ITR, GST, or Business registration? Hamari team aapki help ke liye taiyar hai.</p>
        </div>
      </section>

      <section className="py-24 -mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Left Column: Contact Cards */}
            <div className="lg:col-span-1 space-y-6 ">
              {contactMethods.map((method, i) => (
                <div key={i} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-blue-200 transition-all group">
                  <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{method.icon}</div>
                  <h4 className="font-black text-slate-900 text-lg">{method.title}</h4>
                  <p className="text-blue-600 font-bold my-1">{method.detail}</p>
                  <p className="text-slate-800 text-xs font-bold uppercase tracking-widest">{method.sub}</p>
                </div>
              ))}
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-2 bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-blue-900/5 border border-slate-50 text-black">
              <form className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-widest ml-2">Full Name</label>
                  <input type="text" placeholder="Anish Kumar" className="bg-slate-50 border-none p-4 rounded-2xl outline-none focus:ring-2 ring-blue-500/20 transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-widest ml-2">Email Address</label>
                  <input type="email" placeholder="name@example.com" className="bg-slate-50 border-none p-4 rounded-2xl outline-none focus:ring-2 ring-blue-500/20 transition-all" />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-widest ml-2">Service Required</label>
                  <select className="bg-slate-50 border-none p-4 rounded-2xl outline-none focus:ring-2 ring-blue-500/20 transition-all appearance-none cursor-pointer">
                    <option>Income Tax Filing (ITR)</option>
                    <option>GST Registration/Return</option>
                    <option>Company Incorporation</option>
                    <option>Tax Consultation</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-widest ml-2">Message</label>
                  <textarea rows="4" placeholder="How can we help you today?" className="bg-slate-50 border-none p-4 rounded-2xl outline-none focus:ring-2 ring-blue-500/20 transition-all resize-none"></textarea>
                </div>
                <button className="md:col-span-2 bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-500/20">
                  Send Enquiry
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Map Placeholder or Trust Section */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto h-[400px] bg-slate-100 rounded-[3rem] overflow-hidden relative group">
           {/* If you have a Google Maps API Key, you can replace this with an iframe */}
           <div className="absolute inset-0 flex items-center justify-center bg-slate-200">
              <div className="text-center">
                <p className="text-slate-800 font-black uppercase tracking-widest mb-2">Our Presence</p>
                <p className="text-2xl font-black text-slate-900">Serving Clients PAN India</p>
                <p className="text-slate-500 mt-2 font-medium italic">📍 Sasaram | Mumbai | Patna</p>
              </div>
           </div>
        </div>
      </section>
      <Footer/>
    </main>
  );
}