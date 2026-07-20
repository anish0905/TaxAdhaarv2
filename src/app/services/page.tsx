import Footer from "@/components/Footer";
import ServiceGrid from "@/components/home/ServiceGrid";
import PublicNavbar from "@/components/Navbar";
import Link from "next/link";
import { ArrowRight, Shield, ShieldCheck, Sparkles, Zap } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// 1. ADVANCED SEO METADATA (Perfected For Indexing)
export const metadata = {
  title: "Professional Tax & Compliance Services | TaxAdhaar India",
  description: "India's leading digital platform for ITR Filing, GST Compliance, Company Incorporation, Trademark Registration, and Export/Import (IEC) licenses. Secure CA-assisted solutions.",
  keywords: [
    "ITR Filing India", "GST Registration Sasaram", "Trademark Application", 
    "Pvt Ltd Incorporation", "IEC Code Online", "LUT Filing GST", "MSME Registration"
  ],
  alternates: { canonical: "https://taxadhaar.com/services" },
  openGraph: {
    title: "TaxAdhaar | Full-Stack Compliance for Businesses & Individuals",
    description: "Expert Tax Architecture for Bharat. Fast, Secure, and 100% Digital.",
    url: "https://taxadhaar.com/services",
    type: "website",
    images: [{ url: "https://taxadhaar.com/og-services.jpg" }],
  },
};

export default function ServicesPage() {
  // 2. COMPREHENSIVE JSON-LD STRUCTURED DATA
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": "TaxAdhaar",
    "description": "Premium Digital Tax and Business Compliance Firm in India.",
    "url": "https://taxadhaar.com",
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
    <main className="bg-white min-h-screen selection:bg-blue-600 selection:text-white text-slate-950 font-sans antialiased tracking-tight">
      {/* Injecting Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <PublicNavbar />

      {/* --- 🏛️ HERO SECTION: Premium Micro-Text Elite Aesthetics --- */}
      <header className="relative pt-36 pb-20 bg-[#F8FAFC] overflow-hidden border-b border-slate-200/50">
        {/* Background Grids and Accents */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_100%,#000_70%,transparent_100%)] opacity-70 pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-6 relative z-10 space-y-6">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-white border border-slate-200/80 rounded-md text-slate-500 text-[9px] font-black uppercase tracking-widest shadow-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-600"></span>
              </span>
              FY 2026-27 COMPLIANCE ARCHITECTURE LIVE
            </div>
          </div>

          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.95] max-w-3xl mx-auto">
              Tax Infrastructure <br /><span className="text-blue-600 font-black">Engineered For Growth.</span>
            </h1>
            
            <p className="max-w-xl mx-auto text-slate-500 text-[13px] font-medium leading-relaxed">
              TaxAdhaar bridges the structural gap between complex Indian corporate statutes and modern business agility through audited workflow protocols.
            </p>
          </div>

          {/* Verification Badges with Micro-Typography */}
          <div className="flex justify-center gap-8 pt-4">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200/60 shadow-sm">
              <Shield size={12} className="text-blue-600" />
              <div className="text-left leading-none">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">DATA MATRIX</p>
                <p className="text-[9px] font-black text-slate-800">AES-256 BIT</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200/60 shadow-sm">
              <ShieldCheck size={12} className="text-emerald-600" />
              <div className="text-left leading-none">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">GOVT ENDPOINT</p>
                <p className="text-[9px] font-black text-slate-800">GSTN & MCA</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- 🛠️ STRATEGIC SERVICES PORTFOLIO --- */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-100 pb-8 mb-12 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <span className="h-1 w-3 bg-blue-600 rounded-full" />
                <h4 className="text-[9px] font-black uppercase text-blue-600 tracking-widest">OFFICIAL CATALOG</h4>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                Corporate Service Matrix
              </h2>
              <p className="text-slate-400 text-xs font-medium max-w-md">
                From intellectual property registration to integrated cross-border trade legalities, our automated pipelines handle the compliance footprint.
              </p>
            </div>
            
            <div className="text-right">
              <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em] inline-block border-l-2 border-slate-200 pl-3">
                SECURE COUNSEL SUPPORT
              </span>
            </div>
          </div>

          {/* Dynamic Grid Container */}
          <div className="p-1.5 bg-slate-50 border border-slate-200/60 rounded-[2rem] overflow-hidden shadow-inner">
            <ServiceGrid />
          </div>
        </div>
      </section>

      {/* --- 📈 TRUST PARAMETERS & CONVERSIONS --- */}
      <section className="py-16 bg-slate-50 border-y border-slate-200/60 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-12 gap-10 items-center">
          
          <div className="md:col-span-7 space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Zap size={10} className="text-blue-600" />
                <h4 className="text-[9px] font-black uppercase text-slate-400 tracking-widest">WHY TAXADHAAR</h4>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                Algorithmic Data Integrity.
              </h3>
            </div>

            <div className="space-y-4">
              {[
                { t: "Clear document checklists", d: "Review the documents commonly needed before you request a service." },
                { t: "Service-specific support", d: "Use the enquiry form to describe your requirement and receive a response from the service team." },
                { t: "Official-source verification", d: "Rules and requirements should be confirmed with the relevant official portal before filing." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 bg-white border border-slate-200/50 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900">
                    <span className="font-black text-[10px] italic">0{idx+1}</span>
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">{item.t}</h4>
                    <p className="text-slate-500 text-[11px] font-medium leading-relaxed">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Dashboard Metric Card (Right Panel) */}
          <div className="md:col-span-5 bg-white p-8 rounded-[2rem] border border-slate-200/80 shadow-xl shadow-slate-200/30 flex flex-col justify-between h-full relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-600" />
            <div className="text-center space-y-4 relative z-10">
              <div className="inline-flex p-2 bg-blue-50 text-blue-600 rounded-xl text-xs">
                <Sparkles size={14} />
              </div>
              <div>
                <p className="text-blue-600 font-black text-3xl tracking-tighter">Important</p>
                <p className="text-slate-400 font-black uppercase tracking-widest text-[8px] mt-1">Verify current rules before filing</p>
              </div>
              <div className="w-full h-px bg-slate-100" />
              <p className="text-slate-600 font-semibold italic text-xs leading-relaxed px-2">Tax and compliance requirements can change. Check the latest official guidance and seek qualified advice where needed.</p>
            </div>
          </div>

        </div>
      </section>

      {/* --- 🚀 ULTRA-CONVERSION CTA FOOTPRINT --- */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-slate-950 rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl border border-slate-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-l from-blue-600/10 to-transparent rounded-full pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter max-w-xl mx-auto leading-none">
              Automate Your System Compliance Parameters.
            </h2>
            <p className="text-slate-400 text-xs max-w-sm mx-auto font-medium leading-normal uppercase tracking-wider">
              Explore the service information, prepare your documents, and contact support when you need help.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
              <Link href="/login" className="bg-blue-600 text-white px-8 py-3.5 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5">
                Get Started
              </Link>
              <Link href="/contact" className="bg-white/5 border border-white/10 text-white px-8 py-3.5 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-1.5">
                Talk to a Specialist <ArrowRight size={10} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
