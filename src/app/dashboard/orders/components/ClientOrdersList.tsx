// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import Script from "next/script";
// import { 
//   FileText, Clock, ShieldCheck, IndianRupee, 
//   ArrowRight, CheckCircle2, Loader2, Activity 
// } from "lucide-react";

// export default function ClientOrdersList({ initialOrders }: { initialOrders: any[] }) {
//   const [orders] = useState(initialOrders);

//   const makePayment = async (amount: number, orderId: string) => {
//     try {
//       const res = await fetch("/api/razorpay", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ amount, orderId }),
//       });
//       const data = await res.json();

//       const options = {
//         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//         amount: data.amount,
//         currency: "INR",
//         name: "Legal Filing Service",
//         description: `Payment for Order #${orderId.slice(-6).toUpperCase()}`,
//         order_id: data.id,
//         handler: async function (response: any) {
//           const updateRes = await fetch("/api/orders/update-status", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ 
//                orderId, 
//                razorpay_payment_id: response.razorpay_payment_id,
//                status: 'processing', // Payment success ke baad processing state
//                paymentStatus: 'paid'
//             }),
//           });

//           if(updateRes.ok) {
//             window.location.href = `/dashboard/client/orders/success/${orderId}`;
//           }
//         },
//         theme: { color: "#2563eb" },
//       };

//       const paymentObject = new (window as any).Razorpay(options);
//       paymentObject.open();
//     } catch (error) {
//       console.error("Payment failed", error);
//       alert("Payment initiation failed. Please try again.");
//     }
//   };

//   return (
//     <>
//       <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

//       <div className="space-y-10">
//         {orders.map((order: any) => {
//           // Logic mapping with your Enums
//           const isReviewing = order.status === 'under_review';
//           const isPaymentPending = order.status === 'payment_pending' && order.paymentStatus !== 'paid';
//           const isProcessing = order.status === 'processing' || (order.paymentStatus === 'paid' && order.status !== 'completed');
//           const isCompleted = order.status === 'completed';

//           return (
//             <div key={order._id} className="bg-white rounded-[4rem] p-4 shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden group hover:border-blue-100 transition-all">
//               <div className="flex flex-col xl:flex-row items-stretch gap-8">
                
//                 {/* 1. Service Info Section */}
//                 <div className="xl:w-1/4 p-8 flex flex-col justify-between border-r border-slate-50">
//                   <div className="space-y-6">
//                     <div className="flex items-center gap-5">
//                       <div className="w-16 h-16 bg-[#020617] text-blue-500 rounded-[1.5rem] flex items-center justify-center text-2xl font-black italic shadow-lg group-hover:scale-110 transition-transform">
//                         {order.serviceType.charAt(0)}
//                       </div>
//                       <div>
//                         <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1.5">#{String(order._id).slice(-6).toUpperCase()}</p>
//                         <h2 className="text-xl font-black text-slate-900 uppercase leading-none tracking-tight">
//                           {order.serviceType.replace(/-/g, " ")}
//                         </h2>
//                       </div>
//                     </div>
                    
//                     <Link 
//                       href={`/dashboard/client/orders/${order._id}`} 
//                       className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 tracking-[0.1em] transition-colors"
//                     >
//                       View Documents <ArrowRight size={14} />
//                     </Link>
//                   </div>
//                 </div>

//                 {/* 2. Visual Progress Tracker */}
//                 <div className="flex-1 p-8 flex flex-col justify-center bg-slate-50/50 rounded-[3.5rem] my-4 mx-4 xl:mx-0 relative">
//                   <div className="relative flex justify-between max-w-lg mx-auto w-full">
//                     {/* Progress Background Line */}
//                     <div className="absolute top-5 left-0 right-0 h-[3px] bg-slate-200 -z-0 rounded-full overflow-hidden">
//                        <div className={`h-full bg-blue-600 transition-all duration-1000 ${isCompleted ? 'w-full' : isProcessing ? 'w-2/3' : isPaymentPending ? 'w-1/3' : 'w-0'}`}></div>
//                     </div>
                    
