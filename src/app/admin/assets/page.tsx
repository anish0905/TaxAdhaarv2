"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileSpreadsheet, PlusCircle, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminAssetUploadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    description: "",
    badgeText: "CA Vetted",
    assetType: "excel",
    isPremium: true,
    price: 99,
    fileUrl: "",
    metaTitle: "",
    metaDesc: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.success) {
        setMessage({ type: "success", text: "💥 Boom! Digital Asset uploaded and locked in database!" });
        setFormData({
          title: "", slug: "", excerpt: "", description: "",
          badgeText: "CA Vetted", assetType: "excel", isPremium: true,
          price: 99, fileUrl: "", metaTitle: "", metaDesc: ""
        });
        router.refresh();
      } else {
        setMessage({ type: "error", text: result.message || "Failed to compile asset node." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network routine crash failure." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 text-slate-950 text-left">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-sm space-y-6">
        
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2.5 bg-slate-900 text-white rounded-xl"><FileSpreadsheet size={20} /></div>
          <div>
            <h1 className="text-xl font-black tracking-tight uppercase">Ecosystem Core Asset Deployer</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin Control Matrix</p>
          </div>
        </div>

        {message.text && (
          <div className={`p-4 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}>
            {message.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label>Asset Title</label>
              <input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g., GST ITC Reconciliation Master Sheet" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-950 text-slate-900 font-medium normal-case" />
            </div>
            <div className="space-y-1">
              <label>Unique URL Slug</label>
              <input required type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} placeholder="e.g., gst-itc-recon-sheet" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-950 text-slate-900 font-medium lowercase" />
            </div>
          </div>

          <div className="space-y-1">
            <label>Excerpt (Short Description)</label>
            <input required type="text" value={formData.excerpt} onChange={(e) => setFormData({...formData, excerpt: e.target.value})} placeholder="Briefly explain what this spreadsheet or word doc template solves..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-950 text-slate-900 font-medium normal-case" />
          </div>

          <div className="space-y-1">
            <label>Detailed HTML Content Description</label>
            <textarea required rows={5} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="<p>Enter the complete landing page marketing text in clean raw HTML format...</p>" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-950 text-slate-900 font-mono text-xs normal-case" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label>Asset Format Type</label>
              <select value={formData.assetType} onChange={(e) => setFormData({...formData, assetType: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-950 text-slate-900 font-bold">
                <option value="excel">Excel Spreadsheet</option>
                <option value="word">Word Template (.docx)</option>
                <option value="pdf">PDF Handbook</option>
              </select>
            </div>
            <div className="space-y-1">
              <label>Badge Text</label>
              <input type="text" value={formData.badgeText} onChange={(e) => setFormData({...formData, badgeText: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-950 text-slate-900 font-medium normal-case" />
            </div>
            <div className="space-y-1">
              <label>Cost Matrix (INR)</label>
              <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-950 text-slate-900 font-bold" />
            </div>
          </div>

          <div className="space-y-1">
            <label>Secure File Storage Cloud URL</label>
            <input required type="text" value={formData.fileUrl} onChange={(e) => setFormData({...formData, fileUrl: e.target.value})} placeholder="https://cloudinary.com/your-secured-excel-sheet.xlsx" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-950 text-slate-900 font-medium normal-case" />
          </div>

         {/* ⚡ FIXED: 'required' attribute को हटा दिया गया है */}
<button 
  type="submit" 
  disabled={loading} 
  className="w-full bg-slate-950 hover:bg-slate-900 text-white p-4 rounded-2xl font-black uppercase tracking-widest text-center flex items-center justify-center gap-2 transition-all shadow-md disabled:bg-slate-400"
>
  <PlusCircle size={14} /> {loading ? "Compiling Asset Node..." : "Deploy Asset To Store"}
</button>
        </form>
        
      </div>
    </div>
  );
}