import { Wallet, CheckCircle2, ReceiptIndianRupee, Loader2, ArrowRight, Activity } from "lucide-react";
import Link from "next/link";

interface BillingCardProps {
  order: any;
  userBalance: number;
  useWallet: boolean;
  setUseWallet: (val: boolean) => void;
  isProcessingPayment: boolean;
  onPay: (amount: number, id: string) => void;
}

export function OrderBillingCard({ 
  order, 
  userBalance, 
  useWallet, 
  setUseWallet, 
  isProcessingPayment, 
  onPay 
}: BillingCardProps) {
  
  const isPaymentPending = order.status === 'payment_pending' && order.paymentStatus !== 'paid';
  const isProcessing = order.status === 'processing' || (order.paymentStatus === 'paid' && order.status !== 'completed');
  
  const subTotal = order.billing?.totalAmount || 0;
  const maxRedeemable = 200;
  
  // Wallet logic: Click tabhi asar karega jab balance > 0 ho
  const walletAmountToUse = (useWallet && userBalance > 0) ? Math.min(userBalance, maxRedeemable) : 0;
  const finalPayable = subTotal - walletAmountToUse;

  // Click Handler with simple logic
  const handleWalletToggle = () => {
    if (userBalance > 0) {
      setUseWallet(!useWallet);
    }
  };

  if (isPaymentPending) {
    return (
      <div className="bg-[#020617] text-white rounded-[3rem] p-8 h-full flex flex-col relative overflow-hidden shadow-2xl border border-white/5">
        
        {/* --- WALLET SECTION --- */}
        <div 
          onClick={handleWalletToggle}
          className={`mb-6 p-4 rounded-[2rem] border transition-all flex items-center justify-between cursor-pointer select-none ${
            (useWallet && userBalance > 0) 
              ? 'bg-blue-600 border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.3)]' 
              : 'bg-white/5 border-white/10 hover:border-white/20'
          } ${userBalance === 0 ? 'opacity-40 cursor-not-allowed grayscale' : 'active:scale-95'}`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl transition-colors ${useWallet && userBalance > 0 ? 'bg-blue-500' : 'bg-white/10'}`}>
              <Wallet size={18} className={userBalance === 0 ? 'text-slate-500' : 'text-white'} />
            </div>
            <div className="text-left">
              <p className={`text-[10px] font-black uppercase tracking-widest ${userBalance === 0 ? 'text-slate-500' : 'text-white'}`}>
                Apply Credits
              </p>
              <p className={`text-[9px] font-bold ${userBalance === 0 ? 'text-slate-500' : 'opacity-70'}`}>
                Avail: ₹{userBalance}
              </p>
            </div>
          </div>

          {userBalance > 0 ? (
            useWallet ? (
              <CheckCircle2 size={20} fill="white" className="text-blue-600" />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-white/20 group-hover:border-white/40" />
            )
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-white/10" />
          )}
        </div>

        {/* --- BILLING SUMMARY --- */}
        <div className="space-y-4 mb-8 bg-white/5 p-6 rounded-[2.5rem] border border-white/5">
           <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
             <span>Professional Fee</span>
             <span>₹{order.billing?.serviceCharge || 0}</span>
           </div>
           
           {order.billing?.taxAmount > 0 && (
             <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
                <span>Official Fees</span>
                <span>₹{order.billing?.taxAmount}</span>
             </div>
           )}

           {useWallet && userBalance > 0 && (
             <div className="flex justify-between text-[10px] font-black uppercase text-emerald-400 pt-2 border-t border-white/10 animate-in fade-in slide-in-from-top-1">
               <span>Wallet Discount</span>
               <span className="italic">- ₹{walletAmountToUse}</span>
             </div>
           )}

           <div className="pt-4 flex justify-between items-end">
             <div>
               <p className="text-[10px] font-black text-blue-400 uppercase mb-1 tracking-tighter">Total Payable</p>
               <h4 className="text-5xl font-black italic tracking-tighter transition-all">
                 ₹{finalPayable}
               </h4>
             </div>
             <ReceiptIndianRupee size={32} className="text-blue-500/20" />
           </div>
        </div>

        <button 
          onClick={() => onPay(subTotal, order._id)}
          disabled={isProcessingPayment}
          className="w-full bg-blue-600 text-white py-5 rounded-[1.8rem] font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 mt-auto shadow-xl shadow-blue-900/40 disabled:opacity-50 active:scale-95 transition-transform"
        >
          {isProcessingPayment ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>Authorize & Pay <ArrowRight size={14} /></>
          )}
        </button>
      </div>
    );
  }

  // Processing & Completed states logic remains same as per your design
  if (isProcessing) {
    return (
      <div className="bg-blue-50 border-2 border-blue-100 rounded-[3rem] p-10 h-full flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="w-20 h-20 bg-white rounded-[2rem] shadow-xl flex items-center justify-center text-blue-600 mb-6 relative z-10">
          <Activity size={40} className="animate-spin" style={{ animationDuration: '3s' }} />
        </div>
        <h4 className="text-lg font-black text-slate-900 uppercase italic leading-none">Filing in Progress</h4>
        <p className="text-[9px] font-bold text-blue-600 uppercase mt-3 tracking-widest opacity-70">Expert Verification Active</p>
        <Activity size={120} className="absolute -right-8 -bottom-8 text-blue-100 opacity-50" />
      </div>
    );
  }

  return (
    <div className="bg-emerald-50 border-2 border-emerald-100 rounded-[3rem] p-10 h-full flex flex-col items-center justify-center text-center group">
      <div className="w-20 h-20 bg-emerald-500 text-white rounded-[2.5rem] flex items-center justify-center mb-6 shadow-2xl shadow-emerald-200 group-hover:scale-110 transition-transform">
        <CheckCircle2 size={40} strokeWidth={3} />
      </div>
      <h4 className="text-lg font-black text-emerald-900 uppercase italic tracking-tighter leading-none">Job Completed</h4>
      <p className="text-[9px] font-bold text-emerald-600 uppercase mt-3 tracking-widest">Documents Dispatched</p>
      <Link 
        href={`/dashboard/client/orders/${order._id}`} 
        className="mt-8 px-6 py-3 bg-white border border-emerald-200 rounded-full text-[10px] font-black uppercase text-emerald-700 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
      >
        Download Files
      </Link>
    </div>
  );
}