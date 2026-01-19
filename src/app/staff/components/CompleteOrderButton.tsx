"use client";

import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { completeOrderAction } from "@/app/actions/completeOrder";
import { useRouter } from "next/navigation";

export default function CompleteOrderButton({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleComplete = async () => {
    if (!confirm("Are you sure you want to mark this filing as completed?")) return;
    
    setLoading(true);
    const result = await completeOrderAction(orderId);
    
    if (result.success) {
      alert("Filing marked as completed!");
      router.push("/staff/dashboard");
    } else {
      alert("Error: " + result.error);
    }
    setLoading(false);
  };

  if (currentStatus === "completed") {
    return (
      <div className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3">
        <CheckCircle size={16} /> Already Completed
      </div>
    );
  }

  return (
    <button 
      onClick={handleComplete}
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-900/40 active:scale-95 disabled:opacity-50"
    >
      {loading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
      Mark as Completed
    </button>
  );
}