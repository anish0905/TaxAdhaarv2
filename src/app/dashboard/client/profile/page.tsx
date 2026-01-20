import React from 'react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { 
  Mail, 
  Phone, 
  ShieldCheck, 
  MapPin, 
  Calendar,
  Camera,
  Edit3,
  LucideIcon // Type import karein
} from "lucide-react";
import Link from 'next/link';

// 1. Reusable Sub-component (Fixed Props & Types)
// Yahan hum 'icon: LucideIcon' pass kar rahe hain element ki jagah
function InfoItem({ icon: Icon, label, value }: { icon: LucideIcon, label: string, value: string }) {
  return (
    <div className="flex items-start gap-3 sm:gap-4 group min-w-0">
      <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
        {/* Yahan Icon ko direct render karein */}
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-xs sm:text-sm font-bold text-slate-900 truncate break-words">{value}</p>
      </div>
    </div>
  );
}

export default async function ClientProfilePage() {
  const session = await getServerSession(authOptions);
  await connectDB();
  
  // lean() use karne par data plain object hota hai, isliye type safety ke liye any ya interface dein
  const user = await User.findById(session?.user?.id).lean() as any;

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 p-4 md:p-0 pb-10">
      
      {/* HEADER SECTION - Responsive Height */}
      <div className="relative h-40 sm:h-48 md:h-64 bg-[#020617] rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl">
        {/* Blue Glow Effect */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-indigo-600 rounded-full blur-[100px] opacity-20"></div>
        
        {/* AVATAR BOX */}
        <div className="absolute -bottom-10 left-6 sm:left-10 md:left-16 flex items-end gap-6">
          <div className="relative group">
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-white rounded-[1.5rem] sm:rounded-[2.2rem] p-1 shadow-2xl">
              <div className="w-full h-full bg-slate-100 rounded-[1.3rem] sm:rounded-[2rem] flex items-center justify-center text-[#020617] font-black text-2xl sm:text-3xl md:text-4xl border-4 border-white">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>
            <button className="absolute bottom-1 right-1 p-1.5 sm:p-2 bg-white text-blue-600 rounded-lg sm:rounded-xl shadow-lg hover:scale-110 transition-transform border border-slate-100">
              <Camera size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* NAME & ACTIONS BAR */}
      <div className="pt-10 sm:pt-12 md:pt-16 px-2 sm:px-6 md:px-16 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tighter truncate">
            {user?.name || "Client Name"}
          </h1>
          <p className="text-slate-500 font-bold text-[10px] sm:text-xs uppercase tracking-widest mt-1 flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-500 flex-shrink-0" />
            Verified Client Account
          </p>
        </div>
    
        <Link 
          href="/dashboard/client/profile/edit" 
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#020617] text-white px-6 py-3.5 sm:py-3 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95"
        >
          <Edit3 size={14} /> Edit Profile
        </Link>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Personal Details Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center italic text-xs shadow-sm">i</div>
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 sm:gap-y-12">
              {/* Ab hum direct icon name pass kar rahe hain */}
              <InfoItem icon={Mail} label="Email Address" value={user?.email || "Not Provided"} />
              <InfoItem icon={Phone} label="Mobile Number" value={user?.phone || "Not Provided"} />
              <InfoItem icon={MapPin} label="Location" value="India" />
              <InfoItem icon={Calendar} label="Member Since" value={new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} />
            </div>
          </div>
        </div>

        {/* Sidebar Status Card */}
        <div className="space-y-6">
          <div className="bg-[#020617] p-8 rounded-[2rem] md:rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl group-hover:bg-blue-600/20 transition-all"></div>
            
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-8">System Badge</h3>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-xs font-bold text-slate-400">Membership</span>
                <span className="text-xs font-black text-emerald-400 uppercase tracking-tighter">Elite Client</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-xs font-bold text-slate-400">Portal Access</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span className="text-xs font-black text-blue-400 uppercase tracking-tighter">Full Permission</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed italic mt-4">
                Your profile information is secured using 256-bit AES encryption standards.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}