"use client";

import { useState, useEffect } from "react";
import BlogManager from "@/components/admin/BlogManager";
import BlogListManager from "@/components/admin/BlogListManager"; // ⚡ NEW COMPONENT INTEGRATION
import CategoryManager from "@/components/admin/CategoryManager";
import PartnerManager from "@/components/admin/PartnerManager";
import NotificationManager from "@/components/admin/NotificationManager";
import AdManager from "@/components/admin/AdManager";

export default function UltimateAdminDashboard() {
  // 🔥 Active Tab State Upgraded with 'manage-blogs'
  const [activeTab, setActiveTab] = useState<"blogs" | "manage-blogs" | "notifications" | "ads" | "categories" | "partners" >("blogs");
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [ads, setAds] = useState([]);
  const [partners, setPartners] = useState([]);
  const [blogs, setBlogs] = useState([]);

  // 🔄 Shared States for Editing Blog between Tabs (State Lifting Mechanism)
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [blogToEdit, setBlogToEdit] = useState<any>(null);

  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");

  const fetchCategories = async () => {
    const res = await fetch("/api/categories").then(r => r.json());
    if (res.success) setCategories(res.data);
  };

  const fetchNotifications = async () => {
    const res = await fetch("/api/notifications").then(r => r.json());
    if (res.success) setNotifications(res.data);
  };

  const fetchAds = async () => {
    const res = await fetch("/api/ads").then(r => r.json());
    if (res.success) setAds(res.data);
  };

  const fetchPartners = async () => {
    const res = await fetch("/api/partners").then(r => r.json());
    if (res.success) setPartners(res.data);
  };

  const fetchAllBlogs = async () => {
    const res = await fetch("/api/blogs?admin=true").then(r => r.json());
    if (res.success) setBlogs(res.data);
  };

  useEffect(() => {
    fetchCategories();
    fetchNotifications();
    fetchAds();
    fetchPartners();
    fetchAllBlogs();
  }, []);

  const handleCatNameChange = (name: string) => {
    setNewCatName(name);
    setNewCatSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
  };

  // ⚡ Upgraded Edit Trigger: Fetch full single document directly from API to unlock SEO fields
  const startEditBlog = async (blog: any) => {
    setMessage("");
    
    // सिलेक्टेड ब्लॉग की आईडी या स्लग निकालें
    const blogIdentifier = blog.slug || blog._id;
    
    try {
      // 🚀 सीधे डायनेमिक GET एपीआई को हिट करके पूरे डॉक्यूमेंट को मंगाओ
      const res = await fetch(`/api/blogs/${blogIdentifier}`).then(r => r.json());
      
      if (res.success && res.data) {
        // मोंगोडीबी का पूरा फ्रेश डेटा (metaTitle, keywords, tags के साथ) स्टेट में डालो
        setEditingBlogId(res.data._id);
        setBlogToEdit(res.data); 
        setActiveTab("blogs"); // फॉर्म वाले टैब पर ऑटो-स्विच करें
      } else {
        // फॉलबैक: अगर किसी वजह से एपीआई न चले, तो पुराना ऑब्जेक्ट ही बैकअप की तरह यूज़ करें
        setEditingBlogId(blog._id);
        setBlogToEdit(blog);
        setActiveTab("blogs");
      }
    } catch (err) {
      console.error("Failed to fetch full blog schema, using table fallback:", err);
      setEditingBlogId(blog._id);
      setBlogToEdit(blog);
      setActiveTab("blogs");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 bg-slate-50 min-h-screen my-6 rounded-2xl border border-slate-200 shadow-sm text-black">
      <div className="border-b border-slate-200 pb-5 mb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">🏢 Centralized Tax Portal Control Panel</h1>
        <p className="text-sm text-slate-500 mt-1">SaaS Architecture पर बेस्ड फुली मॉड्युलर कंट्रोल सेंटर।</p>
      </div>

      {/* 🚀 EXTENDED MODULAR TABS */}
      <div className="flex bg-slate-200/80 p-1.5 rounded-xl space-x-1 mb-8 max-w-3xl overflow-x-auto">
        {(["blogs", "manage-blogs", "categories", "partners", "notifications", "ads"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setMessage(""); }}
            className={`flex-1 py-2.5 px-4 text-xs font-bold uppercase tracking-wider rounded-lg transition-all whitespace-nowrap cursor-pointer ${activeTab === tab ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:bg-white/40"}`}
          >
            {tab === "blogs" && (editingBlogId ? "✏️ Editing Article" : "📝 Write Blog")}
            {tab === "manage-blogs" && "📋 Manage Blogs"}
            {tab === "categories" && "📁 Categories"}
            {tab === "partners" && "🤝 Partners"}
            {tab === "notifications" && "📢 Live Ticker"}
            {tab === "ads" && "💰 Manage Ads"}
          </button>
        ))}
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-xl font-bold text-xs border ${message.includes("❌") ? "bg-red-50 text-red-700 border-red-100" : "bg-green-50 text-green-700 border-green-100"}`}>
          {message}
        </div>
      )}

      {/* ROUTERS TO DECOUPLED SUB-COMPONENTS */}
      {activeTab === "blogs" && (
        <BlogManager 
          categories={categories} 
          partners={partners} 
          setMessage={setMessage} 
          editingBlogId={editingBlogId}
          setEditingBlogId={setEditingBlogId}
          blogToEdit={blogToEdit}
          setBlogToEdit={setBlogToEdit}
          fetchAllBlogs={fetchAllBlogs}
          setActiveTab={setActiveTab}
        />
      )}
      
      {activeTab === "manage-blogs" && (
        <BlogListManager 
          blogs={blogs} 
          fetchAllBlogs={fetchAllBlogs} 
          startEditBlog={startEditBlog} 
          setMessage={setMessage} 
        />
      )}

      {activeTab === "categories" && <CategoryManager categories={categories} fetchCategories={fetchCategories} setMessage={setMessage} handleCatNameChange={handleCatNameChange} newCatName={newCatName} newCatSlug={newCatSlug} newCatDesc={newCatDesc} setNewCatSlug={setNewCatSlug} setNewCatDesc={setNewCatDesc} />}
      {activeTab === "partners" && <PartnerManager partners={partners} fetchPartners={fetchPartners} setMessage={setMessage} />}
      {activeTab === "notifications" && <NotificationManager notifications={notifications} fetchNotifications={fetchNotifications} setMessage={setMessage} />}
      {activeTab === "ads" && <AdManager ads={ads} fetchAds={fetchAds} setMessage={setMessage} />}
    </div>
  );
}