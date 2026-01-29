"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPassword } from "@/app/actions/register";
import PublicNavbar from "@/components/Navbar";
import { Lock, ShieldCheck, Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setMsg({ type: 'error', text: "Passwords match nahi kar rahe!" });
    }
    if (password.length < 6) {
      return setMsg({ type: 'error', text: "Password kam se kam 6 characters ka hona chahiye." });
    }

    setLoading(true);
    const res = await resetPassword(token || "", password);

    if (res.error) {
      setMsg({ type: 'error', text: res.error });
      setLoading(false);
    } else {
      setMsg({ type: 'success', text: res.success || "Password updated!" });
      setTimeout(() => router.push("/login"), 3000);
    }
  };

  if (!token) {
    return <div className="text-center p-20 font-black tracking-widest uppercase">Invalid Access: Missing Token</div>;
  }

  return (
    <div className="bg-white min-h-screen">
      <PublicNavbar />
      <div className="flex items-center justify-center min-h-[90vh] p-6">
        <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-500">
          
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-100">
              <Lock size={32} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">New Password.</h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
              Step 02: Finalize Security Update
            </p>
          </div>

          <div className="bg-white border border-slate-100 p-8 rounded-[3rem] shadow-2xl shadow-slate-200/50">
            {msg?.type === 'success' ? (
              <div className="text-center py-6 space-y-4">
                <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl font-black text-xs uppercase tracking-widest">
                  {msg.text}
                </div>
                <p className="text-slate-400 text-[10px] font-bold">Redirecting to login...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {msg?.type === 'error' && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-red-100">
                    {msg.text}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-800 uppercase ml-4 tracking-widest">New Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-8 py-5 rounded-[2rem] border border-slate-100 bg-slate-50/50 focus:bg-white outline-none transition-all font-bold text-slate-900"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-800 uppercase ml-4 tracking-widest">Confirm Password</label>
                  <input 
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-8 py-5 rounded-[2rem] border border-slate-100 bg-slate-50/50 focus:bg-white outline-none transition-all font-bold text-slate-900"
                  />
                </div>

                <button 
                  disabled={loading}
                  className="w-full bg-[#020617] text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-emerald-600 shadow-xl transition-all disabled:bg-slate-300"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}