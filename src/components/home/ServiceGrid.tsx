"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Info, ArrowRight } from "lucide-react";
import { servicesData } from "@/data/services";
import { useSession } from "next-auth/react"; // Session check karne ke liye
import { useRouter } from "next/navigation"; // Redirect karne ke liye
import Link from "next/link";

export default function ServiceGrid() {
  const { data: session } = useSession(); // Auth status fetch karna
  const router = useRouter();

  // Default variants state
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({
    "income-tax": "salaried",
    "gst-filing": "regular-monthly",
    "business-registration": "pvt-ltd"
  });

  const handleVariantChange = (serviceKey: string, variantId: string) => {
    setSelectedVariants(prev => ({ ...prev, [serviceKey]: variantId }));
  };

  // --- Login Check Logic ---
  const handleStartService = (key: string, variantId: string, label: string) => {
    if (!session) {
      alert("Please login first to start your " + label + " application.");
      router.push("/login"); // User ko login par bhejna
      return;
    }
    
    // Agar login hai toh agle page par bhej do
    router.push(`/dashboard/services/${key}?variant=${variantId}`);
  };

  return (
    <section className="px-4 py-12 max-w-5xl mx-auto bg-transparent">
      <div className="mb-8 space-y-1 pl-1">
        <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase text-[14px]">Professional Services Matrix</h2>
        <p className="text-slate-400 text-[11px] font-medium tracking-tight">Select operational category to review mandatory compliance schemas and protocols.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {Object.entries(servicesData).map(([key, s]: [string, any]) => {
          const currentVariantId = selectedVariants[key] || s.variants?.[0]?.id;
          const activeVariantData = s.variants?.find((v: any) => v.id === currentVariantId);

          return (
            <div 
              key={key}
              className="bg-white border border-slate-200/80 rounded-[2rem] p-6 shadow-sm flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                {/* Header Block (Compact Typography) */}
                <div className="flex items-center gap-4 mb-5 pb-4 border-b border-slate-100">
                  <div className="text-3xl bg-slate-50 w-14 h-14 flex items-center justify-center rounded-2xl border border-slate-100/70 shadow-sm shrink-0">
                    {s.icon}
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest bg-blue-50/70 border border-blue-100/50 px-2 py-0.5 rounded">
                      {s.category}
                    </span>
                    <h3 className="text-base font-black text-slate-950 tracking-tight">{s.title}</h3>
                  </div>
                </div>

                {/* Variant Selection Block */}
                <div className="mb-5">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    Select Classification
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {s.variants?.map((v: any) => (
                      <button
                        key={v.id}
                        onClick={() => handleVariantChange(key, v.id)}
                        className={`px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${
                          currentVariantId === v.id 
                            ? "bg-slate-950 text-white border-slate-950 shadow-sm" 
                            : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Content Block */}
                <div className="space-y-4">
                  <div className="flex gap-3 bg-blue-50/30 p-3.5 rounded-xl border border-blue-100/40">
                    <Info className="text-blue-600 shrink-0 mt-0.5" size={14} />
                    <div className="space-y-0.5">
                      <p className="text-[8px] font-black text-blue-600 uppercase tracking-wider">Statutory Advisory</p>
                      <p className="text-[11px] text-slate-600 font-semibold leading-relaxed italic">
                        {activeVariantData?.note}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/80">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2.5">Required Document Roster</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                      {activeVariantData?.docs.map((doc: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] font-bold text-slate-600 group">
                          <CheckCircle2 size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span className="group-hover:text-slate-950 transition-colors leading-tight">{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {activeVariantData?.returns && (
                  <div className="flex items-center justify-between px-4 py-2 bg-slate-950 rounded-lg text-white">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Filing Schedule</span>
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-400">{activeVariantData.returns}</span>
                  </div>
                )}

                {/* --- Action Button with Micro-Text --- */}
                <button 
                  onClick={() => handleStartService(key, currentVariantId, activeVariantData?.label)}
                  className="group w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
                >
                  Initialize {activeVariantData?.label} Flow
                  <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}