"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import PublicNavbar from "@/components/Navbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
     setError("Your email or password is incorrect.");
        setLoading(false);
      } else {
        window.location.href = "/dashboard-redirect";
      }
    } catch (err) {
      setError("System error. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <PublicNavbar />
      
      <div className="flex min-h-screen lg:h-screen pt-20 lg:pt-0 selection:bg-blue-100 overflow-hidden">
        
        {/* --- LEFT SIDE: BRANDING --- */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#020617] p-16 flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
          
          <div className="relative z-10">
            <div className="mt-32 space-y-8">
              <div className="inline-block px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                ★ The Future of Tax Filing
              </div>
              <h2 className="text-7xl font-black leading-[0.95] tracking-tighter">
                Seamlessly <br/> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Connected.</span>
              </h2>
              <p className="text-slate-400 text-xl max-w-md font-medium leading-relaxed">
                Login to access India&apos;s most advanced AI-powered tax dashboard. 
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between border-t border-slate-800 pt-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">© 2026 TaxPortal India</p>
            <div className="flex gap-4">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Secure</p>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: LOGIN FORM --- */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 bg-white relative">
          
          <div className="max-w-md w-full relative">
            <div className="mb-10 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 lg:mt-8">Welcome back.</h1>
              <p className="text-slate-800 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em]">
                Enter your secure credentials to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 text-red-600 p-5 rounded-[1.5rem] text-xs font-black border border-red-100 flex items-center gap-3">
                  <div className="w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-[10px]">!</div>
                  {error}
                </div>
              )}

              <div className="group space-y-1.5">
                <label className="text-[10px] font-black text-slate-800 uppercase ml-4 tracking-[0.2em]">Email Account</label>
                <input 
                  type="email" 
                  autoComplete="email"
                  className="w-full px-6 md:px-8 py-4 md:py-5 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-[8px] focus:ring-blue-50 outline-none transition-all duration-500 font-bold text-slate-900 placeholder:text-slate-500 shadow-sm"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="group space-y-1.5">
                <div className="flex justify-between items-center px-4">
                  <label className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">Security Key</label>
                  <Link href="/login/forget-password" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700">Recovery?</Link>
                </div>
                <input 
                  type="password" 
                  autoComplete="current-password"
                  className="w-full px-6 md:px-8 py-4 md:py-5 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-[8px] focus:ring-blue-50 outline-none transition-all duration-500 font-bold text-slate-900 placeholder:text-slate-500 shadow-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button 
                disabled={loading}
                type="submit" 
                className="w-full bg-[#020617] text-white py-5 md:py-6 rounded-[1.5rem] md:rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] hover:bg-blue-600 shadow-xl shadow-slate-200 hover:shadow-blue-500/40 transition-all duration-500 active:scale-[0.97] disabled:bg-slate-300 mt-4"
              >
                {loading ? "Decrypting..." : "Access Dashboard"}
              </button>
            </form>

            <div className="mt-10 md:mt-12 text-center">
              <p className="text-slate-800 font-bold text-sm">
                Don&apos;t have a secure account? <br/>
                <Link href="/register" className="text-blue-600 hover:text-blue-700 transition-all uppercase tracking-[0.2em] text-[10px] mt-4 inline-block border-b-2 border-blue-50 pb-1">
                  Establish New Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}