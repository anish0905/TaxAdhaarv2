"use client";

import { useState, useEffect, memo } from "react";
import { calculateTaxData } from "./TaxLogic";
import { Download, TrendingUp, X, Phone, User as UserIcon, CreditCard, ArrowUpRight, Activity, Percent, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import PublicNavbar from "@/components/Navbar";
import { generatePDF } from "@/app/utils/generateReport";
import Footer from "@/components/Footer";

// Sleek Minimal Regime Result Card Node
const ResultCard = memo(({ title, amount, isBest, color, formatCurr }: any) => {
  return (
    <div className={`p-6 rounded-[2rem] border transition-all duration-500 flex flex-col justify-between h-full relative overflow-hidden ${isBest ? (color === 'blue' ? 'border-blue-500 bg-blue-50/30 shadow-sm' : 'border-emerald-500 bg-emerald-50/30 shadow-sm') : 'border-slate-200 bg-white'}`}>
      {isBest && <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl ${color === 'blue' ? 'from-blue-500/10' : 'from-emerald-500/10'} to-transparent rounded-full pointer-events-none`} />}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-black text-[9px] uppercase tracking-widest text-slate-400">{title}</h3>
          {isBest && <span className={`p-1 rounded-lg ${color === 'blue' ? 'bg-blue-600' : 'bg-emerald-600'} text-white shadow-sm`}><TrendingUp size={10} /></span>}
        </div>
        <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">₹{formatCurr(amount)}</div>
      </div>
      {isBest && <p className={`mt-3 text-[8px] font-black uppercase tracking-widest ${color === 'blue' ? 'text-blue-600' : 'text-emerald-600'}`}>Recommended Regime</p>}
    </div>
  );
});
ResultCard.displayName = "ResultCard";

// Premium Savings Meter Component
const SavingsMeter = memo(({ oldTax, newTax }: { oldTax: number, newTax: number }) => {
  const savings = Math.abs(oldTax - newTax);
  if (savings <= 0) return null;
  return (
    <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-lg relative overflow-hidden text-left">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-l from-emerald-500/10 to-transparent rounded-full pointer-events-none" />
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
        <div className="text-center md:text-left space-y-0.5">
          <p className="text-blue-400 text-[8px] font-black uppercase tracking-widest">Optimized Fiscal Delta</p>
          <h2 className="text-xl md:text-2xl font-black tracking-tight">
            Saving <span className="text-emerald-400">₹{savings.toLocaleString('en-IN')}</span> / year
          </h2>
        </div>
        <div className="h-px w-full md:h-8 md:w-px bg-slate-800" />
        <div className="text-center md:text-right">
          <div className="text-emerald-400 text-xl font-black tracking-tight">
            +₹{Math.round(savings / 12).toLocaleString('en-IN')}/mo
          </div>
          <p className="text-slate-400 text-[8px] font-bold uppercase tracking-widest">Disposable Income Boost</p>
        </div>
      </div>
    </div>
  );
});
SavingsMeter.displayName = "SavingsMeter";

// Affiliate Offers & Utility Portal Layout Grid
const AffiliateOffers = memo(({ oldTax, newTax }: { oldTax: number, newTax: number }) => {
  const savings = Math.abs(oldTax - newTax);
  if (savings <= 0) return null;

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center gap-2 px-1">
        <span className="flex h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
        <h4 className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Financial Utilities Portal</h4>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* CIBIL BUREAU METER */}
        <div className="md:col-span-7 bg-white border border-slate-200/80 rounded-[2rem] p-6 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500" />
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-[8px] font-black tracking-widest uppercase px-2 py-0.5 bg-slate-100 text-slate-800 rounded border border-slate-200">RBI Bureau Assessment</span>
              <h3 className="font-black text-lg text-slate-900 tracking-tight mt-1">Credit Score Audit</h3>
            </div>
            <Activity size={16} className="text-emerald-500" />
          </div>

          <div className="py-4 flex flex-col items-center justify-center relative">
            <svg className="w-36 h-20" viewBox="0 0 100 50">
              <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#E2E8F0" strokeWidth="10" strokeLinecap="round"/>
              <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="url(#scoreGrad)" strokeWidth="10" strokeLinecap="round" strokeDasharray="126" strokeDashoffset="30"/>
            </svg>
            <div className="absolute bottom-3 text-center">
              <p className="text-2xl font-black text-slate-900 tracking-tighter">785</p>
              <p className="text-[8px] font-black uppercase text-emerald-600 tracking-widest bg-emerald-50 px-1.5 py-0.5 rounded-full">Excellent</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-0.5 text-[8px] font-black uppercase tracking-wider text-center text-slate-400 mb-4">
            <div className="border-t-2 border-red-500 pt-0.5"><span className="text-red-500">Poor</span></div>
            <div className="border-t-2 border-amber-500 pt-0.5"><span className="text-amber-500">Fair</span></div>
            <div className="border-t-2 border-blue-500 pt-0.5"><span className="text-blue-500">Good</span></div>
            <div className="border-t-2 border-emerald-500 pt-0.5"><span className="text-emerald-500">Excellent</span></div>
          </div>

          <p className="text-slate-500 text-[11px] font-medium leading-normal mb-4 text-center">
            Verify score status in 3 dynamic validation triggers via OTP secured framework.
          </p>

          <Link href="https://sales.gromo.in/c/ItiN_CCVj1XzQrqkDxIgr" target="_blank" className="w-full py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest text-center flex items-center justify-center gap-1.5 hover:bg-slate-800 transition-all shadow-sm active:scale-[0.99]">
            Verify Bureau Score <ArrowUpRight size={12} />
          </Link>
        </div>

        {/* AXIS BANK NEO CREDIT CARD */}
        <div className="md:col-span-5 bg-white border border-slate-200/80 rounded-[2rem] p-6 shadow-sm flex flex-col justify-between overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#8F0025]" />
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-[8px] font-black tracking-widest uppercase px-2 py-0.5 bg-rose-50 text-[#8F0025] rounded border border-rose-100">Reward Tier</span>
              <CreditCard size={16} className="text-[#8F0025]" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900 tracking-tight">Axis Bank Neo</h3>
              <p className="text-slate-400 text-[8px] font-bold uppercase tracking-wider">Lifetime Free Offer</p>
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span>🍕</span> <span>40% OFF on Zomato Deliveries</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span>🛍️</span> <span>10% OFF on Blinkit & Myntra</span>
              </div>
            </div>
            <p className="text-slate-500 text-[11px] font-medium leading-normal pt-1">
              Maximize take-home delta of <span className="text-slate-900 font-bold">₹{Math.round(savings / 12).toLocaleString('en-IN')}/mo</span> with lifestyle rebates.
            </p>
          </div>
          <Link href="https://leads.banksathi.com/?h=eTBId2hhQTNab3p2Zkt2V1VZb2Rvdz09" target="_blank" className="w-full py-3 bg-[#8F0025] text-white rounded-xl font-black text-[10px] uppercase tracking-widest text-center flex items-center justify-center gap-1.5 hover:bg-[#70001D] transition-all shadow-md mt-4 active:scale-[0.99]">
            Activate Account <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
});
AffiliateOffers.displayName = "AffiliateOffers";

export default function TaxCalculatorClient() {
  const [salary, setSalary] = useState(1300000);
  const [inv, setInv] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [leadData, setLeadData] = useState({ name: "", phone: "" });

  useEffect(() => { setMounted(true); }, []);

  const results = calculateTaxData(salary, inv);
  const formatCurr = (num: number) => mounted ? num.toLocaleString('en-IN') : num.toString();

  const finalizeDownload = (e: React.FormEvent) => {
    e.preventDefault();
    generatePDF({ ...results, salary, inv, userName: leadData.name });
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-24 antialiased text-slate-950 selection:bg-blue-600 selection:text-white tracking-tight relative">
      <PublicNavbar />
      
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)] h-[600px] -z-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-16 space-y-10">
        <div className="flex flex-col items-center text-center space-y-3 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-blue-50 border border-blue-200/50 rounded-md text-blue-700 text-[9px] font-black uppercase tracking-widest shadow-sm">
            <span className="flex h-1 w-1 rounded-full bg-blue-600 animate-pulse" />
            LIVE FISCAL DATABASE 2026-27
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tighter max-w-xl leading-[1.1]">
            Tax<span className="text-blue-600 font-black">Adhaar</span> Precision Optimizer.
          </h1>
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.4em] pt-1">National Compliance Engine</p>
        </div>

        {/* Responsive Grid Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
          
          {/* LEFT: Controls Pad */}
          <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-[2rem] shadow-xl shadow-slate-200/30 border border-slate-200/60 space-y-8 relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-full pointer-events-none" />
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3 text-left">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Percent size={14} /></div>
              <div>
                <h3 className="font-black text-xs tracking-tight text-slate-800">Income Matrix</h3>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Calibrate Parameters</p>
              </div>
            </div>

            <div className="space-y-3 text-left">
              <div className="flex justify-between items-end">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Gross Annual Income</label>
                <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tighter">₹{formatCurr(salary)}</span>
              </div>
              <input type="range" min="300000" max="5000000" step="50000" value={salary} onChange={(e)=>setSalary(Number(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 outline-none" />
            </div>
            
            <div className="space-y-3 text-left">
              <div className="flex justify-between items-end">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Deductions (80C)</label>
                <span className="text-lg sm:text-xl font-black text-emerald-600 tracking-tighter">₹{formatCurr(inv)}</span>
              </div>
              <input type="range" min="0" max="250000" step="5000" value={inv} onChange={(e)=>setInv(Number(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500 outline-none" />
            </div>
          </div>

          {/* RIGHT: Dynamic Results Board */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <ResultCard title="New Tax Regime" amount={results.newTax} isBest={results.recommended === "New Regime"} color="blue" formatCurr={formatCurr} />
              <ResultCard title="Old Tax Regime" amount={results.oldTax} isBest={results.recommended === "Old Regime"} color="emerald" formatCurr={formatCurr} />
            </div>

            <SavingsMeter oldTax={results.oldTax} newTax={results.newTax} />
            <AffiliateOffers oldTax={results.oldTax} newTax={results.newTax} />

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
               <button onClick={() => setShowModal(true)} className="flex-1 bg-slate-900 text-white px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm">
                 <Download size={12} /> Download Audit Report
               </button>
               <Link href="/services" className="flex-1 bg-blue-600 text-white px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md flex items-center justify-center gap-1.5 group">
                 File Instant ITR Now <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
               </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 text-center border-t border-slate-200/40 max-w-xs mx-auto">
          <Link href="https://www.aimgrit.in" target="_blank" className="inline-flex items-center gap-1.5 text-[8px] font-black text-slate-400 hover:text-blue-600 transition-all uppercase tracking-widest bg-white border border-slate-200 px-3 py-1.5 rounded-md shadow-sm">
            Architecture by AimGrit
          </Link>
        </div>
      </div>

      {/* LEAD CONVERSION POPUP MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm p-6 sm:p-8 rounded-[2rem] shadow-2xl relative overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-600" />
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors p-1 bg-slate-50 rounded-full">
              <X size={14} />
            </button>
            <div className="text-center space-y-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Identity Verification</h2>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Encrypted Report Secure Delivery Pipeline</p>
              
              <form onSubmit={finalizeDownload} className="space-y-4 pt-4 text-left">
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-slate-400 ml-1 tracking-widest">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input required type="text" placeholder="Anish Kumar" className="w-full pl-10 pr-4 py-3 bg-slate-50 focus:bg-white rounded-lg border border-slate-200 focus:border-blue-500 outline-none font-bold text-slate-900 transition-all text-xs" 
                      onChange={(e) => setLeadData({...leadData, name: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-slate-400 ml-1 tracking-widest">WhatsApp Secure Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input required type="tel" placeholder="7260858715" className="w-full pl-10 pr-4 py-3 bg-slate-50 focus:bg-white rounded-lg border border-slate-200 focus:border-blue-500 outline-none font-bold text-slate-900 transition-all text-xs" 
                      onChange={(e) => setLeadData({...leadData, phone: e.target.value})} />
                  </div>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-black text-[10px] uppercase tracking-widest shadow-md hover:bg-blue-700 transition-all mt-2 flex items-center justify-center gap-1.5">
                  Generate Document <CheckCircle2 size={12} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}