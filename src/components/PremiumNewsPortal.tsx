"use client";

import { useState, useEffect, useMemo, memo, Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import CategoryFilterBar from "./CategoryFilterBar";

// ============================================================================
// CORE ENTITIES SCHEMAS (Cleaned up as per database format)
// ============================================================================
interface Category { 
  _id: string; 
  name: string; 
  slug: string; 
}

interface Partner { 
  _id: string; 
  name: string; 
  description: string; 
  badgeText: string; 
  affiliateLink: string; 
  themeColor: string; 
  isActive: boolean; 
}

interface Blog { 
  _id: string; 
  title: string; 
  slug: string; 
  excerpt: string; 
  mainImage: string; 
  category: { _id: string; name: string; slug: string }; 
  views: number; 
  showAds: boolean; 
  createdAt: string; 
}

interface TaxNotification { 
  _id: string; 
  title: string; 
  link: string; 
  isUrgent: boolean; 
}

// ============================================================================
// RUNTIME TRANSFORMATION AGENTS
// ============================================================================
const formatNewsDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch { return "Invalid date"; }
};

const truncateText = (text: string | null | undefined, maxLength: number): string => {
  if (!text) return ""; 
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};

// ============================================================================
// PERFORMANCE MONITORED LAYOUT SLOTS
// ============================================================================
const LoadingSpinner = memo(() => (
  <div className="flex justify-center items-center h-screen bg-slate-50">
    <div className="relative flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-brand-red border-r-transparent border-b-brand-dark border-l-transparent" />
      <span className="absolute text-[10px] font-bold uppercase tracking-widest text-gray-500 animate-pulse">TAX</span>
    </div>
  </div>
));
LoadingSpinner.displayName = "LoadingSpinner";

const NotificationItem = memo(({ notification }: { notification: TaxNotification }) => (
  <div className={`p-3.5 rounded-xl transition-all border ${notification.isUrgent ? "bg-red-950/40 border-red-900/50 hover:bg-red-950/60" : "bg-slate-900/60 border-slate-800 hover:bg-slate-900"}`}>
    <a href={notification.link || "#"} target="_blank" rel="noreferrer" className="block group">
      <h4 className={`text-xs font-bold leading-snug mb-2 text-left ${notification.isUrgent ? "text-red-400 group-hover:text-red-300" : "text-slate-200 group-hover:text-white"} line-clamp-2 transition-colors`}>
        {notification.isUrgent && "🚨 "}{notification.title}
      </h4>
      <div className="flex items-center justify-between mt-1 text-[9px] font-black uppercase tracking-widest text-slate-500">
        <span>Circular Alert</span>
        <span className={notification.isUrgent ? "text-brand-accent" : "text-slate-400"}>{notification.isUrgent ? "⚡ Urgent" : "View ↗"}</span>
      </div>
    </a>
  </div>
));
NotificationItem.displayName = "NotificationItem";

