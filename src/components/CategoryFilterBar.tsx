"use client";

import { useState, useMemo, useEffect, useRef, memo } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

// ============================================================================
// 🎯 MEMOIZED CATEGORY CHIP BUTTON
// ============================================================================
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
      className={`px-3 py-1.5 md:px-4 md:py-1.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap active:scale-[0.97] border ${
        isActive
          ? variant === "red"
            ? "bg-brand-red text-white border-brand-red shadow-sm shadow-red-600/10"
            : "bg-brand-dark text-white border-brand-dark shadow-sm shadow-slate-900/10"
          : "bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      {name}
    </button>
  )
);
CategoryButton.displayName = "CategoryButton";

// ============================================================================
// 🏛️ MAIN FILTER INTERFACE COMPONENT
// ============================================================================
interface FilterBarProps {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (slug: string) => void;
  isSticky: boolean;
}

export default function CategoryFilterBar({
  categories,
  selectedCategory,
  setSelectedCategory,
  isSticky,
}: FilterBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // क्लोज ड्रॉपडाउन ऑन आउटसाइड क्लिक नोड
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🎯 ADAPTIVE LOGIC: डिवाइडिंग कैटेगरीज बिटवीन आउटर शेल एंड इनर ड्रावर
  const { visibleCategories, hiddenCategories } = useMemo(() => {
    return {
      visibleCategories: categories.slice(0, 3), // शुरुआती 3 बटन्स बाहर रहेंगे
      hiddenCategories: categories.slice(3),      // बाकी सब ड्रावर के अंदर लॉक
    };
  }, [categories]);

  // चेक करो कि क्या हिडन कैटेगरी एक्टिव है स्लग के आधार पर भाई
  const isHiddenCategoryActive = useMemo(() => {
    return hiddenCategories.some((cat) => selectedCategory === cat.slug);
  }, [hiddenCategories, selectedCategory]);

  return (
    <div
      className={`bg-white border border-slate-200/80 p-3 md:p-4 rounded-2xl shadow-sm mb-6 transition-all duration-300 z-40 ${
        isSticky
          ? "sticky top-11 backdrop-blur-md bg-white/95 shadow-md mx-[-8px] sm:mx-0 rounded-t-none sm:rounded-2xl border-x-0 sm:border-x"
          : ""
      }`}
    >
      {/* 💻 DESKTOP DYNAMIC WRAP GRID (lg): ब्यूटीफुली अरेंज्ड मल्टी-लाइन रोज़ */}
      <div className="hidden lg:flex flex-wrap items-center gap-2 md:gap-2.5">
        <span className="text-[11px] font-black uppercase text-slate-400 tracking-widest pr-2 border-r border-slate-200 flex items-center gap-1.5 shrink-0 select-none">
          <SlidersHorizontal size={12} /> Topics
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
            isActive={selectedCategory === cat.slug} // ✅ स्लग से कंपेयर लॉक किया भाई
            onClick={() => setSelectedCategory(cat.slug)}
            variant="red"
          />
        ))}
      </div>

      {/* 📱 MOBILE ARCHITECTURE SLOT (<lg): कंपैक्ट 3 बटन्स + 1 ड्रॉपडाउन */}
      <div className="flex lg:hidden items-center justify-between gap-1.5 relative w-full" ref={dropdownRef}>
        <div className="flex items-center gap-1.5 overflow-x-hidden w-full">
          <CategoryButton
            name="All"
            isActive={selectedCategory === "all"}
            onClick={() => setSelectedCategory("all")}
          />
          {visibleCategories.map((cat) => (
            <CategoryButton
              key={cat._id}
              name={cat.name}
              isActive={selectedCategory === cat.slug} // ✅ स्लग कंपैरिजन फिक्स
              onClick={() => setSelectedCategory(cat.slug)}
              variant="red"
            />
          ))}
        </div>

        {/* ▾ जादुई "More" ट्रिगर बटन */}
        {hiddenCategories.length > 0 && (
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border flex items-center gap-1 transition-all shrink-0 select-none ${
              isHiddenCategoryActive
                ? "bg-brand-red text-white border-brand-red shadow-sm shadow-red-600/10"
                : "bg-slate-900 text-white border-slate-900"
            }`}
          >
            More {hiddenCategories.length}
            <ChevronDown size={12} className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>
        )}

        {/* 🪐 एप्पल-स्टाइल ड्रॉपडाउन पैनल (सिर्फ क्लिक करने पर ही एक्टिव होगा भाई) */}
        {dropdownOpen && (
          <div className="absolute right-0 top-11 w-52 bg-white border border-slate-200 shadow-xl rounded-2xl p-2.5 flex flex-col gap-1.5 z-50 text-left">
            <div className="text-[9px] font-black tracking-widest text-slate-400 uppercase border-b border-slate-100 pb-1.5 mb-1 px-1">
              Other Segments
            </div>
            {hiddenCategories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => {
                  setSelectedCategory(cat.slug); // ✅ सही स्लग रीयल-टाइम ट्रांसफर
                  setDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-colors ${
                  selectedCategory === cat.slug
                    ? "bg-brand-red text-white"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}