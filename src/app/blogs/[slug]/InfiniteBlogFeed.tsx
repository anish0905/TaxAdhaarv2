"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

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
}

interface TaxNotification {
  _id: string;
  title: string;
  link: string;
  isUrgent: boolean;
}

export default function InfiniteBlogFeed({
  initialBlog,
  currentSlug,
}: {
  initialBlog: Blog;
  currentSlug: string;
}) {
  const [blogList, setBlogList] = useState<Blog[]>([initialBlog]);
  const [notifications, setNotifications] = useState<TaxNotification[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  const fetchedIds = useRef<Set<string>>(new Set([initialBlog._id]));
  const fetchedSlugs = useRef<Set<string>>(new Set([currentSlug]));

  // 1. Fetch Sidebar Updates Safely
  useEffect(() => {
    async function fetchSidebarAlerts() {
      try {
        const res = await fetch("/api/notifications");
        if (!res.ok) throw new Error("Notifications HTTP error");
        const json = await res.json();
        if (json.success) setNotifications(json.data);
      } catch (err) {
        console.error("Error loading side-alerts:", err);
      }
    }
    fetchSidebarAlerts();
  }, []);

  // 2. SMART FEED STREAMER 
  const fetchNextArticle = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    try {
      const excludeString = Array.from(fetchedIds.current).join(",");
      const currentCategory = initialBlog.category?._id || "";

      let response = await fetch(`/api/blogs?limit=1&category=${currentCategory}&exclude=${excludeString}`);
      
      if (!response.ok) {
        response = await fetch(`/api/blogs?limit=1&exclude=${excludeString}`);
      }
      
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

  // 3. Infinite trigger layout intersection binding
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

  // 4. Client Viewport URL & Page Tab Title Dynamic Updates
  useEffect(() => {
    const handleUrlTracking = () => {
      const articles = document.querySelectorAll("[data-blog-slug]");
      let currentVisibleSlug = "";

      articles.forEach((article) => {
        const rect = article.getBoundingClientRect();
        if (rect.top <= 250 && rect.bottom >= 250) {
          currentVisibleSlug = article.getAttribute("data-blog-slug") || "";
        }
      });

      if (currentVisibleSlug && window.location.pathname !== `/blogs/${currentVisibleSlug}`) {
        window.history.pushState(null, "", `/blogs/${currentVisibleSlug}`);
        
        const currentBlogElement = document.querySelector(`[data-blog-slug="${currentVisibleSlug}"]`);
        if (currentBlogElement) {
          const newTitle = currentBlogElement.querySelector("h2")?.innerText;
          if (newTitle) document.title = `${newTitle} | TaxAdhaar`;
        }
      }
    };

    window.addEventListener("scroll", handleUrlTracking);
    return () => window.removeEventListener("scroll", handleUrlTracking);
  }, []);

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

  // 📰 REUSABLE BULLETINS WIDGET (⚡ CLICKABLE BUG FIXED)
  const BulletinsWidget = () => {
    if (notifications.length === 0) return null;
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-300 text-left">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center">
            <span className="w-2 h-2 bg-brand-red rounded-full mr-2 animate-ping"></span>
            <span className="w-2 h-2 bg-brand-red rounded-full mr-2 absolute"></span>
            Live Bulletins
          </h3>
          <span className="text-[10px] bg-red-50 text-brand-red font-bold px-2 py-0.5 rounded-full">Updates</span>
        </div>

        <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200">
          {notifications.map((noti) => (
            <a 
              key={`side-notif-${noti._id}`}
              href={noti.link || "#"} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block p-3 bg-gray-50/70 hover:bg-red-50/50 rounded-xl transition duration-200 border-l-4 border-gray-200 hover:border-brand-red group cursor-pointer"
            >
              <h4 className={`text-xs font-bold leading-snug transition-colors duration-200 ${
                noti.isUrgent ? "text-red-600 group-hover:text-red-700" : "text-gray-700 group-hover:text-gray-900"
              } line-clamp-2 hover:underline`}>
                {noti.title}
              </h4>
            </a>
          ))}
        </div>
      </div>
    );
  };

  // 🧱 REUSABLE PARTNER WIDGET
  const PartnerWidget = () => (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white p-5 md:p-6 rounded-2xl shadow-xl border border-slate-800/80 relative overflow-hidden text-left">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
      
      <div className="flex items-center space-x-2">
        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-500/20">
          TaxAdhaar Partners
        </span>
      </div>
      
      <h3 className="text-base font-black mt-3 leading-snug tracking-tight">
        स्मार्ट इन्वेस्टमेंट से बचाएं अपना टैक्स! 💸
      </h3>
      <p className="text-slate-400 text-[11px] mt-1.5 leading-relaxed">
        हमारे ऑफिशियल पार्टनर्स के साथ 0% कमीशन पर डायरेक्ट इन्वेस्टमेंट शुरू करें:
      </p>

      <div className="mt-4 space-y-3">
        {/* Zerodha Box */}
        <div className="p-3.5 bg-white/[0.03] hover:bg-white/[0.06] rounded-xl border border-white/10 hover:border-blue-500/40 transition duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-white tracking-wide">1. Zerodha (No. #1 Broker)</span>
            <span className="text-[9px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-black tracking-wider uppercase">Active</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 leading-normal">Stocks, Direct Mutual Funds और IPOs के लिए बेस्ट।</p>
          <a 
            href="https://zerodha.com/open-account?c=ZLU861" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-2.5 text-xs font-bold text-white text-center flex items-center justify-center bg-blue-600 hover:bg-blue-500 py-2 rounded-lg transition-all duration-200 shadow-md"
          >
            Open Free Account 🚀
          </a>
        </div>

        {/* INDmoney Box */}
        <div className="p-3.5 bg-white/[0.03] hover:bg-white/[0.06] rounded-xl border border-white/10 hover:border-emerald-500/40 transition duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-white tracking-wide">2. INDmoney (US Stocks)</span>
            <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold tracking-tight">ANIDKPM2IND</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 leading-normal">US Stocks (Apple, Google) खरीदें और पोर्टफोलियो track करें।</p>
          <a 
            href="https://indmoney.onelink.me/RmHC/czesc03b" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-2.5 text-xs font-bold text-white text-center flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 py-2 rounded-lg transition-all duration-200 shadow-md"
          >
            Claim Free US Stocks 🇺🇸
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen text-black font-sans">
      {/* GLOBAL NAVBAR / BREADCRUMB */}
      <div className="bg-brand-dark text-white py-4 border-b border-gray-800 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
          <div className="flex items-center space-x-2 text-gray-400">
            <Link href="/blogs" className="hover:text-white transition">Portal Home</Link>
            <span>/</span>
            <span className="text-brand-accent animate-pulse">🔴 Smart Feed Streamer Active</span>
          </div>
          <span className="text-gray-400 text-[10px] bg-slate-800 px-3 py-1 rounded-full">
            Reading category: {initialBlog.category?.name || "General"}
          </span>
        </div>
      </div>

      {/* मास्टर लेआउट ग्रिड: items-start लगाने से साइडबार खींचता नहीं है */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative">
          
          {/* LEFT SIDE: MULTI-BLOG LOOP FLOW */}
          <div className="lg:col-span-2 space-y-16">
            {blogList.map((blog, index) => {
              const isLastItem = index === blogList.length - 1;
              const isRelated = blog.category?._id === initialBlog.category?._id;

              return (
                <div
                  key={`feed-node-${blog._id}`} 
                  ref={isLastItem ? lastElementRef : null}
                  data-blog-slug={blog.slug}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-8 transition-all relative"
                >
                  {/* Smart Label Indicator */}
                  {index > 0 && (
                    <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 text-white text-[10px] font-black tracking-widest px-5 py-1.5 rounded-full uppercase shadow-lg border ${
                      isRelated 
                        ? "bg-brand-red border-red-500" 
                        : "bg-brand-dark border-slate-700"
                    }`}>
                      {isRelated ? "🔥 Related Category Post" : "✨ Recommended Bulletins"}
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-red-50 text-brand-red text-xs font-black uppercase tracking-wider px-3 py-1 rounded-md">
                      {blog.category?.name}
                    </span>
                    <span className="text-xs font-bold text-gray-400">
                      👁️ {blog.views.toLocaleString()} Reads
                    </span>
                  </div>

                  <h1 className="text-2xl md:text-4xl font-black text-gray-900 leading-tight mb-4 tracking-tight">
                    {blog.title}
                  </h1>

                  <div className="text-xs text-gray-400 border-b pb-4 mb-6 flex items-center space-x-2">
                    <span className="font-bold text-gray-700">Tax Portal Desk</span>
                    <span>•</span>
                    <span>Updated: {formatBlogDate(blog.createdAt)}</span>
                  </div>

                  {blog.showAds && (
                    <div className="w-full bg-slate-50 border border-dashed border-slate-200 h-24 mb-6 flex flex-col items-center justify-center text-[10px] text-gray-400 tracking-widest uppercase rounded-lg">
                      <span className="text-[11px] font-bold text-slate-500 mb-0.5">Advertisement</span>
                      <span>-- Google AdSense (INLINE_TOP) --</span>
                    </div>
                  )}

                  <div className="w-full h-64 md:h-[400px] rounded-xl overflow-hidden mb-6 bg-gray-100">
                    <img
                      src={blog.mainImage}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  </div>

                  <p className="text-gray-600 italic text-base border-l-4 border-brand-red pl-4 mb-6 font-medium leading-relaxed">
                    "{blog.excerpt}"
                  </p>

                  <div
                    className="prose prose-slate max-w-none text-gray-800 text-base md:text-lg leading-relaxed space-y-4 font-normal mb-8"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />

                  {blog.tags && (
                    <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-2 items-center mb-6">
                      <span className="text-xs font-bold text-gray-400 mr-2">TAGS:</span>
                      {blog.tags.split(",").map((tag, i) => (
                        <span key={i} className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-md">
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 📱 MOBILE VIEW INJECTION: फोन स्क्रीन्स पर यह हर ब्लॉग के नीचे सिंक होकर बहेगा */}
                  <div className="block lg:hidden space-y-6 my-6">
                    <BulletinsWidget />
                    <PartnerWidget />
                  </div>

                  {blog.showAds && (
                    <div className="w-full bg-slate-50 border border-dashed border-slate-200 h-24 mt-4 flex flex-col items-center justify-center text-[10px] text-gray-400 tracking-widest uppercase rounded-lg">
                      <span className="text-[11px] font-bold text-slate-500 mb-0.5">Advertisement</span>
                      <span>-- Google AdSense (INLINE_BOTTOM) --</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 💻 DESKTOP PREMIUM SMOOTH FLOATING SIDEBAR */}
          {/* transition + will-change-transform के कारण यह ब्राउज़र के GPU पर तैरते हुए स्क्रॉल होता है */}
          <div className="hidden lg:block h-fit lg:sticky lg:top-28 transition-all duration-500 ease-out will-change-transform">
            <div className="space-y-6">
              
              {/* Live Bulletins Execution */}
              <BulletinsWidget />

              {/* Dual Investment Partner Widget */}
              <PartnerWidget />

              {/* Google AdSense Sidebar Container */}
              <div className="w-full bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm">
                <div className="w-full bg-slate-50 border border-dashed border-slate-200 h-[250px] flex flex-col items-center justify-center text-xs text-gray-400 tracking-widest uppercase rounded-xl">
                  <span className="text-slate-500 font-bold mb-1 text-[11px]">Advertisement</span>
                  <span>-- Google AdSense --</span>
                  <span className="text-[10px] text-slate-400 mt-1">(BLOG_SIDEBAR)</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* PROCESS PROGRESS LOADER BAR */}
        {loadingMore && (
          <div className="flex justify-center items-center py-8 mt-16 bg-white rounded-xl border border-dashed border-slate-200 shadow-sm animate-pulse max-w-4xl">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-red"></div>
            <span className="text-xs font-bold text-slate-600 ml-3 uppercase tracking-widest">
              Loading Contextual entry updates...
            </span>
          </div>
        )}

        {!hasMore && (
          <div className="text-center py-10 mt-16 text-sm font-bold text-slate-400 uppercase tracking-widest border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 max-w-4xl">
            🎉 Congratulations! You have fully verified all news items!
          </div>
        )}
      </div>
    </div>
  );
}