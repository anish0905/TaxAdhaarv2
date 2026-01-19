"use client";

import { useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { 
  FileText, Clock, ShieldCheck, IndianRupee, 
  ArrowRight, CheckCircle2, Loader2, Activity 
} from "lucide-react";

export default function ClientOrdersList({ initialOrders }: { initialOrders: any[] }) {
  const [orders] = useState(initialOrders);

  const makePayment = async (amount: number, orderId: string) => {
    try {
      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, orderId }),
      });
      const data = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Legal Filing Service",
        description: `Payment for Order #${orderId.slice(-6).toUpperCase()}`,
        order_id: data.id,
        handler: async function (response: any) {
          const updateRes = await fetch("/api/orders/update-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
               orderId, 
               razorpay_payment_id: response.razorpay_payment_id,
               status: 'processing', // Payment success ke baad processing state
               paymentStatus: 'paid'
            }),
          });

          if(updateRes.ok) {
            window.location.href = `/dashboard/client/orders/success/${orderId}`;
          }
        },
        theme: { color: "#2563eb" },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment failed", error);
      alert("Payment initiation failed. Please try again.");
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="space-y-10">
        {orders.map((order: any) => {
          // Logic mapping with your Enums
          const isReviewing = order.status === 'under_review';
          const isPaymentPending = order.status === 'payment_pending' && order.paymentStatus !== 'paid';
          const isProcessing = order.status === 'processing' || (order.paymentStatus === 'paid' && order.status !== 'completed');
          const isCompleted = order.status === 'completed';

          return (
            <div key={order._id} className="bg-white rounded-[4rem] p-4 shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden group hover:border-blue-100 transition-all">
              <div className="flex flex-col xl:flex-row items-stretch gap-8">
                
                {/* 1. Service Info Section */}
                <div className="xl:w-1/4 p-8 flex flex-col justify-between border-r border-slate-50">
                  <div className="space-y-6">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-[#020617] text-blue-500 rounded-[1.5rem] flex items-center justify-center text-2xl font-black italic shadow-lg group-hover:scale-110 transition-transform">
                        {order.serviceType.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1.5">#{String(order._id).slice(-6).toUpperCase()}</p>
                        <h2 className="text-xl font-black text-slate-900 uppercase leading-none tracking-tight">
                          {order.serviceType.replace(/-/g, " ")}
                        </h2>
                      </div>
                    </div>
                    
                    <Link 
                      href={`/dashboard/client/orders/${order._id}`} 
                      className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 tracking-[0.1em] transition-colors"
                    >
                      View Documents <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>

                {/* 2. Visual Progress Tracker */}
                <div className="flex-1 p-8 flex flex-col justify-center bg-slate-50/50 rounded-[3.5rem] my-4 mx-4 xl:mx-0 relative">
                  <div className="relative flex justify-between max-w-lg mx-auto w-full">
                    {/* Progress Background Line */}
                    <div className="absolute top-5 left-0 right-0 h-[3px] bg-slate-200 -z-0 rounded-full overflow-hidden">
                       <div className={`h-full bg-blue-600 transition-all duration-1000 ${isCompleted ? 'w-full' : isProcessing ? 'w-2/3' : isPaymentPending ? 'w-1/3' : 'w-0'}`}></div>
                    </div>
                    
                    <TimelineStep done={true} label="Docs" active={false} />
                    <TimelineStep done={isPaymentPending || isProcessing || isCompleted} label="Review" active={isReviewing} />
                    <TimelineStep done={isProcessing || isCompleted} label="Payment" active={isPaymentPending} />
                    <TimelineStep done={isCompleted} label="Filing" active={isProcessing} />
                    <TimelineStep done={isCompleted} label="Done" active={false} />
                  </div>
                </div>

                {/* 3. Dynamic Action Card (Billing & Status) */}
                <div className="xl:w-1/3 p-4">
                  {isPaymentPending ? (
                    <div className="bg-[#020617] text-white rounded-[3.5rem] p-8 h-full flex flex-col justify-between border border-white/5 relative overflow-hidden group/pay shadow-2xl">
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Total Payable</p>
                            <h4 className="text-5xl font-black italic tracking-tighter mt-1 text-white">₹{order.billing?.totalAmount}</h4>
                          </div>
                          <div className="p-3 bg-blue-600/20 rounded-2xl">
                            <IndianRupee size={20} className="text-blue-500" />
                          </div>
                        </div>

                        {/* DETAILED BILLING BREAKUP */}
                        <div className="space-y-3 mb-8 bg-white/5 p-6 rounded-[2rem] border border-white/5">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">
                            Billing Summary
                          </p>
                          <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                            <span className="text-slate-400">Govt. Fees / Tax</span>
                            <span className="text-slate-200 italic">₹{order.billing?.taxAmount}</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                            <span className="text-slate-400">Service Charge</span>
                            <span className="text-slate-200 italic">₹{order.billing?.serviceCharge}</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                            <span className="text-slate-400">GST (18%)</span>
                            <span className="text-slate-200 italic">₹{order.billing?.gstAmount}</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => makePayment(order.billing?.totalAmount, order._id)}
                          className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/40 active:scale-95"
                        >
                          Secure Checkout <ArrowRight size={16} />
                        </button>
                      </div>
                      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl group-hover/pay:bg-blue-600/20 transition-all"></div>
                    </div>
                  ) : isProcessing ? (
                    <div className="bg-blue-50 text-blue-600 rounded-[3.5rem] p-10 h-full flex flex-col items-center justify-center text-center border border-blue-100 relative overflow-hidden">
                       <Loader2 size={36} className="mb-4 animate-spin" />
                       <h4 className="text-sm font-black uppercase italic tracking-widest">Filing in Progress</h4>
                       <p className="text-[9px] font-bold uppercase mt-2 opacity-60 leading-relaxed px-4">
                         Our experts are currently filing your application with the department.
                       </p>
                       <Activity size={100} className="absolute -right-6 -bottom-6 opacity-5 text-blue-600" />
                    </div>
                  ) : isCompleted ? (
                    <div className="bg-emerald-50 text-emerald-600 rounded-[3.5rem] p-10 h-full flex flex-col items-center justify-center text-center border border-emerald-100 shadow-inner">
                      <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-5 shadow-lg shadow-emerald-200">
                        <CheckCircle2 size={32} />
                      </div>
                      <h4 className="text-sm font-black uppercase italic">Work Completed</h4>
                      <p className="text-[9px] font-bold uppercase mt-2 opacity-70">Final acknowledgement is ready</p>
                    </div>
                  ) : (
                    <div className="bg-white rounded-[3.5rem] p-10 h-full border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm">
                      <Clock size={28} className="text-orange-500 mb-4 animate-pulse" />
                      <h4 className="text-sm font-black text-slate-900 uppercase italic">Doc Verification</h4>
                      <p className="text-[9px] font-bold uppercase mt-2 text-slate-400">Verifying your upload...</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function TimelineStep({ done, label, active }: { done: boolean, label: string, active: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3 relative z-10">
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border-4 border-[#f8fafc] transition-all duration-500 shadow-sm ${
        done ? 'bg-green-500 text-white shadow-green-100' : active ? 'bg-blue-600 text-white animate-pulse shadow-blue-100' : 'bg-white text-slate-200'
      }`}>
        {done ? <ShieldCheck size={18} /> : active ? <Activity size={18} /> : <div className="w-1.5 h-1.5 bg-current rounded-full" />}
      </div>
      <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${active ? 'text-blue-600' : done ? 'text-green-600' : 'text-slate-400'}`}>
        {label}
      </span>
    </div>
  );
}