const PremiumMiniPartnerCard = memo(({ partner }: { partner: Partner }) => {
  const getBadgeColor = (color: string) => {
    if (color === "blue") return "bg-blue-600 text-white";
    if (color === "emerald") return "bg-emerald-600 text-white";
    if (color === "orange") return "bg-orange-600 text-white";
    return "bg-brand-red text-white";
  };
  const getBorderColor = (color: string) => {
    if (color === "blue") return "border-blue-500/20 hover:border-blue-500/60 hover:bg-slate-900/40";
    if (color === "emerald") return "border-emerald-500/20 hover:border-emerald-500/60 hover:bg-slate-900/40";
    if (color === "orange") return "border-orange-500/20 hover:border-orange-500/60 hover:bg-slate-900/40";
    return "border-slate-800 hover:border-slate-700 hover:bg-slate-900/40";
  };
  return (
    <a href={partner.affiliateLink} target="_blank" rel="noopener noreferrer" className={`group block p-3.5 bg-slate-950 text-white rounded-xl border ${getBorderColor(partner.themeColor)} transition-all duration-200 text-left relative overflow-hidden`}>
      <div className="flex items-center justify-between mb-1.5">
        <h5 className="font-black text-white text-[13px] tracking-tight group-hover:text-brand-accent transition-colors truncate pr-2">{partner.name}</h5>
        <span className="bg-white/5 text-white/40 text-[7px] font-mono uppercase px-1 py-0.5 rounded tracking-widest shrink-0">AD</span>
      </div>
      <p className="text-slate-400 text-[11px] line-clamp-2 leading-relaxed mb-2.5">{partner.description}</p>
      <div className="flex items-center justify-between pt-2 border-t border-slate-900/60 text-[9px] font-bold uppercase tracking-wider">
        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black tracking-widest ${getBadgeColor(partner.themeColor)}`}>{partner.badgeText || "Premium"}</span>
        <span className="text-slate-400 group-hover:text-white transition-colors flex items-center">Claim Link <span className="ml-1 group-hover:translate-x-0.5 transition-transform">↗</span></span>
      </div>
    </a>
  );
});
PremiumMiniPartnerCard.displayName = "PremiumMiniPartnerCard";

const AdBanner = memo(({ className = "" }: { className?: string }) => (
  <div className={`w-full bg-white border border-slate-200 rounded-xl p-2 shadow-sm flex items-center justify-center ${className}`}>
    
  </div>
));
AdBanner.displayName = "AdBanner";

const FeaturedBlog = memo(({ blog }: { blog: Blog }) => (
  <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 group flex flex-col h-full text-left">
    <Link href={`/blogs/${blog.slug}`} className="block relative h-[380px] md:h-[440px] w-full bg-slate-900 overflow-hidden">
      <div className="relative w-full h-full">
        <Image src={typeof blog.mainImage === "string" && blog.mainImage.startsWith("http") ? blog.mainImage : "/placeholder-tax.jpg"} alt={blog.title || "Featured Blog"} fill className="object-cover group-hover:scale-105 transition-transform duration-770" sizes="(max-width: 1024px) 100vw, 66vw" priority unoptimized={process.env.NODE_ENV === "development"} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
      <span className="absolute top-4 left-4 bg-brand-red text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-md shadow-md z-10">🔥 {blog.category?.name || "Tax Spotlight"}</span>
    </Link>
    <div className="p-6 md:p-8 flex flex-col flex-grow">
      <h2 className="text-2xl md:text-3xl font-black text-slate-900 group-hover:text-brand-red transition-colors duration-200 mb-3 leading-tight tracking-tight">
        <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
      </h2>
      <p className="text-slate-600 text-sm md:text-base line-clamp-3 mb-6 leading-relaxed">{truncateText(blog.excerpt || "", 160)}</p>
      <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mt-auto pt-4 border-t border-slate-100">
        <div className="flex items-center space-x-3">
          <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase">Editorial</span>
          <span>{formatNewsDate(blog.createdAt)}</span>
        </div>
        <span className="flex items-center text-slate-500 bg-slate-50 px-2 py-1 rounded-md">👁️&nbsp;{(blog.views ?? 0).toLocaleString()} Views</span>
      </div>
    </div>
  </article>
));
FeaturedBlog.displayName = "FeaturedBlog";

const BlogCard = memo(({ blog }: { blog: Blog }) => (
  <article className="flex flex-col group h-full text-left">
    <Link href={`/blogs/${blog.slug}`} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 flex flex-col h-full">
      <div className="h-52 w-full bg-slate-100 relative overflow-hidden">
        <Image src={typeof blog.mainImage === "string" && blog.mainImage.startsWith("http") ? blog.mainImage : "/placeholder-tax.jpg"} alt={blog.title || "Blog Image"} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" unoptimized={process.env.NODE_ENV === "development"} />
        <span className="absolute top-3 left-3 bg-brand-dark/90 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md backdrop-blur-sm z-10">{blog.category?.name || "Tax Audit"}</span>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h4 className="font-extrabold text-slate-900 group-hover:text-brand-red transition-colors text-base line-clamp-2 mb-2 leading-snug tracking-tight">{blog.title}</h4>
        <p className="text-slate-500 text-xs line-clamp-2 mb-5 leading-relaxed flex-grow">{truncateText(blog.excerpt || "", 100)}</p>
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mt-auto pt-3 border-t border-slate-100">
          <span>📅 {formatNewsDate(blog.createdAt)}</span>
          <span className="text-slate-500 font-medium">👁️ {(blog.views ?? 0).toLocaleString()}</span>
        </div>
      </div>
    </Link>
  </article>
));
BlogCard.displayName = "BlogCard";

// ============================================================================
// MAIN PORTAL HOMEPAGE COMPONENT
// ============================================================================
export default function PremiumNewsPortal({
  initialBlogs = [],
  initialCategories = [],
  initialNotifications = [],
  initialPartners = []
}: {
  initialBlogs?: Blog[];
  initialCategories?: Category[];
  initialNotifications?: TaxNotification[];
  initialPartners?: Partner[];
}) {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [notifications, setNotifications] = useState<TaxNotification[]>(initialNotifications);
  const [partners, setPartners] = useState<Partner[]>(initialPartners);
  
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isSticky, setIsSticky] = useState(false);
  
  // 📈 PAGINATION STATE
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    const handleScroll = () => { setIsSticky(window.scrollY > 100); };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🎯 WATERPROOF FILTER LOGIC: स्लग बेस्ड क्लीन मैचिंग 
  const filteredBlogs = useMemo(() => {
    if (selectedCategory === "all") return blogs;
    
    return blogs.filter((blog) => {
      if (!blog.category) return false;
      
      const blogCategorySlug = blog.category.slug?.toLowerCase().trim() || "";
      const targetFilterSlug = selectedCategory.toLowerCase().trim();

      // डेटाबेस के नए फ़ॉर्मेट ('personal-finance') को फ्रंटएंड स्लग से 100% सिंक कर दिया भाई
      return blogCategorySlug === targetFilterSlug;
    });
  }, [blogs, selectedCategory]);

  // 🔄 फ़िल्टर रीसेट नोड
  useEffect(() => {
    setVisibleCount(10);
  }, [selectedCategory]);

  const currentlyDisplayedBlogs = useMemo(() => {
    return filteredBlogs.slice(0, visibleCount);
  }, [filteredBlogs, visibleCount]);

  const { featuredBlog, remainingBlogs } = useMemo(
    () => ({ featuredBlog: currentlyDisplayedBlogs[0], remainingBlogs: currentlyDisplayedBlogs.slice(1) }),
    [currentlyDisplayedBlogs]
  );

  const hasAds = useMemo(() => blogs.some((b) => b.showAds), [blogs]);

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans text-slate-900 selection:bg-brand-red selection:text-white">
      {/* BREAKING TICKER */}
      <div className="bg-brand-red text-white flex items-center h-11 overflow-hidden shadow-inner sticky top-0 z-50 border-b border-red-700">
        <div className="bg-brand-dark text-[11px] font-black uppercase tracking-widest px-5 h-full flex items-center z-20 whitespace-nowrap shadow-lg">
          <span className="w-2 h-2 rounded-full bg-red-500 mr-2 inline-block animate-ping" /> Breaking Updates
        </div>
        <div className="w-full overflow-hidden relative flex items-center bg-brand-red py-1">
          <div className="animate-marquee whitespace-nowrap flex space-x-12 text-sm font-bold tracking-wide">
            {notifications.length > 0 ? (
              notifications.map((noti) => (
                <a key={noti._id} href={noti.link || "#"} target="_blank" rel="noreferrer" className="hover:text-brand-accent transition flex items-center text-white">
                  {noti.isUrgent ? "🚨 " : "• "}{noti.title}
                </a>
              ))
            ) : (<span>Welcome to TaxAdhaar Portal: Real-time Income Tax, GST, and Corporate Law Circulars Live.</span>)}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        
        {/* 📁 ISOLATED FILTER INTEGRATION SLOT */}
        <CategoryFilterBar 
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          isSticky={isSticky}
        />

        {hasAds && <AdBanner className="mb-8" />}

        {/* HERO SECTION + LAYOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2">
            {featuredBlog ? (
              <FeaturedBlog blog={featuredBlog} />
            ) : (
              <div className="bg-white p-16 text-center rounded-2xl border border-dashed border-slate-200 text-slate-400 font-medium">
                📁 इस कैटेगरी में अभी कोई खबर लाइव नहीं है!
              </div>
            )}
          </section>

          {/* RIGHT SIDEBAR ZONE */}
          <div className="space-y-6 relative z-10">
            <aside className="bg-slate-950 text-white rounded-2xl shadow-xl p-6 border border-slate-800 h-fit flex flex-col relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <h3 className="text-base font-black uppercase tracking-wider flex items-center text-white text-left">
                  <span className="w-2.5 h-2.5 bg-brand-red rounded-full mr-2.5 animate-pulse" /> Official Bulletins
                </h3>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">{notifications.length} New</span>
              </div>
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map((noti) => (
                    <NotificationItem key={noti._id} notification={noti} />
                  ))
                ) : (<div className="text-center text-slate-400 py-8 text-sm">No new notifications</div>)}
              </div>
            </aside>
            {hasAds && <AdBanner />}
          </div>
        </div>

        {/* REMAINING NEWS GRID WITH INTEGRATED MINI PARTNER SLOTS */}
        {remainingBlogs.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-8">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center">
                <span className="bg-brand-dark text-white text-xs px-2 py-1 rounded mr-2.5">STREAM</span> More In This Section
              </h3>
              <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                Showing {currentlyDisplayedBlogs.length} of {filteredBlogs.length} articles
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {remainingBlogs.map((blog, index) => {
                const shouldInjectPartnerSlot = (index + 1) % 3 === 0 && partners.length > 0;
                const basePartnerIdx = Math.floor(index / 3) * 2;
                const partner1 = partners[basePartnerIdx % partners.length];
                const partner2 = partners[(basePartnerIdx + 1) % partners.length];

                return (
                  <Fragment key={blog._id}>
                    <div className="flex flex-col">
                      <BlogCard blog={blog} />
                      {(index + 1) % 6 === 0 && blog.showAds && (
                        <div className="mt-6"><AdBanner /></div>
                      )}
                    </div>

                    {shouldInjectPartnerSlot && partner1 && (
                      <div className="flex flex-col justify-between space-y-4 h-full bg-slate-50 p-4 border border-slate-200/60 rounded-2xl shadow-xs">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">✨ Sponsored Links</span>
                          <span className="text-[8px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase">Verified</span>
                        </div>
                        <div className="flex-1"><PremiumMiniPartnerCard partner={partner1} /></div>
                        {partner2 && (
                          <div className="flex-1"><PremiumMiniPartnerCard partner={partner2} /></div>
                        )}
                      </div>
                    )}
                  </Fragment>
                );
              })}
            </div>

            {/* 👑 DYNAMIC PAGINATION CONTROLLER BUTTON */}
            {filteredBlogs.length > visibleCount && (
              <div className="flex justify-center mt-16">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 12)}
                  className="px-8 py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer"
                >
                  Load More Bulletins ▾
                </button>
              </div>
            )}
          </section>
        )}
      </main>

      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 25s linear infinite; display: inline-flex; min-width: 100%; }
        .animate-marquee:hover { animation-play-state: paused; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ef4444; border-radius: 10px; }
        @media (prefers-reduced-motion: reduce) { .animate-marquee { animation: none; } }
      `}</style>
    </div>
  );
}