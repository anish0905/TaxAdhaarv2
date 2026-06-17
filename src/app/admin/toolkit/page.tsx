"use client";
import { useState, useEffect } from "react";
import { Trash2, Edit2, Plus, Upload, Layers, RefreshCw, Search, ListPlus, Link2 } from "lucide-react";

export default function AdminToolkitPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
  const [editMode, setEditMode] = useState<string | null>(null);
  
  // 🚀 TABS AND SEARCH STATE
  const [activeTab, setActiveTab] = useState<"manage" | "add">("manage");
  const [searchQuery, setSearchQuery] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState(""); // लाइव यूआरएल पेस्ट करने के लिए स्टेट

  // Form Initial State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    badgeText: "Amazon",
    affiliateLink: "",
    image: "",
    category: "",
    displayOrder: 0,
    isActive: true
  });

  // 🔄 FETCH ALL PRODUCTS FROM UPSTASH REDIS / MONGODB
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/toolkit");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Fetch Products Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 📁 FETCH AVAILABLE CATEGORIES WITH SAFEGUARD
  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setCategories(data);
        } else if (data.categories && Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else if (data.data && Array.isArray(data.data)) {
          setCategories(data.data);
        } else {
          setCategories([]);
        }
      }
    } catch (err) {
      console.error("Fetch Categories Error:", err);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // ☁️ 1. METHOD A: LOCAL FILE SELECTION UPLOAD
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageLoading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "toolkit_images"); // तुम्हारा Unsigned Preset नाम
    data.append("folder", "toolkit_images"); // Target Cloud Folder

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: data }
      );
      const fileData = await res.json();
      if (fileData.secure_url) {
        setFormData(prev => ({ ...prev, image: fileData.secure_url }));
        setImageUrlInput(""); // Clear URL input if a file is uploaded
      } else {
        console.error("Upload error logs:", fileData);
        alert(fileData.error?.message || "Local upload validation failed.");
      }
    } catch (err) {
      alert("Cloudinary Local Upload Crashed!");
    } finally {
      setImageLoading(false);
    }
  };

  // ☁️ 2. METHOD B: DIRECT IMAGE URL FETCH & UPLOAD TO CLOUDINARY
  const handleImageUrlUpload = async () => {
    if (!imageUrlInput) return alert("Please paste an image URL first, Anish bhai!");

    setImageLoading(true);
    const data = new FormData();
    data.append("file", imageUrlInput); 
    data.append("upload_preset", "toolkit_images"); // तुम्हारा Unsigned Preset नाम
    data.append("folder", "toolkit_images"); // Target Cloud Folder

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: data }
      );
      const fileData = await res.json();
      if (fileData.secure_url) {
        setFormData(prev => ({ ...prev, image: fileData.secure_url }));
        alert("Image successfully fetched and cached to Cloudinary ecosystem!");
      } else {
        console.error("Cloudinary Link URL Error Logs:", fileData);
        alert(fileData.error?.message || "Failed to upload from URL. Double-check your preset type!");
      }
    } catch (err) {
      alert("Cloudinary Link Fetching Failed!");
    } finally {
      setImageLoading(false);
    }
  };

  // 🚀 CREATE OR UPDATE ACTION (Triggers Upstash Cache Flush)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) return alert("Image asset requirement missing!");
    if (!formData.category) return alert("Please select a department category!");

    const url = editMode ? `/api/toolkit/${editMode}` : "/api/toolkit";
    const method = editMode ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert(editMode ? "Product configuration updated!" : "New product deployed successfully!");
        resetForm();
        fetchProducts();
        setActiveTab("manage");
      }
    } catch (err) {
      console.error("Submission Failure:", err);
    }
  };

  // 🗑️ DELETE PROTOCOL
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to flush this product node from the core registry?")) return;

    try {
      const res = await fetch(`/api/toolkit/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Product flushed & Redis pipeline cleared!");
        fetchProducts();
      }
    } catch (err) {
      console.error("Purge Error:", err);
    }
  };

  const startEdit = (product: any) => {
    setEditMode(product._id);
    setFormData({
      title: product.title,
      slug: product.slug,
      description: product.description,
      badgeText: product.badgeText,
      affiliateLink: product.affiliateLink,
      image: product.image,
      category: product.category?._id || product.category,
      displayOrder: product.displayOrder || 0,
      isActive: product.isActive
    });
    setImageUrlInput("");
    setActiveTab("add");
  };

  const resetForm = () => {
    setEditMode(null);
    setImageUrlInput("");
    setFormData({
      title: "",
      slug: "",
      description: "",
      badgeText: "Amazon",
      affiliateLink: "",
      image: "",
      category: "",
      displayOrder: 0,
      isActive: true
    });
  };

  // 🔍 REAL-TIME FILTERING LOGIC
  const filteredProducts = Array.isArray(products) 
    ? products.filter(p => 
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.slug?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 text-slate-950 font-sans antialiased tracking-tight">
      <div className="max-w-4xl mx-auto space-y-6 pt-6">
        
        {/* Top Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">Ecosystem Toolkit Manager</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Manage Products, Tech Tools & Amazon Affiliate Hooks</p>
          </div>
          <button onClick={fetchProducts} className="w-fit p-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:text-slate-950 shadow-sm transition-all">
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* 📑 TABS CONTROLLER BAR */}
        <div className="flex bg-slate-200/60 p-1 rounded-2xl w-full sm:w-fit gap-1">
          <button 
            onClick={() => setActiveTab("manage")}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all w-1/2 sm:w-auto ${activeTab === "manage" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
          >
            <Layers size={13} />
            Manage Registry ({products.length})
          </button>
          <button 
            onClick={() => setActiveTab("add")}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all w-1/2 sm:w-auto ${activeTab === "add" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
          >
            <ListPlus size={13} />
            {editMode ? "Modify Node" : "Add Product"}
          </button>
        </div>

        {/* --- TAB CONTENT AREA --- */}
        <div className="bg-white rounded-[2rem] border border-slate-200/80 p-5 md:p-8 shadow-sm">
          
          {/* 🔍 TAB 1: MANAGE REGISTRY VIEW */}
          {activeTab === "manage" && (
            <div className="space-y-5">
              {/* SEARCH INPUT BAR */}
              <div className="relative flex items-center">
                <Search size={14} className="absolute left-3.5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search products by name or router slug..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-slate-950 text-slate-900 transition-all placeholder:text-slate-400"
                />
              </div>

              {loading ? (
                <p className="text-xs text-slate-400 animate-pulse py-12 text-center font-bold uppercase tracking-wider">Syncing from Upstash Cache Cluster...</p>
              ) : filteredProducts.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => (
                    <div key={p._id} className="flex items-center justify-between py-4 gap-4 group hover:bg-slate-50/50 px-2 rounded-xl transition-all">
                      <img src={p.image} alt="" className="w-11 h-11 rounded-xl object-cover border bg-slate-50 shrink-0" />
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-xs text-slate-900 tracking-tight truncate leading-tight">{p.title}</h4>
                        <p className="text-[10px] text-slate-400 font-bold truncate tracking-wide mt-1 uppercase">
                          Category: <span className="text-slate-600">{p.category?.name || "Uncategorized"}</span> <span className="mx-1 text-slate-200">|</span> Slug: /{p.slug}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button onClick={() => startEdit(p)} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded-lg transition-all">
                          <Edit2 size={12} />
                        </button>
                        <button onClick={() => handleDelete(p._id)} className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg transition-all">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs font-bold uppercase tracking-wider">No matching nodes found in registry.</div>
              )}
            </div>
          )}

          {/* ➕ TAB 2: ADD / EDIT FORM VIEW */}
          {activeTab === "add" && (
            <div className="space-y-6 max-w-xl mx-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="font-black text-xs uppercase tracking-widest text-slate-800">
                  {editMode ? "⚙️ Configuration Sub-Matrix" : "🚀 Deployment Specs"}
                </h2>
                {editMode && (
                  <button onClick={resetForm} className="text-[9px] font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Product Name</label>
                    <input required type="text" placeholder="e.g., Keychron K2 Keyboard" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:border-slate-950 text-slate-900" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase text-slate-400 tracking-wider">SEO Router Slug</label>
                    <input required type="text" placeholder="best-developer-keyboard" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:border-slate-950 text-slate-900" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Department Category Topic</label>
                  <select 
                    required
                    value={formData.category} 
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:border-slate-950 text-slate-900 cursor-pointer"
                  >
                    <option value="">Select Target Topic</option>
                    {Array.isArray(categories) && categories.map((cat: any) => (
                      <option key={cat._id} value={cat._id}>📁 {cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Product Description</label>
                  <textarea required rows={3} placeholder="Write precise copy optimized for indexing..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:border-slate-950 text-slate-900 resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase text-slate-400 tracking-wider">UI Badge Text</label>
                    <input type="text" placeholder="Best Seller" value={formData.badgeText} onChange={(e) => setFormData({...formData, badgeText: e.target.value})} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:border-slate-950 text-slate-900" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Display Order</label>
                    <input type="number" value={formData.displayOrder} onChange={(e) => setFormData({...formData, displayOrder: Number(e.target.value)})} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:border-slate-950 text-slate-900" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Affiliate Hook Link</label>
                  <input required type="url" placeholder="https://amzn.to/..." value={formData.affiliateLink} onChange={(e) => setFormData({...formData, affiliateLink: e.target.value})} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:border-slate-950 text-slate-900" />
                </div>

                {/* ☁️ DUAL-METHOD IMAGE ASSET PIPELINE (FIXED & SYNCED) */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <label className="text-[8px] font-black uppercase text-slate-400 tracking-wider block">Image Asset Pipeline (Cloudinary)</label>
                  
                  {/* Option A: Paste URL Link */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-slate-500 block">Option A: Paste Live Image URL (e.g., Amazon link)</span>
                    <div className="flex gap-2">
                      <div className="relative flex-1 flex items-center">
                        <Link2 size={12} className="absolute left-3 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="Paste image address (https://...)" 
                          value={imageUrlInput}
                          onChange={(e) => setImageUrlInput(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:border-slate-950 text-slate-900"
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={handleImageUrlUpload}
                        disabled={imageLoading || !imageUrlInput}
                        className="px-3 bg-slate-950 hover:bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-wider disabled:bg-slate-300 transition-all"
                      >
                        Fetch & Host
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 py-1">
                    <span className="h-[1px] bg-slate-200 flex-1"></span>
                    <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">OR</span>
                    <span className="h-[1px] bg-slate-200 flex-1"></span>
                  </div>

                  {/* Option B: Upload File From Device */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-slate-500 block">Option B: Upload File Asset From Device</span>
                    <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 border-dashed relative">
                      <Upload size={14} className="text-slate-400 shrink-0" />
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                      <span className="text-[10px] font-bold text-slate-500">Select Local File</span>
                    </div>
                  </div>

                  {/* Loading & Live Preview Dashboard */}
                  {imageLoading && (
                    <p className="text-[10px] font-black text-blue-600 animate-pulse tracking-wide uppercase">Processing Image Matrix on Cloudinary Core...</p>
                  )}
                  {formData.image && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[8px] font-black uppercase text-emerald-600 tracking-wider block">✓ Active Cloudinary Storage Node:</span>
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden border bg-white shadow-inner">
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}
                </div>

                <button type="submit" disabled={imageLoading} className="w-full py-3.5 bg-slate-950 hover:bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all mt-4 disabled:bg-slate-400">
                  {editMode ? "Confirm Configuration" : "Deploy Matrix Node"}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}