//                     <TimelineStep done={true} label="Docs" active={false} />
//                     <TimelineStep done={isPaymentPending || isProcessing || isCompleted} label="Review" active={isReviewing} />
//                     <TimelineStep done={isProcessing || isCompleted} label="Payment" active={isPaymentPending} />
//                     <TimelineStep done={isCompleted} label="Filing" active={isProcessing} />
//                     <TimelineStep done={isCompleted} label="Done" active={false} />
//                   </div>
//                 </div>

//                 {/* 3. Dynamic Action Card (Billing & Status) */}
//                 <div className="xl:w-1/3 p-4">
//                   {isPaymentPending ? (
//                     <div className="bg-[#020617] text-white rounded-[3.5rem] p-8 h-full flex flex-col justify-between border border-white/5 relative overflow-hidden group/pay shadow-2xl">
//                       <div className="relative z-10">
//                         <div className="flex justify-between items-start mb-6">
//                           <div>
//                             <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Total Payable</p>
//                             <h4 className="text-5xl font-black italic tracking-tighter mt-1 text-white">₹{order.billing?.totalAmount}</h4>
//                           </div>
//                           <div className="p-3 bg-blue-600/20 rounded-2xl">
//                             <IndianRupee size={20} className="text-blue-500" />
//                           </div>
//                         </div>

//                         {/* DETAILED BILLING BREAKUP */}
//                         <div className="space-y-3 mb-8 bg-white/5 p-6 rounded-[2rem] border border-white/5">
//                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">
//                             Billing Summary
//                           </p>
//                           <div className="flex justify-between items-center text-[10px] font-bold uppercase">
//                             <span className="text-slate-400">Govt. Fees / Tax</span>
//                             <span className="text-slate-200 italic">₹{order.billing?.taxAmount}</span>
//                           </div>
//                           <div className="flex justify-between items-center text-[10px] font-bold uppercase">
//                             <span className="text-slate-400">Service Charge</span>
//                             <span className="text-slate-200 italic">₹{order.billing?.serviceCharge}</span>
//                           </div>
//                           <div className="flex justify-between items-center text-[10px] font-bold uppercase">
//                             <span className="text-slate-400">GST (18%)</span>
//                             <span className="text-slate-200 italic">₹{order.billing?.gstAmount}</span>
//                           </div>
//                         </div>

//                         <button 
//                           onClick={() => makePayment(order.billing?.totalAmount, order._id)}
//                           className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/40 active:scale-95"
//                         >
//                           Secure Checkout <ArrowRight size={16} />
//                         </button>
//                       </div>
//                       <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl group-hover/pay:bg-blue-600/20 transition-all"></div>
//                     </div>
//                   ) : isProcessing ? (
//                     <div className="bg-blue-50 text-blue-600 rounded-[3.5rem] p-10 h-full flex flex-col items-center justify-center text-center border border-blue-100 relative overflow-hidden">
//                        <Loader2 size={36} className="mb-4 animate-spin" />
//                        <h4 className="text-sm font-black uppercase italic tracking-widest">Filing in Progress</h4>
//                        <p className="text-[9px] font-bold uppercase mt-2 opacity-60 leading-relaxed px-4">
//                          Our experts are currently filing your application with the department.
//                        </p>
//                        <Activity size={100} className="absolute -right-6 -bottom-6 opacity-5 text-blue-600" />
//                     </div>
//                   ) : isCompleted ? (
//                     <div className="bg-emerald-50 text-emerald-600 rounded-[3.5rem] p-10 h-full flex flex-col items-center justify-center text-center border border-emerald-100 shadow-inner">
//                       <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-5 shadow-lg shadow-emerald-200">
//                         <CheckCircle2 size={32} />
//                       </div>
//                       <h4 className="text-sm font-black uppercase italic">Work Completed</h4>
//                       <p className="text-[9px] font-bold uppercase mt-2 opacity-70">Final acknowledgement is ready</p>
//                     </div>
//                   ) : (
//                     <div className="bg-white rounded-[3.5rem] p-10 h-full border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm">
//                       <Clock size={28} className="text-orange-500 mb-4 animate-pulse" />
//                       <h4 className="text-sm font-black text-slate-900 uppercase italic">Doc Verification</h4>
//                       <p className="text-[9px] font-bold uppercase mt-2 text-slate-400">Verifying your upload...</p>
//                     </div>
//                   )}
//                 </div>

