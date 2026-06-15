import Footer from "@/components/Footer";
import FAQ from "@/components/home/FAQ";
import HeroForm from "@/components/home/HeroForm";
import Process from "@/components/home/Process";
import ServiceGrid from "@/components/home/ServiceGrid";
import Stats from "@/components/home/Stats";
import TrustSlider from "@/components/home/TrustSlider";
import PublicNavbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";

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
    canonical: "https://www.taxadhaar.com",
  },
  openGraph: {
    title: "TaxAdhaar - Empowering Bharat's Taxpayers Digitally",
    description: "Join millions across India filing with the smartest CA-assisted platform.",
    url: "https://www.taxadhaar.com",
    siteName: "TaxAdhaar",
    locale: "en_IN",
    type: "website",
  },
};

// API Fetch Function
async function getLatestUpdates() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    // Double slash remove karne ke liye sanitize kiya
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    
    const res = await fetch(`${cleanBaseUrl}/api/blogs?limit=3`, {
      next: { revalidate: 3600 } 
    });
    
    if (!res.ok) {
      console.error(`API response failed with status: ${res.status}`);
      return [];
    }
    
    const json = await res.json();
    return json.success && Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.error("Error fetching homepage blogs:", error);
    return [];
  }
}

export default async function HomePage() {
  const latestBlogs = await getLatestUpdates();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": "TaxAdhaar",
    "alternateName": "TaxAdhaar Digital Solutions",
    "description": "A leading Pan-India digital platform providing Tax, GST, and Business Registration services.",
    "url": "https://www.taxadhaar.com",
    "logo": "https://www.taxadhaar.com/logo.png",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "areaServed": "IN",
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

      {/* --- HERO SECTION --- */}
      <header className="relative px-6 pt-32 pb-20 md:pt-48 md:pb-32 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 overflow-hidden">
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

          <h1 className="text-6xl md:text-[7rem] font-black text-slate-900 leading-[0.85] tracking-tighter italic">
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

          <div className="pt-10 flex flex-wrap gap-4 items-center justify-center md:justify-start">
             <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg shadow-sm group hover:bg-blue-600 transition-all duration-300">
               <span className="text-[10px] font-black uppercase tracking-widest text-blue-700 group-hover:text-white">
                 MCA Verified
               </span>
             </div>

             <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm group hover:bg-slate-900 transition-all duration-300">
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-white">
                 256-Bit SSL Secure
               </span>
             </div>

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
        
        <Stats />
        <Process />

        {/* --- DYNAMIC LATEST TAX UPDATES & NEWS --- */}
        <section className="py-28 bg-slate-50 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                  Knowledge Hub
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-4">
                  Latest Tax & GST Bulletins
                </h2>
                <p className="text-slate-500 font-medium mt-2">
                  Stay updated with live insights curated by national Chartered Accountants.
                </p>
              </div>
              <Link 
                href="/blogs" 
                className="inline-flex items-center gap-2 bg-white border border-slate-200 text-[#020617] font-black text-xs uppercase tracking-widest px-6 py-4 rounded-2xl shadow-sm hover:bg-[#020617] hover:text-white transition-all group shrink-0"
              >
                View All Bulletins
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>

            {/* Blogs Display Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestBlogs && latestBlogs.length > 0 ? (
                latestBlogs.map((blog: any) => (
                  <article key={blog._id} className="group bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm hover:shadow-2xl hover:border-blue-100/50 transition-all duration-500 flex flex-col justify-between">
                    <div>
                      {/* Blog Cover Image Container */}
                      <div className="w-full h-56 relative rounded-[1.8rem] overflow-hidden bg-slate-100 mb-6">
                        <Image
                          src={blog.mainImage || "/placeholder-tax.jpg"} 
                          alt={blog.title || "Tax Bulletin"}
                          fill
                          sizes="(max-w-7xl) 33vw, 100vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-lg">
                          {blog.category?.name || "Taxation"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">
                          {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ""}
                        </span>
                      </div>

                      <h3 className="text-xl font-black text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      
                      <p className="text-sm text-slate-500 font-medium mt-3 line-clamp-3 leading-relaxed">
                        {blog.metaDesc || "Read the latest compliance updates on TaxAdhaar."}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-50 flex items-center justify-between">
                      <Link 
                        href={`/blogs/${blog.slug}`} 
                        className="text-xs font-black uppercase tracking-wider text-[#020617] hover:text-blue-600 flex items-center gap-1.5 transition-colors"
                      >
                        Read Full Article <span>→</span>
                      </Link>
                    </div>
                  </article>
                ))
              ) : (
                // Fallback Shimmer/Loaders
                [1, 2, 3].map((num) => (
                  <div key={num} className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm animate-pulse">
                    <div className="w-full h-56 bg-slate-200 rounded-[1.8rem] mb-6"></div>
                    <div className="w-24 h-4 bg-slate-200 rounded mb-4"></div>
                    <div className="w-full h-6 bg-slate-200 rounded mb-2"></div>
                    <div className="w-3/4 h-6 bg-slate-200 rounded"></div>
                  </div>
                ))
              )}
            </div>

          </div>
        </section>

        <FAQ />
      </main>

      <Footer />
    </div>
  );
}