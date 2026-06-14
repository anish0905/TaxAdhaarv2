"use client";

import { useState, useEffect, useMemo, memo } from "react";
import Link from "next/link";
import Image from "next/image";

// ============================================================================
// TYPES
// ============================================================================
interface Category {
  _id: string;
  name: string;
  slug: string;
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
// HELPER FUNCTIONS
// ============================================================================
const formatNewsDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "Invalid date";
  }
};

// 💡 FIX 1: Safe Truncate Check (Ab khali values par crash nahi hoga)
const truncateText = (text: string | null | undefined, maxLength: number): string => {
  if (!text) return ""; 
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};

// ============================================================================
// MEMOIZED COMPONENTS
// ============================================================================

const LoadingSpinner = memo(() => (
  <div className="flex justify-center items-center h-screen bg-slate-50">
    <div className="relative flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-brand-red border-r-transparent border-b-brand-dark border-l-transparent" />
      <span className="absolute text-[10px] font-bold uppercase tracking-widest text-gray-500 animate-pulse">
        TAX
      </span>
    </div>
  </div>
));
LoadingSpinner.displayName = "LoadingSpinner";

const CategoryButton = memo(
  ({
    name,
    isActive,
    onClick,
    variant = "default",
  }: {
    name: string;
    isActive: boolean;
    onClick: () => void;
    variant?: "default" | "red";
  }) => (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
        isActive
          ? variant === "red"
            ? "bg-brand-red text-white shadow-md shadow-red-600/20"
            : "bg-brand-dark text-white shadow-md shadow-slate-900/20"
          : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      {name}
    </button>
  )
);
CategoryButton.displayName = "CategoryButton";

const NotificationItem = memo(({ notification }: { notification: TaxNotification }) => (
  <div
    className={`p-3.5 rounded-xl transition-all border ${
      notification.isUrgent
        ? "bg-red-950/40 border-red-900/50 hover:bg-red-950/60"
        : "bg-slate-900/60 border-slate-800 hover:bg-slate-900"
    }`}
  >
    <a href={notification.link || "#"} target="_blank" rel="noreferrer" className="block group">
      <h4
        className={`text-xs font-bold leading-snug mb-2 ${
          notification.isUrgent
            ? "text-red-400 group-hover:text-red-300"
            : "text-slate-200 group-hover:text-white"
        } line-clamp-2 transition-colors`}
      >
        {notification.isUrgent && "🚨 "}
        {notification.title}
      </h4>
      <div className="flex items-center justify-between mt-1 text-[9px] font-black uppercase tracking-widest text-slate-500">
        <span>Circular Alert</span>
        <span className={notification.isUrgent ? "text-brand-accent" : "text-slate-400"}>
          {notification.isUrgent ? "⚡ Urgent" : "View ↗"}
        </span>
      </div>
    </a>
  </div>
));
NotificationItem.displayName = "NotificationItem";

const AdBanner = memo(({ className = "" }: { className?: string }) => (
  <div
    className={`w-full bg-white border border-slate-200 rounded-xl p-2 shadow-sm flex items-center justify-center ${className}`}
  >
    <div className="w-full bg-gradient-to-br from-slate-50 to-slate-100 h-24 flex flex-col items-center justify-center text-[10px] text-slate-400 font-mono tracking-widest uppercase rounded-lg border border-dashed border-slate-300">
      <span className="text-slate-500 text-xs mb-1">Advertisement</span>
      <span>-- Google AdSense Placement --</span>
    </div>
  </div>
));
AdBanner.displayName = "AdBanner";

// Featured Blog Component - FIXED COPT WITH NEXT/IMAGE
const FeaturedBlog = memo(({ blog }: { blog: Blog }) => (
  <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 group flex flex-col h-full">
    <Link
      href={`/blogs/${blog.slug}`}
      className="block relative h-[380px] md:h-[440px] w-full bg-slate-900 overflow-hidden"
    >
      <div className="relative w-full h-full">
        {/* 💡 FIX 2: Replaced <img> with Next.js <Image /> component */}
        <Image
          src={typeof blog.mainImage === "string" && blog.mainImage.startsWith("http") ? blog.mainImage : "/placeholder-tax.jpg"}
          alt={blog.title || "Featured Blog"}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 1024px) 100vw, 66vw"
          priority
          unoptimized={process.env.NODE_ENV === "development"}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
      <span className="absolute top-4 left-4 bg-brand-red text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-md shadow-md z-10">
        🔥 {blog.category?.name || "Tax Spotlight"}
      </span>
    </Link>
    <div className="p-6 md:p-8 flex flex-col flex-grow">
      <h2 className="text-2xl md:text-3xl font-black text-slate-900 group-hover:text-brand-red transition-colors duration-200 mb-3 leading-tight tracking-tight">
        <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
      </h2>
      <p className="text-slate-600 text-sm md:text-base line-clamp-3 mb-6 leading-relaxed">
        {truncateText(blog.excerpt || "", 160)}
      </p>
      <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mt-auto pt-4 border-t border-slate-100">
        <div className="flex items-center space-x-3">
          <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase">
            Editorial
          </span>
          <span>{formatNewsDate(blog.createdAt)}</span>
        </div>
        <span className="flex items-center text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
          👁️&nbsp;{(blog.views ?? 0).toLocaleString()} Views
        </span>
      </div>
    </div>
  </article>
));
FeaturedBlog.displayName = "FeaturedBlog";

