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
    <section className="px-6 py-20 max-w-7xl mx-auto bg-slate-50/30">
      <div className="mb-12">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Professional Services</h2>
        <p className="text-slate-500 font-medium">Select your category to view mandatory documents and process details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {Object.entries(servicesData).map(([key, s]: [string, any]) => {
          const currentVariantId = selectedVariants[key] || s.variants?.[0]?.id;
          const activeVariantData = s.variants?.find((v: any) => v.id === currentVariantId);

          return (
            <div 
              key={key}
              className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header Block */}
              <div className="flex items-center gap-5 mb-8 pb-6 border-b border-slate-100">
                <div className="text-5xl bg-slate-50 w-20 h-20 flex items-center justify-center rounded-3xl shadow-inner">
                  {s.icon}
                </div>
                <div>
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">
                    {s.category}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">{s.title}</h3>
                </div>
              </div>

              {/* Variant Selection Block */}
              <div className="mb-8">
                <p className="text-[11px] font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
                   Choose Your Business Type
                </p>
                <div className="flex flex-wrap gap-2">
                  {s.variants?.map((v: any) => (
                    <button
                      key={v.id}
                      onClick={() => handleVariantChange(key, v.id)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                        currentVariantId === v.id 
                        ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200" 
                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Content Block */}
              <div className="space-y-6">
                <div className="flex gap-4 bg-blue-50/50 p-5 rounded-3xl border border-blue-100/50">
                  <Info className="text-blue-600 shrink-0" size={20} />
                  <div>
                    <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Expert Note</p>
                    <p className="text-sm text-slate-700 font-semibold leading-relaxed italic">
                      {activeVariantData?.note}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                  <p className="text-[11px] font-black text-slate-400 uppercase mb-4">Mandatory Checklist</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                    {activeVariantData?.docs.map((doc: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-xs font-bold text-slate-600 group">
                        <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                        <span className="group-hover:text-slate-900 transition-colors">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {activeVariantData?.returns && (
                  <div className="flex items-center justify-between px-6 py-4 bg-slate-900 rounded-2xl text-white">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Filing Type</span>
                    <span className="text-sm font-black">{activeVariantData.returns}</span>
                  </div>
                )}

                {/* --- Updated Action Button with Login Check --- */}
                <button 
                  onClick={() => handleStartService(key, currentVariantId, activeVariantData?.label)}
                  className="group w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-100 active:scale-95"
                >
                  Start {activeVariantData?.label} Filing
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}