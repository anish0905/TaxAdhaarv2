"use client";
import { createEnquiry } from "@/app/actions/createEnquiry";
import { useState } from "react";

export default function HeroForm() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.12)] border border-slate-100 relative overflow-hidden group">
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors"></div>
      
      <div className="relative z-10">
        <h3 className="text-3xl font-black text-slate-900 mb-2">Expert Advice</h3>
        <p className="text-slate-800 font-bold text-xs uppercase tracking-widest mb-8">Get a Callback in 5 Minutes</p>
        
        <form action={createEnquiry} className="space-y-5" onSubmit={() => setLoading(true)}>
          <div className="space-y-2">
            <input 
              name="name"
              type="text" 
              placeholder="Full Name" 
              required
              className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all text-black font-semibold placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <input 
              name="phone"
              type="text" 
              placeholder="Mobile Number" 
              required
              className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all text-black font-semibold placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <select name="service" className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all text-black font-semibold appearance-none cursor-pointer">
              <option value="ITR">Income Tax Filing</option>
              <option value="GST">GST Services</option>
              <option value="COMPANY">Company Registration</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-600 shadow-2xl shadow-slate-200 transition-all active:scale-95 hover:shadow-blue-200 mt-4 disabled:bg-slate-400"
          >
            {loading ? "Requesting..." : "Book Free Consultation"}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-4 border-t pt-6">
           <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-2">
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
             Data Encrypted & Secure
           </p>
        </div>
      </div>
    </div>
  );
}