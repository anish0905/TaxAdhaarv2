"use client";

import { useEffect, use } from "react";
import { activateReferralBonus } from "../../../../actions/activateReferral";
import { CheckCircle2, ArrowRight, PartyPopper, ShieldCheck } from "lucide-react";
import Link from "next/link";

// Type Definition for Next.js SearchParams
interface PageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default function SuccessPage({ searchParams }: PageProps) {
  // searchParams ko safely unwrapping/waiting
  const params = use(searchParams);
  const orderId = params.orderId;

  useEffect(() => {
    if (orderId) {
      activateReferralBonus(orderId);
    }
  }, [orderId]);

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-slate-50/50">
      <div className="max-w-xl w-full">
        
        {/* SUCCESS CARD */}
        <div className="bg-white rounded-[2.5rem] sm:rounded-[4rem] p-8 sm:p-12 md:p-16 shadow-2xl shadow-blue-900/10 border border-slate-100 text-center relative overflow-hidden group">
          
          {/* Background Decorative Glows */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700" />

          {/* ICON SECTION */}
          <div className="relative mb-8 flex justify-center">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-emerald-50 text-emerald-500 rounded-[2rem] sm:rounded-[3rem] flex items-center justify-center shadow-inner relative">
              <CheckCircle2 size={64} className="sm:w-20 sm:h-20" strokeWidth={2.5} />
              <div className="absolute -top-2 -right-2 bg-white p-2 rounded-xl shadow-lg animate-bounce">
                <PartyPopper size={24} className="text-orange-500" />
              </div>
            </div>
          </div>

          {/* TEXT SECTION */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
              Payment <br /> <span className="text-emerald-500">Successful!</span>
            </h1>
            
            <div className="flex items-center justify-center gap-2 text-slate-500 font-bold text-[10px] sm:text-xs uppercase tracking-widest">
              <ShieldCheck size={16} className="text-blue-600" />
              Reference ID: {orderId?.slice(-12).toUpperCase() || "N/A"}
            </div>

            <p className="text-slate-500 text-sm sm:text-base font-medium leading-relaxed max-w-xs mx-auto pt-2">
              Your application has been received. Any eligible referral bonus is being processed in the background.
            </p>
          </div>

          {/* DIVIDER */}
          <div className="h-[1px] bg-slate-100 w-full my-10" />

          {/* ACTION BUTTONS - Responsive Stack */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/dashboard/client/orders"
              className="flex-1 bg-[#020617] text-white py-4 sm:py-5 rounded-2xl sm:rounded-3xl font-black uppercase text-[10px] sm:text-[11px] tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
            >
              View My Orders <ArrowRight size={16} />
            </Link>
          </div>

          <p className="mt-8 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
            © 2026 Legal Filing Portal • Secure Transaction
          </p>
        </div>

      </div>
    </div>
  );
}