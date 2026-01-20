"use client";
import { useState, useEffect } from "react";
import { Gift, Copy, Check, MessageCircle } from "lucide-react";

export default function ReferralBox({ referralCode }: { referralCode: string }) {
  const [copied, setCopied] = useState(false);
  const [referralLink, setReferralLink] = useState("");

  // Window object ko safely access karne ke liye useEffect
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Yeh automatically 'http://localhost:3000' ya aapka 'https://yourdomain.com' pick kar lega
      const origin = window.location.origin;
      setReferralLink(`${origin}/register?ref=${referralCode}`);
    }
  }, [referralCode]);

  const copyToClipboard = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnWhatsApp = () => {
    if (!referralLink) return;
    const message = encodeURIComponent(`Register using my link to get professional tax services: ${referralLink}`);
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  // Jab tak link generate nahi hota, tab tak loading state ya empty box dikhayenge
  if (!referralLink) {
    return <div className="h-[300px] bg-slate-800 animate-pulse rounded-[3rem]"></div>;
  }

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden group">
      <div className="relative z-10">
        <Gift size={32} className="mb-6 text-blue-200" />
        <h3 className="text-2xl font-black mb-2 italic tracking-tighter text-white">Refer & Earn ₹100</h3>
        <p className="text-blue-100 text-xs font-medium mb-8 leading-relaxed">
          Invite friends. You get <span className="text-white font-black underline decoration-green-400 font-bold">₹100</span> when they pay for their first service.
        </p>

        {/* LINK BOX */}
        <div className="bg-black/20 p-4 rounded-2xl mb-6 flex items-center justify-between border border-white/10">
          <span className="text-[10px] font-mono truncate mr-4 text-blue-200">
            {referralLink}
          </span>
          <button 
            onClick={copyToClipboard} 
            type="button"
            className="shrink-0 p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
          </button>
        </div>

        <button 
          onClick={shareOnWhatsApp}
          type="button"
          className="w-full bg-white text-blue-600 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
        >
          <MessageCircle size={16} fill="currentColor" /> Invite via WhatsApp
        </button>
      </div>
      
      {/* Design Decor */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
    </div>
  );
}