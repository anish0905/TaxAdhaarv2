"use client";
import { useState } from "react";
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
  ChevronRight,
  Briefcase
} from "lucide-react";

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* MOBILE TRIGGER */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-[100] bg-blue-600 text-white p-4 rounded-full shadow-2xl"
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-[90] w-72 bg-[#020617] text-white transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        
        {/* LOGO */}
        <div className="p-8 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-xl italic shadow-lg shadow-blue-500/20">
              S
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tighter uppercase leading-none">
                Staff <span className="text-blue-500 italic">Portal</span>
              </h2>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">Management v1.0</p>
            </div>
          </div>
        </div>

        {/* MENU LINKS */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Primary Menu</p>
          
          {menuLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`
                  group flex items-center justify-between px-4 py-4 rounded-2xl transition-all duration-300
                  ${isActive 
                    ? "bg-blue-600 text-white shadow-xl shadow-blue-900/40" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"}
                `}
              >
                <div className="flex items-center gap-4">
                  <span className={`${isActive ? "text-white" : "text-slate-500 group-hover:text-blue-400"}`}>
                    {link.icon}
                  </span>
                  <span className="text-sm font-bold">{link.name}</span>
                </div>
                {link.badge ? (
                  <span className="bg-orange-500/20 text-orange-400 text-[8px] font-black px-2 py-1 rounded-lg">
                    {link.badge}
                  </span>
                ) : (
                  <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? "hidden" : ""}`} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* USER PROFILE & LOGOUT */}
        <div className="p-6 mt-auto">
          <div className="bg-white/5 rounded-[2rem] p-4 border border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white">
                ST
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-black truncate uppercase tracking-tight text-white">Team Member</p>
                <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">Active Now</p>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 lg:ml-72 min-h-screen">
        <div className="p-4 md:p-10">
          {children}
        </div>
      </main>

      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] lg:hidden"
        />
      )}
    </div>
  );
}