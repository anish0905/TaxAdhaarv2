"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { 
  LayoutDashboard, 
  Clock, 
  CheckCircle2, 
  UserCircle, 
  Menu, 
  X,
  ChevronRight
} from "lucide-react";

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // 1. Menu Links ko yahan define karein (Error Fix)
  const menuLinks = [
    { 
      name: "Dashboard", 
      href: "/staff/dashboard", 
      icon: <LayoutDashboard size={20} /> 
    },
    { 
      name: "Active Queue", 
      href: "/staff/active-orders", 
      icon: <Clock size={20} />,
      badge: "Paid"
    },
    { 
      name: "My Completed", 
      href: "/staff/completed", 
      icon: <CheckCircle2 size={20} /> 
    },
    { 
      name: "Profile", 
      href: "/staff/profile", 
      icon: <UserCircle size={20} /> 
    },
  ];

  // Mobile par route change hote hi sidebar band karne ke liye
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      
      {/* --- MOBILE HEADER (Sirf Mobile pe dikhega) --- */}
      <div className="lg:hidden w-full bg-[#020617] text-white p-4 flex justify-between items-center sticky top-0 z-[100] border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black italic">S</div>
          <span className="font-bold uppercase tracking-tighter">Staff Portal</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-white/5 rounded-lg"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-[90] w-72 bg-[#020617] text-white transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        lg:sticky lg:h-screen
      `}>
        
        {/* LOGO (Desktop) */}
        <div className="p-8 hidden lg:block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-xl italic shadow-lg">S</div>
            <div>
              <h2 className="text-lg font-black tracking-tighter uppercase leading-none">
                Staff <span className="text-blue-500 italic">Portal</span>
              </h2>
            </div>
          </div>
        </div>

        {/* MENU LINKS */}
        <nav className="flex-1 px-4 py-6 lg:py-0 space-y-2 overflow-y-auto">
          <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Main Menu</p>
          
          {menuLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  group flex items-center justify-between px-4 py-4 rounded-2xl transition-all
                  ${isActive 
                    ? "bg-blue-600 text-white shadow-lg" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"}
                `}
              >
                <div className="flex items-center gap-4">
                  <span className={isActive ? "text-white" : "text-slate-500"}>{link.icon}</span>
                  <span className="text-sm font-bold">{link.name}</span>
                </div>
                {link.badge && (
                  <span className="bg-orange-500/20 text-orange-400 text-[8px] font-black px-2 py-1 rounded-lg">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT AREA */}
        <div className="p-6 border-t border-white/5">
          <LogoutButton />
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 w-full min-h-screen">
        <div className="p-4 sm:p-6 lg:p-10">
          {children}
        </div>
      </main>

      {/* OVERLAY (Mobile only) */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] lg:hidden"
        />
      )}
    </div>
  );
}