//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </>
//   );
// }

// function TimelineStep({ done, label, active }: { done: boolean, label: string, active: boolean }) {
//   return (
//     <div className="flex flex-col items-center gap-3 relative z-10">
//       <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border-4 border-[#f8fafc] transition-all duration-500 shadow-sm ${
//         done ? 'bg-green-500 text-white shadow-green-100' : active ? 'bg-blue-600 text-white animate-pulse shadow-blue-100' : 'bg-white text-slate-200'
//       }`}>
//         {done ? <ShieldCheck size={18} /> : active ? <Activity size={18} /> : <div className="w-1.5 h-1.5 bg-current rounded-full" />}
//       </div>
//       <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${active ? 'text-blue-600' : done ? 'text-green-600' : 'text-slate-400'}`}>
//         {label}
//       </span>
//     </div>
//   );
// }


//dumy h testing ke liya uppeer wala hi code sahi h 



"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  FileText, Clock, ShieldCheck, IndianRupee, 
  ArrowRight, CheckCircle2, Loader2, Activity, Wallet, ReceiptIndianRupee 
} from "lucide-react";

// --- Internal Component: TimelineStep ---
function TimelineStep({ 
  done, 
  label, 
  active, 
  icon 
}: { 
  done: boolean; 
  label: string; 
  active: boolean; 
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 relative z-10 group">
      <div 
        className={`w-12 h-12 rounded-2xl flex items-center justify-center border-4 border-white transition-all duration-700 shadow-lg ${
          done 
            ? 'bg-emerald-500 text-white shadow-emerald-200/50' 
            : active 
              ? 'bg-[#020617] text-blue-400 animate-pulse shadow-blue-200/50 scale-110' 
              : 'bg-white text-slate-300'
        }`}
      >
        {done ? <CheckCircle2 size={20} strokeWidth={3} /> : active ? icon : icon}
      </div>
      
      <div className="flex flex-col items-center">
        <span 
          className={`text-[9px] font-black uppercase tracking-[0.15em] transition-colors duration-500 ${
            active ? 'text-blue-600' : done ? 'text-emerald-600' : 'text-slate-400'
          }`}
        >
          {label}
        </span>
        {active && (
          <div className="w-4 h-1 bg-blue-600 rounded-full mt-1 animate-bounce" />
        )}
      </div>
    </div>
  );
}

