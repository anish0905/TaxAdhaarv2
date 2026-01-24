"use client";

import { useState, useEffect } from "react";
import { 
  ArrowUpRight, TrendingUp, Users2, Wallet2, 
  Clock, Copy, Share2, Check, MessageCircle, 
  Briefcase, UserPlus 
} from "lucide-react";

export default function MarketingDashboard({ user }: any) {
  const [copied, setCopied] = useState(false);
  const [activeLinkType, setActiveLinkType] = useState<'client' | 'partner'>('client');
  const [baseUrl, setBaseUrl] = useState("");

  // Step 1: Component mount hote hi current domain detect karein
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Isse http://localhost:3000 ya https://taxclear.in apne aap mil jayega
      setBaseUrl(window.location.origin);
    }
  }, []);

  // Step 2: Referral Code logic
  const refCode = user?.referralCode || 'ANISH5488';

  // Step 3: Dynamic Links based on Detected Domain
  const referralLinks = {
    client: `${baseUrl}/register?ref=${refCode}`,
    partner: `${baseUrl}/field-marketing/register?ref=${refCode}`
  };

  const currentLink = referralLinks[activeLinkType];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const text = activeLinkType === 'client' 
      ? `Expert Tax Solutions! Get your GST/ITR filed. Register here: ${currentLink}`
      : `Join TaxClear Marketing Team! Earn 10% commission. Join here: ${currentLink}`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-10">
      {/* ... Stats Grid ... */}

      {/* --- 3. DUAL SHARE & EARN TOOLKIT --- */}
      <div className="bg-[#020617] rounded-[3.5rem] p-1 shadow-2xl shadow-blue-900/20 overflow-hidden">
        <div className="bg-gradient-to-br from-slate-900 to-[#020617] rounded-[3.4rem] p-8 md:p-12 relative overflow-hidden border border-white/5">
          
          <div className="relative z-10 grid xl:grid-cols-2 gap-12 items-center">
            
            {/* Left: Info Section */}
            <div>
              <div className="flex gap-2 mb-6">
                 <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-500/20">
                    Recruitment Suite
                 </span>
              </div>
              <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-6 leading-none">
                Expand Your <span className="text-blue-500">Network</span>
              </h2>
              
              {/* Tab Switcher */}
              <div className="flex bg-white/5 p-1.5 rounded-2xl w-fit border border-white/5 mb-8">
                <button 
                  onClick={() => setActiveLinkType('client')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${
                    activeLinkType === 'client' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UserPlus size={14} /> Onboard Client
                </button>
                <button 
                  onClick={() => setActiveLinkType('partner')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${
                    activeLinkType === 'partner' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Briefcase size={14} /> Recruit Partner
                </button>
              </div>

              <p className="text-slate-400 font-bold text-sm leading-relaxed max-w-md italic">
                {activeLinkType === 'client' 
                  ? "Share this link with business owners. Earn 5% direct commission on every order they place."
                  : "Share this with potential marketing partners. Build a team and earn up to 3% and 2% from their sales."
                }
              </p>
            </div>

            {/* Right: Action Section */}
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 space-y-6 shadow-inner">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-blue-400 ml-2">
                  Dynamic {activeLinkType === 'partner' ? 'Partner' : 'Client'} Link
                </label>
                <div className="bg-black/40 border border-white/10 px-6 py-5 rounded-2xl flex items-center justify-between group overflow-hidden">
                  <span className="text-xs font-bold text-white/80 truncate mr-4 italic">
                    {currentLink || "Detecting Domain..."}
                  </span>
                  <button onClick={copyToClipboard} className="shrink-0 text-blue-400 hover:text-white transition-colors">
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={copyToClipboard}
                  className="bg-white text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-blue-600 hover:text-white transition-all active:scale-95"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />} 
                  {copied ? "Copied" : "Copy Link"}
                </button>
                
                <button 
                  onClick={shareWhatsApp}
                  className="bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all active:scale-95 shadow-xl shadow-emerald-900/40"
                >
                  <MessageCircle size={16} /> WhatsApp
                </button>
              </div>
            </div>
          </div>

          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -mr-20 -mt-20"></div>
        </div>
      </div>
    </div>
  );
}