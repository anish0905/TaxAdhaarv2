"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateUser } from "../../../../actions/updateUser"; 
import { Save, Loader2, CheckCircle, User as UserIcon, Phone, MapPin, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from 'next/link';

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  async function clientAction(formData: FormData) {
    setLoading(true);
    const result = await updateUser(formData);
    
    if (result.success) {
      setIsSaved(true);
      setTimeout(() => router.push("/dashboard/client/profile"), 1500);
    } else {
      alert("Something went wrong!");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-0 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER NAVIGATION */}
      <div className="flex items-center justify-between">
        <Link 
          href="/dashboard/client/profile" 
          className="group inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-[10px] uppercase tracking-[0.2em] transition-all"
        >
          <div className="p-2 bg-white rounded-xl border border-slate-100 shadow-sm group-hover:shadow-md group-hover:-translate-x-1 transition-all">
            <ArrowLeft size={14} />
          </div>
          Back to Profile
        </Link>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
          <ShieldCheck size={12} className="text-blue-600" />
          <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Secure Update</span>
        </div>
      </div>

      {/* MAIN FORM CARD */}
      <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        
        {/* TOP BANNER */}
        <div className="bg-[#020617] p-8 md:p-14 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
              Edit <span className="text-blue-500">Settings</span>
            </h1>
            <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mt-4 flex items-center gap-2">
              <span className="w-4 h-[1px] bg-blue-500"></span>
              Update your personal account information
            </p>
          </div>
          
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -ml-10 -mb-10"></div>
        </div>

        {/* FORM SECTION */}
        <form action={clientAction} className="p-6 md:p-14 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            
            {/* Full Name */}
            <div className="group space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-600 transition-colors">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  name="name" 
                  type="text" 
                  required 
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-14 pr-6 py-5 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] text-sm font-bold focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all shadow-sm hover:border-slate-200" 
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="group space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-600 transition-colors">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  name="phone" 
                  type="tel" 
                  placeholder="+91 00000 00000"
                  className="w-full pl-14 pr-6 py-5 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] text-sm font-bold focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all shadow-sm hover:border-slate-200" 
                />
              </div>
            </div>

            {/* Location */}
            <div className="group space-y-3 md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-600 transition-colors">
                Location / City
              </label>
              <div className="relative">
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  name="location" 
                  type="text" 
                  placeholder="e.g. Mumbai, India"
                  className="w-full pl-14 pr-6 py-5 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] text-sm font-bold focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all shadow-sm hover:border-slate-200" 
                />
              </div>
            </div>

          </div>

          {/* ACTION BUTTONS */}
          <div className="pt-8 flex flex-col sm:flex-row items-center gap-4">
            <button 
              type="submit" 
              disabled={loading || isSaved} 
              className={`
                w-full sm:w-auto min-w-[220px] flex items-center justify-center gap-3 px-10 py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 disabled:opacity-70
                ${isSaved 
                  ? "bg-emerald-500 text-white shadow-emerald-200" 
                  : "bg-blue-600 text-white shadow-blue-200 hover:bg-[#020617] hover:shadow-blue-100"}
              `}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : isSaved ? (
                <CheckCircle size={18} className="animate-bounce" />
              ) : (
                <Save size={18} />
              )}
              {loading ? "Processing..." : isSaved ? "Updated Successfully" : "Save Changes"}
            </button>
            
            <Link 
              href="/dashboard/client/profile"
              className="w-full sm:w-auto text-center px-10 py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
            >
              Discard
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}