export default function ClientOrdersList({ initialOrders, userBalance = 100 }: { initialOrders: any[], userBalance?: number }) {
  const [orders] = useState(initialOrders);
  const [isProcessingPayment, setIsProcessingPayment] = useState<string | null>(null);
  const [useWallet, setUseWallet] = useState(false);

  const maxRedeemable = 200;
  const walletAmountToUse = useWallet ? Math.min(userBalance, maxRedeemable) : 0;

  const makePayment = async (amount: number, orderId: string) => {
    try {
      setIsProcessingPayment(orderId);
      const netPayable = amount - walletAmountToUse;

      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: netPayable, orderId }),
      });
      const data = await res.json();

      const dummyResponse = {
        razorpay_payment_id: "pay_dummy_" + Math.random().toString(36).substring(7),
        razorpay_order_id: data.id,
      };

      const updateRes = await fetch("/api/orders/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
           orderId, 
           razorpay_payment_id: dummyResponse.razorpay_payment_id,
           status: 'processing', 
           paymentStatus: 'paid',
           walletUsed: walletAmountToUse 
        }),
      });

      if(updateRes.ok) window.location.href = `/dashboard/orders/success/${orderId}`;
    } catch (error) {
      console.error("Payment failed", error);
    } finally {
      setIsProcessingPayment(null);
    }
  };

  return (
    <div className="space-y-12">
      {orders.map((order: any) => {
        // Status Logic
        const isReviewing = order.status === 'under_review';
        const isPaymentPending = order.status === 'payment_pending' && order.paymentStatus !== 'paid';
        const isProcessing = order.status === 'processing' || (order.paymentStatus === 'paid' && order.status !== 'completed');
        const isCompleted = order.status === 'completed';

        const subTotal = order.billing?.totalAmount || 0;
        const finalPayable = subTotal - walletAmountToUse;

        return (
          <div key={order._id} className="bg-white rounded-[3.5rem] p-3 shadow-2xl shadow-slate-200/50 border border-slate-100 group transition-all hover:border-blue-200">
            <div className="flex flex-col xl:flex-row gap-6">
              
              {/* 1. SERVICE INFO */}
              <div className="xl:w-1/4 p-8 bg-slate-50/50 rounded-[3rem] flex flex-col justify-between border border-slate-50">
                <div className="space-y-6">
                  <div className="w-14 h-14 bg-[#020617] text-blue-500 rounded-2xl flex items-center justify-center text-xl font-black italic shadow-lg">
                    {order.serviceType.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">ID: #{String(order._id).slice(-6).toUpperCase()}</p>
                    <h2 className="text-xl font-black text-slate-900 uppercase leading-tight tracking-tight">
                      {order.serviceType.replace(/-/g, " ")}
                    </h2>
                  </div>
                  <Link href={`/dashboard/client/orders/${order._id}`} className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 transition-colors">
                    View Dossier <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* 2. VISUAL PROGRESS TRACKER */}
              <div className="flex-1 p-8 flex flex-col justify-center bg-slate-50/50 rounded-[3.5rem] my-4 mx-4 xl:mx-0 relative border border-slate-100/50">
                <div className="relative flex justify-between max-w-xl mx-auto w-full px-2">
                  <div className="absolute top-6 left-0 right-0 h-[4px] bg-slate-200/60 -z-0 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-1000 ease-in-out shadow-[0_0_10px_rgba(37,99,235,0.4)] ${
                        isCompleted ? 'w-full' : 
                        isProcessing ? 'w-[75%]' : 
                        isPaymentPending ? 'w-[50%]' : 
                        isReviewing ? 'w-[25%]' : 'w-0'
                      }`}
                    />
                  </div>
                  
                  <TimelineStep done={true} label="Docs" active={false} icon={<FileText size={16} />} />
                  <TimelineStep done={isPaymentPending || isProcessing || isCompleted} label="Review" active={isReviewing} icon={<Clock size={16} />} />
                  <TimelineStep done={isProcessing || isCompleted} label="Payment" active={isPaymentPending} icon={<IndianRupee size={16} />} />
                  <TimelineStep done={isCompleted} label="Filing" active={isProcessing} icon={<Activity size={16} />} />
                  <TimelineStep done={isCompleted} label="Done" active={false} icon={<ShieldCheck size={16} />} />
                </div>
              </div>

              {/* 3. DYNAMIC BILLING CARD */}
              <div className="xl:w-[35%] p-2">
  {isPaymentPending ? (
    /* --- CASE 1: PAYMENT PENDING (Checkout UI) --- */
    <div className="bg-[#020617] text-white rounded-[3rem] p-8 h-full flex flex-col relative overflow-hidden shadow-2xl border border-white/5">
      <div className="relative z-10 h-full flex flex-col">
        
        {/* WALLET SELECTION */}
        <button 
          onClick={() => setUseWallet(!useWallet)}
          className={`mb-6 p-4 rounded-[2rem] border transition-all flex items-center justify-between group/wallet ${
            useWallet ? 'bg-blue-600 border-blue-400 shadow-lg' : 'bg-white/5 border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${useWallet ? 'bg-blue-500' : 'bg-white/10'}`}>
              <Wallet size={18} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest">Apply Credits</p>
              <p className={`text-[9px] font-bold ${useWallet ? 'text-blue-100' : 'text-slate-500'}`}>
                Avail: ₹{userBalance}
              </p>
            </div>
          </div>
          {useWallet ? <CheckCircle2 size={20} fill="white" className="text-blue-600" /> : <div className="w-5 h-5 rounded-full border-2 border-white/10" />}
        </button>

        {/* DETAILED BILLING BREAKUP */}
        <div className="space-y-4 mb-8 bg-white/5 p-6 rounded-[2.5rem] border border-white/5">
           <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5 pb-2">Billing Summary</p>
           
           <div className="flex justify-between text-[10px] font-bold uppercase">
              <span className="text-slate-400">Professional Fee</span>
              <span className="text-slate-200">₹{order.billing?.serviceCharge}</span>
           </div>
           
           <div className="flex justify-between text-[10px] font-bold uppercase">
              <span className="text-slate-400">Govt. Official Fees</span>
              <span className="text-slate-200">₹{order.billing?.taxAmount}</span>
           </div>

           <div className="flex justify-between text-[10px] font-bold uppercase">
              <span className="text-slate-400">GST (18%)</span>
              <span className="text-slate-200">₹{order.billing?.gstAmount}</span>
           </div>

           {useWallet && (
             <div className="flex justify-between text-[10px] font-black uppercase text-emerald-400 pt-2 border-t border-white/10">
                <span>Wallet Discount</span>
                <span className="italic">- ₹{walletAmountToUse}</span>
             </div>
           )}

           <div className="pt-4 flex justify-between items-end">
              <div>
                 <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Total Payable</p>
                 <h4 className="text-5xl font-black italic tracking-tighter text-white">₹{finalPayable}</h4>
              </div>
              <ReceiptIndianRupee size={32} className="text-blue-500/20" />
           </div>
        </div>

        <button 
          onClick={() => makePayment(subTotal, order._id)}
          disabled={isProcessingPayment === order._id}
          className="w-full bg-blue-600 text-white py-5 rounded-[1.8rem] font-black uppercase text-[10px] tracking-[0.2em] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 mt-auto shadow-xl shadow-blue-900/40 disabled:opacity-50"
        >
          {isProcessingPayment === order._id ? <Loader2 className="animate-spin" /> : <>Authorize & Pay <ArrowRight size={14} /></>}
        </button>
      </div>
    </div>

  ) : isProcessing ? (
    /* --- CASE 2: FILING IN PROGRESS --- */
    <div className="bg-blue-50 border-2 border-blue-100 rounded-[3rem] p-10 h-full flex flex-col items-center justify-center text-center relative overflow-hidden group">
       <div className="w-20 h-20 bg-white rounded-[2rem] shadow-xl flex items-center justify-center text-blue-600 mb-6 relative z-10">
          <Activity size={40} className="animate-spin" style={{ animationDuration: '3s' }} />
       </div>
       <h4 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter leading-none">Filing in Progress</h4>
       <p className="text-[9px] font-bold text-blue-600 uppercase mt-3 tracking-widest opacity-70">Expert Verification Active</p>
       <div className="mt-8 w-full max-w-[180px] space-y-2">
          <div className="h-1 bg-blue-200 rounded-full overflow-hidden">
             <div className="h-full bg-blue-600 w-2/3 animate-pulse" />
          </div>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter text-center">Coordinating with Dept.</p>
       </div>
       <Activity size={120} className="absolute -right-8 -bottom-8 text-blue-100 opacity-50" />
    </div>

  ) : (
    /* --- CASE 3: COMPLETED --- */
    <div className="bg-emerald-50 border-2 border-emerald-100 rounded-[3rem] p-10 h-full flex flex-col items-center justify-center text-center group transition-all hover:bg-emerald-100/50">
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
  )}
</div>

            </div>
          </div>
        )
      })}
    </div>
  );
}