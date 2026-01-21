"use client";
import { registerUser, verifyOTP } from "../actions/register";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import PublicNavbar from "@/components/Navbar";
import { CheckCircle, Gift } from "lucide-react";

// 1. SearchParams ka logic alag component mein move kiya
function RegisterForm() {
  const [step, setStep] = useState<'register' | 'otp'>('register');
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralFromUrl = searchParams.get("ref") || "";

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
    <div className="w-full lg:w-1/2 flex items-start lg:items-center justify-center p-6 lg:p-12 overflow-y-auto bg-white">
      <div className="max-w-md w-full">
        {step === 'register' && referralFromUrl && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 shrink-0">
              <Gift size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">Referral Applied</p>
              <p className="text-xs font-bold text-slate-700 mt-1">Code: <span className="text-emerald-700">{referralFromUrl}</span></p>
            </div>
            <CheckCircle size={18} className="ml-auto text-emerald-500" />
          </div>
        )}

        {step === 'register' ? (
          <form action={handleRegister} className="grid grid-cols-1 gap-3">
            <div className="mb-4">
              <h1 className="text-4xl font-black text-[#020617] tracking-tight">Register.</h1>
              <p className="text-slate-400 text-xs font-bold mt-1">Create your professional account</p>
            </div>
            {msg && (
              <div className={`p-3 rounded-2xl text-[11px] font-bold border flex items-center gap-2 ${
                msg.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
              }`}>
                {msg.text}
              </div>
            )}
            <input type="hidden" name="referredBy" value={referralFromUrl} />
            <InputField label="Full Name" name="name" type="text" placeholder="Rahul Kumar" />
            <InputField label="Email" name="email" type="email" placeholder="name@company.com" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputField label="Phone" name="phone" type="text" placeholder="+91..." />
              <InputField label="Password" name="password" type="password" placeholder="••••" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-[#020617] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all mt-4 shadow-xl active:scale-95">
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <h1 className="text-4xl font-black text-[#020617] tracking-tight mb-4 text-center italic">Verify.</h1>
            <input 
              type="text" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)}
              className="text-black w-full px-6 py-4 rounded-2xl border-2 border-blue-100 bg-blue-50/30 text-center text-2xl font-black tracking-[0.5em] focus:border-blue-500 outline-none transition-all"
              placeholder="000000" required 
            />
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#020617] transition-all active:scale-95">
              {loading ? "Verifying..." : "Confirm Code"}
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-slate-400 font-bold text-xs uppercase tracking-tight">
          Already a member? 
          <Link href="/login" className="text-blue-600 ml-2 border-b-2 border-blue-100 hover:border-blue-600 transition-all">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

// 2. Main Page Component (With Suspense Boundary)
export default function RegisterPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      <header className="h-[10vh] flex items-center border-b border-slate-50">
        <PublicNavbar />
      </header>

      <main className="h-[90vh] flex flex-col lg:flex-row overflow-hidden">
        <div className="hidden lg:flex lg:w-1/2 bg-[#020617] p-12 flex-col justify-center text-white relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-600 rounded-full blur-[100px] opacity-20"></div>
          <div className="relative z-10 space-y-6">
            <h2 className="text-6xl font-black tracking-tighter uppercase italic leading-none">
              Start Your <br/> 
              <span className="text-blue-500">Journey.</span>
            </h2>
          </div>
        </div>

        {/* Suspense is required for useSearchParams() */}
        <Suspense fallback={<div className="w-full lg:w-1/2 flex items-center justify-center font-black uppercase text-xs tracking-widest text-slate-400">Loading Portal...</div>}>
          <RegisterForm />
        </Suspense>
      </main>
    </div>
  );
}

function InputField({ label, name, type, placeholder }: any) {
  return (
    <div className="space-y-1">
      <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">{label}</label>
      <input 
        name={name} type={type} required 
        className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-sm text-black shadow-sm" 
        placeholder={placeholder} 
      />
    </div>
  );
}