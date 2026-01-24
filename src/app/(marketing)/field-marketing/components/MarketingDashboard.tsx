"use client";

import { useState, useEffect } from "react";
import { 
  TrendingUp, Users2, Wallet2, 
  Clock, Copy, Check, MessageCircle, 
  Briefcase, UserPlus, Loader2, ShieldCheck, ArrowUpRight, Layers
} from "lucide-react";
import WithdrawalModal from "./WithdrawalModal";

// Props mein 'team = []' add kiya gaya hai jo Server Page se aayega
export default function MarketingDashboard({ user, logs = [], team = [] }: any) {
  const [copied, setCopied] = useState(false);
  const [activeLinkType, setActiveLinkType] = useState<'client' | 'partner'>('client');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const refCode = user?.referralCode;

  const referralLinks = {
    client: `${baseUrl}/register?ref=${refCode}`,
    partner: `${baseUrl}/field-marketing/register?ref=${refCode}`
  };

  const currentLink = referralLinks[activeLinkType];

  const copyToClipboard = () => {
    if (!refCode) return;
    navigator.clipboard.writeText(currentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const text = activeLinkType === 'client' 
      ? `Expert Tax Solutions! Get your GST/ITR filed by professionals. Register here: ${currentLink}`
      : `Join our Field Marketing Team and earn up to 10% commission! Join here: ${currentLink}`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const stats = [
    { title: 'Current Wallet', value: `₹${user?.referralEarnings?.balance?.toLocaleString() || '0'}`, icon: <Wallet2 size={24} />, color: 'bg-blue-600' },
    { title: 'Gross Earnings', value: `₹${user?.referralEarnings?.totalCommissionEarned?.toLocaleString() || '0'}`, icon: <TrendingUp size={24} />, color: 'bg-emerald-600' },
    { title: 'Marketing Network', value: `${team?.length || '0'} Members`, icon: <Users2 size={24} />, color: 'bg-indigo-600' },
    { title: 'Pipeline Cash', value: `₹${user?.referralEarnings?.pending?.toLocaleString() || '0'}`, icon: <Clock size={24} />, color: 'bg-amber-600' },
  ];

  if (!mounted) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  );

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto px-4">
      {isModalOpen && <WithdrawalModal user={user} onClose={() => setIsModalOpen(false)} />}

      {/* 1. HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
            Profit <span className="text-blue-600">Overview</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-4">
            Agent ID: {refCode || 'N/A'} • Welcome, {user?.name}
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-[#020617] text-white px-10 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl">
          Request Payout
        </button>
      </div>

      {/* 2. STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 group">
            <div className={`w-14 h-14 ${stat.color} text-white rounded-[1.4rem] flex items-center justify-center mb-6`}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{stat.title}</p>
            <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* 3. RECRUITMENT TOOLKIT */}
      <div className="bg-[#020617] rounded-[3.5rem] p-1 shadow-2xl">
        <div className="bg-gradient-to-br from-slate-900 to-[#020617] rounded-[3.4rem] p-8 md:p-12 relative border border-white/5 grid xl:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-6">Expand Your <span className="text-blue-500">Network</span></h2>
            <div className="flex bg-white/5 p-1.5 rounded-2xl w-fit border border-white/5 mb-8">
              <button onClick={() => setActiveLinkType('client')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase ${activeLinkType === 'client' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>Onboard Client</button>
              <button onClick={() => setActiveLinkType('partner')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase ${activeLinkType === 'partner' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>Recruit Partner</button>
            </div>
            <p className="text-slate-400 font-bold text-sm italic">{activeLinkType === 'client' ? "Earn 5% direct commission on client orders." : "Build a team and earn 3% (L2) and 2% (L3) commissions."}</p>
          </div>
          <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 space-y-6">
            <div className="bg-black/40 border border-white/10 px-6 py-5 rounded-2xl flex items-center justify-between">
              <span className="text-xs font-bold text-white/80 truncate mr-4 italic">{refCode ? currentLink : "Generating Link..."}</span>
              <button onClick={copyToClipboard} className="text-blue-400">{copied ? <Check size={20} /> : <Copy size={20} />}</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={copyToClipboard} className="bg-white text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest">{copied ? "Copied" : "Copy Link"}</button>
              <button onClick={shareWhatsApp} className="bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"><MessageCircle size={16} /> WhatsApp</button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. TEAM NETWORK TABLE */}
      <div className="bg-white rounded-[4rem] p-6 md:p-10 shadow-2xl border border-slate-100 overflow-hidden">
        <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-10 flex items-center gap-3">
          <Users2 className="text-blue-600" size={24} /> Team <span className="text-blue-600">Network</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-4">
            <thead>
              <tr className="text-left">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined On</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody>
              {team.length > 0 ? team.map((member: any) => (
                <tr key={member._id} className="bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all rounded-[2rem]">
                  <td className="px-6 py-5 first:rounded-l-[2rem] text-[11px] font-black uppercase italic text-slate-800">{member.name}</td>
                  <td className="px-6 py-5">
                    <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase ${member.role === 'field_marketing' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {member.role === 'field_marketing' ? 'Partner' : 'Client'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-[10px] font-black text-slate-400">{new Date(member.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-5 last:rounded-r-[2rem] text-emerald-500 font-black text-[9px] uppercase"><ShieldCheck size={14} className="inline mr-1"/> Active</td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="text-center py-10 text-slate-400 font-black uppercase text-xs">No team members yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. COMMISSION LOGS */}
      <div className="bg-white rounded-[4rem] p-6 md:p-10 shadow-2xl border border-slate-100 overflow-hidden">
        <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-10 flex items-center gap-3">
          <Layers className="text-blue-600" size={24} /> Commission <span className="text-blue-600">Breakout</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-4">
            <thead>
              <tr className="text-left">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Service</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hierarchy</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Profit</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? logs.map((log: any) => (
                <tr key={log._id} className="bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all rounded-[2rem]">
                  <td className="px-6 py-5 first:rounded-l-[2rem] text-[11px] font-black italic uppercase text-slate-800">{log.serviceType}</td>
                  <td className="px-6 py-5"><span className="bg-blue-100 text-blue-600 text-[9px] font-black px-3 py-1.5 rounded-lg uppercase">{log.level}</span></td>
                  <td className="px-6 py-5 text-emerald-600 font-black italic">₹{log.amount}</td>
                  <td className="px-6 py-5 last:rounded-r-[2rem] text-[10px] font-black text-slate-400">{new Date(log.createdAt).toLocaleDateString()}</td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="text-center py-10 text-slate-400 font-black uppercase text-xs">No transactions yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}