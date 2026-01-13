"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createEnquiry, type CreateEnquiryState } from "@/app/actions/createEnquiry";

export default function EnquiryModal({
  isOpen,
  onClose,
  serviceName,
}: {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    formData.set("service", serviceName); // ✅ service card se

    try {
      const res: CreateEnquiryState = await createEnquiry(formData);

      if (res.error) {
        setMessage({ type: "error", text: res.error });
      }

      if (res.success) {
        setMessage({ type: "success", text: res.success });
        formRef.current.reset();

        setTimeout(() => {
          onClose();
          setMessage(null);
        }, 2500);
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-xl font-bold text-slate-800 hover:text-black"
          >
            ✕
          </button>

          <div className="text-center mb-6">
            <h3 className="text-3xl font-black text-black">Quick Enquiry</h3>
            <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mt-2">
              Service: {serviceName}
            </p>
          </div>

          {message && (
            <div
              className={`mb-4 p-3 rounded-xl text-xs font-bold border ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border-green-100"
                  : "bg-red-50 text-red-700 border-red-100"
              }`}
            >
              {message.text}
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              placeholder="Full Name"
              required
              className="w-full px-6 py-4 rounded-2xl border bg-slate-50 font-bold text-black"
            />

            <input
              name="phone"
              placeholder="Phone Number"
              required
              className="w-full px-6 py-4 rounded-2xl border bg-slate-50 font-bold text-black"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#020617] text-white py-4 rounded-2xl font-black uppercase tracking-widest disabled:bg-slate-400"
            >
              {loading ? "Sending..." : "Request Callback"}
            </button>
          </form>

          <p className="text-center mt-6 text-[10px] font-black text-slate-400 uppercase">
            🔒 Secure & Confidential
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
