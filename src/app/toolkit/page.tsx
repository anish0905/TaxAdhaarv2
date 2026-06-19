"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpRight, ArrowLeft, Search, ShoppingBag, BookOpen, CreditCard, Laptop } from "lucide-react";
import PublicNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ==========================================
// 🔄 1. INTERNAL CAROUSEL CARD COMPONENT
// ==========================================
function CategoryCard({ cat, itemQuantity, getCategoryIcon, onClick }: { cat: any; itemQuantity: number; getCategoryIcon: any; onClick: () => void }) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  
  const imagesList = Array.isArray(cat.images) && cat.images.length > 0 
    ? cat.images 
    : [cat.image || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400"];

  useEffect(() => {
    if (imagesList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImgIndex((prevIndex) => (prevIndex + 1) % imagesList.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [imagesList.length]);

  return (
    <div 
      onClick={onClick}
      className="bg-white border border-slate-200/80 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-900/30 transition-all duration-500 cursor-pointer group flex flex-col justify-between h-80 relative"
    >
      <div className="h-44 w-full overflow-hidden relative border-b border-slate-100 bg-slate-50">
        {imagesList.map((imgUrl: string, idx: number) => (
          <img 
            key={idx}
            src={imgUrl} 
            alt={`${cat.name} banner ${idx}`}
            className={`absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ${
              idx === currentImgIndex ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 z-0"
            }`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400";
            }}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent z-20" />
        
        <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-xl text-[8px] font-black uppercase tracking-widest text-slate-900 border border-white shadow-sm z-30">
          {getCategoryIcon(cat.name)} Explore Department
        </span>

        {imagesList.length > 1 && (
          <div className="absolute bottom-4 right-4 flex gap-1 z-30">
            {imagesList.map((_: any, idx: number) => (
              <span 
                key={idx} 
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === currentImgIndex ? "w-3 bg-white" : "w-1 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between bg-white z-20">
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-sm md:text-base text-slate-950 tracking-tight group-hover:text-blue-600 transition-colors">
              {cat.name}
            </h3>
            <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
              {itemQuantity} Nodes
            </span>
          </div>
          <p className="text-slate-500 text-[11px] font-medium leading-relaxed line-clamp-2">
            {cat.description || "No sub-text deployed for this topic registry."}
          </p>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 🏛️ 2. CORE TOOLKIT CONTENT INNER LAYOUT
// ==========================================
function ToolkitContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryQuery = searchParams.get("category");

  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEcosystemData = async () => {
    setLoading(true);
    try {
      const prodRes = await fetch("/api/toolkit");
      const prodData = await prodRes.json();
      setProducts(Array.isArray(prodData) ? prodData : []);

      const catRes = await fetch("/api/categories");
      const catData = await catRes.json();
      
      if (Array.isArray(catData)) {
        setCategories(catData);
      } else if (catData.categories && Array.isArray(catData.categories)) {
        setCategories(catData.categories);
      } else if (catData.data && Array.isArray(catData.data)) {
        setCategories(catData.data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Ecosystem Hydration Failure:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEcosystemData();
  }, []);

  const activeCategoryData = categories.find(c => c.slug === categoryQuery);

  const displayedProducts = products.filter(p => {
    const productCatId = p.category?._id || p.category;
    const matchesCategory = activeCategoryData ? productCatId === activeCategoryData._id : true;
    
    const matchesSearch = 
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (catName: string) => {
    const name = catName?.toLowerCase() || "";
    if (name.includes("book") || name.includes("finance") || name.includes("crypto") || name.includes("money")) return <BookOpen size={10} />;
    if (name.includes("card") || name.includes("tax") || name.includes("wealth") || name.includes("credit")) return <CreditCard size={10} />;
    return <Laptop size={10} />;
  };

  const handleCategoryClick = (slug: string) => {
    router.push(`/toolkit?category=${slug}`, { scroll: false });
  };

  const handleClearCategory = () => {
    setSearchQuery("");
    router.push("/toolkit", { scroll: false });
  };

  // 📝 HTML टैग्स को साफ करके प्लेन टेक्स्ट डिस्क्रिप्शन रेंडर करने के लिए हेल्पर नोड
  const stripHtmlTags = (htmlString: string) => {
    if (!htmlString) return "";
    return htmlString.replace(/<\/?[^>]+(>|$)/g, "");
  };

  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 pb-20 space-y-8">
      {/* PREMIUM DYNAMIC HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200/60 pb-6 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {categoryQuery && (
              <button 
                onClick={handleClearCategory}
                className="mr-1 p-2 bg-white border border-slate-200 rounded-xl hover:border-slate-400 transition-all text-slate-700 shadow-sm"
              >
                <ArrowLeft size={12} />
              </button>
            )}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-900 text-white rounded text-[8px] font-black uppercase tracking-widest">
              <ShoppingBag size={8} className="text-amber-400 animate-pulse" /> Ecosystem Store v3
            </div>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">
            {activeCategoryData ? `${activeCategoryData.name} Hub` : "The TaxAdhaar Ecosystem Store"}
          </h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider leading-relaxed">
            {activeCategoryData ? activeCategoryData.description : "Premium tools, finance bundles, and curated digital assets vetted by technical counsel nodes."}
          </p>
        </div>
        
        {!categoryQuery && (
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.25em] hidden md:block">
            Centralized Node Matrix
          </span>
        )}
      </div>

      {/* ⏳ CORE LOADING STATE */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white border border-slate-200/60 rounded-[2rem] h-80 p-5 space-y-4 animate-pulse">
              <div className="bg-slate-100 h-40 w-full rounded-2xl" />
              <div className="h-4 bg-slate-100 rounded w-2/3" />
              <div className="h-3 bg-slate-100 rounded w-full" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Categories Grid (Only shows if no category filter query is active) */}
          {!activeCategoryData && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {categories.map((cat) => {
                const itemQuantity = products.filter(p => {
                  const productCatId = p.category?._id || p.category;
                  return productCatId === cat._id;
                }).length;

                return (
                  <CategoryCard 
                    key={cat._id}
                    cat={cat}
                    itemQuantity={itemQuantity}
                    getCategoryIcon={getCategoryIcon}
                    onClick={() => handleCategoryClick(cat.slug)}
                  />
                );
              })}
            </div>
          )}

          {/* Products View List Inside Selected Category */}
          {activeCategoryData && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="relative max-w-md shadow-sm rounded-xl overflow-hidden">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  placeholder={`Search inside ${activeCategoryData.name || "department"}...`} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-200 focus:border-slate-950 outline-none text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedProducts.map((p) => {
                  const isTaxmannGST = p.title?.toLowerCase().includes("taxmann") && p.title?.toLowerCase().includes("gst");
                  
                  const displayBadge = isTaxmannGST ? "🔥 Best Seller | Real-Time" : (p.badgeText || "Ecosystem");
                  
                  // 🛡️ Safe HTML Filtering Zone
                  const rawDescription = isTaxmannGST 
                    ? "For Chartered Accountants, Tax Practitioners, corporate financial directors, and e-commerce business owners navigating India's dynamic indirect tax system, guesswork is a massive liability. Vetted reference engine."
                    : p.description;
                  const displayDescription = stripHtmlTags(rawDescription);

                  return (
                    <div 
                      key={p._id || p.id} 
                      // 🎯 1. पूरे कार्ड पर क्लिक करने से यूजर इंटरनल डायनेमिक स्लग पेज पर रूट करेगा
                      onClick={() => router.push(`/toolkit/${p.slug}`)}
                      className="bg-white border border-slate-200/80 rounded-[2rem] p-5 shadow-sm flex flex-col sm:flex-row gap-5 items-center hover:border-slate-950/20 hover:shadow-xl transition-all duration-500 cursor-pointer group relative min-h-36"
                    >
                      {/* Product Image Node */}
                      <div className="w-24 h-24 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 flex-shrink-0 relative">
                        <img 
                          src={p.image} 
                          alt={p.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=200";
                          }}
                        />
                      </div>

                      {/* Content Meta Area */}
                      <div className="flex-1 flex flex-col justify-between h-full w-full min-h-[6.5rem] py-0.5">
                        <div className="space-y-1.5">
                          <span className={`inline-block text-[7px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded border font-mono ${
                            isTaxmannGST ? "bg-amber-50 border-amber-200 text-amber-700 font-bold animate-pulse" : "bg-slate-50 text-slate-800 border-slate-200/60"
                          }`}>
                            {displayBadge}
                          </span>
                          
                          {/* 🎯 2. टाइटल पर भी होवर इफ़ेक्ट एक्टिव रहेगा */}
                          <h3 className="font-black text-xs md:text-sm text-slate-950 tracking-tight leading-snug group-hover:text-blue-600 transition-colors">
                            {p.title}
                          </h3>
                          
                          <p className="text-slate-500 text-[11px] font-medium leading-relaxed line-clamp-2">
                            {displayDescription}
                          </p>
                        </div>

                        {/* 🎯 3. ACTIONS BUTTON BAR: अब यहाँ अमेज़न लिंक की जगह "View Details" का प्रीमियम लूप है */}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50 w-full">
                          <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-blue-600 group-hover:translate-x-0.5 transition-transform">
                            View Blueprint Detail <ArrowUpRight size={11} />
                          </span>
                          
                          <span className="text-[9px] font-black uppercase tracking-wider bg-slate-100 group-hover:bg-slate-950 group-hover:text-white px-3 py-1.5 rounded-xl text-slate-600 transition-all duration-300">
                            Open Node
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {displayedProducts.length === 0 && (
                <div className="text-center bg-white border border-slate-200/50 rounded-[2rem] p-12 border-dashed">
                  <p className="text-xs font-black text-slate-800 uppercase tracking-wider">No active deployment specs found.</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ==========================================
// 🏛️ 3. MAIN WRAPPER WITH SUSPENSE BOUNDARY
// ==========================================
export default function AdvancedToolkit() {
  return (
    <main className="bg-[#F8FAFC] min-h-screen text-slate-950 font-sans antialiased tracking-tight">
      <PublicNavbar />
      <Suspense fallback={
        <div className="max-w-5xl mx-auto px-6 pt-32 pb-20 text-center text-xs font-bold text-slate-400">
          Hydrating Ecosystem Layout...
        </div>
      }>
        <ToolkitContent />
      </Suspense>
      <Footer />
    </main>
  );
}