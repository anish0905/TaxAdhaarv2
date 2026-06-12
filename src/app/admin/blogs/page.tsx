"use client";

import { useState, useEffect } from "react";
import { CldUploadWidget } from "next-cloudinary";

// --- TYPES & INTERFACES ---
interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

interface TaxNotification {
  _id: string;
  title: string;
  link?: string;
  isUrgent: boolean;
  createdAt: string;
}

interface AdPlacement {
  _id?: string;
  location: string;
  adCode: string;
  isActive: boolean;
  updatedAt?: string;
}

export default function UltimateAdminDashboard() {
  // 🔥 Active Tab State ("blogs", "notifications", "ads", "categories")
  const [activeTab, setActiveTab] = useState<"blogs" | "notifications" | "ads" | "categories">("blogs");

  // --- GENERAL STATES ---
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // --- 1. BLOG FORM STATES ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tags, setTags] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [showAds, setShowAds] = useState(true);

  // --- 2. NOTIFICATION STATES ---
  const [notifications, setNotifications] = useState<TaxNotification[]>([]);
  const [notiTitle, setNotiTitle] = useState("");
  const [notiLink, setNotiLink] = useState("");
  const [notiIsUrgent, setNotiIsUrgent] = useState(false);

  // --- 3. ADS STATES ---
  const [ads, setAds] = useState<AdPlacement[]>([]);
  const [adLocation, setAdLocation] = useState("HOME_TOP");
  const [adCode, setAdCode] = useState("");
  const [adIsActive, setAdIsActive] = useState(true);

  // --- 4. NEW: CATEGORY STATES ---
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");

  // --- INITIAL DATA FETCHING ---
  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        setCategories(result.data);
        if (result.data.length > 0) setCategoryId(result.data[0]._id);
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const result = await res.json();
      if (result.success) setNotifications(result.data);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  const fetchAds = async () => {
    try {
      const res = await fetch("/api/ads");
      const result = await res.json();
      if (result.success) setAds(result.data);
    } catch (err) {
      console.error("Failed to load ads:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchNotifications();
    fetchAds();
  }, []);

  // ऑटो-स्लग जनरेटर कैटेगरी नेम के आधार पर
  const handleCatNameChange = (name: string) => {
    setNewCatName(name);
    setNewCatSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
  };

  // --- 1. HANDLE BLOG SUBMIT ---
  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!categoryId) {
      setMessage("❌ एरर: कृपया पहले कम से कम एक कैटेगरी बनाएं!");
      setLoading(false);
      return;
    }
    if (!mainImage) {
      setMessage("❌ एरर: कृपया पहले समाचार का बैनर अपलोड करें!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, content, excerpt, mainImage, categoryId,
          metaTitle: metaTitle || title,
          metaDesc: metaDesc || excerpt,
          keywords, tags, isPublished, showAds,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setMessage("🎉 टैक्स न्यूज़ सफलतापूर्वक लाइव हो गई है!");
        setTitle(""); setContent(""); setExcerpt(""); setMainImage("");
        setMetaTitle(""); setMetaDesc(""); setKeywords(""); setTags("");
      } else {
        setMessage(`❌ एरर: ${result.message || "कुछ गड़बड़ हुई"}`);
      }
    } catch (error) {
      setMessage("❌ सर्वर से कनेक्ट करने में दिक्कत आई।");
    } finally {
      setLoading(false);
    }
  };

  // --- 2. HANDLE NOTIFICATION SUBMIT ---
  const handleNotiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: notiTitle, link: notiLink, isUrgent: notiIsUrgent }),
      });
      const result = await res.json();
      if (result.success) {
        setMessage("⚡ लाइव नोटिफिकेशन तुरंत पोर्टल पर फ्लैश हो गया है!");
        setNotiTitle(""); setNotiLink(""); setNotiIsUrgent(false);
        fetchNotifications();
      }
    } catch (err) {
      setMessage("❌ नोटिफिकेशन पब्लिश करने में दिक्कत आई।");
    } finally {
      setLoading(false);
    }
  };

  const handleNotiDelete = async (id: string) => {
    if (!confirm("क्या आप इसे हटाना चाहते हैं?")) return;
    try {
      const res = await fetch(`/api/notifications?id=${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) setNotifications(notifications.filter((n) => n._id !== id));
    } catch (err) {
      alert("डिलीट करने में एरर आया");
    }
  };

  // --- 3. HANDLE ADS SUBMIT ---
  const handleAdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: adLocation, adCode, isActive: adIsActive }),
      });
      const result = await res.json();
      if (result.success) {
        setMessage("💰 एडसेंस विज्ञापन स्लॉट सफलतापूर्वक अपडेट हो गया है!");
        setAdCode("");
        fetchAds();
      }
    } catch (err) {
      setMessage("❌ एड्स अपडेट करने में फेलियर आया।");
    } finally {
      setLoading(false);
    }
  };

  const toggleAdStatus = async (currentAd: AdPlacement) => {
    try {
      await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: currentAd.location,
          adCode: currentAd.adCode,
          isActive: !currentAd.isActive,
        }),
      });
      fetchAds();
    } catch (err) {
      alert("स्टेटस चेंज फेल!");
    }
  };

  // --- 4. NEW: HANDLE CATEGORY SUBMIT ---
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCatName, slug: newCatSlug, description: newCatDesc }),
      });
      const result = await res.json();
      if (result.success) {
        setMessage("📁 नई टैक्स कैटेगरी सफलतापूर्वक रजिस्टर हो गई है!");
        setNewCatName(""); setNewCatSlug(""); setNewCatDesc("");
        fetchCategories(); //Dropdown और लिस्ट दोनों रिफ्रेश करें
      } else {
        setMessage(`❌ एरर: ${result.message || "कैटेगरी नहीं बनी"}`);
      }
    } catch (err) {
      setMessage("❌ सर्वर एरर आया।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 bg-slate-50 min-h-screen my-6 rounded-2xl border border-slate-200 shadow-sm text-black">
      
      {/* HEADER SECTION */}
      <div className="border-b border-slate-200 pb-5 mb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">🏢 Centralized Tax Portal Control Panel</h1>
        <p className="text-sm text-slate-500 mt-1">खबरें, लाइव टिकर, विज्ञापन ज़ोन और कैटेगरीज को एक ही प्रीमियम इंटरफ़ेस से मैनेज करें।</p>
      </div>

      {/* 🚀 TAB NAVIGATION BUTTONS */}
      <div className="flex bg-slate-200/80 p-1.5 rounded-xl space-x-1 mb-8 max-w-xl overflow-x-auto">
        <button
          onClick={() => { setActiveTab("blogs"); setMessage(""); }}
          className={`flex-1 py-2.5 px-4 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer whitespace-nowrap ${activeTab === "blogs" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:bg-white/40"}`}
        >
          📝 Write Blog
        </button>
        <button
          onClick={() => { setActiveTab("categories"); setMessage(""); }}
          className={`flex-1 py-2.5 px-4 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer whitespace-nowrap ${activeTab === "categories" ? "bg-white text-purple-600 shadow-sm" : "text-slate-600 hover:bg-white/40"}`}
        >
          📁 Categories
        </button>
        <button
          onClick={() => { setActiveTab("notifications"); setMessage(""); }}
          className={`flex-1 py-2.5 px-4 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer whitespace-nowrap ${activeTab === "notifications" ? "bg-white text-red-600 shadow-sm" : "text-slate-600 hover:bg-white/40"}`}
        >
          📢 Live Ticker
        </button>
        <button
          onClick={() => { setActiveTab("ads"); setMessage(""); }}
          className={`flex-1 py-2.5 px-4 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer whitespace-nowrap ${activeTab === "ads" ? "bg-white text-amber-600 shadow-sm" : "text-slate-600 hover:bg-white/40"}`}
        >
          💰 Manage Ads
        </button>
      </div>

      {/* ALERT MESSAGE TOAST */}
      {message && (
        <div className={`p-4 mb-6 rounded-xl font-bold text-xs uppercase tracking-wide shadow-xs border ${message.includes("❌") ? "bg-red-50 text-red-700 border-red-100" : "bg-green-50 text-green-700 border-green-100"}`}>
          {message}
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 1: VIRAL BLOG WRITER */}
      {/* ========================================== */}
      {activeTab === "blogs" && (
        <form onSubmit={handleBlogSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">News Title (H1)</label>
              <input
                type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Extended Due Date Notification till July 15, 2026"
                className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Select Tax Category</label>
              <select
                value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-slate-50 p-4 border border-dashed rounded-xl">
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Featured Image</label>
            <CldUploadWidget
              uploadPreset="tax_portal_presets"
              onSuccess={(result: any) => result?.info?.secure_url && setMainImage(result.info.secure_url)}
            >
              {({ open }) => (
                <button type="button" onClick={() => open()} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase rounded-lg shadow transition cursor-pointer">
                  {mainImage ? "✓ Image Link Attached" : "📸 Upload News Banner"}
                </button>
              )}
            </CldUploadWidget>
            {mainImage && <p className="text-[10px] text-green-600 mt-2 truncate font-mono">URL: {mainImage}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Short Excerpt (Google Meta Snippet)</label>
            <textarea
              required rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
              placeholder="यह छोटा विवरण Google सर्च रिज़ल्ट में दिखेगा..."
              className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Full News Content (HTML Supported)</label>
            <textarea
              required rows={8} value={content} onChange={(e) => setContent(e.target.value)}
              placeholder="अपनी टैक्स न्यूज़ का पूरा आर्टिकल यहाँ लिखें..."
              className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">SEO Meta Title (Optional)</label>
              <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Focus Keywords</label>
              <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="e.g., GST portal, ITR form" className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 items-center">
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (Comma separated)" className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 text-sm" />
            <label className="flex items-center space-x-2 font-bold text-xs uppercase text-slate-700 cursor-pointer"><input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="w-4 h-4 accent-blue-600" /> <span>Immediately Publish</span></label>
            <label className="flex items-center space-x-2 font-bold text-xs uppercase text-slate-700 cursor-pointer"><input type="checkbox" checked={showAds} onChange={(e) => setShowAds(e.target.checked)} className="w-4 h-4 accent-blue-600" /> <span>Enable Ads on this News</span></label>
          </div>

          <button type="submit" disabled={loading} className="w-full p-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest rounded-lg shadow-md transition cursor-pointer">
            {loading ? "Publishing News..." : "⚡ Broadcast Article to Public"}
          </button>
        </form>
      )}

      {/* ========================================== */}
      {/* TAB 2: CATEGORY CREATOR (New Integration 🚀) */}
      {/* ========================================== */}
      {activeTab === "categories" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={handleCategorySubmit} className="bg-white p-5 rounded-xl border border-slate-200 h-fit space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-purple-600">📁 Create New Topic</h2>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Category Name</label>
              <input type="text" required value={newCatName} onChange={(e) => handleCatNameChange(e.target.value)} placeholder="e.g., Income Tax, GST updates" className="w-full p-2 border rounded-lg text-sm bg-slate-50 outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">SEO URL Slug</label>
              <input type="text" required value={newCatSlug} onChange={(e) => setNewCatSlug(e.target.value)} placeholder="income-tax" className="w-full p-2 border rounded-lg text-xs bg-slate-100 font-mono text-slate-600" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Description (Optional)</label>
              <textarea rows={3} value={newCatDesc} onChange={(e) => setNewCatDesc(e.target.value)} placeholder="Short note about this category..." className="w-full p-2 border rounded-lg text-xs bg-slate-50 outline-none" />
            </div>
            <button type="submit" disabled={loading} className="w-full p-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold uppercase rounded-lg cursor-pointer shadow-sm">
              Save Category Topic
            </button>
          </form>

          <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-4">Available Categories ({categories.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-1">
              {categories.map((cat) => (
                <div key={cat._id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">{cat.name}</h4>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5">Slug: /{cat.slug}</p>
                    {cat.description && <p className="text-xs text-slate-500 mt-2 line-clamp-2">{cat.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 3: LIVE BROADCAST NOTIFICATIONS */}
      {/* ========================================== */}
      {activeTab === "notifications" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={handleNotiSubmit} className="bg-white p-5 rounded-xl border border-slate-200 h-fit space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-red-600">📢 Add Marquee Alert</h2>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Alert Title</label>
              <textarea required rows={3} value={notiTitle} onChange={(e) => setNotiTitle(e.target.value)} placeholder="e.g., GSTR-9 filing deadline extended!" className="w-full p-2 border rounded-lg text-sm bg-slate-50 outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Circular Link (Optional)</label>
              <input type="url" value={notiLink} onChange={(e) => setNotiLink(e.target.value)} placeholder="https://..." className="w-full p-2 border rounded-lg text-xs bg-slate-50" />
            </div>
            <label className="flex items-center space-x-2 text-xs font-bold text-red-700 bg-red-50 p-2.5 rounded-lg border border-red-100 cursor-pointer">
              <input type="checkbox" checked={notiIsUrgent} onChange={(e) => setNotiIsUrgent(e.target.checked)} className="w-4 h-4 accent-red-600" />
              <span>🚨 Mark as Urgent Pulse Alert</span>
            </label>
            <button type="submit" disabled={loading} className="w-full p-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase rounded-lg cursor-pointer">
              Broadcast Live Alert
            </button>
          </form>

          <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-4">Active Bulletins Stream ({notifications.length})</h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {notifications.map((n) => (
                <div key={n._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <div>
                    <p className="font-bold text-slate-800">{n.isUrgent && "🚨 "}{n.title}</p>
                    {n.link && <a href={n.link} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline font-mono text-[10px] block mt-0.5">{n.link}</a>}
                  </div>
                  <button onClick={() => handleNotiDelete(n._id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer">🗑️</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 4: GOOGLE ADSENSE MONETIZATION MANAGER */}
      {/* ========================================== */}
      {activeTab === "ads" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={handleAdSubmit} className="bg-white p-5 rounded-xl border border-slate-200 h-fit space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-amber-600">💰 Inject Ad Unit</h2>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Ad Zone Location</label>
              <select value={adLocation} onChange={(e) => setAdLocation(e.target.value)} className="w-full p-2 border font-semibold rounded-lg text-xs bg-slate-50">
                <option value="HOME_TOP">HOME_TOP (Top Header Banner)</option>
                <option value="BLOG_SIDEBAR">BLOG_SIDEBAR (Right Sidebar)</option>
                <option value="BELOW_TITLE">BELOW_TITLE (Post Header)</option>
                <option value="BELOW_ARTICLE">BELOW_ARTICLE (Post Footer)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">AdSense HTML Script Code</label>
              <textarea required rows={5} value={adCode} onChange={(e) => setAdCode(e.target.value)} placeholder='<ins class="adsbygoogle" ...></ins>' className="w-full p-2 border rounded-lg font-mono text-xs bg-slate-900 text-amber-400" />
            </div>
            <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input type="checkbox" checked={adIsActive} onChange={(e) => setAdIsActive(e.target.checked)} className="w-4 h-4 accent-amber-500" />
              <span>🟢 Instantly Deploy This Ad Slot</span>
            </label>
            <button type="submit" disabled={loading} className="w-full p-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase rounded-lg cursor-pointer">
              Save Ad Layout Settings
            </button>
          </form>

          <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-4">Ad Tracking Zones ({ads.length})</h2>
            <div className="space-y-3">
              {ads.map((ad) => (
                <div key={ad._id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="bg-slate-900 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase mr-2">{ad.location}</span>
                    <span className={`text-[10px] font-bold ${ad.isActive ? "text-green-600" : "text-red-500"}`}>{ad.isActive ? "● ON AIR" : "○ PAUSED"}</span>
                  </div>
                  <button onClick={() => toggleAdStatus(ad)} className={`px-3 py-1 text-xs font-bold rounded-md cursor-pointer transition ${ad.isActive ? "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100" : "bg-green-50 text-green-600 border border-green-100 hover:bg-green-100"}`}>
                    {ad.isActive ? "Pause" : "Activate"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}