"use client";
import { useState, useEffect } from "react";
import { calculateTaxData } from "./TaxLogic";
import { Download, ShieldCheck, TrendingUp, X, Phone, User as UserIcon } from "lucide-react";
import Link from "next/link";
import PublicNavbar from "@/components/Navbar";
import { generatePDF } from "@/app/utils/generateReport";

export default function TaxCalculatorPage() {
  const [salary, setSalary] = useState(1300000);
  const [inv, setInv] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  // Lead Modal States
  const [showModal, setShowModal] = useState(false);
  const [leadData, setLeadData] = useState({ name: "", phone: "" });

  useEffect(() => { setMounted(true); }, []);

  const results = calculateTaxData(salary, inv);
  const formatCurr = (num: number) => mounted ? num.toLocaleString('en-IN') : num.toString();

  const handleDownloadTrigger = () => {
    setShowModal(true);
  };

  const finalizeDownload = (e: React.FormEvent) => {
    e.preventDefault();
    // Yahan aap apna server action call kar sakte hain lead save karne ke liye
    console.log("Saving Lead:", leadData); 
    
    generatePDF({ ...results, salary, inv, userName: leadData.name });
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20">
      <PublicNavbar />
      
      <div className="max-w-6xl mx-auto px-6 mt-12 space-y-10">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center space-y-2 animate-in fade-in duration-700">
          <div className="p-4 bg-white rounded-3xl shadow-sm border border-slate-100 text-blue-600 mb-2">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Tax Optimizer.</h1>
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.3em]">Precision Engine 2025-26</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Controls Panel */}
          <div className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 space-y-10">
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Annual Salary</label>
                <span className="text-xl font-black text-blue-600">₹{formatCurr(salary)}</span>
              </div>
              <input type="range" min="300000" max="5000000" step="50000" value={salary} onChange={(e)=>setSalary(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            </div>
            
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Deductions (80C)</label>
                <span className="text-xl font-black text-emerald-500">₹{formatCurr(inv)}</span>
              </div>
              <input type="range" min="0" max="250000" step="5000" value={inv} onChange={(e)=>setInv(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <ResultCard title="New Regime" amount={results.newTax} isBest={results.recommended === "New Regime"} color="blue" formatCurr={formatCurr} />
              <ResultCard title="Old Regime" amount={results.oldTax} isBest={results.recommended === "Old Regime"} color="emerald" formatCurr={formatCurr} />
            </div>

            <SavingsMeter oldTax={results.oldTax} newTax={results.newTax} />

            <div className="flex flex-col md:flex-row gap-4">
               <button 
                onClick={handleDownloadTrigger}
                className="flex-1 bg-white border-2 border-slate-900 text-slate-900 px-8 py-5 rounded-3xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3 active:scale-95">
                 <Download size={16} /> Download Audit Report
               </button>
               <Link href="/services" className="flex-1 bg-blue-600 text-white px-8 py-5 rounded-3xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center">
                  File ITR Now
               </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.5em] pt-10">
          Powered by Aimgrit Digital Solutions
        </p>
      </div>

      {/* LEAD MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md p-10 rounded-[3rem] shadow-2xl relative animate-in zoom-in duration-300">
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900">
              <X size={24} />
            </button>
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">One last step!</h2>
              <p className="text-slate-500 text-xs font-bold leading-relaxed">Enter your details to receive the personalized tax audit report on your device.</p>
              
              <form onSubmit={finalizeDownload} className="space-y-4 pt-4 text-left">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input required type="text" placeholder="Anish Kumar" className="w-full pl-14 pr-8 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:bg-white outline-none font-bold text-slate-900" 
                      onChange={(e) => setLeadData({...leadData, name: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-4">WhatsApp Number</label>
                  <div className="relative">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input required type="tel" placeholder="7557721426" className="w-full pl-14 pr-8 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:bg-white outline-none font-bold text-slate-900" 
                      onChange={(e) => setLeadData({...leadData, phone: e.target.value})} />
                  </div>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 mt-4">
                  Generate Report
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-components (SavingsMeter, ResultCard) ko alag file ya bottom me rakhein
function SavingsMeter({ oldTax, newTax }: { oldTax: number, newTax: number }) {
  const savings = Math.abs(oldTax - newTax);
  if (savings <= 0) return null;
  return (
    <div className="bg-[#020617] p-8 rounded-[2.5rem] text-white shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-1">Optimization Result</p>
          <h2 className="text-3xl font-black tracking-tight">
            Saving <span className="text-emerald-400">₹{savings.toLocaleString('en-IN')}</span> per year
          </h2>
        </div>
        <div className="h-px w-full md:h-12 md:w-px bg-slate-700" />
        <div className="text-center">
          <div className="text-emerald-400 text-2xl font-black tracking-tighter">
            ₹{Math.round(savings / 12).toLocaleString('en-IN')}/mo
          </div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Extra Take-home Pay</p>
        </div>
      </div>
    </div>
  );
}

function ResultCard({ title, amount, isBest, color, formatCurr }: any) {
  return (
    <div className={`p-8 rounded-[2.5rem] border-2 transition-all duration-500 flex flex-col justify-between h-full ${isBest ? (color === 'blue' ? 'border-blue-500 bg-blue-50/50' : 'border-emerald-500 bg-emerald-50/50') : 'border-slate-100 bg-white shadow-sm'}`}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-black text-[11px] uppercase tracking-widest text-slate-400">{title}</h3>
          {isBest && <span className={`p-1.5 rounded-lg ${color === 'blue' ? 'bg-blue-500' : 'bg-emerald-500'} text-white`}><TrendingUp size={14} /></span>}
        </div>
        <div className="text-4xl font-black text-slate-900 tracking-tight">₹{formatCurr(amount)}</div>
      </div>
      {isBest && <p className={`mt-4 text-[10px] font-bold uppercase ${color === 'blue' ? 'text-blue-600' : 'text-emerald-600'}`}>Highly Recommended</p>}
    </div>
  );
}