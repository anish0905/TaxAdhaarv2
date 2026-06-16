"use client";

import { useState, useRef, useEffect } from "react";
import { CldUploadWidget } from "next-cloudinary";

interface BlogManagerProps {
  categories: any[];
  partners: any[];
  setMessage: (msg: string) => void;
  editingBlogId: string | null;
  setEditingBlogId: (id: string | null) => void;
  blogToEdit: any;
  setBlogToEdit: (blog: any) => void;
  fetchAllBlogs: () => void;
  setActiveTab: (tab: any) => void;
}

export default function BlogManager({ 
  categories, 
  partners, 
  setMessage, 
  editingBlogId, 
  setEditingBlogId, 
  blogToEdit, 
  setBlogToEdit,
  fetchAllBlogs,
  setActiveTab
}: BlogManagerProps) {
  const [loading, setLoading] = useState(false);

  // --- FORM STATES ---
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
  console.log("🚀 BlogManager Rendered with Editing Blog ID:", editingBlogId);
  
  // 🤝 Affiliate Dropdown States
  const [selectedPartners, setSelectedPartners] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // कैटेगरीज लोड होने पर डिफ़ॉल्ट सेट करने के लिए सेफ सेफगार्ड
  useEffect(() => {
    if (categories && categories.length > 0 && !categoryId) {
      setCategoryId(categories[0]._id);
    }
  }, [categories, categoryId]);

  // ⚡ मोंगोडीबी मास्टर रिपोजिटरी गेट सिंक (100% डेटा फ़ील्ड्स लॉक)
  useEffect(() => {
    if (editingBlogId && blogToEdit) {
      // अगर डेटा किसी 'data' ऑब्जेक्ट के अंदर लिपटा हुआ आ रहा हो तो उसे बाहर निकालें
      const target = blogToEdit.data ? blogToEdit.data : blogToEdit;

      setTitle(target.title || "");
      setContent(target.content || "");
      setExcerpt(target.excerpt || "");
      setMainImage(target.mainImage || "");
      setCategoryId(target.category?._id || target.category || "");
      
      // 🔍 डेटाबेस की चारों SEO फ़ील्ड्स को फ़ोर्स बाइंड किया
      setMetaTitle(target.metaTitle || "");
      setMetaDesc(target.metaDesc || "");
      setKeywords(target.keywords || "just empty"); 
      setTags(target.tags || "");         
      
      setIsPublished(target.isPublished !== undefined ? target.isPublished : true);
      setShowAds(target.showAds !== undefined ? target.showAds : true);
      
      // अफ़िलिएट पार्टनर्स एरे को सेफ़ली लोड करें
      setSelectedPartners(target.relatedPartners || []);
    }
  }, [editingBlogId, blogToEdit]);



  // Click Outside Listener for Dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectPartner = (partner: any) => {
    if (!selectedPartners.some(p => p._id === partner._id)) {
      setSelectedPartners([...selectedPartners, partner]);
    }
    setSearchQuery("");
  };

  const handleRemovePartner = (id: string) => {
    setSelectedPartners(selectedPartners.filter(p => p._id !== id));
  };

  const filteredPartners = partners.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !selectedPartners.some(sp => sp._id === p._id)
  );

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue": return "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20";
      case "emerald": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20";
      case "orange": return "bg-orange-500/10 text-orange-600 border-orange-500/20 hover:bg-orange-500/20";
      default: return "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 hover:bg-indigo-500/20";
    }
  };

  const cancelEditing = () => {
    setEditingBlogId(null);
    setBlogToEdit(null);
    setTitle(""); setContent(""); setExcerpt(""); setMainImage("");
    setMetaTitle(""); setMetaDesc(""); setKeywords(""); setTags("");
    setSelectedPartners([]);
    setActiveTab("manage-blogs");
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // 🚀 मोंगोडीबी स्कीमा के साथ 100% एलाइन्ड पेलोड आर्किटेक्चर
    const payload = {
      title,
      content,
      excerpt,
      mainImage,
      categoryId,
      metaTitle: metaTitle || title,
      metaDesc: metaDesc || excerpt,
      keywords,
      tags,
      isPublished,
      showAds,
      relatedPartners: selectedPartners.map(p => p._id),
    };

    try {
      let res;
      if (editingBlogId) {
        // ✅ डायनेमिक राउट [slug] मैच फ़ॉरवर्डिंग (No More 405)
        res = await fetch(`/api/blogs/${blogToEdit.slug || editingBlogId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const result = await res.json();
      if (result.success) {
        setMessage(editingBlogId ? "✏️ टैक्स न्यूज़ सफलतापूर्वक अपडेट हो गई है!" : "🎉 टैक्स न्यूज़ सफलतापूर्वक लाइव हो गई है!");
        
        // फॉर्म रीसेट
        setTitle(""); setContent(""); setExcerpt(""); setMainImage("");
        setMetaTitle(""); setMetaDesc(""); setKeywords(""); setTags("");
        setSelectedPartners([]);
        setEditingBlogId(null);
        setBlogToEdit(null);
        
        fetchAllBlogs();
        setActiveTab("manage-blogs"); // रीडायरेक्ट टू लाइव कैटलॉग
      } else {
        setMessage(`❌ एरर: ${result.message || "कार्रवाई विफल रही"}`);
      }
    } catch (error) {
      setMessage("❌ सर्वर रिपॉन्स एरर आया।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleBlogSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6 text-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-sm font-black uppercase tracking-wider text-blue-600">
          {editingBlogId ? "✏️ Edit & Refine Article" : "📝 Compose New Viral News"}
        </h2>
        {editingBlogId && (
          <button type="button" onClick={cancelEditing} className="text-xs bg-slate-100 hover:bg-slate-200 font-bold px-3 py-1.5 rounded-md text-slate-700 transition cursor-pointer">
            Cancel & Go Back
          </button>
        )}
      </div>

      {/* Title & Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">News Title (H1)</label>
          <input
            type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Extended Due Date Notification"
            className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Select Tax Category</label>
          <select
            value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
            className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 font-bold text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
          </select>
        </div>
      </div>

      {/* Banner Upload */}
      <div className="bg-slate-50 p-4 border border-dashed rounded-xl">
        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Featured Image</label>
        <CldUploadWidget
          uploadPreset="tax_portal_presets"
          onSuccess={(result: any) => result?.info?.secure_url && setMainImage(result.info.secure_url)}
        >
          {({ open }) => (
            <button type="button" onClick={() => open()} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase rounded-lg shadow transition cursor-pointer">
              {mainImage ? "✓ Image Attached" : "📸 Upload News Banner"}
            </button>
          )}
        </CldUploadWidget>
        {mainImage && <p className="text-[10px] text-green-600 mt-2 truncate font-mono">URL: {mainImage}</p>}
      </div>

      {/* Short Excerpt */}
      <div>
        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Short Excerpt (Google Meta Snippet)</label>
        <textarea
          required rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
          placeholder="यह छोटा विवरण Google सर्च रिज़ल्ट में दिखेगा..."
          className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Main Content */}
      <div>
        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Full News Content (HTML Supported)</label>
        <textarea
          required rows={8} value={content} onChange={(e) => setContent(e.target.value)}
          placeholder="अपनी टैक्स न्यूज़ का पूरा आर्टिकल यहाँ लिखें..."
          className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 font-mono text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Searchable Multi-Select Dropdown for Partners */}
      <div className="bg-slate-50 p-5 border border-dashed rounded-xl relative" ref={dropdownRef}>
        <label className="block text-xs font-black uppercase text-slate-600 mb-2">🤝 Linked Affiliate Monetization Networks</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedPartners.length === 0 && <span className="text-xs italic text-slate-400">कोई पार्टनर सिलेक्टेड नहीं है।</span>}
          {selectedPartners.map((p) => (
            <div key={p._id} className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs font-extrabold ${getColorClasses(p.themeColor)}`}>
              <span>{p.name}</span>
              <button type="button" onClick={() => handleRemovePartner(p._id)} className="ml-1 text-slate-500 hover:text-red-500 font-bold text-sm cursor-pointer">&times;</button>
            </div>
          ))}
        </div>
        <div className="relative">
          <input 
            type="text" value={searchQuery} onFocus={() => setIsDropdownOpen(true)} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 सर्च करें और अफ़िलिएट लिंक जोड़ें..."
            className="w-full p-3 border border-slate-300 rounded-xl bg-white text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          {isDropdownOpen && (
            <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-[200px] overflow-y-auto z-50 divide-y divide-slate-100">
              {filteredPartners.map((p) => (
                <div key={p._id} onClick={() => handleSelectPartner(p)} className="p-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between text-left">
                  <p className="text-xs font-black text-slate-800">{p.name}</p>
                  <span className="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-600">{p.badgeText}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 🚀 ⚡ SEO ENGINE ZONE (FULLY BOUND & STYLED) */}
      <div className="bg-blue-50/40 p-5 rounded-xl border border-blue-100/70 space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-blue-700">🔍 Search Engine Optimization (SEO Zone)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">SEO Meta Title (Google Header Tag)</label>
            <input 
              type="text" 
              value={metaTitle} 
              onChange={(e) => setMetaTitle(e.target.value)} 
              placeholder="Keep under 60 characters for best CTR"
              className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 font-semibold text-sm outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Focus Ranking Keywords</label>
            <input 
              type="text" 
              value={keywords} 
              onChange={(e) => setKeywords(e.target.value)} 
              placeholder="e.g., GST portal updates, ITR 2026 due date"
              className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 font-semibold text-sm outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">SEO Meta Description (Custom Override Snippet)</label>
          <textarea 
            rows={2}
            value={metaDesc} 
            onChange={(e) => setMetaDesc(e.target.value)} 
            placeholder="Recommended length: 150-160 characters for high ranking results..."
            className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>
      </div>

      {/* Tags, Publish Controls & Submit Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 items-center">
        <div>
          <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Internal Filter Tags</label>
          <input 
            type="text" 
            value={tags} 
            onChange={(e) => setTags(e.target.value)} 
            placeholder="Tags (Comma separated, e.g., ITR, GST)" 
            className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 font-semibold text-sm outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>
        <label className="flex items-center space-x-2 text-xs font-bold uppercase text-slate-700 cursor-pointer select-none mt-5">
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="w-4 h-4 accent-blue-600 rounded cursor-pointer" /> 
          <span>Immediately Publish</span>
        </label>
        <label className="flex items-center space-x-2 text-xs font-bold uppercase text-slate-700 cursor-pointer select-none mt-5">
          <input type="checkbox" checked={showAds} onChange={(e) => setShowAds(e.target.checked)} className="w-4 h-4 accent-blue-600 rounded cursor-pointer" /> 
          <span>Enable Ads</span>
        </label>
      </div>

      <button type="submit" disabled={loading} className="w-full p-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest rounded-lg shadow-md transition-all duration-150 cursor-pointer">
        {loading ? "Processing Dynamic Request..." : editingBlogId ? "⚡ Update News Article" : "⚡ Broadcast Article to Public"}
      </button>
    </form>
  );
}