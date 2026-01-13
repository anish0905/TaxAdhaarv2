"use client";
import { registerUser, verifyOTP } from "@/app/actions/register";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PublicNavbar from "@/components/Navbar";

export default function RegisterPage() {
  const [step, setStep] = useState<'register' | 'otp'>('register');
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  async function handleRegister(formData: FormData) {
    setLoading(true);
    setMsg(null);
    const res = await registerUser(formData);
    if (res.error) {
      setMsg({ type: 'error', text: res.error });
      setLoading(false);
    } else {
      setEmail(formData.get("email") as string);
      setMsg({ type: 'success', text: "OTP sent to your email!" });
      setStep('otp');
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await verifyOTP(email, otp);
    if (res.error) {
      setMsg({ type: 'error', text: res.error });
      setLoading(false);
    } else {
      setMsg({ type: 'success', text: "Verified! Redirecting..." });
      setTimeout(() => router.push("/login"), 2000);
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      {/* --- NAVBAR: 20% HEIGHT ON DESKTOP --- */}
      <header className="h-[10vh] lg:h-[10vh] flex items-center border-b border-slate-50">
        <PublicNavbar />
      </header>

      {/* --- MAIN CONTENT: 80% HEIGHT ON DESKTOP --- */}
      <main className="h-[90vh] lg:h-[90vh] flex flex-col lg:flex-row overflow-hidden">
        
        {/* LEFT SIDE: BRANDING (Desktop only) */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#020617] p-12 flex-col justify-center text-white relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-600 rounded-full blur-[100px] opacity-20"></div>
          
          <div className="relative z-10 space-y-6">
            <h2 className="text-6xl font-black leading-[1] tracking-tighter">
              {step === 'register' ? "Start Your" : "Check Your"} <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                {step === 'register' ? "Journey." : "Inbox."}
              </span>
            </h2>
            <p className="text-slate-400 text-lg max-w-sm font-medium">
              {step === 'register' ? "Fast, Secure, and Professional Tax Filing." : "We've sent a code to verify your identity."}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: FORM (Scrollable for Mobile) */}
        <div className="w-full lg:w-1/2 flex items-start lg:items-center justify-center p-6 lg:p-12 overflow-y-auto bg-white">
          <div className="max-w-md w-full py-6">
            <div className="mb-6 text-center lg:text-left">
              <h1 className="text-4xl font-black text-[#020617] tracking-tight">
                {step === 'register' ? "Register." : "Verify."}
              </h1>
            </div>

            {msg && (
              <div className={`p-3 mb-4 rounded-2xl text-[11px] font-bold border flex items-center gap-2 ${
                msg.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
              }`}>
                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-current opacity-20" />
                {msg.text}
              </div>
            )}

            {step === 'register' ? (
              <form action={handleRegister} className="grid grid-cols-1 gap-3">
                <InputField label="Full Name" name="name" type="text" placeholder="Rahul Kumar" />
                <InputField label="Email" name="email" type="email" placeholder="name@company.com" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField label="Phone" name="phone" type="text" placeholder="+91..." />
                    <InputField label="Password" name="password" type="password" placeholder="••••" />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-[#020617] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all mt-2">
                  {loading ? "Creating..." : "Create Account"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <input 
                  type="text" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)}
                  className="text-black w-full px-6 py-4 rounded-2xl border-2 border-blue-100 bg-blue-50/30 text-center text-2xl font-black tracking-[0.5em] focus:border-blue-500 outline-none transition-all"
                  placeholder="000000" required 
                />
                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#020617] transition-all">
                  {loading ? "Verifying..." : "Confirm Code"}
                </button>
                <div className="text-center">
                   {timer > 0 ? (
                     <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Resend in {timer}s</p>
                   ) : (
                     <button type="button" onClick={() => setTimer(60)} className="text-blue-600 text-[10px] font-black uppercase tracking-widest border-b border-blue-200">Resend OTP</button>
                   )}
                </div>
              </form>
            )}

            <p className="mt-6 text-center text-slate-400 font-bold text-xs">
              Already have an account? 
              <Link href="/login" className="text-blue-600 ml-2 uppercase tracking-tighter border-b border-blue-100">Sign In</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

// Small Helper Component for Inputs
function InputField({ label, name, type, placeholder }: any) {
  return (
    <div className="space-y-1">
      <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">{label}</label>
      <input 
        name={name} type={type} required 
        className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-sm" 
        placeholder={placeholder} 
      />
    </div>
  );
}