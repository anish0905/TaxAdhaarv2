"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowLeft, Search, ShoppingBag, Layers2, BookOpen, CreditCard, Laptop } from "lucide-react";
import PublicNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// 🔄 1. INTERNAL CAROUSEL CARD COMPONENT
// हर कैटेगरी कार्ड का अपना इंडिपेंडेंट ऑटो-प्ले टाइमर चलाने के लिए
function CategoryCard({ cat, itemQuantity, getCategoryIcon, onClick }: { cat: any; itemQuantity: number; getCategoryIcon: any; onClick: () => void }) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  
  // 💡 स्कीमा से images का एरे निकालो, अगर न हो तो कड़क फॉलबैक इमेज
  const imagesList = Array.isArray(cat.images) && cat.images.length > 0 
    ? cat.images 
    : [cat.image || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400"];

  // ⏱️ ऑटो-प्ले टाइमर: हर 2.5 सेकंड में इमेज बदलेगी भाई
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
      {/* Visual Category Image Carousel Banner */}
      <div className="h-44 w-full overflow-hidden relative border-b border-slate-100 bg-slate-50">
        
        {/* 📚 इमेजेस का स्मूथ फ़ेड ट्रांज़िशन */}
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

        {/* मॉडर्न ग्रेडिएंट ओवरले */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent z-20" />
        
        <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-xl text-[8px] font-black uppercase tracking-widest text-slate-900 border border-white shadow-sm z-30">
          {getCategoryIcon(cat.name)} Explore Department
        </span>

        {/* 🔴 स्लिक कैरोसेल डॉट्स (Indicators) */}
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

      {/* Info Text Block */}
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

// 🏛️ 2. MAIN ADVANCED TOOLKIT COMPONENT
export default function AdvancedToolkit() {
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔄 FETCH LIVE DATA (Upstash Redis Cache Sync)
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

  const activeCategoryData = categories.find(c => c._id === selectedCatId);

  // 🔍 REAL-TIME SEARCH & FILTER
  const displayedProducts = products.filter(p => {
    const productCatId = p.category?._id || p.category;
    const matchesCategory = selectedCatId ? productCatId === selectedCatId : true;
    
    const matchesSearch = 
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesCategory && matchesSearch;
  });

  // 🎨 SMART ICON PICKER
  const getCategoryIcon = (catName: string) => {
    const name = catName?.toLowerCase() || "";
    if (name.includes("book") || name.includes("finance")) return <BookOpen size={10} />;
    if (name.includes("card") || name.includes("tax") || name.includes("wealth")) return <CreditCard size={10} />;
    return <Laptop size={10} />;
  };

  return (
    <main className="bg-[#F8FAFC] min-h-screen text-slate-950 font-sans antialiased tracking-tight">
      <PublicNavbar />
      
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-20 space-y-8">
        
        {/* PREMIUM DYNAMIC HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200/60 pb-6 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {selectedCatId && (
                <button 
                  onClick={() => { setSelectedCatId(null); setSearchQuery(""); }}
                  className="mr-1 p-2 bg-white border border-slate-200 rounded-xl hover:border-slate-400 transition-all text-slate-700 shadow-sm hover:scale-102 active:scale-98"
                >
                  <ArrowLeft size={12} />
                </button>
              )}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-900 text-white rounded text-[8px] font-black uppercase tracking-widest">
                <ShoppingBag size={8} className="text-amber-400 animate-pulse" /> Ecosystem Store v3
              </div>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">
              {selectedCatId ? `${activeCategoryData?.name} Hub` : "The TaxAdhaar Ecosystem Store"}
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider leading-relaxed">
              {selectedCatId ? activeCategoryData?.description : "Premium tools, finance bundles, and curated digital assets vetted by technical counsel nodes."}
            </p>
          </div>
          
          {!selectedCatId && (
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
                <div className="h-3 bg-slate-100 rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* --- VIEW 1: CATEGORY SELECTION MODE WITH AUTOMATIC CAROUSEL --- */}
            {!selectedCatId && (
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
                      onClick={() => setSelectedCatId(cat._id)}
                    />
                  );
                })}
              </div>
            )}

            {/* --- VIEW 2: PRODUCTS MATRIX LIST MODE --- */}
            {selectedCatId && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Search within Category */}
                <div className="relative max-w-md shadow-sm rounded-xl overflow-hidden">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input 
                    type="text" 
                    placeholder={`Search inside ${activeCategoryData?.name || "department"}...`} 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-200 focus:border-slate-950 outline-none text-xs font-semibold transition-all"
                  />
                </div>

                {/* Product Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayedProducts.map((p) => (
                    <div 
                      key={p._id || p.id} 
                      className="bg-white border border-slate-200/80 rounded-[2rem] p-4 shadow-sm flex gap-4 items-center hover:border-slate-950/20 hover:shadow-md transition-all duration-300 relative group min-h-32"
                    >
                      {/* Left Side: Product Image */}
                      <div className="w-24 h-24 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 flex-shrink-0 relative">
                        <img 
                          src={p.image} 
                          alt={p.title} 
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=200&auto=format&fit=crop";
                          }}
                        />
                      </div>

                      {/* Right Side: Meta Details and Affiliate Redirect Button */}
                      <div className="flex-1 flex flex-col justify-between h-full min-h-[6rem] py-0.5">
                        <div className="space-y-1">
                          <div className="flex justify-between items-start">
                            <span className="text-[7px] font-black tracking-widest uppercase px-1.5 py-0.5 bg-slate-50 text-slate-800 rounded border border-slate-200/60 shadow-inner font-mono">
                              {p.badgeText || "Ecosystem"}
                            </span>
                          </div>
                          <h3 className="font-black text-xs md:text-sm text-slate-950 tracking-tight leading-snug group-hover:text-blue-600 transition-colors">
                            {p.title}
                          </h3>
                          <p className="text-slate-400 text-[10px] font-medium leading-relaxed line-clamp-2">
                            {p.description}
                          </p>
                        </div>

                        <Link 
                          href={p.affiliateLink} 
                          target="_blank" 
                          rel="sponsored nofollow" 
                          className="inline-flex w-fit mt-2 items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-all hover:translate-x-0.5"
                        >
                          Access Resource <ArrowUpRight size={11} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State Handler */}
                {displayedProducts.length === 0 && (
                  <div className="text-center bg-white border border-slate-200/50 rounded-[2rem] p-12 border-dashed">
                    <p className="text-xs font-black text-slate-800 uppercase tracking-wider">No active deployment specs found.</p>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-1">Try clarifying your query strings or fallback search inputs</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

      </div>
      
      <Footer />
    </main>
  );
}