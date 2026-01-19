import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { servicesData } from "@/data/services";
import { Gift, Rocket, ShieldCheck, Zap, Copy, MessageCircle } from "lucide-react";

export default async function DashboardHome() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const referralCode = session.user.name?.split(' ')[0].toUpperCase() + "10OFF";

  return (
    // Yahan se min-h-screen hata kar padding adjust ki hai taaki layout ke sath fit ho
    <div className="pb-20">
      
      {/* --- PREMIUM HEADER --- */}
      {/* Sidebar ke sath rounded corners maintain karne ke liye rounded-3xl add kiya hai */}
      <div className="bg-[#020617] text-white pt-16 pb-40 px-6 md:px-10 relative overflow-hidden rounded-b-[3rem] lg:rounded-br-[4rem]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-10"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-indigo-600 rounded-full blur-[120px] opacity-10"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-4">
               <span className="h-[2px] w-8 bg-blue-500"></span>
               <p className="text-blue-500 font-black text-[10px] uppercase tracking-[0.4em]">Verified Client Portal</p>
            </div>
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-none">
              Welcome, <br/> {session.user.name?.split(' ')[0]}.
            </h1>
          </div>
          
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-6 md:p-8 rounded-[2.5rem] flex items-center gap-8 shadow-2xl">
            <div className="pr-8 border-r border-white/10">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Earnings</p>
              <p className="text-2xl font-black text-green-400 italic">₹0.00</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Code</p>
              <div className="flex items-center gap-3">
                <span className="text-lg font-black tracking-[0.2em] text-blue-400">{referralCode}</span>
                <Copy size={14} className="text-slate-500 cursor-pointer hover:text-white transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN DASHBOARD CONTENT --- */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: SERVICES */}
          <div className="lg:col-span-8 space-y-8" id="services-section">
            <div className="bg-white rounded-[3.5rem] p-8 md:p-10 shadow-xl border border-slate-100">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter">Services</h2>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Start your application</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <Zap size={20} fill="currentColor" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.keys(servicesData).map((key) => (
                  <Link 
                    key={key} 
                    href={`/dashboard/services/${key}`} 
                    className="group p-8 bg-slate-50 rounded-[2.5rem] border-2 border-transparent hover:border-blue-600 hover:bg-white hover:shadow-2xl transition-all duration-500"
                  >
                    <div className="text-4xl mb-6 transform group-hover:scale-110 group-hover:-rotate-12 transition-transform">
                      {servicesData[key].icon}
                    </div>
                    <h3 className="font-black text-slate-900 uppercase tracking-tighter text-lg mb-2">
                      {servicesData[key].title}
                    </h3>
                    <p className="text-slate-400 text-xs font-bold leading-relaxed mb-6 group-hover:text-slate-600">
                      Click to upload documents & start review.
                    </p>
                    <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest">
                      Start <Rocket size={12} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Empty State */}
            <div className="bg-white rounded-[3rem] p-12 border-2 border-dashed border-slate-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-6">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm mb-2">No Active Filing</h3>
                <p className="text-slate-500 text-xs font-medium max-w-xs">
                  Your submitted applications will appear here.
                </p>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden group">
               <div className="relative z-10">
                 <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                   <Gift size={24} className="text-white" />
                 </div>
                 <h3 className="text-2xl font-black mb-4 italic tracking-tighter">Refer Friends, <br/>Save 10%</h3>
                 <p className="text-blue-100 text-xs font-medium mb-8 leading-relaxed opacity-90">
                   Get <span className="text-white font-black underline decoration-green-400 underline-offset-4">10% Discount</span> on professional charges.
                 </p>
                 <button className="w-full bg-white text-blue-600 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl">
                   Share My Link
                 </button>
               </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                <p className="text-slate-400 font-black text-[9px] uppercase tracking-[0.3em] mb-4">Pricing Policy</p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"></div>
                    <p className="text-[11px] font-bold text-slate-600">Discount applies on Professional Fees.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                    <p className="text-[11px] font-bold text-slate-600">Govt taxes at actual rates.</p>
                  </div>
                </div>
            </div>

            <div className="bg-slate-50 rounded-[2.5rem] p-8 text-center border border-slate-100">
               <h4 className="font-black text-slate-900 uppercase text-[10px] tracking-widest mb-4">Need Help?</h4>
               <a href="https://wa.me/91XXXXXXXXXX" className="inline-flex items-center gap-3 text-green-600 font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                 <MessageCircle size={18} fill="currentColor" /> WhatsApp Expert
               </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}