"use client";
import React, { use } from "react"; // use hook add kiya
import Link from "next/link";
import { CheckCircle2, ArrowRight, FileText, ShieldCheck } from "lucide-react";

export default function PaymentSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  // Params ko unwrap karein
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full">
        {/* Success Icon Section */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
            <div className="relative bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-[2.5rem] mb-6 inline-flex items-center justify-center">
              <CheckCircle2 size={48} className="text-emerald-400" />
            </div>
          </div>
          <h1 className="text-3xl font-black italic tracking-tighter text-white mb-2 uppercase">
            Payment Successful
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            Your order has been verified and moved to processing.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 mb-8 backdrop-blur-sm">
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-blue-500" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Order ID</span>
              </div>
              {/* .id use kiya params.orderId ki jagah */}
              <span className="text-xs font-mono font-bold text-white uppercase">
                {orderId ? orderId.slice(-12) : "Loading..."}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-emerald-500" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</span>
              </div>
              <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-black px-3 py-1 rounded-full uppercase italic">
                Verified & Paid
              </span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-dashed border-white/10">
            <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed text-center">
              Our team will start working on your <br /> documentation shortly.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Link 
            href={`/dashboard/orders/${orderId}`}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 group shadow-xl shadow-blue-500/20"
          >
            Track My Order
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            href="/dashboard"
            className="w-full bg-transparent border border-white/10 text-slate-400 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 transition-all text-center"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}