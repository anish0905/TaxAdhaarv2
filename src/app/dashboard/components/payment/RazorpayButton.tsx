"use client";
import { Zap, Loader2 } from "lucide-react";
import Script from "next/script";
import { useState } from "react";

export function RazorpayButton({ amount, orderId }: { amount: number; orderId: string }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const processPayment = async () => {
    setIsProcessing(true);

    try {
      // 1. Fetch Order from Backend
      const response = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, orderId }),
      });

      const order = await response.json();

      if (!order.id) {
        throw new Error(order.error || "Failed to create order");
      }

      // 2. Razorpay Checkout Configuration
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_OVc4uvnLM5CT3J",
        amount: order.amount,
        currency: order.currency,
        name: "TaxAdhaar",
        description: "Professional Compliance Services",
        image: "https://www.taxadhaar.in/logo.png", // Ensure this exists in public folder
        order_id: order.id,
        handler: async function (response: any) {
          // Verify Payment
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.verified) {
            window.location.href = "/dashboard/success";
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: "TaxAdhaar Client",
          email: "support@taxadhaar.in",
          contact: "7557721426",
        },
        theme: {
          color: "#2563eb",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error("Payment Process Error:", error);
      alert(error.message || "Payment initiation failed.");
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Script
        id="razorpay-checkout"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      
      <button
        disabled={isProcessing}
        onClick={processPayment}
        className="group relative w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
      >
        {isProcessing ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <Zap size={14} className="fill-current group-hover:scale-125 transition-transform" />
        )}
        
        <span>{isProcessing ? "Verifying Order..." : "Pay via Razorpay Secure"}</span>
        
        {/* Subtle Shine Effect */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
      </button>
    </>
  );
}