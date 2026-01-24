// src/components/payment/RazorpayButton.tsx
"use client"
import { Zap } from "lucide-react";

export function RazorpayButton({ amount, orderId }: { amount: number, orderId: string }) {
  const processPayment = async () => {
    // 1. Backend API call karke Razorpay Order ID lein
    // 2. Razorpay Window open karein
    console.log("Starting Razorpay...");
  };

  return (
    <button 
      onClick={processPayment}
      className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2"
    >
      <Zap size={14} fill="currentColor" /> Pay via Razorpay
    </button>
  );
}