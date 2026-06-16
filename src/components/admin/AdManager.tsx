"use client";
import { useState } from "react";

export default function AdManager({ ads, fetchAds, setMessage }: any) {
  const [adLocation, setAdLocation] = useState("HOME_TOP");
  const [adCode, setAdCode] = useState("");
  const [adIsActive, setAdIsActive] = useState(true);

  const handleAdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: adLocation, adCode, isActive: adIsActive }),
      });
      if (res.ok) {
        setMessage("💰 एडसेंस विज्ञापन स्लॉट सफलतापूर्वक अपडेट हो गया है!");
        setAdCode(""); fetchAds();
      }
    } catch (err) {
      setMessage("❌ एड्स अपडेट करने में फेलियर आया।");
    }
  };

  const toggleAdStatus = async (currentAd: any) => {
    try {
      await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: currentAd.location, adCode: currentAd.adCode, isActive: !currentAd.isActive }),
      });
      fetchAds();
    } catch (err) {
      alert("स्टेटस चेंज फेल!");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-black">
      <form onSubmit={handleAdSubmit} className="bg-white p-5 rounded-xl border border-slate-200 h-fit space-y-4">
        <h2 className="text-xs font-black uppercase tracking-wider text-amber-600">💰 Inject Ad Unit</h2>
        <select value={adLocation} onChange={(e) => setAdLocation(e.target.value)} className="w-full p-2 border font-semibold rounded-lg text-xs bg-slate-50">
          <option value="HOME_TOP">HOME_TOP</option>
          <option value="BLOG_SIDEBAR">BLOG_SIDEBAR</option>
          <option value="BELOW_TITLE">BELOW_TITLE</option>
        </select>
        <textarea required rows={5} value={adCode} onChange={(e) => setAdCode(e.target.value)} placeholder='<ins class="adsbygoogle" ...></ins>' className="w-full p-2 border rounded-lg font-mono text-xs bg-slate-900 text-amber-400" />
        <button type="submit" className="w-full p-2.5 bg-slate-900 text-white text-xs font-bold uppercase rounded-lg">Save Ad Settings</button>
      </form>
      <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-4">Ad Tracking Zones ({ads.length})</h2>
        <div className="space-y-3">
          {ads.map((ad: any) => (
            <div key={ad._id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
              <span className="bg-slate-900 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase mr-2">{ad.location}</span>
              <button onClick={() => toggleAdStatus(ad)} className="px-3 py-1 text-xs font-bold rounded-md bg-red-50 text-red-600">Toggle</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}