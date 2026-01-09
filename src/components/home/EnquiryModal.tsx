"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createEnquiry, type UploadLeadsState } from "@/app/actions/createEnquiry";

export default function EnquiryModal({ isOpen, onClose, serviceName }: any) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(formRef.current!);
    formData.append("service", serviceName); // Card se aane wala service name add kiya

    try {
      const res: UploadLeadsState = await createEnquiry(formData);

      if (res.error) {
        setMessage({ type: "error", text: res.error });
      } else if (res.success) {
        setMessage({ type: "success", text: res.success });
        formRef.current?.reset();
        // 3 second baad modal auto-close
        setTimeout(() => {
          onClose();
          setMessage(null);
        }, 3000);
      }
    } catch (err) {
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Box */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden p-8 md:p-10"
        >
          <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 text-xl font-bold">✕</button>

          <div className="text-center mb-8">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight italic">Quick Enquiry</h3>
            <p className="text-blue-600 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">Interested in: {serviceName}</p>
          </div>

          {message && (
            <div className={`p-4 mb-6 rounded-2xl text-xs font-black border ${
              message.type === "success" ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"
            }`}>
              {message.text}
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">Full Name</label>
              <input 
                name="name"
                type="text" 
                placeholder="Enter your name" 
                required 
                className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-slate-900" 
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">Phone Number</label>
              <input 
                name="phone"
                type="tel" 
                placeholder="+91 XXXXX XXXXX" 
                required 
                className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-slate-900" 
              />
            </div>

            <button 
              disabled={loading}
              type="submit" 
              className="w-full bg-[#020617] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-blue-600 shadow-xl transition-all active:scale-95 mt-4 disabled:bg-slate-300"
            >
              {loading ? "Sending..." : "Request Callback"}
            </button>
          </form>

          <p className="text-center mt-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">
            🛡️ Secure & Confidential Connection
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}