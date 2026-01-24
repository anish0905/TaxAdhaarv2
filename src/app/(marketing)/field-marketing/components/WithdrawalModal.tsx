"use client";
import { useState } from "react";
import { X, Wallet, ShieldCheck, Loader2 } from "lucide-react";
import { requestPayoutAction } from "@/app/actions/marketingActions";

export default function WithdrawalModal({ user, onClose }: any) {
  const [amount, setAmount] = useState("");
  const [upi, setUpi] = useState("");
  const [loading, setLoading] = useState(false);

  // Safe variables to prevent "undefined" crashes
  const currentBalance = user?.referralEarnings?.balance ?? 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Balance check with safe number conversion
    if (Number(amount) > currentBalance) {
      return alert("Insufficient balance in your wallet!");
    }
    
    if (Number(amount) < 500) {
      return alert("Minimum withdrawal amount is ₹500");
    }
    
    setLoading(true);
    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("upiId", upi);

    try {
      const res = await requestPayoutAction(formData);
      if (res?.success) {
        alert("Payout request submitted successfully!");
        onClose();
      } else {
        alert(res?.error || "Failed to submit request");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl relative animate-in zoom-in duration-300">
        <button 
          onClick={onClose} 
          className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <Wallet size={28} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase italic">
            Request <span className="text-blue-600">Payout</span>
          </h2>
          {/* FIXED: Added optional chaining and fallback */}
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
            Current Balance: ₹{currentBalance.toLocaleString()}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Amount to Withdraw</label>
            <input 
              required
              type="number" 
              min="500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Min. ₹500"
              className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Your UPI ID</label>
            <input 
              required
              type="text" 
              value={upi}
              onChange={(e) => setUpi(e.target.value)}
              placeholder="e.g. anish@okaxis"
              className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
            />
          </div>

          <button 
            disabled={loading || currentBalance < 500}
            className="w-full bg-[#020617] disabled:bg-slate-300 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200"
          >
            {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck size={18} />}
            {currentBalance < 500 ? "Minimum ₹500 Required" : "Confirm Withdrawal"}
          </button>
        </form>
      </div>
    </div>
  );
}