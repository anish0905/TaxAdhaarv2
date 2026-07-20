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
import ToolkitCarousel from "@/components/home/ToolkitCarousel"; // 👈 कैरोसेल इम्पोर्ट

export const dynamic = "force-dynamic";

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
    canonical: "https://taxadhaar.com",
  },
  openGraph: {
    title: "TaxAdhaar - Empowering Bharat's Taxpayers Digitally",
    description: "Join millions across India filing with the smartest CA-assisted platform.",
    url: "https://taxadhaar.com",
    siteName: "TaxAdhaar",
    locale: "en_IN",
    type: "website",
  },
};

// 📝 1. API Fetch Function for Blogs
async function getLatestUpdates() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://taxadhaar.com";
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const res = await fetch(`${cleanBaseUrl}/api/blogs?limit=3`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.success && Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.error("Error fetching homepage blogs:", error);
    return [];
  }
}

// ⚡ 2. API Fetch Function for Categories (Direct Endpoint Sync)
async function getLatestCategories() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://taxadhaar.com";
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    
    const res = await fetch(`${cleanBaseUrl}/api/categories`, { cache: 'no-store' });
    if (!res.ok) return [];
    
    const json = await res.json();
    // अगर बैकएंड डायरेक्ट एरे दे रहा है या json.data में, दोनों को सेफ़ली हैंडल करेगा भाई
    const dataArray = json.data || json;
    return Array.isArray(dataArray) ? dataArray : [];
  } catch (error) {
    console.error("Error fetching homepage categories:", error);
    return [];
  }
}

export default async function HomePage() {
  const [latestBlogs, categoriesData] = await Promise.all([
    getLatestUpdates(),
    getLatestCategories()
  ]);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": "TaxAdhaar",
    "url": "https://taxadhaar.com",
    "logo": "https://taxadhaar.com/icon.png",
    "address": { "@type": "PostalAddress", "addressCountry": "IN" },
    "areaServed": "IN",
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
      <header className="relative px-6 pt-32 pb-24 md:pt-48 md:pb-36 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 overflow-hidden">
        <div className="absolute top-10 -left-20 w-[30rem] h-[30rem] bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-full filter blur-[140px] opacity-15 animate-pulse duration-[6000ms]"></div>
        <div className="absolute -bottom-10 right-10 w-[24rem] h-[24rem] bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full filter blur-[120px] opacity-10"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a0a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="flex-1 space-y-8 z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-slate-50 to-white border border-slate-200/80 px-4 py-2 rounded-2xl shadow-md group hover:border-blue-200 transition-all duration-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            <span className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
              Pan-India Digital Compliance Engine
            </span>
          </div>

          <h1 className="text-6xl sm:text-7xl md:text-[6.5rem] font-black text-slate-900 leading-[0.85] tracking-tight font-sans">
            Taxation <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent drop-shadow-sm">
              Universal.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed font-medium tracking-tight">
            Clear tax and business-compliance information, practical tools, and a simple way to request professional support.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-8 pt-4 border-t border-slate-100 max-w-md">
            <div>
              <p className="text-3xl font-black text-slate-900 tracking-tight">₹15Cr+</p>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">Tax Capital Saved</p>
            </div>
            <div className="w-px h-10 bg-slate-200 hidden sm:block"></div>
            <div>
              <p className="text-3xl font-black text-slate-900 tracking-tight">99.4%</p>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">Success Resolution</p>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full max-w-lg relative group z-10 mt-8 lg:mt-0">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 rounded-[3.5rem] blur opacity-15 group-hover:opacity-30 transition duration-1000"></div>
          <div className="relative bg-white/80 backdrop-blur-xl rounded-[3rem] p-1 border border-white/60 shadow-2xl">
            <HeroForm />
          </div>
        </div>
      </header>

      {/* --- PAN-INDIA REACH SECTION --- */}
      <section className="py-20 border-y border-slate-100 bg-slate-50/50">
        <TrustSlider />
      </section>

      <main>
        <div className="py-20">
          <ServiceGrid />
        </div>
        
        <Stats />
        <Process />

        {/* --- 1. DYNAMIC LATEST TAX UPDATES & NEWS --- */}
        <section className="py-28 bg-slate-50 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                  Knowledge Hub
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-4">
                  Latest Tax & GST Bulletins
                </h2>
              </div>
              <Link href="/blogs" className="bg-white border border-slate-200 text-[#020617] font-black text-xs uppercase tracking-widest px-6 py-4 rounded-2xl shadow-sm hover:bg-[#020617] hover:text-white transition-all shrink-0">
                View All Bulletins →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestBlogs && latestBlogs.length > 0 ? (
                latestBlogs.map((blog: any) => (
                  <article key={blog._id} className="group bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between">
                    <div>
                      <div className="w-full h-56 relative rounded-[1.8rem] overflow-hidden bg-slate-100 mb-6">
                        <img src={blog.mainImage || "/placeholder-tax.jpg"} alt={blog.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                      </div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-lg">
                          {blog.category?.name || "Taxation"}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 leading-snug line-clamp-2">{blog.title}</h3>
                      <p className="text-sm text-slate-500 font-medium mt-3 line-clamp-3">{blog.metaDesc}</p>
                    </div>
                    <div className="pt-6 mt-6 border-t border-slate-50">
                      <Link href={`/blogs/${blog.slug}`} className="text-xs font-black uppercase tracking-wider text-[#020617] hover:text-blue-600 transition-colors">
                        Read Full Article →
                      </Link>
                    </div>
                  </article>
                ))
              ) : (
                [1, 2, 3].map((num) => <div key={num} className="bg-white h-96 rounded-[2.5rem] animate-pulse" />)
              )}
            </div>
          </div>
        </section>

        {/* --- 2. PREMIUM SPLIT-LAYOUT CATEGORIES CAROUSEL SECTION --- */}
        <section className="py-32 bg-white border-y border-slate-100 relative overflow-hidden">
          <div className="absolute top-1/4 right-0 w-80 h-80 bg-emerald-500/5 rounded-full filter blur-[100px]" />
          
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
            
            <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
              <span className="inline-flex text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] bg-emerald-50/80 px-4 py-2 rounded-xl border border-emerald-100">
                Ecosystem Hubs
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.05]">
                Financial Toolkit & Strategic Departments
              </h2>
              <p className="text-slate-500 font-medium text-base leading-relaxed max-w-lg mx-auto lg:mx-0">
                Accelerate your compliance pipeline. Explore our live curated index of Amazon best-sellers, custom tax lodgment sheets, and system utilities trusted by national corporate leaders.
              </p>
              <div className="pt-4">
                <Link href="/toolkit" className="inline-flex items-center gap-2 bg-[#020617] text-white font-black text-xs uppercase tracking-widest px-8 py-4.5 rounded-2xl shadow-lg hover:bg-blue-600 transition-all duration-300">
                  Explore Full Toolkit Registry →
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 w-full flex justify-center items-center">
              {categoriesData && categoriesData.length > 0 ? (
                <ToolkitCarousel items={categoriesData} />
              ) : (
                <div className="w-full max-w-lg h-[460px] bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 animate-pulse flex flex-col justify-between">
                  <div className="w-full h-52 bg-slate-200 rounded-[1.8rem]" />
                  <div className="space-y-2 mt-4">
                    <div className="w-1/4 h-4 bg-slate-200 rounded" />
                    <div className="w-full h-6 bg-slate-200 rounded" />
                  </div>
                  <div className="w-full h-12 bg-slate-200 rounded-xl mt-6" />
                </div>
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
