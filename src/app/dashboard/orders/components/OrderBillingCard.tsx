"use client"
import { useState } from "react";
import { 
  Wallet, CheckCircle2, ReceiptIndianRupee, 
  Zap, QrCode, ShieldCheck, ChevronDown, ChevronUp 
} from "lucide-react";
import { ManualPayment } from "../../components/payment/ManualPayment";
import { RazorpayButton } from "../../components/payment/RazorpayButton";

export function OrderBillingCard({ order, userBalance, useWallet, setUseWallet }: any) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const subTotal = order.billing?.serviceCharge || 0;
  const officialFees = order.billing?.taxAmount || 0;
  const gst = order.billing?.gstAmount || 0;
  const totalOriginal = order.billing?.totalAmount || 0;
  
  const walletDiscount = (useWallet && userBalance > 0) ? Math.min(userBalance, 200) : 0;
  const finalPayable = totalOriginal - walletDiscount;

  return (
    <div className="bg-[#020617] text-white rounded-[2.5rem] p-6 h-fit sticky top-24 shadow-2xl border border-white/5 overflow-hidden">
      
      {/* 1. COMPACT HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
            <ReceiptIndianRupee size={16} className="text-blue-500" />
          </div>
          <h2 className="text-sm font-black uppercase tracking-tight italic">Payment Detail</h2>
        </div>
        <div className="flex items-center gap-1 text-emerald-400">
          <ShieldCheck size={12} />
          <span className="text-[8px] font-black uppercase">Secure</span>
        </div>
      </div>

      {/* 2. WALLET SECTION (More Compact) */}
      <div 
        onClick={() => userBalance > 0 && setUseWallet(!useWallet)}
        className={`mb-4 p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
          (useWallet && userBalance > 0) 
            ? 'bg-blue-600 border-blue-400' 
            : 'bg-white/5 border-white/10 hover:border-white/20'
        } ${userBalance === 0 ? 'opacity-30 grayscale' : 'active:scale-95'}`}
      >
        <div className="flex items-center gap-3">
          <Wallet size={16} className={useWallet ? "text-white" : "text-slate-400"} />
          <div>
            <p className="text-[9px] font-black uppercase leading-none">Use Credits</p>
            <p className="text-[8px] font-bold opacity-60">Available: ₹{userBalance}</p>
          </div>
        </div>
        {useWallet && userBalance > 0 ? <CheckCircle2 size={16} fill="white" className="text-blue-600" /> : <div className="w-4 h-4 rounded-full border border-white/20" />}
      </div>

      {/* 3. TOTAL PAYABLE (Highlighted) */}
      <div className="bg-white/5 rounded-2xl p-4 mb-4 border border-white/5">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Total Payable</p>
            <h4 className="text-4xl font-black italic tracking-tighter text-white leading-none">
              ₹{finalPayable.toLocaleString('en-IN')}
            </h4>
          </div>
          <button 
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="flex items-center gap-1 text-[8px] font-black uppercase text-blue-500 hover:text-blue-400 transition-colors"
          >
            {showBreakdown ? 'Hide Bill' : 'View Bill'} {showBreakdown ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
          </button>
        </div>

        {/* Expandable Breakdown */}
        {showBreakdown && (
          <div className="mt-4 space-y-2 pt-4 border-t border-white/10 animate-in slide-in-from-top-2 duration-300">
            <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase">
              <span>Service Fee</span>
              <span>₹{subTotal}</span>
            </div>
            <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase">
              <span>Official Fees</span>
              <span>₹{officialFees}</span>
            </div>
            <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase border-b border-white/5 pb-2">
              <span>GST (18%)</span>
              <span>₹{gst}</span>
            </div>
            {useWallet && userBalance > 0 && (
              <div className="flex justify-between text-[9px] font-black text-emerald-400 uppercase italic">
                <span>Wallet Discount</span>
                <span>- ₹{walletDiscount}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. PAYMENT METHODS (Side-by-Side or Stacked) */}
      <div className="space-y-3">
        <p className="text-[8px] font-black text-slate-600 uppercase text-center tracking-[0.2em]">Select Gateway</p>
        
        <div className="grid grid-cols-1 gap-3">
          {/* Razorpay Component (Ensuring it is styled internally or wrapped) */}
          <div className="w-full">
            <RazorpayButton amount={finalPayable} orderId={order._id.toString()} />
          </div>

          <div className="relative py-1 flex items-center justify-center">
            <div className="absolute w-full h-[1px] bg-white/5"></div>
            <span className="relative bg-[#020617] px-3 text-[8px] font-black text-slate-700 uppercase">OR</span>
          </div>

          {/* Manual Payment Component */}
          <div className="w-full">
            <ManualPayment orderId={order._id.toString()} amount={finalPayable} />
          </div>
        </div>
      </div>

      <p className="mt-6 text-[8px] text-center text-slate-700 font-bold uppercase tracking-widest leading-relaxed">
        Payments are encrypted <br/> & processed securely
      </p>
    </div>
  );
}