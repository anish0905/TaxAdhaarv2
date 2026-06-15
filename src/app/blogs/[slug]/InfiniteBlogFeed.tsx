// app/blogs/[slug]/InfiniteBlogFeed.tsx
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

  // 2. SMART FEED STREAMER (With Production Error Handlers)
  const fetchNextArticle = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    try {
      const excludeString = Array.from(fetchedIds.current).join(",");
      const currentCategory = initialBlog.category?._id || "";

      // Path handlers explicitly absolute parameters check targets
      let response = await fetch(`/api/blogs?limit=1&category=${currentCategory}&exclude=${excludeString}`);
      
      if (!response.ok) {
        // Fallback directly to generic fetch if category fails
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
      setHasMore(false); // UI fallback crash block loops
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
        
        // 🔥 IMPROVEMENT: Browser tab title also matches live active scroll blog
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* MAIN STREAM GRID LOOP INTERFACE */}
          <div className="lg:col-span-2 space-y-16">
            {blogList.map((blog, index) => {
              const isLastItem = index === blogList.length - 1;
              const isRelated = blog.category?._id === initialBlog.category?._id;

              return (
                <div
                  key={`feed-node-${blog._id}`} 
                  ref={isLastItem ? lastElementRef : null}
                  data-blog-slug={blog.slug}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 transition-all relative"
                >
                  {/* Smart Label Indicator */}
                  {index > 0 && (
                    <div className={`absolute -top-7 left-1/2 transform -translate-x-1/2 text-white text-[10px] font-black tracking-widest px-5 py-1.5 rounded-full uppercase shadow-lg border ${
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
                    <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-2 items-center">
                      <span className="text-xs font-bold text-gray-400 mr-2">TAGS:</span>
                      {blog.tags.split(",").map((tag, i) => (
                        <span key={i} className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-md">
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {blog.showAds && (
                    <div className="w-full bg-slate-50 border border-dashed border-slate-200 h-24 mt-8 flex flex-col items-center justify-center text-[10px] text-gray-400 tracking-widest uppercase rounded-lg">
                      <span className="text-[11px] font-bold text-slate-500 mb-0.5">Advertisement</span>
                      <span>-- Google AdSense (INLINE_BOTTOM) --</span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* PROCESS PROGRESS LOADER BAR */}
            {loadingMore && (
              <div className="flex justify-center items-center py-8 bg-white rounded-xl border border-dashed border-slate-200 shadow-sm animate-pulse">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-red"></div>
                <span className="text-xs font-bold text-slate-600 ml-3 uppercase tracking-widest">
                  Loading Contextual entry updates...
                </span>
              </div>
            )}

            {!hasMore && (
              <div className="text-center py-10 text-sm font-bold text-slate-400 uppercase tracking-widest border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                🎉 Congratulations! You have fully verified all news items!
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR COMPONENT ASIDE */}
          <div className="hidden lg:block">
            <div className="space-y-6 sticky top-24">
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center justify-between border-b pb-3 mb-4">
                  <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider flex items-center">
                    <span className="w-2.5 h-2.5 bg-brand-red rounded-full mr-2 animate-pulse"></span>
                    Live Bulletins
                  </h3>
                </div>

                <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                  {notifications.map((noti) => (
                    <div key={`side-notif-${noti._id}`} className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition border-l-4 border-gray-300 hover:border-brand-red">
                      <a href={noti.link || "#"} target="_blank" rel="noreferrer" className="block">
                        <h4 className={`text-xs font-bold ${noti.isUrgent ? "text-red-700" : "text-gray-800"} line-clamp-2 hover:underline`}>
                          {noti.title}
                        </h4>
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full bg-slate-50 border border-dashed border-slate-200 h-[300px] flex flex-col items-center justify-center text-xs text-gray-400 tracking-widest uppercase rounded-2xl shadow-sm">
                <span className="text-slate-500 font-bold mb-1">Advertisement</span>
                <span>-- Google AdSense --</span>
                <span className="text-[10px] text-slate-400 mt-1">(BLOG_SIDEBAR)</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}