// Blog Card Component - FIXED COPY WITH NEXT/IMAGE
const BlogCard = memo(({ blog }: { blog: Blog }) => (
  <article className="flex flex-col group h-full">
    <Link
      href={`/blogs/${blog.slug}`}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 flex flex-col h-full"
    >
      <div className="h-52 w-full bg-slate-100 relative overflow-hidden">
        {/* 💡 FIX 3: Replaced <img> with Next.js <Image /> component */}
        <Image
          src={typeof blog.mainImage === "string" && blog.mainImage.startsWith("http") ? blog.mainImage : "/placeholder-tax.jpg"}
          alt={blog.title || "Blog Image"}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized={process.env.NODE_ENV === "development"}
        />
        <span className="absolute top-3 left-3 bg-brand-dark/90 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md backdrop-blur-sm z-10">
          {blog.category?.name || "Tax Audit"}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h4 className="font-extrabold text-slate-900 group-hover:text-brand-red transition-colors text-base line-clamp-2 mb-2 leading-snug tracking-tight">
          {blog.title}
        </h4>
        <p className="text-slate-500 text-xs line-clamp-2 mb-5 leading-relaxed flex-grow">
          {truncateText(blog.excerpt || "", 100)}
        </p>
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
// MAIN COMPONENT
// ============================================================================
export default function PremiumNewsPortal() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [notifications, setNotifications] = useState<TaxNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogRes, catRes, notiRes] = await Promise.all([
          fetch("/api/blogs"),
          fetch("/api/categories"),
          fetch("/api/notifications"),
        ]);

        const [blogData, catData, notiData] = await Promise.all([
          blogRes.json(),
          catRes.json(),
          notiRes.json(),
        ]);

        if (blogData.success) setBlogs(blogData.data);
        if (catData.success) setCategories(catData.data);
        if (notiData.success) setNotifications(notiData.data);
      } catch (err) {
        console.error("Error fetching portal data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredBlogs = useMemo(() => {
    if (selectedCategory === "all") return blogs;
    return blogs.filter(
      (blog) =>
        blog.category?._id === selectedCategory || blog.category?.slug === selectedCategory
    );
  }, [blogs, selectedCategory]);

  const { featuredBlog, remainingBlogs } = useMemo(
    () => ({
      featuredBlog: filteredBlogs[0],
      remainingBlogs: filteredBlogs.slice(1),
    }),
    [filteredBlogs]
  );

  const hasAds = useMemo(() => blogs.some((b) => b.showAds), [blogs]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans text-slate-900 selection:bg-brand-red selection:text-white">
      {/* BREAKING TICKER */}
      <div className="bg-brand-red text-white flex items-center h-11 overflow-hidden shadow-inner sticky top-0 z-50 border-b border-red-700">
        <div className="bg-brand-dark text-[11px] font-black uppercase tracking-widest px-5 h-full flex items-center z-20 whitespace-nowrap shadow-lg">
          <span className="w-2 h-2 rounded-full bg-red-500 mr-2 inline-block animate-ping" />
          Breaking Updates
        </div>
        <div className="w-full overflow-hidden relative flex items-center bg-brand-red py-1">
          <div className="animate-marquee whitespace-nowrap flex space-x-12 text-sm font-bold tracking-wide">
            {notifications.length > 0 ? (
              notifications.map((noti) => (
                <a
                  key={noti._id}
                  href={noti.link || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-brand-accent transition flex items-center text-white"
                >
                  {noti.isUrgent ? "🚨 " : "• "}
                  {noti.title}
                </a>
              ))
            ) : (
              <span>
                Welcome to TaxAdhaar Portal: Real-time Income Tax, GST, and Corporate Law Circulars Live.
              </span>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* CATEGORY FILTER BAR */}
        <div
          className={`bg-white border border-slate-200 p-3 rounded-2xl shadow-sm mb-6 transition-all duration-300 z-40 ${
            isSticky ? "sticky top-11 backdrop-blur-md bg-white/95 shadow-md" : ""
          }`}
        >
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none scroll-smooth">
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider pr-2 border-r hidden md:inline-block">
              📁 Topics:
            </span>

            <CategoryButton
              name="All Tax News"
              isActive={selectedCategory === "all"}
              onClick={() => setSelectedCategory("all")}
            />

            {categories.map((cat) => (
              <CategoryButton
                key={cat._id}
                name={cat.name}
                isActive={selectedCategory === cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                variant="red"
              />
            ))}
          </div>
        </div>

        {hasAds && <AdBanner className="mb-8" />}

        {/* HERO SECTION + SIDEBAR */}
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

          <aside className="bg-brand-dark text-white rounded-2xl shadow-xl p-6 border border-slate-800 h-fit flex flex-col relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <h3 className="text-base font-black uppercase tracking-wider flex items-center text-white">
                <span className="w-2.5 h-2.5 bg-brand-red rounded-full mr-2.5 animate-pulse" />
                Official Bulletins
              </h3>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                {notifications.length} New
              </span>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1 custom-scrollbar">
              {notifications.length > 0 ? (
                notifications.map((noti) => (
                  <NotificationItem key={noti._id} notification={noti} />
                ))
              ) : (
                <div className="text-center text-slate-400 py-8 text-sm">
                  No new notifications
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* REMAINING NEWS GRID */}
        {remainingBlogs.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-8">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center">
                <span className="bg-brand-dark text-white text-xs px-2 py-1 rounded mr-2.5">
                  STREAM
                </span>
                More In This Section
              </h3>
              <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                {remainingBlogs.length} articles
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {remainingBlogs.map((blog, index) => (
                <div key={blog._id} className="flex flex-col">
                  <BlogCard blog={blog} />

                  {(index + 1) % 3 === 0 && blog.showAds && (
                    <div className="mt-6">
                      <AdBanner />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
          display: inline-flex;
          min-width: 100%;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ef4444;
          border-radius: 10px;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee { animation: none; }
        }
      `}</style>
    </div>
  );
}