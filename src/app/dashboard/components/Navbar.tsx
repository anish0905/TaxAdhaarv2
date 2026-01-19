"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, FileText, UserCircle, LogOut } from "lucide-react";

export default function DashboardNavbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Overview", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Documents", href: "/dashboard/documents", icon: <FileText size={18} /> },
    { name: "Profile", href: "/dashboard/profile", icon: <UserCircle size={18} /> },
  ];

  // Disable scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex justify-between items-center sticky top-0 z-[50]">
        
        {/* Left: Mobile Toggle & Logo */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsOpen(true)}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Menu size={24} className="text-slate-900" />
          </button>
          
          <Link href="/dashboard" className="text-xl font-black text-blue-600 tracking-tighter italic lg:hidden">
            T<span className="text-slate-900">P.</span>
          </Link>
        </div>

        {/* Right: User Profile */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Client</p>
            <p className="text-xs font-black text-slate-900">{session?.user?.name || "User"}</p>
          </div>
          
          <div className="h-10 w-10 bg-[#020617] text-blue-500 rounded-xl flex items-center justify-center font-black italic shadow-md">
            {session?.user?.name?.charAt(0) || "U"}
          </div>
        </div>
      </nav>

      {/* --- MOBILE OVERLAY --- */}
      <div 
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[90] transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`} 
        onClick={() => setIsOpen(false)} 
      />

      {/* --- MOBILE SIDEBAR DRAWER --- */}
      <aside className={`fixed top-0 left-0 h-full w-[280px] bg-white z-[100] shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="p-6 flex justify-between items-center border-b border-slate-50">
          <span className="font-black italic text-blue-600 text-lg">MENU</span>
          <button onClick={() => setIsOpen(false)} className="p-2 bg-slate-50 rounded-lg">
            <X size={20}/>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-4 p-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                pathname === link.href ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </div>

        <div className="p-6 border-t border-slate-50 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black italic">
               {session?.user?.name?.charAt(0)}
            </div>
            <div className="min-w-0">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">Account</p>
               <p className="text-xs font-black text-slate-900 truncate">{session?.user?.name}</p>
            </div>
          </div>
          <button 
            onClick={() => signOut()}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-red-50 text-red-600 font-black text-[10px] uppercase tracking-[0.2em]"
          >
            <LogOut size={14}/> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}