"use client";
import { uploadExcelLeads } from "@/app/actions/uploadLeads";
import { useState } from "react";

export default function AdminUploadLeads() {
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAction(formData: FormData) {
    setLoading(true);
    const res = await uploadExcelLeads(formData);
    setLoading(false);

    if (res.error) setMsg({ type: "error", text: res.error });
    else setMsg({ type: "success", text: res.success! });
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Bulk Upload</h1>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-2">Update database via Excel</p>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
        <form action={handleAction} className="space-y-6">
          {msg && (
            <div className={`p-4 rounded-2xl text-xs font-black border ${
              msg.type === "success" ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"
            }`}>
              {msg.text}
            </div>
          )}

          <div className="border-4 border-dashed border-slate-50 rounded-[2rem] p-16 flex flex-col items-center gap-4 bg-slate-50/50 hover:bg-white hover:border-blue-100 transition-all cursor-pointer relative">
            <span className="text-5xl">📁</span>
            <p className="font-bold text-slate-600">Select Excel (.xlsx) Lead File</p>
            <input 
              type="file" 
              name="file" 
              accept=".xlsx, .xls" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#020617] text-white py-6 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 shadow-xl transition-all disabled:bg-slate-300"
          >
            {loading ? "Processing..." : "🚀 Finalize Upload"}
          </button>
        </form>
      </div>
    </div>
  );
}