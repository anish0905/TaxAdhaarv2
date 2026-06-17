"use client";
import { useState } from "react";
import { Upload, Link2, Trash2, Edit2, FolderPlus, Layers, X } from "lucide-react";

export default function CategoryManager({ categories, fetchCategories, setMessage }: any) {
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  
  // ⚙️ EDIT MODE STATE MANAGERS
  const [editModeId, setEditModeId] = useState<string | null>(null);

  // Form Field States
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catDesc, setCatDesc] = useState("");

  // ऑटोमैटिक स्लग जनरेटर भाई
  const handleNameChange = (nameVal: string) => {
    setCatName(nameVal);
    if (!editModeId) {
      setCatSlug(
        nameVal
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, "")
      );
    }
  };

  // ☁️ METHOD A: PASTE LIVE IMAGE URL TO CLOUDINARY
  const handleImageUrlUpload = async () => {
    if (!imageUrlInput) return alert("Please paste an image URL first, Anish bhai!");
    if (uploadedImages.length >= 4) return alert("Maximum 4 image matrix limit reached!");

    setImageLoading(true);
    const data = new FormData();
    data.append("file", imageUrlInput);
    data.append("upload_preset", "toolkit_images"); 
    data.append("folder", "toolkit_images");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: data }
      );
      const fileData = await res.json();
      if (fileData.secure_url) {
        setUploadedImages(prev => [...prev, fileData.secure_url]);
        setImageUrlInput("");
      } else {
        alert(fileData.error?.message || "Failed to host from remote URL.");
      }
    } catch (err) {
      alert("Cloudinary Link Fetching Failed!");
    } finally {
      setImageLoading(false);
    }
  };

  // ☁️ METHOD B: LOCAL FILE UPLOAD TO CLOUDINARY
  const handleLocalFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (uploadedImages.length >= 4) return alert("Maximum 4 image matrix limit reached!");

    setImageLoading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "toolkit_images"); 
    data.append("folder", "toolkit_images");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: data }
      );
      const fileData = await res.json();
      if (fileData.secure_url) {
        setUploadedImages(prev => [...prev, fileData.secure_url]);
      } else {
        alert(fileData.error?.message || "Local upload validation failed.");
      }
    } catch (err) {
      alert("Cloudinary Local Upload Crashed!");
    } finally {
      setImageLoading(false);
    }
  };

  const removeImageFromQueue = (indexToRemove: number) => {
    setUploadedImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // 🚀 CREATE OR UPDATE ACTION TRIGGER
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadedImages.length === 0) return alert("Please hook at least 1 image for the carousel grid!");

    setLoading(true);
    const url = editModeId ? `/api/categories/${editModeId}` : "/api/categories";
    const method = editModeId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: catName, 
          slug: catSlug, 
          description: catDesc,
          images: uploadedImages 
        }),
      });
      if (res.ok) {
        setMessage(editModeId ? "📁 कैटेगरी कॉन्फ़िगरेशन अपडेट हो गया!" : "📁 नई कैटेगरी सफलतापूर्वक रजिस्टर हो गई!");
        resetForm();
        fetchCategories();
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.message || "Submission Failed"}`);
      }
    } catch (err) {
      console.error("Category submission failure:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ DELETE METHOD TRIGGER
  const handleCategoryDelete = async (id: string) => {
    if (!confirm("Are you sure you want to flush this category? All mapped items will lose alignment!")) return;

    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage("🗑️ कैटेगरी फ्लश कर दी गई है और रेडिस पाइपलाइन क्लियर है!");
        fetchCategories();
        if (editModeId === id) resetForm();
      } else {
        alert("Failed to flush category node.");
      }
    } catch (err) {
      console.error("Purge Error:", err);
    }
  };

  // ⚙️ INITIALIZE EDIT MATRIX
  const startCategoryEdit = (cat: any) => {
    setEditModeId(cat._id);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatDesc(cat.description || "");
    setUploadedImages(Array.isArray(cat.images) ? cat.images : [cat.image].filter(Boolean));
  };

  const resetForm = () => {
    setEditModeId(null);
    setCatName("");
    setCatSlug("");
    setCatDesc("");
    setUploadedImages([]);
    setImageUrlInput("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-black">
      
      {/* LEFT GRID: DYNAMIC SUBMIT & UPDATE FORM */}
      <form onSubmit={handleCategorySubmit} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm h-fit space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xs font-black uppercase tracking-wider text-purple-600 flex items-center gap-1.5">
            <FolderPlus size={13} /> {editModeId ? "⚙️ Edit Topic Matrix" : "📁 Create New Topic Registry"}
          </h2>
          {editModeId && (
            <button type="button" onClick={resetForm} className="text-rose-600 hover:bg-rose-50 p-1 rounded-lg transition-all">
              <X size={14} />
            </button>
          )}
        </div>
        
        <div className="space-y-1">
          <label className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Category Name</label>
          <input type="text" required value={catName} onChange={(e) => handleNameChange(e.target.value)} placeholder="e.g., Personal Finance" className="w-full px-3 py-2 border rounded-xl text-sm bg-slate-50 outline-none focus:border-purple-600 text-slate-900" />
        </div>

        <div className="space-y-1">
          <label className="text-[8px] font-black uppercase text-slate-400 tracking-wider">SEO Unique Slug</label>
          <input type="text" required value={catSlug} onChange={(e) => setCatSlug(e.target.value)} placeholder="personal-finance" className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-100 font-mono text-slate-600 outline-none" />
        </div>

        <div className="space-y-1">
          <label className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Topic Description</label>
          <textarea rows={2} value={catDesc} onChange={(e) => setCatDesc(e.target.value)} placeholder="Write precise copy for frontend slider view..." className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50 outline-none focus:border-purple-600 text-slate-900 resize-none" />
        </div>

        {/* DUAL-METHOD MULTI-IMAGE PIPELINE */}
        <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider block">Carousel Image Assets ({uploadedImages.length}/4)</span>
          
          <div className="flex gap-1.5">
            <div className="relative flex-1 flex items-center">
              <Link2 size={11} className="absolute left-2.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Paste remote image address..." 
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="w-full pl-7 pr-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold outline-none text-slate-900"
              />
            </div>
            <button 
              type="button"
              onClick={handleImageUrlUpload}
              disabled={imageLoading || !imageUrlInput || uploadedImages.length >= 4}
              className="px-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[9px] font-black uppercase disabled:bg-slate-300 transition-all"
            >
              Fetch
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[8px] font-black text-slate-300">
            <span className="h-[1px] bg-slate-200 flex-1"></span>OR<span className="h-[1px] bg-slate-200 flex-1"></span>
          </div>

          <div className="relative flex items-center justify-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200 border-dashed cursor-pointer">
            <Upload size={12} className="text-slate-400" />
            <span className="text-[10px] font-bold text-slate-500">Upload Local File Asset</span>
            <input type="file" accept="image/*" disabled={uploadedImages.length >= 4} onChange={handleLocalFileUpload} className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed" />
          </div>

          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-4 gap-2 pt-1 border-t border-slate-200">
              {uploadedImages.map((imgUrl, index) => (
                <div key={index} className="relative w-full aspect-square bg-white rounded-lg border overflow-hidden group shadow-inner">
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImageFromQueue(index)} className="absolute inset-0 bg-rose-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {imageLoading && (
            <p className="text-[9px] font-black text-purple-600 animate-pulse uppercase tracking-wider">Syncing node to Cloudinary node cluster...</p>
          )}
        </div>

        <button type="submit" disabled={loading || imageLoading || uploadedImages.length === 0} className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl disabled:bg-slate-300 shadow-sm transition-all">
          {loading ? "Processing Registry..." : editModeId ? "Update Category Topic" : "Save Category Topic"}
        </button>
      </form>

      {/* RIGHT GRID MODULE: AVAILABLE CATEGORIES WITH ACTION NODES */}
      <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-4 flex items-center gap-1.5">
          <Layers size={13} className="text-slate-500" /> Available Core Categories ({categories.length})
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[520px] overflow-y-auto pr-1">
          {categories.map((cat: any) => {
            const catImages = Array.isArray(cat.images) && cat.images.length > 0 ? cat.images : [cat.image].filter(Boolean);
            
            return (
              <div key={cat._id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col justify-between group relative hover:border-slate-300 transition-all">
                <div className="flex gap-3 items-center">
                  {/* Category Thumbnail */}
                  <div className="w-12 h-12 rounded-xl border overflow-hidden shrink-0 bg-white">
                    <img src={catImages[0] || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=100"} alt="" className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <h4 className="font-black text-xs text-slate-900 truncate tracking-tight">{cat.name}</h4>
                    <p className="text-[9px] font-mono text-slate-400 mt-0.5 truncate">Slug: /{cat.slug}</p>
                    
                    {/* Image Node Count Dots */}
                    <div className="flex gap-0.5 mt-1">
                      {catImages.map((_: any, i: number) => (
                        <span key={i} className="w-1.5 h-1 bg-purple-400 rounded-full"></span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 🛠️ ACTION BUTTON OVERLAY PANEL */}
                <div className="flex justify-end gap-1.5 mt-3 pt-2.5 border-t border-slate-200/60">
                  <button 
                    type="button" 
                    onClick={() => startCategoryEdit(cat)} 
                    className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-1 bg-white border rounded-lg text-slate-600 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm"
                  >
                    <Edit2 size={10} /> Edit
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleCategoryDelete(cat._id)} 
                    className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-1 bg-white border rounded-lg text-slate-600 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm"
                  >
                    <Trash2 size={10} /> Flush
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}