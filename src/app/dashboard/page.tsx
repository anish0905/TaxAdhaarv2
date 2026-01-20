import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { servicesData } from "@/data/services";
import { Rocket, Zap, Clock, CheckCircle2 } from "lucide-react";
import ReferralBox from "./components/ReferralBox"; 
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { Order } from "@/models/Order";

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
    <div className="pb-20 animate-in fade-in duration-700">
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
            <div className="bg-white rounded-[3.5rem] p-8 md:p-10 shadow-xl border border-slate-100">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter">Services</h2>
                <Zap size={20} className="text-blue-600" fill="currentColor" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.keys(servicesData).map((key) => (
                  <Link key={key} href={`/dashboard/services/${key}`} className="group p-8 bg-slate-50 rounded-[2.5rem] border-2 border-transparent hover:border-blue-600 hover:bg-white transition-all">
                     <div className="text-4xl mb-4">{servicesData[key].icon}</div>
                     <h3 className="font-black text-slate-900 uppercase text-lg">{servicesData[key].title}</h3>
                     <p className="text-slate-400 text-xs font-bold mt-2">Start Application <Rocket size={12} className="inline ml-1" /></p>
                  </Link>
                ))}
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