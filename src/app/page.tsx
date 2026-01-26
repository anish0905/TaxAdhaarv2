import Footer from "@/components/Footer";
import FAQ from "@/components/home/FAQ";
import HeroForm from "@/components/home/HeroForm";
import Process from "@/components/home/Process";
import ServiceGrid from "@/components/home/ServiceGrid";
import Stats from "@/components/home/Stats";
import TrustSlider from "@/components/home/TrustSlider";
import PublicNavbar from "@/components/Navbar";

// 1. NATIONAL SEO METADATA
export const metadata = {
  title: "TaxAdhaar | India's Premier Digital Tax & Business Compliance Platform",
  description: "Official TaxAdhaar portal for Pan-India ITR filing, GST compliance, and Company Incorporation. Secure CA-assisted financial services for individuals and startups across India.",
  keywords: [
    "Online ITR Filing India", 
    "GST Registration India", 
    "Digital Tax Consultant India", 
    "Company Incorporation Services", 
    "TaxAdhaar National Portal",
    "Income Tax Filing for NRIs",
    "Startup India Registration"
  ],
  alternates: {
    canonical: "https://www.taxadhaar.in",
  },
  openGraph: {
    title: "TaxAdhaar - Empowering Bharat's Taxpayers Digitally",
    description: "Join millions across India filing with the smartest CA-assisted platform.",
    url: "https://www.taxadhaar.in",
    siteName: "TaxAdhaar",
    locale: "en_IN",
    type: "website",
  },
};

export default function HomePage() {
  // 2. NATIONAL ORGANIZATION SCHEMA
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": "TaxAdhaar",
    "alternateName": "TaxAdhaar Digital Solutions",
    "description": "A leading Pan-India digital platform providing Tax, GST, and Business Registration services.",
    "url": "https://www.taxadhaar.in",
    "logo": "https://www.taxadhaar.in/logo.png",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN" // Focus on Country level
    },
    "areaServed": "IN", // Tells Google you serve the whole country
    "serviceArea": {
      "@type": "Country",
      "name": "India"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-7557721426",
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["English", "Hindi"]
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-blue-600 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      
      <PublicNavbar />

      {/* --- HERO SECTION: NATIONAL IDENTITY --- */}
      <header className="relative px-6 pt-32 pb-20 md:pt-48 md:pb-32 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 overflow-hidden">
        {/* Dynamic Background Blobs */}
        <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-500 rounded-full filter blur-[120px] opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500 rounded-full filter blur-[100px] opacity-10"></div>

        <div className="flex-1 space-y-10 z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-3 bg-slate-50 border border-slate-200 px-5 py-2.5 rounded-2xl shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
            </span>
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.25em]">
              Pan-India Digital Compliance Engine
            </span>
          </div>

          <h1 className=" text-6xl md:text-[7rem] font-black text-slate-900 leading-[0.85] tracking-tighter italic">
            Taxation <br />
            <span className="text-blue-600 not-italic">Universal.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-500 max-w-xl leading-relaxed font-medium">
            Simplifying financial regulations for 1.4 Billion citizens. 
            <span className="text-slate-900 font-bold underline decoration-blue-600/20 underline-offset-8 ml-2">
              National Presence, Local Expertise.
            </span>
          </p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-12 pt-6">
            <div className="group">
              <p className="text-4xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">₹15Cr+</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">National Tax Savings</p>
            </div>
            <div className="group">
              <p className="text-4xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">28 States</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Operational Coverage</p>
            </div>
          </div>
                {/* Hero Section ke paragraph ke theek niche ye add karein */}
<div className="pt-10 flex flex-wrap gap-4 items-center justify-center md:justify-start">
   {/* Badge 1 */}
   <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg shadow-sm group hover:bg-blue-600 transition-all duration-300">
     <span className="text-[10px] font-black uppercase tracking-widest text-blue-700 group-hover:text-white">
       MCA Verified
     </span>
   </div>

   {/* Badge 2 */}
   <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm group hover:bg-slate-900 transition-all duration-300">
     <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-white">
       256-Bit SSL Secure
     </span>
   </div>

   {/* Badge 3 */}
   <div className="flex items-center gap-2 bg-green-50 border border-green-100 px-3 py-1.5 rounded-lg shadow-sm group hover:bg-green-600 transition-all duration-300">
     <span className="text-[10px] font-black uppercase tracking-widest text-green-700 group-hover:text-white">
       Pan-India Service
     </span>
   </div>
</div>
        </div>

        {/* --- HERO FORM --- */}
        <div className="flex-1 w-full max-w-lg relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[3.5rem] blur opacity-10 group-hover:opacity-25 transition duration-1000"></div>
          <HeroForm />
        </div>
        
      </header>


      {/* --- PAN-INDIA REACH SECTION --- */}
      <section className="py-20 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-8">Serving Businesses from Kashmir to Kanyakumari</p>
          <TrustSlider />
        </div>
      </section>

      <main>
        <div className="py-20">
          <ServiceGrid />
        </div>
        
        {/* Stats Section with National Data */}
        <Stats />

        {/* Optimized Workflow */}
        <Process />

        {/* FAQ - General Indian Tax Questions */}
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}