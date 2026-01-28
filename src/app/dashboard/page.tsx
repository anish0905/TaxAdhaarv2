import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";

import { Rocket, Zap, Clock, CheckCircle2 } from "lucide-react";
import ReferralBox from "./components/ReferralBox"; 
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { Order } from "@/models/Order";
import ServiceGrid from "@/components/home/ServiceGrid";
// Imports के ठीक बाद और Component के पहले
export async function generateMetadata() {
  return {
    title: "Dashboard | Taxadhaar - Expert Business Solutions",
    description: "Manage your GST, ITR, and Business compliance. Check your referral earnings and active services on Taxadhaar.",
    robots: { index: false, follow: false }, // डैशबोर्ड को गूगल पर इंडेक्स नहीं करना चाहिए (Privacy)
  };
}

export default async function DashboardHome() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await connectDB();
  const user = await User.findById(session.user.id).lean();
  
  // Referred users ki list with payment status
  const referredUsersRaw = await User.find({ referredBy: user?.referralCode })
    .select("name createdAt isVerified _id")
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const referredUsers = await Promise.all(referredUsersRaw.map(async (ref: any) => {
    const firstPaidOrder = await Order.findOne({ 
      clientId: ref._id, 
      paymentStatus: "paid" 
    });
    return { ...ref, hasPaid: !!firstPaidOrder };
  }));

  const referralCode = user?.referralCode || (session.user.name?.split(' ')[0].toUpperCase() + session.user.id.slice(-4));

  return (
   <div className="min-h-screen overflow-y-auto touch-pan-y pb-20 animate-in fade-in duration-700">
      {/* HEADER WITH REAL-TIME BALANCE */}
      <div className="bg-[#020617] text-white pt-16 pb-40 px-6 md:px-10 relative overflow-hidden rounded-b-[3rem] lg:rounded-br-[4rem]">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-none">
              Welcome, <br/> {session.user.name?.split(' ')[0]}.
            </h1>
          </div>
          
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-6 md:p-8 rounded-[2.5rem] flex items-center gap-8 shadow-2xl">
            <div className="pr-8 border-r border-white/10 text-center">
              <p className="text-[10px] font-black text-emerald-400 uppercase mb-2 tracking-widest">Active Wallet</p>
              <p className="text-3xl font-black text-emerald-400 italic">₹{user?.referralEarnings?.balance || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black text-orange-400 uppercase mb-2 tracking-widest">Pending</p>
              <p className="text-3xl font-black text-orange-400 italic">₹{user?.referralEarnings?.pending || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {/* SERVICES SECTION */}
        {/* SERVICES HUB SECTION */}
<div className="bg-white rounded-[3.5rem] p-8 md:p-12 shadow-xl border border-slate-100 overflow-hidden relative group">
  {/* Background Decoration */}
  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-blue-100 transition-colors duration-700"></div>
  
  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
    <div className="space-y-4 text-center md:text-left">
      <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
        <Zap size={16} className="text-blue-600" fill="currentColor" />
        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Expert Solutions</span>
      </div>
      <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">
        Ready to file your <br/> <span className="text-blue-600 italic">Business Compliance?</span>
      </h2>
      <p className="text-slate-500 font-medium text-sm max-w-md">
        GST Registration, ITR Filing, and Company Incorporation — managed by experts for your business growth.
      </p>
    </div>

    {/* The Main Action Button */}
    <Link 
      href="/dashboard/services" 
      className="group/btn relative bg-slate-900 text-white px-10 py-8 rounded-[2rem] flex flex-col items-center justify-center gap-2 hover:bg-blue-600 transition-all duration-500 shadow-2xl hover:scale-105 active:scale-95 min-w-[240px]"
    >
      <Rocket size={32} className="mb-2 group-hover/btn:-translate-y-2 group-hover/btn:translate-x-2 transition-transform duration-500" />
      <span className="text-xs font-black uppercase tracking-[0.2em]">Explore All Services</span>
      <div className="flex gap-1 mt-1 opacity-50">
        <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
        <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
      </div>
    </Link>
  </div>

  {/* Quick Shortcuts (User ki clarity ke liye) */}
  <div className="mt-12 pt-8 border-t border-slate-50 flex flex-wrap justify-center md:justify-start gap-8 opacity-60">
    <div className="flex items-center gap-2">
      <span className="text-xl">⚡</span>
      <span className="text-[10px] font-black uppercase text-slate-800">GST Solutions</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xl">💎</span>
      <span className="text-[10px] font-black uppercase text-slate-800">Income Tax</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xl">🏢</span>
      <span className="text-[10px] font-black uppercase text-slate-800">Business Setup</span>
    </div>
  </div>
</div>

            {/* REFERRAL LIST WITH STATUS BADGES */}
            <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm">
               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                 <Clock size={16} className="text-blue-600" /> Recent Referrals
               </h3>
               <div className="space-y-4">
                 {referredUsers.length > 0 ? referredUsers.map((ref: any) => (
                   <div key={ref._id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl transition-all">
                     <div className="flex items-center gap-3">
                       <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${ref.hasPaid ? 'bg-emerald-500 text-white' : 'bg-white text-blue-600'}`}>
                         {ref.name[0].toUpperCase()}
                       </div>
                       <div>
                        <span className="text-xs font-black text-slate-700 uppercase block">{ref.name}</span>
                        <span className="text-[8px] text-slate-400 font-bold uppercase">Joined {new Date(ref.createdAt).toLocaleDateString()}</span>
                       </div>
                     </div>
                     <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase italic border ${
                       ref.hasPaid ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-orange-50 text-orange-500 border-orange-100"
                     }`}>
                       {ref.hasPaid ? "Bonus Activated" : "Payment Pending"}
                     </span>
                   </div>
                 )) : (
                   <p className="text-center py-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest italic">No referrals found</p>
                 )}
               </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <ReferralBox referralCode={referralCode} />
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                <p className="text-slate-400 font-black text-[9px] uppercase tracking-[0.3em] mb-4">Referral Rules</p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                    <p className="text-[11px] font-bold text-slate-600 italic">Reward added to Pending on registration.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-[11px] font-bold text-slate-600 italic">Moves to Active Wallet after friend's first payment.</p>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}