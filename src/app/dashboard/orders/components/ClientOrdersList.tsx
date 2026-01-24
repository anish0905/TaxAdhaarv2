"use client";
import { useState } from "react";
import { OrderServiceInfo } from "./OrderServiceInfo";
import { OrderBillingCard } from "./OrderBillingCard";
import { OrderProgressTracker } from "./OrderProgressTracker";
import { 
  CheckCircle2, ShieldCheck, Clock, 
  Activity, FileSearch, Sparkles, SearchCode, 
  AlertOctagon, RefreshCw, ArrowRight
} from "lucide-react";

export default function ClientOrdersList({ initialOrders, user }: { initialOrders: any[], user: any }) {
  const [orders] = useState(initialOrders);
  const [useWallet, setUseWallet] = useState(false);
  const currentBalance = user?.referralEarnings?.balance ?? 0;

  return (
    <div className="space-y-12">
      {orders.map((order: any) => {
        let StatusStory = null;

        // 1. REJECTED STORY (Highest Priority - Action Needed)
        if (order.status === 'rejected') {
          StatusStory = (
            <div className="h-full min-h-[220px] bg-rose-50 border-2 border-rose-100 rounded-[2.8rem] p-8 flex flex-col items-center justify-center text-center animate-in shake duration-500">
              <div className="w-16 h-16 bg-rose-600 text-white rounded-[1.8rem] flex items-center justify-center mb-4 shadow-lg shadow-rose-200">
                <AlertOctagon size={32} />
              </div>
              <h4 className="text-lg font-black text-rose-900 uppercase italic leading-none">Action Required</h4>
              <p className="text-[9px] font-bold text-rose-600 uppercase mt-2 tracking-widest leading-tight px-2">
                {order.billing?.remarks || "Application needs correction"}
              </p>
              <button 
                onClick={() => window.location.href = `/dashboard/orders/${order._id}`}
                className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase text-rose-700 hover:underline"
              >
                Fix Issues <ArrowRight size={12} />
              </button>
            </div>
          );
        }

        // 2. PAYMENT VERIFICATION
        else if (order.paymentStatus === 'verification_pending') {
          StatusStory = (
            <div className="h-full min-h-[220px] bg-amber-50/50 border-2 border-amber-100 rounded-[2.8rem] p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-white text-amber-500 rounded-[1.8rem] flex items-center justify-center mb-6 shadow-sm border border-amber-100 relative">
                <Clock size={32} className="animate-spin-slow" style={{ animationDuration: '6s' }} />
                <div className="absolute inset-0 border-2 border-amber-500 border-t-transparent rounded-[1.8rem] animate-spin"></div>
              </div>
              <h4 className="text-lg font-black text-amber-900 uppercase italic leading-none">Awaiting Clearance</h4>
              <p className="text-[9px] font-bold text-amber-600 uppercase mt-2 tracking-widest">Checking bank records</p>
            </div>
          );
        }

        // 3. PAID & PROGRESSING STORIES
        else if (order.paymentStatus === 'paid') {
          if (order.status === 'completed') {
            StatusStory = (
              <div className="h-full min-h-[220px] bg-emerald-50/50 border-2 border-emerald-100 rounded-[2.8rem] p-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-emerald-500 text-white rounded-[1.8rem] flex items-center justify-center mb-4 shadow-lg shadow-emerald-200">
                  <Sparkles size={32} />
                </div>
                <h4 className="text-lg font-black text-emerald-900 uppercase italic leading-none">Service Success</h4>
                <p className="text-[9px] font-bold text-emerald-600 uppercase mt-2 tracking-widest">Documents dispatched</p>
              </div>
            );
          } 
          else if (order.status === 'processing') {
            StatusStory = (
              <div className="h-full min-h-[220px] bg-blue-50/50 border-2 border-blue-100 rounded-[2.8rem] p-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-[1.8rem] flex items-center justify-center mb-6 shadow-lg shadow-blue-200">
                  <RefreshCw size={32} className="animate-spin" style={{ animationDuration: '3s' }} />
                </div>
                <h4 className="text-lg font-black text-blue-900 uppercase italic leading-none">Portal Syncing</h4>
                <p className="text-[9px] font-bold text-blue-600 uppercase mt-2 tracking-widest leading-tight">
                  Your data is being <br/> uploaded to Govt Portal
                </p>
              </div>
            );
          }
          else {
            // Default: Under Review
            StatusStory = (
              <div className="h-full min-h-[220px] bg-indigo-50/50 border-2 border-indigo-100 rounded-[2.8rem] p-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-white border-2 border-indigo-200 text-indigo-600 rounded-[1.8rem] flex items-center justify-center mb-6 shadow-xl shadow-indigo-100 relative">
                   <SearchCode size={32} className="animate-pulse" />
                </div>
                <h4 className="text-lg font-black text-indigo-900 uppercase italic leading-none">Expert Review</h4>
                <p className="text-[9px] font-bold text-indigo-600 uppercase mt-2 tracking-widest">Verifying Assets</p>
              </div>
            );
          }
        }

        return (
          <div key={order._id} className="bg-white rounded-[3.5rem] p-3 shadow-2xl shadow-slate-200/50 border border-slate-100 transition-all hover:border-blue-200 overflow-hidden relative">
            <div className="flex flex-col xl:flex-row gap-6">
              <OrderServiceInfo order={order} />
              <OrderProgressTracker status={order.status} paymentStatus={order.paymentStatus} />
              <div className="xl:w-[35%] p-2">
                {StatusStory || (
                <OrderBillingCard 
  order={order} 
  userBalance={currentBalance} 
  useWallet={useWallet} 
  setUseWallet={setUseWallet}
  // Parameters ko types de diye: amt (number), id (string), method (string)
  onPay={(amt: number, id: string, method: string) => {
    if(method === 'manual') {
      window.location.href = `/dashboard/orders/${id}`;
    }
    // Agar Razorpay implementation hai toh yahan call karein
  }}
/>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}