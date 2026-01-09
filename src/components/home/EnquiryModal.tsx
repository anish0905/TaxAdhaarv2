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

    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);
    formData.append("service", serviceName); // Append selected service

    try {
      const res: UploadLeadsState = await createEnquiry(formData);

      if (res.error) {
        setMessage({ type: "error", text: res.error });
      } else if (res.success) {
        setMessage({ type: "success", text: res.success });
        form.reset();
      }
    } catch (err: any) {
      console.error(err);
      setMessage({ type: "error", text: err.message || "Failed to submit your request." });
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
          className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden p-8 md:p-12"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors text-2xl font-bold"
          >
            ✕
          </button>

          <div className="text-center mb-8">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">Quick Enquiry</h3>
            <p className="text-blue-600 font-bold text-xs uppercase tracking-widest mt-2">
              Service: {serviceName}
            </p>
          </div>

          {/* Success/Error Message */}
          {message && (
            <div
              className={`p-2 mb-4 rounded text-sm font-bold ${
                message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                required
                className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="+91 00000 00000"
                required
                className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#020617] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-blue-600 shadow-xl transition-all active:scale-95 mt-4 disabled:bg-slate-400"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>

          <p className="text-center mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            🔒 Your data is secure with TaxPortal
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
