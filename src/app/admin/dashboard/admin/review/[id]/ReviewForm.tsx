"use client";
import { useState } from "react";
import { generateFinalBill } from "@/app/actions/orderActions";
import { useRouter } from "next/navigation";

export default function ReviewForm({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const data = {
      orderId,
      taxAmount: Number(formData.get("tax")),
      serviceCharge: Number(formData.get("service")),
      remarks: String(formData.get("remarks")),
    };

    const res = await generateFinalBill(data);
    if (res.success) {
      alert("Bill Sent to Client!");
      router.push("/dashboard/admin");
      router.refresh();
    } else {
      alert("Error: " + res.error);
    }
    setLoading(false);
  }

  return (
    <form action={handleSubmit} className="space-y-6 bg-[#020617] p-8 rounded-[2.5rem] text-white shadow-2xl">
      <h3 className="text-xl font-black italic uppercase text-blue-400 mb-6">Pricing & Review</h3>
      
      <div>
        <label className="text-[10px] font-black uppercase text-slate-500 block mb-2">Govt. Tax / Fee (₹)</label>
        <input name="tax" type="number" placeholder="500" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 font-bold" required />
      </div>

      <div>
        <label className="text-[10px] font-black uppercase text-slate-500 block mb-2">Service Charge (₹)</label>
        <input name="service" type="number" placeholder="1000" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 font-bold" required />
      </div>

      <div>
        <label className="text-[10px] font-black uppercase text-slate-500 block mb-2">Expert Remarks</label>
        <textarea name="remarks" placeholder="Documents are verified. Please pay to proceed." className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 text-xs font-bold h-24" />
      </div>

      <button 
        disabled={loading}
        className="w-full bg-blue-600 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-500 transition-all disabled:opacity-50"
      >
        {loading ? "Generating Bill..." : "Approve & Send Bill"}
      </button>
    </form>
  );
}