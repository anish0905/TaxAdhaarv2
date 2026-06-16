"use client";
import { useState } from "react";

export default function NotificationManager({ notifications, fetchNotifications, setMessage }: any) {
  const [notiTitle, setNotiTitle] = useState("");
  const [notiLink, setNotiLink] = useState("");
  const [notiIsUrgent, setNotiIsUrgent] = useState(false);

  const handleNotiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: notiTitle, link: notiLink, isUrgent: notiIsUrgent }),
      });
      if (res.ok) {
        setMessage("⚡ लाइव नोटिफिकेशन तुरंत पोर्टल पर फ्लैश हो गया है!");
        setNotiTitle(""); setNotiLink(""); setNotiIsUrgent(false);
        fetchNotifications();
      }
    } catch (err) {
      setMessage("❌ नोटिफिकेशन पब्लिश करने में दिक्कत आई।");
    }
  };

  const handleNotiDelete = async (id: string) => {
    if (!confirm("क्या आप इसे हटाना चाहते हैं?")) return;
    try {
      await fetch(`/api/notifications?id=${id}`, { method: "DELETE" });
      fetchNotifications();
    } catch (err) {
      alert("डिलीट करने में एरर आया");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-black">
      <form onSubmit={handleNotiSubmit} className="bg-white p-5 rounded-xl border border-slate-200 h-fit space-y-4">
        <h2 className="text-xs font-black uppercase tracking-wider text-red-600">📢 Add Marquee Alert</h2>
        <textarea required rows={3} value={notiTitle} onChange={(e) => setNotiTitle(e.target.value)} placeholder="Alert Title" className="w-full p-2 border rounded-lg text-sm bg-slate-50 outline-none" />
        <input type="url" value={notiLink} onChange={(e) => setNotiLink(e.target.value)} placeholder="Circular Link (Optional)" className="w-full p-2 border rounded-lg text-xs bg-slate-50" />
        <label className="flex items-center space-x-2 text-xs font-bold text-red-700 bg-red-50 p-2.5 rounded-lg border border-red-100 cursor-pointer">
          <input type="checkbox" checked={notiIsUrgent} onChange={(e) => setNotiIsUrgent(e.target.checked)} className="w-4 h-4 accent-red-600" />
          <span>🚨 Mark as Urgent Pulse Alert</span>
        </label>
        <button type="submit" className="w-full p-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase rounded-lg">Broadcast Live Alert</button>
      </form>
      <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-4">Active Bulletins ({notifications.length})</h2>
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {notifications.map((n: any) => (
            <div key={n._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <div><p className="font-bold text-slate-800">{n.isUrgent && "🚨 "}{n.title}</p></div>
              <button onClick={() => handleNotiDelete(n._id)} className="text-slate-400 hover:text-red-600">🗑️</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}