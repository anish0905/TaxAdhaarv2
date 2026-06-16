"use client";
import { useState } from "react";

export default function CategoryManager({ categories, fetchCategories, setMessage, handleCatNameChange, newCatName, newCatSlug, newCatDesc, setNewCatSlug, setNewCatDesc }: any) {
  const [loading, setLoading] = useState(false);

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCatName, slug: newCatSlug, description: newCatDesc }),
      });
      if (res.ok) {
        setMessage("📁 नई टैक्स कैटेगरी सफलतापूर्वक रजिस्टर हो गई है!");
        fetchCategories();
      }
    } catch (err) {
      setMessage("❌ सर्वर एरर आया।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-black">
      <form onSubmit={handleCategorySubmit} className="bg-white p-5 rounded-xl border border-slate-200 h-fit space-y-4">
        <h2 className="text-xs font-black uppercase tracking-wider text-purple-600">📁 Create New Topic</h2>
        <input type="text" required value={newCatName} onChange={(e) => handleCatNameChange(e.target.value)} placeholder="Category Name" className="w-full p-2 border rounded-lg text-sm bg-slate-50 outline-none" />
        <input type="text" required value={newCatSlug} onChange={(e) => setNewCatSlug(e.target.value)} placeholder="Slug" className="w-full p-2 border rounded-lg text-xs bg-slate-100 font-mono text-slate-600" />
        <textarea rows={3} value={newCatDesc} onChange={(e) => setNewCatDesc(e.target.value)} placeholder="Description" className="w-full p-2 border rounded-lg text-xs bg-slate-50 outline-none" />
        <button type="submit" className="w-full p-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold uppercase rounded-lg">Save Category Topic</button>
      </form>
      <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-4">Available Categories ({categories.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-1">
          {categories.map((cat: any) => (
            <div key={cat._id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="font-extrabold text-sm text-slate-900">{cat.name}</h4>
              <p className="text-[10px] font-mono text-slate-400 mt-0.5">Slug: /{cat.slug}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}