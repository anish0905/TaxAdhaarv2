"use client";
import { useState } from "react";
import { servicesData } from "@/data/services";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import ServiceGrid from "@/components/home/ServiceGrid";

export default function ServicesHub() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", ...new Set(Object.values(servicesData).map((s: any) => s.category))];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24 pt-4 md:pt-10 px-4 md:px-10">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-10">
        
        {/* HEADER & SEARCH BLOCK - Responsive Padding & Text */}
        {/* <div className="flex flex-col gap-6 bg-white p-5 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-sm border border-slate-100">
          <div className="space-y-1 text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-tight">
              Service Hub
            </h1>
            <p className="text-[10px] md:text-xs font-bold text-slate-400 tracking-widest uppercase">
              Select & Start your compliance journey
            </p>
          </div>

          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Search e.g. GST, ITR..."
              className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-xl md:rounded-2xl outline-none text-sm font-bold transition-all shadow-inner md:shadow-none"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div> */}

        {/* CATEGORY FILTER - Mobile: Touch-friendly Horizontal Scroll */}
        <div className="flex flex-col gap-3">
          {/* <div className="flex items-center gap-2 px-1 text-slate-400">
             <SlidersHorizontal size={14} />
             <span className="text-[10px] font-black uppercase tracking-widest">Filter Category</span>
          </div> */}
          
          {/* Scrollable Container with Hidden Scrollbar */}
          {/* <div className="flex overflow-x-auto pb-4 gap-2 md:gap-3 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-5 py-3 md:px-8 md:py-3.5 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 shrink-0 active:scale-95 ${
                  activeCategory === cat 
                  ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200" 
                  : "bg-white text-slate-500 border-white hover:border-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div> */}
        </div>

        {/* SERVICES DISPLAY AREA */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Ensure ServiceGrid inside also uses grid-cols-1 md:grid-cols-2 */}
          <ServiceGrid 
            // filterCategory={activeCategory} 
            // searchQuery={searchQuery} 
          />
        </div>
      </div>

      {/* CSS for hiding scrollbars while maintaining functionality */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}