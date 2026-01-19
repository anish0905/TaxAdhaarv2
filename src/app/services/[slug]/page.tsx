import { servicesData } from "@/data/services";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import PublicNavbar from "@/components/Navbar";

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  
  const { slug } = await params;
  const service = servicesData[slug];
  const session = await getServerSession(authOptions);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <h1 className="text-2xl font-black italic uppercase tracking-widest text-slate-400">
          Service Not Found
        </h1>
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
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic mb-6 uppercase">
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
            <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3 italic uppercase tracking-tight">
              <span className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-sm shadow-lg shadow-blue-200">✓</span>
              Mandatory Documents
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

          {/* Additional Info / Trust Section */}
          <div className="p-8 bg-blue-50 rounded-[2rem] border border-blue-100">
             <h4 className="font-black text-blue-900 uppercase text-sm mb-2 tracking-widest">Privacy Assured</h4>
             <p className="text-blue-700 text-sm font-medium">Your documents are encrypted and handled only by certified professionals. We follow strict data protection protocols.</p>
          </div>
        </div>

        {/* --- RIGHT: PROFESSIONAL WORKFLOW CARD --- */}
        <div className="lg:col-span-1">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] sticky top-32">
            <h4 className="text-xl font-black text-slate-900 mb-8 italic uppercase tracking-tighter">Process Timeline</h4>
            
            <div className="space-y-8 relative">
              {/* Step 1 */}
              <div className="flex gap-4 relative z-10">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-black text-sm border-4 border-white shadow-lg">1</div>
                  <div className="w-[2px] h-10 bg-slate-200"></div>
                </div>
                <div>
                  <p className="font-black text-slate-900 text-sm uppercase tracking-tight">Upload Docs</p>
                  <p className="text-xs text-slate-500 font-bold">Securely submit required files</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 relative z-10">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-sm border-4 border-white shadow-lg animate-pulse">2</div>
                  <div className="w-[2px] h-10 bg-slate-200"></div>
                </div>
                <div>
                  <p className="font-black text-slate-900 text-sm uppercase tracking-tight">Verification</p>
                  <p className="text-xs text-slate-500 font-bold">CA/Expert review of data</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 relative z-10">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center font-black text-sm border-4 border-white shadow-lg">3</div>
                </div>
                <div>
                  <p className="font-black text-slate-900 text-sm uppercase tracking-tight text-opacity-50">Payment</p>
                  <p className="text-xs text-slate-400 font-bold italic">Pay via Dashboard after approval</p>
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-4">
              <Link 
                href={session ? "/dashboard" : `/login?callbackUrl=/services/${slug}`}
                className="block w-full bg-[#020617] text-white py-6 rounded-2xl text-center font-black text-sm uppercase tracking-[0.2em] hover:bg-blue-600 shadow-xl transition-all active:scale-95"
              >
                {session ? "Go to Dashboard" : "Login to Apply"}
              </Link>
              
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[9px] text-center text-slate-400 font-black uppercase tracking-[0.15em] leading-relaxed">
                  No professional fee required today. <br/> Pay only after document verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}