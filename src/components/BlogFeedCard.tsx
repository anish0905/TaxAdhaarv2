"use client";

import { memo } from "react";
import Image from "next/image";

// Types derived accurately from architecture with strict null safety check nodes
interface BlogCardProps {
  blog: any;
  index: number;
  lastElementRef: ((node: HTMLDivElement | null) => void) | null;
  formatBlogDate: (date: string) => string;
  ToolkitInFeedWidget: any;
  PartnerCard: any;
  feedPartners: any[];
  BulletinsWidget: any;
}

export const BlogFeedCard = memo(({
  blog,
  index,
  lastElementRef,
  formatBlogDate,
  ToolkitInFeedWidget,
  PartnerCard,
  feedPartners,
  BulletinsWidget
}: BlogCardProps) => {

  // सेफ़्टी गार्ड: अगर किसी वजह से ब्लॉग ऑब्जेक्ट अधूरा या खाली आए तो क्रैश न हो भाई
  if (!blog || !blog.title) return null;

  return (
    <div
      ref={lastElementRef}
      data-blog-slug={blog.slug}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-8 transition-all relative text-left"
    >
      {/* 🌌 रिकमेंडेड पोस्ट्स के लिए फ्लोटिंग एंकर बैज */}
      {index > 0 && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-white text-[10px] font-black tracking-widest px-5 py-1.5 rounded-full uppercase shadow-lg bg-slate-900 select-none">
          ✨ Recommended Bulletins
        </div>
      )}

      {/* कार्ड हेडर: केटेगरी नेम और व्यूज */}
      <div className="flex items-center justify-between mb-4">
        <span className="bg-red-50 text-red-600 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-md">
          {blog.category?.name || "Tax Updates"}
        </span>
        <span className="text-xs font-bold text-gray-400">
          👁️ {blog.views ? blog.views.toLocaleString() : 0} Reads
        </span>
      </div>

      {/* 🚀 CRITICAL SEO HEADING STRUCTURE FIX (بिंग एरर को परमानेंटली कुचल दिया भाई) */}
      {index === 0 ? (
        <h1 className="text-2xl md:text-4xl font-black text-gray-900 leading-tight mb-4 tracking-tight">
          {blog.title}
        </h1>
      ) : (
        <h2 className="text-2xl md:text-4xl font-black text-gray-900 leading-tight mb-4 tracking-tight">
          {blog.title}
        </h2>
      )}

      {/* पब्लिशिंग टाइमलाइन */}
      <div className="text-xs text-gray-400 border-b pb-4 mb-6">
        <span className="font-bold text-gray-700">Tax Portal Desk</span> • Updated: {formatBlogDate(blog.createdAt)}
      </div>

      {/* मेन फीचर्ड इमेज बैनर */}
      <div className="w-full h-64 md:h-[400px] rounded-xl overflow-hidden mb-6 bg-gray-100 relative">
        <Image
          src={blog.mainImage || "/placeholder-tax.jpg"}
          alt={blog.title}
          fill
          className="object-cover"
          priority={index === 0}
          sizes="(max-width: 1024px) 100vw, 66vw"
          unoptimized={process.env.NODE_ENV === "development"}
        />
      </div>

      {/* एक्सेप्ट/मेटा समरी */}
      <p className="text-gray-600 italic text-base border-l-4 border-red-500 pl-4 mb-6 font-medium leading-relaxed">
        "{blog.excerpt}"
      </p>

      {/* HTML रेंडरिंग जोन (सेफ मोंगोडीबी कंटेंट स्ट्रीम) */}
      <div
        className="prose prose-slate max-w-none text-gray-800 text-base md:text-lg leading-relaxed space-y-4 font-normal mb-8"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* 🧰 TOOLKIT ECOSYSTEM INTEGRATION NODE */}
      <ToolkitInFeedWidget 
        categoryId={blog.category?._id} 
        categoryName={blog.category?.name} 
      />

      {/* कॉर्पोरेट एफिलिएट / स्पॉन्सर्ड पार्टनर्स स्लॉट */}
      {feedPartners && feedPartners.length > 0 && (
        <div className="my-8 space-y-3">
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest select-none">Sponsored Financial Partner</p>
          {feedPartners.map((partner: any) => (
            <PartnerCard key={`feed-p-${partner._id}`} partner={partner} variant="feed" />
          ))}
        </div>
      )}

      {/* एसईओ टैग क्लाउड */}
      {blog.tags && (
        <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-2 items-center mb-4">
          <span className="text-xs font-bold text-gray-400 mr-2 select-none">TAGS:</span>
          {blog.tags.split(",").map((tag: string, i: number) => (
            <span key={i} className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-md">
              #{tag.trim()}
            </span>
          ))}
        </div>
      )}

      {/* 📱 MOBILE VIEW COMPACT SLOT */}
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
});

BlogFeedCard.displayName = "BlogFeedCard";