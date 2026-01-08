"use client";
import { registerUser } from "@/app/actions/register";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PublicNavbar from "@/components/Navbar"; // Navbar import karein

export default function RegisterPage() {
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMsg(null);
    const res = await registerUser(formData);
    
    if (res.error) {
      setMsg({ type: 'error', text: res.error });
      setLoading(false);
    } else {
      setMsg({ type: 'success', text: "Account created! Redirecting..." });
      setTimeout(() => router.push("/login"), 2000);
    }
  }

  return (
    <div className="bg-white min-h-screen">
      <PublicNavbar />
      
      {/* pt-20: Navbar ki space chhodne ke liye
          lg:h-[calc(100vh-80px)]: Desktop par screen ke hisaab se height fit karne ke liye
      */}
      <div className="pt-20 flex flex-col lg:flex-row min-h-screen lg:h-[calc(100vh-5px)] overflow-hidden selection:bg-blue-100">
        
        {/* --- LEFT SIDE: BRANDING --- */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#020617] p-16 flex-col justify-center text-white relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-500 rounded-full blur-[100px] opacity-10 animate-bounce transition-all duration-1000"></div>

          <div className="relative z-10 space-y-8">
            <div className="inline-block px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest">
              ★ The Future of Tax Filing
            </div>
            <h2 className="text-7xl font-black leading-[0.95] tracking-tighter">
              Start Your <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Journey.</span>
            </h2>
            <p className="text-slate-400 text-xl max-w-md font-medium leading-relaxed">
              Create your account in seconds and get expert-assisted tax filing today.
            </p>
          </div>

          <div className="absolute bottom-10 left-16 z-10 flex items-center gap-6 opacity-40">
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">© 2026 TaxPortal India</p>
            <div className="h-[1px] w-12 bg-slate-700"></div>
            <p className="text-[10px] font-black uppercase tracking-widest italic">Encrypted</p>
          </div>
        </div>

        {/* --- RIGHT SIDE: REGISTER FORM --- */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto custom-scrollbar">
          <div className="max-w-md w-full py-10">
            
            <div className="mb-8 text-center lg:text-left">
              <h1 className="text-5xl font-black text-[#020617] tracking-tight mb-3">Register.</h1>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">
                Create your secure portal account
              </p>
            </div>

            {msg && (
              <div className={`p-4 mb-6 rounded-[1.5rem] text-xs font-black border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
                msg.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
              }`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${msg.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                  {msg.type === 'success' ? '✓' : '!'}
                </div>
                {msg.text}
              </div>
            )}

            <form action={handleSubmit} className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">Full Name</label>
                <input name="name" className="w-full px-7 py-4 rounded-[1.5rem] border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-[8px] focus:ring-blue-50 outline-none transition-all duration-500 font-bold text-slate-900 shadow-sm" placeholder="Rahul Kumar" required />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">Email Address</label>
                <input name="email" type="email" className="w-full px-7 py-4 rounded-[1.5rem] border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-[8px] focus:ring-blue-50 outline-none transition-all duration-500 font-bold text-slate-900 shadow-sm" placeholder="name@company.com" required />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">Phone Number</label>
                <input name="phone" className="w-full px-7 py-4 rounded-[1.5rem] border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-[8px] focus:ring-blue-50 outline-none transition-all duration-500 font-bold text-slate-900 shadow-sm" placeholder="+91 98XXX XXXXX" required />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">Secure Password</label>
                <input name="password" type="password" className="w-full px-7 py-4 rounded-[1.5rem] border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-[8px] focus:ring-blue-50 outline-none transition-all duration-500 font-bold text-slate-900 shadow-sm" placeholder="••••••••" required />
              </div>

              <button type="submit" disabled={loading} className="w-full bg-[#020617] text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-blue-600 shadow-xl shadow-slate-200 hover:shadow-blue-300 transition-all duration-500 active:scale-[0.98] mt-4">
                {loading ? "Establishing..." : "Create Account"}
              </button>
            </form>

            <div className="mt-4 text-center border-t border-slate-50 pt-4">
              <p className="text-slate-400 font-bold text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 transition-all uppercase tracking-widest text-[10px] border-b-2 border-blue-50 ml-2">
                  Sign In Now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}