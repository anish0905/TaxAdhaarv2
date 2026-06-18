"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, CreditCard, Laptop, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

// 🎨 SMART ICON PICKER FOR CATEGORIES
const getCategoryIcon = (nameStr: string) => {
  const name = nameStr?.toLowerCase() || "";
  if (name.includes("book") || name.includes("finance") || name.includes("money") || name.includes("mutual")) {
    return <BookOpen size={14} className="text-emerald-500" />;
  }
  if (name.includes("card") || name.includes("tax") || name.includes("wealth") || name.includes("credit") || name.includes("adhaar")) {
    return <CreditCard size={14} className="text-amber-500" />;
  }
  if (name.includes("tech") || name.includes("dev") || name.includes("keyboard") || name.includes("gadget") || name.includes("workspace")) {
    return <Laptop size={14} className="text-blue-500" />;
  }
  return <Sparkles size={14} className="text-purple-500" />;
};

export default function ToolkitCarousel({ items }: { items: any[] }) {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!items || items.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [items, isHovered]);

  if (!items || items.length === 0) return null;

  const currentCategory = items[index];

  const displayTitle = currentCategory.name || "Premium Hub";
  const displayDesc = currentCategory.description || "Explore curated premium resources and tactical solutions under this ecosystem.";
  
  // 📸 क्लाउडिनरी इमेजेस एरे से सेफ़ पाथ एक्स्ट्रैक्टर भाई
  const displayImage = Array.isArray(currentCategory.images) && currentCategory.images.length > 0
    ? currentCategory.images[0]
    : "/placeholder-tax.jpg";

  return (
    <div 
      className="w-full max-w-lg mx-auto relative bg-white border border-slate-100 rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-slate-100/50 min-h-[460px] flex flex-col justify-between group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col flex-1 justify-between"
        >
          <div>
            {/* 📸 क्लाउडिनरी इमेज रेंडरर */}
            <div className="w-full h-52 relative rounded-[1.8rem] overflow-hidden bg-slate-50 border border-slate-100/80 p-6 mb-6 flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:border-blue-100">
              <img
                src={displayImage}
                alt={displayTitle}
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder-tax.jpg";
                }}
              />
            </div>

            {/* Badges Matrix */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 px-3 py-1 rounded-xl shadow-sm">
                {getCategoryIcon(currentCategory.name)}
                <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">
                  {displayTitle}
                </span>
              </div>
              <span className="text-[9px] font-black text-blue-700 bg-blue-50 border border-blue-100/60 px-3 py-1 rounded-xl uppercase tracking-wider">
                Ecosystem Node
              </span>
            </div>

            {/* Typography */}
            <h3 className="text-2xl font-black text-slate-900 leading-snug tracking-tight line-clamp-1">
              {displayTitle}
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-2 line-clamp-2 leading-relaxed">
              {displayDesc}
            </p>
          </div>

          {/* Action Box Link */}
          <div className="pt-6 mt-6 border-t border-slate-100">
            <Link
              href={`/toolkit?category=${currentCategory.slug}`}
              className="group/btn w-full inline-flex items-center justify-center gap-2 bg-[#020617] text-white font-black text-xs uppercase tracking-wider py-4 rounded-2xl shadow-md shadow-slate-900/10 hover:bg-blue-600 hover:shadow-blue-600/20 transition-all duration-300"
            >
              Explore Hub 
              <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 🟢 Navigation Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === index ? "w-6 bg-blue-600 shadow-sm shadow-blue-600/50" : "w-1.5 bg-slate-200 hover:bg-slate-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}