import { servicesData } from "@/data/services";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import PublicNavbar from "@/components/Navbar";

// Next.js 15 ke liye params ko Promise handle karna padta hai
export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  
  // 1. Params ko await karein
  const { slug } = await params;
  
  // 2. Data fetch karein
  const service = servicesData[slug];
  const session = await getServerSession(authOptions);

  // Debugging ke liye (Console mein dikhega)
  if (!service) {
    console.log("Requested Slug:", slug);
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <h1 className="text-2xl font-black italic uppercase tracking-widest text-slate-400">
          Service Not Found
        </h1>
        <p className="text-slate-500 font-bold">Slug: {slug}</p>
        <Link href="/" className="text-blue-600 underline font-bold">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <PublicNavbar />
      
      {/* --- HERO SECTION --- */}
      <div className="bg-[#020617] pt-32 pb-20 px-6 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-20"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="text-6xl mb-6 block animate-bounce">{service.icon}</span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic mb-6">
            {service.title}
          </h1>
          <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            {service.description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-3 gap-16">
        
        {/* --- LEFT: DOCUMENTS --- */}
        <div className="lg:col-span-2 space-y-12">
          <div>
            <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <span className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-sm shadow-lg shadow-blue-200">✓</span>
              Documents Required
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.docs.map((doc: string, i: number) => (
                <div key={i} className="flex items-center gap-4 p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 hover:border-blue-200 transition-all group">
                  <div className="w-3 h-3 bg-blue-500 rounded-full group-hover:scale-150 transition-transform"></div>
                  <span className="font-bold text-slate-700 uppercase tracking-tight text-sm">{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- RIGHT: PRICING CARD --- */}
        <div className="lg:col-span-1">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl sticky top-32">
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em] mb-2">Professional Fee</p>
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-6xl font-black text-slate-900">{service.price}</span>
              <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">+ GST</span>
            </div>

            <div className="space-y-4">
              <Link 
                href={session ? "/dashboard" : `/login?callbackUrl=/services/${slug}`}
                className="block w-full bg-[#020617] text-white py-6 rounded-2xl text-center font-black text-sm uppercase tracking-[0.2em] hover:bg-blue-600 shadow-xl transition-all active:scale-95"
              >
                Apply Online
              </Link>
              
              <button className="w-full bg-white text-slate-900 border-2 border-slate-100 py-6 rounded-2xl text-center font-black text-sm uppercase tracking-[0.2em] hover:bg-slate-50 transition-all">
                Quick Enquiry
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}