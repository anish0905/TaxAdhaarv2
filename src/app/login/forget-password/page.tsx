"use client";
import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/app/actions/register";
import PublicNavbar from "@/components/Navbar";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const res = await forgotPassword(email);
    if (res.error) {
      setMsg({ type: 'error', text: res.error });
    } else {
      setMsg({ type: 'success', text: "Reset link sent! Check your inbox." });
    }
    setLoading(false);
  };

  return (
    <div className="bg-white min-h-screen">
      <PublicNavbar />
      
      <div className="flex items-center justify-center min-h-[90vh] p-6">
        <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-100">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Recover Key.</h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
              Security Protocol: Password Reset
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white border border-slate-100 p-8 rounded-[3rem] shadow-2xl shadow-slate-200/50">
            {msg ? (
              <div className="text-center space-y-4 py-4">
                <div className={`p-4 rounded-2xl text-xs font-black uppercase tracking-widest border ${
                  msg.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                }`}>
                  {msg.text}
                </div>
                {msg.type === 'success' && (
                  <p className="text-slate-500 text-[10px] font-bold uppercase italic">
                    If you don't see it, check your spam folder.
                  </p>
                )}
                <Link href="/login" className="flex items-center justify-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest mt-6">
                  <ArrowLeft size={14} /> Back to login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-800 uppercase ml-4 tracking-widest">Registered Email</label>
                  <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full pl-14 pr-8 py-5 rounded-[2rem] border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-[8px] focus:ring-blue-50 outline-none transition-all duration-500 font-bold text-slate-900 shadow-sm"
                    />
                  </div>
                </div>

                <button 
                  disabled={loading}
                  className="w-full bg-[#020617] text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-600 shadow-xl shadow-slate-200 transition-all duration-500 active:scale-[0.97] disabled:bg-slate-300"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>

                <div className="text-center">
                  <Link href="/login" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">
                    Wait, I remember it!
                  </Link>
                </div>
              </form>
            )}
          </div>

          <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">
            Taxadhaar Security Layer v2.0
          </p>
        </div>
      </div>
    </div>
  );
}