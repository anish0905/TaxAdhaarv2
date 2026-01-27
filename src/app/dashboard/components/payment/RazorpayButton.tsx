"use client";
import { Zap, Loader2 } from "lucide-react";
import Script from "next/script";
import { useState } from "react";

interface RazorpayButtonProps {
  orderId: string;
  useWallet: boolean; // Amount ki jagah useWallet pass karenge security ke liye
  amount?: number;
}

export function RazorpayButton({ orderId, useWallet, amount }: RazorpayButtonProps) {
  console.log("RazorpayButton Rendered with:", { orderId, useWallet });
  const [isProcessing, setIsProcessing] = useState(false);

  const processPayment = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // 1. Backend se Razorpay Order create karwana
      // Note: Hum amount nahi bhej rahe, backend DB se fetch karega
      const response = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, useWallet }),
      });

      const orderData = await response.json();

      if (!response.ok || !orderData.id) {
        throw new Error(orderData.error || "Failed to initiate payment");
      }

      // 2. Razorpay Checkout Options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use your env key
        amount: orderData.amount,
        currency: orderData.currency,
        name: "TaxAdhaar",
        description: "Professional Compliance Services",
        image: "https://www.taxadhaar.in/logo.png",
        order_id: orderData.id,
        handler: async function (response: any) {
          // 3. Payment Verification (Verify Signature)
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderId, // MongoDB ID for tracking
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.verified) {
              // Success redirect
              window.location.href = `/dashboard/orders/${orderId}/success`;
            } else {
              alert("Payment verification failed! Please check with support.");
            }
          } catch (err) {
            alert("Error verifying payment. Don't worry, contact support.");
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: "TaxAdhaar Client",
          email: "support@taxadhaar.in",
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
      console.error("Payment Error:", error);
      alert(error.message || "Something went wrong.");
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
        
        <span>{isProcessing ? "INITIALIZING..." : "Pay via Razorpay Secure"}</span>
        
        {/* Shine Animation */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
      </button>
    </>
  );
}