"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowUpRight, ShoppingBag, BookOpen, CreditCard, Laptop, ShoppingCart } from "lucide-react";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================
interface Partner {
  _id: string;
  name: string;
  description: string;
  badgeText: string;
  affiliateLink: string;
  themeColor: string;
  isActive: boolean;
}

interface ToolkitProduct {
  _id: string;
  title: string;
  slug: string;
  description: string;
  badgeText: string;
  affiliateLink: string;
  image: string;
  category: any;
  displayOrder: number;
}

interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  mainImage: string;
  category: { _id: string; name: string; slug: string };
  views: number;
  showAds: boolean;
  tags: string;
  createdAt: string;
  relatedPartners: Partner[] | string[] | any; 
}

interface TaxNotification {
  _id: string;
  title: string;
  link: string;
  isUrgent: boolean;
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================
const LoadingSpinner = memo(() => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
  </div>
));
LoadingSpinner.displayName = "LoadingSpinner";

// ============================================================================
// 🚀 COMPONENT: IN-FEED TOOLKIT CONNECTOR WIDGET (Interlinked Ecosystem)
// ============================================================================
const ToolkitInFeedWidget = memo(({ categoryId, categoryName }: { categoryId: string; categoryName: string }) => {
  const router = useRouter();
  const [toolkitProducts, setToolkitProducts] = useState<ToolkitProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelatedToolkit() {
      try {
        const res = await fetch("/api/toolkit");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            // ब्लॉग कैटेगरी के हिसाब से रिलेवेंट प्रोडक्ट्स फ़िल्टर करो भाई
            const filtered = data.filter((p: any) => {
              const pCatId = p.category?._id || p.category;
              return pCatId === categoryId;
            }).slice(0, 2); 
            
            // फ़ॉलबैक: अगर उस कैटेगरी का स्पेसिफिक प्रोडक्ट नहीं है, तो कोई भी दो लेटेस्ट प्रोडक्ट दिखाओ
            setToolkitProducts(filtered.length > 0 ? filtered : data.slice(0, 2));
          }
        }
      } catch (err) {
        console.error("Failed to load in-feed toolkit nodes:", err);
      } finally {
        setLoading(false);
      }
    }
    if (categoryId) fetchRelatedToolkit();
  }, [categoryId]);

  if (loading || toolkitProducts.length === 0) return null;

  return (
    <div className="my-8 bg-slate-50 border border-slate-200/80 rounded-[2rem] p-5 sm:p-6 text-left shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-200/60 pb-3 mb-4">
        <div className="space-y-0.5">
          <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 border border-blue-100 rounded">
            🧰 TaxAdhaar Premium Toolkit
          </span>
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight mt-1">
            Recommended Reference Manuals for {categoryName || "This Topic"}
          </h4>
        </div>
      </div>

      {/* 📱 2-Column Compact Card Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {toolkitProducts.map((product) => (
          <div 
            key={product._id}
            // 🎯 ऐक्शन 1: पूरे कार्ड पर क्लिक करने से हमारी ही वेबसाइट का स्लग पेज खुलेगा
            onClick={() => router.push(`/toolkit/${product.slug}`)}
            className="bg-white border border-slate-200/70 rounded-2xl p-3 flex gap-3 items-center hover:border-slate-950/20 hover:shadow-md transition-all duration-300 cursor-pointer group relative"
          >
            {/* Small Product Cover Box */}
            <div className="w-14 h-14 rounded-xl bg-slate-50 overflow-hidden border border-slate-100 shrink-0 relative">
              <img 
                src={product.image} 
                alt={product.title} 
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=150";
                }}
              />
            </div>

            {/* Meta Text details */}
            <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
              <div className="space-y-0.5">
                <span className="inline-block text-[7px] font-black tracking-widest uppercase text-amber-700 bg-amber-50 px-1 py-0.2 rounded font-mono border border-amber-100">
                  {product.badgeText || "Vetted Node"}
                </span>
                <h5 className="font-black text-[11px] sm:text-xs text-slate-950 tracking-tight truncate leading-snug group-hover:text-blue-600 transition-colors">
                  {product.title}
                </h5>
              </div>

              {/* Action Buttons Hub */}
              <div className="flex items-center justify-between gap-2 mt-1.5 pt-1.5 border-t border-slate-100">
                <span className="text-[9px] font-bold text-blue-600 inline-flex items-center gap-0.5">
                  Blueprint <ArrowUpRight size={10} />
                </span>

                {/* 💸 AFFILIATE ACTION GATEWAY: बटन पर क्लिक करने से डायरेक्ट अमेज़न साइटस्ट्राइप हॉप होगा */}
                <a 
                  href={product.affiliateLink || "#"}
                  target="_blank"
                  rel="sponsored nofollow"
                  // 🎯 stopPropagation मस्ट है ताकि पूरा पेरेंट कार्ड क्लिक न हो भाई!
                  onClick={(e) => e.stopPropagation()}
                  className="text-[8px] font-black uppercase tracking-wider bg-slate-900 text-white hover:bg-amber-600 hover:text-white px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1"
                >
                  <ShoppingCart size={10} className="text-amber-400" /> Get Asset
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
ToolkitInFeedWidget.displayName = "ToolkitInFeedWidget";

