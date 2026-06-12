"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  mainImage: string;
  category: { name: string; slug: string };
  views: number;
  showAds: boolean;
  keywords: string;
  tags: string;
  createdAt: string;
}

interface TaxNotification {
  _id: string;
  title: string;
  link: string;
  isUrgent: boolean;
}

export default function IndividualBlogPage({ params }: { params: Promise<{ slug: string }> }) {
  // Next.js 16 के नियमों के अनुसार params को unwrapping (use) करना ज़रूरी है
  const { slug } = use(params);

  const [blog, setBlog] = useState<Blog | null>(null);
  const [notifications, setNotifications] = useState<TaxNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [formattedDate, setFormattedDate] = useState(""); // हाइड्रेशन एरर रोकने के लिए सेफ़ डेट स्टेट

  useEffect(() => {
    async function fetchArticleData() {
      try {
        // 1. Fetch current blog by slug
        const res = await fetch(`/api/blogs/${slug}`);
        const result = await res.json();
        if (result.success) {
          setBlog(result.data);
          
          // क्रिटिकल फिक्स: केवल क्लाइंट साइड पर डेट फॉर्मेट करें ताकि सर्वर-क्लाइंट टाइम मिसमैच एरर न आए
          if (result.data?.createdAt) {
            const dateObj = new Date(result.data.createdAt);
            setFormattedDate(
              dateObj.toLocaleString("en-IN", {
                dateStyle: "long",
                timeStyle: "short",
              })
            );
          }
        }

        // 2. Side ticker के लिए ताज़ा नोटिफिकेशन्स लाएँ
        const notiRes = await fetch("/api/notifications");
        const notiData = await notiRes.json();
        if (notiData.success) setNotifications(notiData.data);
      } catch (err) {
        console.error("Error loading article:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticleData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-20 bg-gray-50 min-h-screen text-black">
        <h2 className="text-2xl font-bold text-gray-800">⚠️ समाचार नहीं मिला!</h2>
        <p className="text-gray-500 mt-2">हो सकता है यह आर्टिकल डिलीट कर दिया गया हो या इसका URL गलत हो।</p>
        <Link href="/blogs" className="mt-4 inline-block px-5 py-2.5 bg-brand-red text-white font-bold rounded-lg">
          ← वापस मुख्य पोर्टल पर जाएँ
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen text-black font-sans">
      
      {/* PREMIUM HEADER BREADCRUMB */}
      <div className="bg-brand-dark text-white py-4 border-b border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          <Link href="/blogs" className="hover:text-white transition">Home</Link>
          <span>/</span>
          <span className="text-brand-accent">{blog.category?.name || "Tax Updates"}</span>
          <span>/</span>
          <span className="text-gray-200 truncate max-w-xs">{blog.title}</span>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SIDE: COMPLETE ARTICLE (2 Columns width) */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            
            {/* Category Tag & View Counter */}
            <div className="flex items-center justify-between mb-4">
              <span className="bg-red-50 text-brand-red text-xs font-black uppercase tracking-wider px-3 py-1 rounded-md">
                {blog.category?.name}
              </span>
              <span className="text-xs font-bold text-gray-400 flex items-center">
                👁️ {blog.views} Views
              </span>
            </div>

            {/* Main H1 Title */}
            <h1 className="text-2xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
              {blog.title}
            </h1>

            {/* Date and Author Stamp */}
            <div className="text-xs text-gray-400 border-b pb-4 mb-6 flex items-center space-x-2">
              <span className="font-bold text-gray-700">Tax Portal Desk</span>
              <span>•</span>
              {/* 100% सेफ़ डेट रेंडरिंग */}
              <span>Updated: {formattedDate || "Loading date..."}</span>
            </div>

            {/* 1. TOP ARTICLE AD (If enabled) */}
            {blog.showAds && (
              <div className="w-full bg-gray-100 h-24 mb-6 flex items-center justify-center text-[10px] text-gray-400 tracking-widest uppercase border rounded">
                -- Google AdSense Banner (BELOW_TITLE) --
              </div>
            )}

            {/* Big Featured Image Banner */}
            <div className="w-full h-64 md:h-[400px] rounded-xl overflow-hidden mb-6 bg-gray-100">
              <img
                src={blog.mainImage}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* News Short Excerpt */}
            <p className="text-gray-600 italic text-base border-l-4 border-brand-red pl-4 mb-6 font-medium leading-relaxed">
              "{blog.excerpt}"
            </p>

            {/* HTML / Rich Text Article Body */}
            <div 
              className="prose prose-blue max-w-none text-gray-800 text-base leading-relaxed space-y-4 font-normal"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Focus Keywords / Tags for SEO */}
            {blog.tags && (
              <div className="mt-8 pt-4 border-t border-gray-100 flex flex-wrap gap-2 items-center">
                <span className="text-xs font-bold text-gray-400 mr-2">TAGS:</span>
                {blog.tags.split(",").map((tag, i) => (
                  <span key={i} className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-md">
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* 2. BOTTOM ARTICLE AD */}
            {blog.showAds && (
              <div className="w-full bg-gray-100 h-24 mt-8 flex items-center justify-center text-[10px] text-gray-400 tracking-widest uppercase border rounded">
                -- Google AdSense Banner (BELOW_ARTICLE) --
              </div>
            )}

          </div>

          {/* RIGHT SIDE: LIVE ALERTS AND BANNER ADS */}
          <div className="space-y-6">
            
            {/* Live Notifications Box */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between border-b pb-3 mb-4">
                <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider flex items-center">
                  <span className="w-2.5 h-2.5 bg-brand-red rounded-full mr-2"></span>
                  Live Flash Bulletins
                </h3>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
              </div>

              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                {notifications.map((noti) => (
                  <div key={noti._id} className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition border-l-4 border-gray-300 hover:border-brand-red">
                    <a href={noti.link || "#"} target="_blank" rel="noreferrer" className="block">
                      <h4 className={`text-xs font-bold ${noti.isUrgent ? "text-red-700" : "text-gray-800"} line-clamp-2 hover:underline`}>
                        {noti.title}
                      </h4>
                    </a>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-4">कोई नया नोटिफिकेशन नहीं है।</p>
                )}
              </div>
            </div>

            {/* 3. SIDEBAR SQUARE AD PLACEMENT */}
            <div className="w-full bg-gray-200 h-[300px] flex items-center justify-center text-xs text-gray-400 tracking-widest uppercase border rounded-2xl shadow-sm">
              -- Square AdSense Ad (BLOG_SIDEBAR) --
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}