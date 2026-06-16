"use client";

interface BlogListManagerProps {
  blogs: any[];
  fetchAllBlogs: () => void;
  startEditBlog: (blog: any) => void;
  setMessage: (msg: string) => void;
}

export default function BlogListManager({ blogs, fetchAllBlogs, startEditBlog, setMessage }: BlogListManagerProps) {
  
  // 🗑️ Handle Permanently Deleting an Article
  const handleBlogDelete = async (slug: string) => {
    if (!confirm("🚨 सावधान! क्या आप इस आर्टिकल को हमेशा के लिए डिलीट करना चाहते हैं? इसके बाद यह रिकवर नहीं होगा!")) return;
    try {
      const res = await fetch(`/api/blogs/${slug}`, { method: "DELETE" });
      const result = await res.json();
      
      if (result.success) {
        setMessage("🗑️ आर्टिकल सफलतापूर्वक पोर्टल से हटा दिया गया है और कैशे साफ़ हो गया है!");
        fetchAllBlogs(); // रिपोजिटरी लिस्ट रिफ्रेश करें
      } else {
        setMessage(`❌ डिलीट फेल हुआ: ${result.message || "अज्ञात कारण"}`);
      }
    } catch (err) {
      console.error("Delete handler error:", err);
      alert("डिलीट करने में कोई समस्या आई!");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs text-black">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
          📋 Live Article Repository ({blogs.length})
        </h3>
        <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
          Central Catalog
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider">
              <th className="p-3">Banner</th>
              <th className="p-3">Title & Category</th>
              <th className="p-3">Stats</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {blogs.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400 italic font-medium">
                  पोर्टल पर फ़िलहाल कोई खबर उपलब्ध नहीं है। "Write Blog" टैब से पहली खबर लाइव करें! ✨
                </td>
              </tr>
            )}
            {blogs.map((b) => (
              <tr key={b._id} className="hover:bg-slate-50/80 transition duration-150 group">
                {/* 1. Blog Main Image Thumbnail */}
                <td className="p-3 w-20">
                  <div className="w-16 h-10 rounded-md overflow-hidden border border-slate-200 bg-slate-100">
                    <img 
                      src={b.mainImage || "/fallback-banner.jpg"} 
                      alt="news banner" 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-200" 
                    />
                  </div>
                </td>

                {/* 2. Title, Category and Publish Status Badges */}
                <td className="p-3 max-w-xs md:max-w-md">
                  <p className="font-extrabold text-slate-900 text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {b.title}
                  </p>
                  <div className="flex items-center space-x-2 mt-1.5">
                    <span className="bg-blue-50 text-blue-600 border border-blue-100/60 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-tight">
                      {b.category?.name || "General Updates"}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      b.isPublished 
                        ? "bg-green-50 text-green-600 border border-green-100/60" 
                        : "bg-amber-50 text-amber-500 border border-amber-100/60"
                    }`}>
                      {b.isPublished ? "● Live / Public" : "○ Draft / Invisible"}
                    </span>
                  </div>
                </td>

                {/* 3. Viral View Tracker Counter */}
                <td className="p-3 font-extrabold text-slate-500 whitespace-nowrap text-sm">
                  👁️ {b.views?.toLocaleString() || 0} <span className="text-[10px] font-normal text-slate-400">Reads</span>
                </td>

                {/* 4. Action Buttons (Edit/Delete Router Triggers) */}
                <td className="p-3">
                  <div className="flex items-center justify-center space-x-2">
                    <button 
                      type="button"
                      onClick={() => startEditBlog(b)}
                      className="px-3 py-1.5 bg-amber-50 text-amber-600 font-bold border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors duration-150 cursor-pointer text-xs"
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleBlogDelete(b.slug || b._id)}
                      className="px-3 py-1.5 bg-red-50 text-red-600 font-bold border border-red-200 rounded-lg hover:bg-red-100 transition-colors duration-150 cursor-pointer text-xs"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}