// 🤝 REUSABLE BANNER CARD
const PartnerCard = memo(({ partner, variant = "sidebar" }: { partner: Partner; variant?: "sidebar" | "feed" }) => {
  if (!partner || !partner.name) return null;

  const getThemeClasses = (color: string) => {
    switch (color) {
      case "blue": return { badge: "bg-blue-500 text-white", btn: "bg-blue-600 hover:bg-blue-500", border: "hover:border-blue-500/40" };
      case "emerald": return { badge: "bg-emerald-500 text-white", btn: "bg-emerald-600 hover:bg-emerald-500", border: "hover:border-emerald-500/40" };
      case "orange": return { badge: "bg-orange-500 text-white", btn: "bg-orange-600 hover:bg-orange-500", border: "hover:border-orange-500/40" };
      default: return { badge: "bg-indigo-500 text-white", btn: "bg-indigo-600 hover:bg-indigo-500", border: "hover:border-indigo-500/40" };
    }
  };

  const css = getThemeClasses(partner.themeColor);

  if (variant === "feed") {
    return (
      <div className={`p-5 bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950 rounded-2xl border border-white/10 ${css.border} transition duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left`}>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm ${css.badge}`}>
              {partner.badgeText || "Authorized"}
            </span>
            <h4 className="text-sm font-black text-white tracking-wide uppercase">{partner.name}</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">{partner.description}</p>
        </div>
        <a 
          href={partner.affiliateLink || "#"} target="_blank" rel="noopener noreferrer"
          className={`px-6 py-3 text-xs font-black uppercase tracking-wider text-white text-center rounded-xl transition duration-200 whitespace-nowrap shadow-md ${css.btn}`}
        >
          Open Free Account ↗
        </a>
      </div>
    );
  }

  return (
    <div className={`p-4 bg-white/[0.03] hover:bg-white/[0.06] rounded-xl border border-white/10 ${css.border} transition duration-200 text-left`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-extrabold text-white tracking-wide">{partner.name}</span>
        <span className={`text-[8px] px-2 py-0.5 rounded font-black tracking-wider uppercase ${css.badge}`}>
          {partner.badgeText}
        </span>
      </div>
      <p className="text-[11px] text-slate-400 leading-normal mb-2.5">{partner.description}</p>
      <a 
        href={partner.affiliateLink || "#"} target="_blank" rel="noopener noreferrer"
        className={`w-full text-center block py-2 text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition duration-200 shadow-xs border border-white/5 ${css.btn}`}
      >
        Claim Verified Offer 🚀
      </a>
    </div>
  );
});
PartnerCard.displayName = "PartnerCard";

// ============================================================================
// MAIN STREAMER COMPONENT
// ============================================================================
export default function InfiniteBlogFeed({
  initialBlog,
  currentSlug,
}: {
  initialBlog: Blog;
  currentSlug: string;
}) {
  const [blogList, setBlogList] = useState<Blog[]>([initialBlog]);
  const [notifications, setNotifications] = useState<TaxNotification[]>([]);
  const [globalPartners, setGlobalPartners] = useState<Partner[]>([]); 
  const [activePartners, setActivePartners] = useState<any[]>(initialBlog.relatedPartners || []);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const fetchedIds = useRef<Set<string>>(new Set([initialBlog._id]));
  const fetchedSlugs = useRef<Set<string>>(new Set([currentSlug]));

  // 1. Load Sidebar Alerts & Global Links
  useEffect(() => {
    async function loadSidebarData() {
      try {
        const [notiRes, partnerRes] = await Promise.all([
          fetch("/api/notifications"),
          fetch("/api/partners?active=true")
        ]);

        const [notiJson, partnerJson] = await Promise.all([
          notiRes.json(),
          partnerRes.json()
        ]);

        if (notiJson.success) setNotifications(notiJson.data);
        if (partnerJson.success) setGlobalPartners(partnerJson.data);
      } catch (err) {
        console.error("Error loading side widgets data:", err);
      }
    }
    loadSidebarData();
  }, []);

  // 2. SMART CONTEXTUAL FEED STREAMER 
  const fetchNextArticle = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    try {
      const excludeString = Array.from(fetchedIds.current).join(",");
      const currentCategory = initialBlog.category?._id || "";

      let response = await fetch(`/api/blogs?limit=1&category=${currentCategory}&exclude=${excludeString}`);
      if (!response.ok) response = await fetch(`/api/blogs?limit=1&exclude=${excludeString}`);
      
      let result = await response.json();

      if (!result.success || !result.data || result.data.length === 0) {
        response = await fetch(`/api/blogs?limit=1&exclude=${excludeString}`);
        result = await response.json();
      }

      if (result.success && result.data && result.data.length > 0) {
        const nextBlog = result.data[0];

        if (fetchedIds.current.has(nextBlog._id) || fetchedSlugs.current.has(nextBlog.slug)) {
          setHasMore(false);
          setLoadingMore(false);
          return;
        }

        fetchedIds.current.add(nextBlog._id);
        fetchedSlugs.current.add(nextBlog.slug);
        
        setBlogList((prev) => {
          if (prev.some((b) => b._id === nextBlog._id)) return prev;
          return [...prev, nextBlog];
        });
      } else {
        setHasMore(false); 
      }
    } catch (err) {
      console.error("Failed to load infinite post stream:", err);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, initialBlog]);

  // 3. Intersection Observer Binding
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchNextArticle();
        }
      }, { threshold: 0.05, rootMargin: "300px" });

      if (node) observerRef.current.observe(node);
    },
    [loadingMore, hasMore, fetchNextArticle]
  );

  // 4. Client Viewport URL & Dynamic Sidebar Partner Switcher Engine
  useEffect(() => {
    const handleScrollTracking = () => {
      const articles = document.querySelectorAll("[data-blog-slug]");
      let currentVisibleSlug = "";

      articles.forEach((article) => {
        const rect = article.getBoundingClientRect();
        if (rect.top <= 250 && rect.bottom >= 250) {
          currentVisibleSlug = article.getAttribute("data-blog-slug") || "";
        }
      });

      if (currentVisibleSlug) {
        if (window.location.pathname !== `/blogs/${currentVisibleSlug}`) {
          window.history.pushState(null, "", `/blogs/${currentVisibleSlug}`);
          const currentBlogElement = document.querySelector(`[data-blog-slug="${currentVisibleSlug}"]`);
          if (currentBlogElement) {
            const newTitle = currentBlogElement.querySelector("h1")?.innerText;
            if (newTitle) document.title = `${newTitle} | TaxAdhaar`;
          }
        }

        const activeBlogObj = blogList.find(b => b.slug === currentVisibleSlug);
        if (activeBlogObj) {
          setActivePartners(activeBlogObj.relatedPartners || []);
        }
      }
    };

    window.addEventListener("scroll", handleScrollTracking);
    return () => window.removeEventListener("scroll", handleScrollTracking);
  }, [blogList]);

  const formatBlogDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("en-IN", {
        dateStyle: "long",
        timeStyle: "short",
      });
    } catch {
      return "Live Update";
    }
  };

  // 📰 REUSABLE BULLETINS WIDGET
  const BulletinsWidget = () => {
    if (notifications.length === 0) return null;
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-300 text-left">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center">
            <span className="w-2 h-2 bg-brand-red rounded-full mr-2 animate-ping"></span>
            Live Bulletins
          </h3>
        </div>
        <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
          {notifications.map((noti) => (
            <a 
              key={`side-notif-${noti._id}`} href={noti.link || "#"} target="_blank" rel="noopener noreferrer" 
              className="block p-3 bg-gray-50/70 hover:bg-red-50/50 rounded-xl transition duration-200 border-l-4 border-gray-200 hover:border-brand-red group"
            >
              <h4 className="text-xs font-bold leading-snug text-gray-700 group-hover:text-gray-900 line-clamp-2 hover:underline">
                {noti.title}
              </h4>
            </a>
          ))}
        </div>
      </div>
    );
  };

  // 💻 DESKTOP DYNAMIC SIDEBAR PARTNER WIDGET
  const SidebarPartnerWidget = () => {
    const rawDisplay = activePartners && activePartners.length > 0 ? activePartners : [];
    
    const cleanPartners = (rawDisplay || [])
      .map(p => {
        if (typeof p === "string" || (p && !p.name && typeof p === "object" && p.$oid)) {
          const targetId = typeof p === "string" ? p : p.$oid;
          return globalPartners.find(gp => gp._id === targetId);
        }
        return p;
      })
      .filter(p => p && p._id && p.isActive !== false);
    
    if (cleanPartners.length === 0) return null;

    return (
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white p-5 rounded-2xl shadow-xl border border-slate-800/80 text-left">
        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-500/20">
          TaxAdhaar Benefits
        </span>
        <h3 className="text-sm font-black mt-3 leading-snug tracking-tight">
          स्मार्ट टैक्स सेविंग पार्टनर्स 💸
        </h3>
        <div className="mt-4 space-y-3">
          {cleanPartners.map((partner) => (
            <PartnerCard key={`side-p-${partner._id}`} partner={partner} variant="sidebar" />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen text-black font-sans">
      {/* GLOBAL NAVBAR / BREADCRUMB */}
      <div className="bg-slate-950 text-white py-4 border-b border-gray-800 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
          <div className="flex items-center space-x-2 text-gray-400">
            <Link href="/blogs" className="hover:text-white transition">Portal Home</Link>
            <span>/</span>
            <span className="text-emerald-400 animate-pulse">🔴 Smart Feed Streamer Active</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative">
          
          {/* LEFT SIDE: MULTI-BLOG LOOP FLOW */}
          <div className="lg:col-span-2 space-y-16">
            {blogList.map((blog, index) => {
              const isLastItem = index === blogList.length - 1;
              const isRelated = blog.category?._id === initialBlog.category?._id;
              
              const rawPartners = blog.relatedPartners || [];
              const feedPartners = (rawPartners || [])
                .map((p: any) => {
                  if (typeof p === "string" || (p && !p.name && p.$oid)) {
                    const idToFind = typeof p === "string" ? p : p.$oid;
                    return globalPartners.find(gp => gp._id === idToFind);
                  }
                  return p;
                })
                .filter((p:any) => p && p._id && p.isActive !== false);

              return (
                <div
                  key={`feed-node-${blog._id}`} 
                  ref={isLastItem ? lastElementRef : null}
                  data-blog-slug={blog.slug}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-8 transition-all relative"
                >
                  {index > 0 && (
                    <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 text-white text-[10px] font-black tracking-widest px-5 py-1.5 rounded-full uppercase shadow-lg ${
                      isRelated ? "bg-red-600" : "bg-slate-900"
                    }`}>
                      {isRelated ? "🔥 Related Category Post" : "✨ Recommended Bulletins"}
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-red-50 text-red-600 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-md">
                      {blog.category?.name}
                    </span>
                    <span className="text-xs font-bold text-gray-400">
                      👁️ {blog.views ? blog.views.toLocaleString() : 0} Reads
                    </span>
                  </div>

                  <h1 className="text-2xl md:text-4xl font-black text-gray-900 leading-tight mb-4 tracking-tight">
                    {blog.title}
                  </h1>

                  <div className="text-xs text-gray-400 border-b pb-4 mb-6">
                    <span className="font-bold text-gray-700">Tax Portal Desk</span> • Updated: {formatBlogDate(blog.createdAt)}
                  </div>

                  <div className="w-full h-64 md:h-[400px] rounded-xl overflow-hidden mb-6 bg-gray-100 relative">
                    <Image
                      src={blog.mainImage || "/placeholder-tax.jpg"} alt={blog.title} fill className="object-cover"
                      priority={index === 0} sizes="(max-width: 1024px) 100vw, 66vw" unoptimized={process.env.NODE_ENV === "development"}
                    />
                  </div>

                  <p className="text-gray-600 italic text-base border-l-4 border-red-500 pl-4 mb-6 font-medium leading-relaxed">
                    "{blog.excerpt}"
                  </p>

                  <div
                    className="prose prose-slate max-w-none text-gray-800 text-base md:text-lg leading-relaxed space-y-4 font-normal mb-8"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />

                  {/* ======================================================= */}
                  {/* 🎯 RELATED ECOSYSTEM TOOLKIT PRODUCTS INJECTION        */}
                  {/* ======================================================= */}
                  <ToolkitInFeedWidget 
                    categoryId={blog.category?._id} 
                    categoryName={blog.category?.name} 
                  />

                  {/* IN-FEED PARTNER PLACEMENT */}
                  {feedPartners && feedPartners.length > 0 && (
                    <div className="my-8 space-y-3">
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Sponsored Financial Partner</p>
                      {feedPartners.map((partner: any) => (
                        <PartnerCard key={`feed-p-${partner._id}`} partner={partner} variant="feed" />
                      ))}
                    </div>
                  )}

                  {blog.tags && (
                    <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-2 items-center mb-4">
                      <span className="text-xs font-bold text-gray-400 mr-2">TAGS:</span>
                      {blog.tags.split(",").map((tag, i) => (
                        <span key={i} className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-md">
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* MOBILE VIEW INJECTION */}
                  <div className="block lg:hidden space-y-6 my-6">
                    <BulletinsWidget />
                    {feedPartners && feedPartners.length > 0 && (
                      <div className="space-y-3">
                        {feedPartners.map((partner: any) => (
                          <PartnerCard key={`mobile-feed-p-${partner._id}`} partner={partner} variant="feed" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 💻 DESKTOP FLOATING SIDEBAR */}
          <div className="hidden lg:block h-fit lg:sticky lg:top-24 space-y-6">
            <BulletinsWidget />
            <SidebarPartnerWidget />
            
            {/* AdSense */}
            <div className="w-full bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm">
              <div className="w-full bg-slate-50 border border-dashed border-slate-200 h-[250px] flex flex-col items-center justify-center text-xs text-gray-400 tracking-widest uppercase rounded-xl">
                <span className="text-slate-500 font-bold mb-1 text-[11px]">Advertisement</span>
                <span>-- Google AdSense --</span>
              </div>
            </div>
          </div>

        </div>

        {loadingMore && <LoadingSpinner />}

        {!hasMore && (
          <div className="text-center py-10 mt-16 text-sm font-bold text-slate-400 uppercase tracking-widest border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 max-w-4xl mx-auto">
            🎉 Congratulations! You have fully verified all news items!
          </div>
        )}
      </div>
    </div>
  );
}