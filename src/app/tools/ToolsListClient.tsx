"use client";

import { useState, memo, useEffect } from "react";
import { FileSpreadsheet, FileText, Download, Lock, ShieldCheck, Sparkles } from "lucide-react";
import PublicNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ============================================================================
// 🎴 MEMOIZED ASSET CARD 
// ============================================================================
const AssetCard = memo(({ asset, onUnlock, isProcessing }: { asset: any; onUnlock: (asset: any) => void; isProcessing: boolean }) => {
  return (
    <div className="bg-white border border-slate-200/70 rounded-[2rem] p-5 flex flex-col justify-between hover:border-slate-950/20 hover:shadow-xl transition-all duration-300 relative overflow-hidden group text-left h-full">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-slate-500/5 to-transparent rounded-full pointer-events-none" />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${
            asset.assetType === "excel" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-blue-50 text-blue-700 border-blue-100"
          }`}>
            {asset.assetType === "excel" ? <FileSpreadsheet size={10} /> : <FileText size={10} />}
            {asset.assetType}
          </span>
          <span className="text-[9px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 font-mono">
            {asset.badgeText || "CA Vetted"}
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="font-black text-sm text-slate-900 tracking-tight leading-snug group-hover:text-blue-600 transition-colors line-clamp-1">
            {asset.title}
          </h3>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed line-clamp-2">
            {asset.excerpt}
          </p>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          {asset.isPremium ? (
            <div className="flex flex-col">
              <span className="text-[7px] font-black uppercase tracking-wider text-slate-400 leading-none">Special Cost</span>
              <span className="text-base font-black text-slate-950 tracking-tight">₹{asset.price}</span>
            </div>
          ) : (
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">FREE</span>
          )}
        </div>

        <button
          onClick={() => onUnlock(asset)}
          disabled={isProcessing}
          className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all active:scale-[0.98] shadow-sm disabled:opacity-50 ${
            asset.isPremium ? "bg-slate-950 text-white hover:bg-slate-800" : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {asset.isPremium ? (
            <>{isProcessing ? "Opening..." : "Unlock Tool"} <Lock size={10} className="text-amber-400" /></>
          ) : (
            <>Download <Download size={10} /></>
          )}
        </button>
      </div>
    </div>
  );
});
AssetCard.displayName = "AssetCard";

// ============================================================================
// 🏛️ MAIN CLIENT ENGINE
// ============================================================================
export default function ToolsListClient({ initialAssets }: { initialAssets: any[] }) {
  const [filter, setFilter] = useState("all");
  const [processingId, setProcessingId] = useState<string | null>(null);

  // 🔄 रेज़रपे की बाहरी स्क्रिप्ट लोड करो भाई
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const filteredAssets = initialAssets.filter(asset => {
    if (filter === "all") return true;
    return asset.assetType === filter;
  });

  // 🛰️ DYNAMIC TRANSACTION GATEWAY
  const handleAssetAction = async (asset: any) => {
    if (!asset.isPremium) {
      // 🎁 फ्री एसेट बिना किसी झंझट सीधे डाउनलोड होगा भाई
      window.open(`/api/assets/download?slug=${asset.slug}`, "_blank");
      return;
    }

    // 💸 प्रीमियम एसेट के लिए रेज़रपे ऑर्डर जनरेट करो
    try {
      setProcessingId(asset._id);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetId: asset._id }),
      });

      const orderData = await res.json();
      if (!orderData.success) {
        alert("Payment initialization failed. Routine error.");
        return;
      }

      // रेज़रपे के चेकआउट ऑप्शंस कस्टमाइज़ करो भाई
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "TaxAdhaar",
        description: `Unlock ${asset.title}`,
        order_id: orderData.orderId,
        handler: function (response: any) {
          // 🎉 PAYMENT SUCCESS: पेमेंट होते ही सिक्योर डाउनलोड टोकन के साथ फाइल पॉप-अप मार दो!
          const successToken = "PAYMENT_SUCCESS_TOKEN"; // इसे तुम बाद में वेबहुक से बदल सकते हो भाई
          window.open(`/api/assets/download?slug=${asset.slug}&token=${successToken}`, "_blank");
        },
        prefill: {
          name: "Anish Kumar",
          email: "support@aimgrit.com",
          contact: "7557721426",
        },
        theme: { color: "#020617" }, // तुम्हारा क्लासी डार्क थीम थीम कोड भाई
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error("Checkout script fail node:", err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <>
      <PublicNavbar />
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)] h-[500px] -z-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 space-y-10">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50 border border-blue-200/50 rounded-md text-blue-700 text-[9px] font-black uppercase tracking-widest shadow-xs">
            <Sparkles size={10} className="animate-spin" /> PRO COMPLIANCE ASSETS 2026
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tighter leading-tight max-w-xl">
            Ecosystem Financial <span className="text-blue-600">Utilities & Tools</span>.
          </h1>
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">Automate Operational Computation Loops</p>
        </div>

        <div className="flex justify-center pt-2">
          <div className="bg-white border border-slate-200 p-1 rounded-xl flex gap-1 shadow-xs max-w-md">
            {["all", "excel", "word"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-5 py-2 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all ${
                  filter === type ? "bg-slate-950 text-white shadow-xs" : "text-slate-500 hover:text-slate-950"
                }`}
              >
                {type === "all" ? "All Assets" : type === "excel" ? "Excel Sheets" : "Notice Templates"}
              </button>
            ))}
          </div>
        </div>

        {filteredAssets.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl bg-white max-w-md mx-auto text-xs font-bold text-slate-400 uppercase tracking-widest">
            📭 No active digital assets compiled in this segment yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 pt-2">
            {filteredAssets.map((asset) => (
              <div key={asset._id} className="h-full">
                <AssetCard asset={asset} onUnlock={handleAssetAction} isProcessing={processingId === asset._id} />
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 bg-slate-100 border border-slate-200/60 p-4 rounded-2xl text-[10px] font-semibold text-slate-500 max-w-3xl mx-auto tracking-normal">
          <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
          <span>
            Every asset undergoes strict cryptographic and legal compliance vetting. Instant delivery node active via automated messaging routing frameworks.
          </span>
        </div>
      </div>
      <Footer />
    </>
  );
}