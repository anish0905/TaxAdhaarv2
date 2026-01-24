"use client";
import { registerUser, verifyOTP } from "@/app/actions/register"; // Apne path ke hisab se update karein
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Gift, ShieldCheck, Users } from "lucide-react";

function MarketingRegisterForm() {
  const [step, setStep] = useState<'register' | 'otp'>('register');
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralFromUrl = searchParams.get("ref") || "";

 async function handleRegister(formData: FormData) {
  setLoading(true);
  setMsg(null);
  
  // --- YE LINE SABSE IMPORTANT HAI ---
  // Isse hum backend action (registerUser) ko 'field_marketing' role bhej rahe hain
  formData.append("role", "field_marketing"); 
  
  const res = await registerUser(formData);
  
  if (res.error) {
    setMsg({ type: 'error', text: res.error });
    setLoading(false);
  } else {
    setEmail(formData.get("email") as string);
    setMsg({ type: 'success', text: "OTP sent! Check your inbox." });
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
      setMsg({ type: 'success', text: "Account Verified! Welcome to the team." });
      setTimeout(() => router.push("/login"), 2000);
    }
  }

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
      <div className="max-w-md w-full space-y-8">
        
        {/* Referral Badge */}
        {step === 'register' && referralFromUrl && (
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-4 animate-bounce-subtle">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Users size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none">Partner Invitation</p>
              <p className="text-xs font-bold text-slate-700 mt-1 italic">Invited by: {referralFromUrl}</p>
            </div>
          </div>
        )}

        {step === 'register' ? (
          <form action={handleRegister} className="space-y-4">
            <div className="mb-8">
              <h1 className="text-5xl font-black text-[#020617] tracking-tighter italic uppercase leading-none">
                Join the <br/><span className="text-blue-600">Elite Team.</span>
              </h1>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-4">Field Marketing Partner Program</p>
            </div>

            {msg && (
              <div className={`p-4 rounded-2xl text-xs font-bold border ${
                msg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
              }`}>
                {msg.text}
              </div>
            )}

            <input type="hidden" name="referredBy" value={referralFromUrl} />
            
            <MarketingInputField label="Official Name" name="name" type="text" placeholder="Anish Kumar" />
            <MarketingInputField label="Business Email" name="email" type="email" placeholder="anish@aimgrit.in" />
            
            <div className="grid grid-cols-2 gap-4">
               <MarketingInputField label="Contact" name="phone" type="text" placeholder="+91..." />
               <MarketingInputField label="Secure Key" name="password" type="password" placeholder="••••" />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#020617] text-white py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl shadow-blue-100 active:scale-95 disabled:opacity-50">
              {loading ? "Initializing..." : "Register as Partner"}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-blue-200">
                <ShieldCheck size={40} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 italic">Verify Identity.</h2>
            <form onSubmit={handleVerifyOtp} className="space-y-4">
                <input 
                  type="text" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-6 py-5 rounded-[2rem] border-2 border-slate-100 bg-slate-50 text-center text-3xl font-black tracking-[0.4em] focus:border-blue-600 outline-none transition-all text-black"
                  placeholder="000000" required 
                />
                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-widest shadow-xl">
                  {loading ? "Authorizing..." : "Complete Setup"}
                </button>
            </form>
          </div>
        )}

        <p className="text-center text-slate-400 font-bold text-[10px] uppercase tracking-widest pt-6 border-t border-slate-50">
          Existing Partner? <Link href="/login" className="text-blue-600 underline underline-offset-4 ml-2">Secure Login</Link>
        </p>
      </div>
    </div>
  );
}

export default function MarketingRegisterPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 flex flex-col lg:flex-row min-h-screen">
        {/* Left Side Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#020617] p-20 flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-blue-600 rounded-full blur-[150px] opacity-20 animate-pulse"></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center font-black italic text-3xl shadow-2xl mb-12">AG</div>
            <h2 className="text-7xl font-black tracking-tighter uppercase italic leading-[0.9]">
              Scale Your <br/> 
              <span className="text-blue-500 underline decoration-white decoration-4 underline-offset-[12px]">Potential.</span>
            </h2>
            <p className="text-blue-200/60 font-bold text-sm uppercase tracking-widest mt-12 max-w-sm">
                Unlock tiered commissions (5% / 3% / 2%) and grow your business network with TaxClear.
            </p>
          </div>

          <div className="relative z-10 flex gap-10">
            <div>
                <p className="text-3xl font-black tracking-tighter italic">10%</p>
                <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Max Reward</p>
            </div>
            <div>
                <p className="text-3xl font-black tracking-tighter italic">24/7</p>
                <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Partner Support</p>
            </div>
          </div>
        </div>

        <Suspense fallback={<div className="w-full lg:w-1/2 flex items-center justify-center font-black uppercase text-xs text-slate-400 italic">Syncing with AimGrit Server...</div>}>
          <MarketingRegisterForm />
        </Suspense>
      </main>
    </div>
  );
}

function MarketingInputField({ label, name, type, placeholder }: any) {
  return (
    <div className="space-y-1 group">
      <label className="text-[9px] font-black text-slate-400 uppercase ml-4 tracking-[0.2em] group-focus-within:text-blue-600 transition-colors">{label}</label>
      <input 
        name={name} type={type} required 
        className="text-black w-full px-6 py-4 rounded-[1.8rem] border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-sm shadow-sm placeholder:text-slate-300" 
        placeholder={placeholder} 
      />
    </div>
  );
}