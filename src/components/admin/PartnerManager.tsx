"use client";

import { useState } from "react";

interface PartnerManagerProps {
  partners: any[];
  fetchPartners: () => void;
  setMessage: (msg: string) => void;
}

export default function PartnerManager({ partners, fetchPartners, setMessage }: PartnerManagerProps) {
  const [loading, setLoading] = useState(false);
  const [partnerName, setPartnerName] = useState("");
  const [partnerDesc, setPartnerDesc] = useState("");
  const [partnerBadge, setPartnerBadge] = useState("Free");
  const [partnerLink, setPartnerLink] = useState("");
  const [partnerColor, setPartnerColor] = useState("orange");
  const [partnerOrder, setPartnerOrder] = useState(0);

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: partnerName, description: partnerDesc, badgeText: partnerBadge,
          affiliateLink: partnerLink, themeColor: partnerColor, displayOrder: partnerOrder
        }),
      });
      const result = await res.json();
      if (result.success) {
        setMessage("🚀 नया अफ़िलिएट पार्टनर सफलतापूर्वक लाइव हो गया है!");
        setPartnerName(""); setPartnerDesc(""); setPartnerLink("");
        fetchPartners();
      }
    } catch (err) {
      setMessage("❌ पार्टनर ऐड करने में सर्वर एरर आया।");
    } finally {
      setLoading(false);
    }
  };

  const togglePartnerStatus = async (partner: any) => {
    try {
      const res = await fetch("/api/partners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: partner._id, isActive: !partner.isActive }),
      });
      if (res.ok) fetchPartners();
    } catch (err) {
      alert("स्टेटस चेंज फेल!");
    }
  };

  const handlePartnerDelete = async (id: string) => {
    if (!confirm("क्या आप इस अफ़िलिएट पार्टनर को हटाना चाहते हैं?")) return;
    try {
      const res = await fetch(`/api/partners?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchPartners();
    } catch (err) {
      alert("डिलीट फेल!");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-black">
      <form onSubmit={handlePartnerSubmit} className="bg-white p-5 rounded-xl border border-slate-200 h-fit space-y-4">
        <h2 className="text-xs font-black uppercase tracking-wider text-emerald-600">🤝 Add Affiliate Partner</h2>
        <input type="text" required value={partnerName} onChange={(e) => setPartnerName(e.target.value)} placeholder="Partner Name" className="w-full p-2 border rounded-lg text-sm bg-slate-50 outline-none" />
        <textarea required rows={2} value={partnerDesc} onChange={(e) => setPartnerDesc(e.target.value)} placeholder="Short Description" className="w-full p-2 border rounded-lg text-xs bg-slate-50 outline-none" />
        <div className="grid grid-cols-2 gap-4">
          <input type="text" value={partnerBadge} onChange={(e) => setPartnerBadge(e.target.value)} className="w-full p-2 border rounded-lg text-xs bg-slate-50" />
          <select value={partnerColor} onChange={(e) => setPartnerColor(e.target.value)} className="w-full p-2 border rounded-lg text-xs bg-slate-50 font-semibold">
            <option value="blue">Blue</option>
            <option value="emerald">Emerald</option>
            <option value="orange">Orange</option>
          </select>
        </div>
        <input type="url" required value={partnerLink} onChange={(e) => setPartnerLink(e.target.value)} placeholder="Tracking Link URL" className="w-full p-2 border rounded-lg text-xs font-mono bg-slate-900 text-emerald-400 outline-none" />
        <button type="submit" disabled={loading} className="w-full p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase rounded-lg">
          Deploy Partner link
        </button>
      </form>

      <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-4">Live Affiliate Networks ({partners.length})</h2>
        <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
          {partners.map((p) => (
            <div key={p._id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between gap-4 text-xs">
              <div className="space-y-1">
                <p className="font-extrabold text-slate-900 text-sm">{p.name} <span className="text-[10px] bg-slate-200 px-1 py-0.5 rounded ml-2">{p.badgeText}</span></p>
                <p className="text-slate-500">{p.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => togglePartnerStatus(p)} className={`px-2.5 py-1 font-bold rounded-md ${p.isActive ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-600"}`}>
                  {p.isActive ? "Pause" : "Activate"}
                </button>
                <button onClick={() => handlePartnerDelete(p._id)} className="text-slate-400 hover:text-red-600">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}