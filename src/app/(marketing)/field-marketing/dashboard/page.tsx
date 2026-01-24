"use client";

import { useState } from "react";
import { 
   TrendingUp, Users2, Wallet2, 
  Clock, 
} from "lucide-react";
import ReferralLink from "../components/ReferralLink";

export default function MarketingDashboard({ user }: any) {
  const [copied, setCopied] = useState(false);

  
  const stats = [
    { title: 'Current Wallet', value: `₹${user?.referralEarnings?.balance?.toLocaleString() || '0'}`, icon: <Wallet2 size={24} />, color: 'bg-blue-600', description: 'Withdrawable balance' },
    { title: 'Gross Earnings', value: `₹${user?.referralEarnings?.totalCommissionEarned?.toLocaleString() || '0'}`, icon: <TrendingUp size={24} />, color: 'bg-emerald-600', description: 'Lifetime income' },
    { title: 'Team Network', value: `${user?.referralEarnings?.teamCount || '0'} Partners`, icon: <Users2 size={24} />, color: 'bg-indigo-600', description: 'Direct & Indirect' },
    { title: 'Upcoming', value: `₹${user?.referralEarnings?.pending?.toLocaleString() || '0'}`, icon: <Clock size={24} />, color: 'bg-amber-600', description: 'Pending verification' },
  ];

  return (
    <div className="space-y-10">
            {/* --- 1. SHARE & EARN TOOLKIT (NEW SECTION) --- */}
      
<ReferralLink user={user} />
      {/* 2. HEADER SECTION (Same as before) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">
            Profit <span className="text-blue-600">Overview</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Agent ID: {user?.referralCode || 'N/A'} • Welcome, {user?.name}
          </p>
        </div>
        <button className="bg-[#020617] text-white px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-2xl flex items-center justify-center gap-2">
          <Wallet2 size={16} /> Withdraw Funds
        </button>
      </div>

      {/* 3. STATS GRID (Same as before) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col gap-5 group hover:border-blue-200 transition-all">
            <div className={`w-12 h-12 ${stat.color} text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.title}</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

  
      {/* 4. COMMISSION BREAKOUT TABLE (Same as before) */}
      <div className="bg-white rounded-[3.5rem] p-6 md:p-10 shadow-2xl shadow-slate-200/50 border border-slate-100">
        {/* ... Table code ... */}
        <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-8">Commission <span className="text-blue-600">Breakout</span></h2>
        {/* table goes here */}
        <p className="text-center text-slate-400 font-bold uppercase text-[10px] py-10">Transaction data syncs in real-time</p>
      </div>
    </div>
  );
}