"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="bg-white px-5 py-2.5 rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-all text-slate-600 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
    >
      <Printer size={16} /> Print Receipt
    </button>
  );
}