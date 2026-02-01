import Footer from "@/components/Footer";
import ServiceGrid from "@/components/home/ServiceGrid";
import PublicNavbar from "@/components/Navbar";
import Link from "next/link";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// 1. ADVANCED SEO METADATA
// Using your full service range to capture long-tail search traffic
export const metadata = {
  title: "Professional Tax & Compliance Services | TaxAdhaar India",
  description: "India's leading digital platform for ITR Filing, GST Compliance, Company Incorporation, Trademark Registration, and Export/Import (IEC) licenses. Secure CA-assisted solutions.",
  keywords: [
    "ITR Filing India", "GST Registration Sasaram", "Trademark Application", 
    "Pvt Ltd Incorporation", "IEC Code Online", "LUT Filing GST", "MSME Registration"
  ],
  alternates: { canonical: "https://www.taxadhaar.in/services" },
  openGraph: {
    title: "TaxAdhaar | Full-Stack Compliance for Businesses & Individuals",
    description: "Expert Tax Architecture for Bharat. Fast, Secure, and 100% Digital.",
    url: "https://www.taxadhaar.in/services",
    type: "website",
    images: [{ url: "https://www.taxadhaar.in/og-services.jpg" }],
  },
};

export default function ServicesPage() {
  // 2. COMPREHENSIVE JSON-LD (Dynamic Mapping)
  // This tells Google you are a high-authority Financial Service provider
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": "TaxAdhaar",
    "description": "Premium Digital Tax and Business Compliance Firm in India.",
    "url": "https://www.taxadhaar.in",
    "telephone": "+91-7557721426",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Sasaram",
      "addressRegion": "Bihar",
      "addressCountry": "IN"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "TaxAdhaar Compliance Portfolio",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Income Tax & ITR Filing" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "GST Registration & Monthly Filing" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Pvt Ltd & LLP Incorporation" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Trademark & Intellectual Property" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Import Export Code (IEC) & LUT" } }
      ]
    }
  };

  return (
    <main className="bg-white min-h-screen selection:bg-blue-600 selection:text-white">
      {/* Injecting Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <PublicNavbar />

      {/* --- HERO SECTION: Premium Fintech Identity --- */}
      <header className="relative pt-40 pb-28 bg-[#f8fafc] overflow-hidden">
        {/* UI Accents */}
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.05] pointer-events-none bg-[grid-slate-200] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[120px]"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-3 bg-white border border-slate-200 px-5 py-2.5 rounded-2xl shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
              </span>
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-500">
                FY 2025-26 Compliance Portal Live
              </span>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-6xl md:text-[9rem] font-black text-slate-900 tracking-tighter leading-[0.8] mb-10">
              Tax <span className="text-blue-600 italic">Redefined.</span>
            </h1>
            
            <p className="max-w-3xl mx-auto text-slate-500 text-lg md:text-2xl font-medium leading-relaxed mb-14">
              TaxAdhaar bridges the gap between complex Indian statutes and 
              modern business agility through AI-driven CA expertise.
            </p>

            {/* Verification Badges */}
            <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black uppercase tracking-widest border-b-2 border-blue-600 mb-1">DATA ENCRYPTION</span>
                <span className="text-[9px] font-bold">AES-256 BIT</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black uppercase tracking-widest border-b-2 border-blue-600 mb-1">GOVT PARTNER</span>
                <span className="text-[9px] font-bold">GSTN & MCA</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- STRATEGIC SERVICES: The Grid --- */}
      <section id="services" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24">
            <div className="max-w-2xl">
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-6">
                Our Strategic <br /> Service Portfolio
              </h2>
              <div className="h-1.5 w-32 bg-blue-600 rounded-full mb-8"></div>
              <p className="text-slate-500 text-lg font-medium leading-relaxed">
                From intellectual property protection to global export compliance, 
                our specialists handle the regulatory burden while you scale.
              </p>
            </div>
            {/* SEO Tagline */}
            <div className="hidden md:block text-right">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] rotate-90 origin-right translate-y-12">
                Certified CA Support
              </p>
            </div>
          </div>

          {/* Your dynamic ServiceGrid goes here */}
          <ServiceGrid />
        </div>
      </section>

      {/* --- DATA SECURITY & ACCURACY --- */}
      <section className="py-24 bg-slate-50 border-y border-slate-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-24 items-center">
          <div className="relative">
            <div className="absolute -left-10 -top-10 text-[15rem] font-black text-slate-200/50 select-none pointer-events-none">
              &
            </div>
            <h3 className="text-4xl font-black text-slate-900 mb-8 relative z-10 leading-tight">
              Why leading startups <br /> choose TaxAdhaar?
            </h3>
            <div className="space-y-10">
              {[
                { t: "Automated Data Ingestion", d: "Direct API integration with ITD & GSTN for 100% data fidelity." },
                { t: "CA-Verified Accuracy", d: "Multi-point check by seasoned Chartered Accountants before every submission." },
                { t: "IPR & Export Specialist", d: "Dedicated legal desk for Trademarks, Copyrights, and IEC licensing." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-6 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <span className="font-black text-xs italic">0{idx+1}</span>
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider mb-1">{item.t}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-12 rounded-[4rem] shadow-2xl shadow-blue-900/5 border border-slate-50 relative group">
             <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-[0.02] transition-opacity rounded-[4rem]"></div>
             <div className="text-center relative z-10">
                <div className="inline-block p-4 bg-blue-50 rounded-3xl mb-6">
                  <span className="text-5xl">🛡️</span>
                </div>
                <p className="text-blue-600 font-black text-7xl mb-2 tracking-tighter">99.9%</p>
                <p className="text-slate-900 font-black uppercase tracking-[0.3em] text-[10px] mb-8">System Compliance Accuracy</p>
                <hr className="mb-8 border-slate-100" />
                <p className="text-slate-600 font-medium italic text-lg leading-relaxed">
                  "TaxAdhaar turned our messy compliance into a streamlined asset. It's not just a filing service; it's our financial backbone."
                </p>
                <div className="mt-8">
                  <p className="font-black text-slate-900 uppercase text-xs">Anish Kumar</p>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Founder, TaxAdhaar</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- CONVERSION ENGINE --- */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto bg-[#020617] rounded-[5rem] p-16 md:p-32 text-center relative overflow-hidden group shadow-[0_50px_100px_-20px_rgba(2,6,23,0.4)]">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10">
            <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-10 italic leading-[0.9]">
              Ready to automate <br /> your taxes?
            </h2>
            <p className="text-slate-400 text-lg md:text-xl mb-14 max-w-2xl mx-auto font-medium">
              Join 15,000+ Indians who have simplified their financial life with TaxAdhaar.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href="/login" className="bg-blue-600 text-white px-14 py-6 rounded-3xl font-black hover:bg-white hover:text-blue-600 transition-all shadow-xl shadow-blue-600/20 text-sm uppercase tracking-widest">
                Get Started
              </Link>
              <Link href="/contact" className="bg-white/5 backdrop-blur-xl text-white border border-white/10 px-14 py-6 rounded-3xl font-black hover:bg-white/10 transition-all text-sm uppercase tracking-widest">
                Talk to a Specialist
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}