"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Overview", href: "/dashboard", icon: "🏠" },
    { name: "Tax Planner", href: "/calculator", icon: "📈" },
    { name: "Services", href: "/dashboard/services", icon: "🛠️" },
    { name: "My Orders", href: "/dashboard/orders", icon: "🛒" },
    { name: "My Profile", href: "/dashboard/client/profile", icon: "👤" },
    { name: "My Documents", href: "/dashboard/client/documents", icon: "📁" },
    { name: "Payments", href: "/dashboard/client/payments", icon: "💳" },
    { name: "Support", href: "/dashboard/client/support", icon: "💬" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      
      {/* --- SIDEBAR (Desktop) --- */}
<aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col fixed h-screen z-50 overflow-y-auto custom-scrollbar">
        <div className="p-8 mt-8">
          <Link href="/" className="flex items-center gap-2">
            <div className=" w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white italic text-xl shadow-lg shadow-blue-200">T</div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter italic">Tax<span className="text-blue-600">Adhaar</span></span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[15px] font-bold transition-all duration-200 ${
                  isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900" // White bg par black/dark text
                }`}
              >
                <span className={`text-xl ${isActive ? "grayscale-0" : "grayscale opacity-70"}`}>{link.icon}</span>
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-100">
          <button 
            onClick={() => signOut()}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
          >
            <span className="text-lg">🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* --- MOBILE NAVBAR (Top) --- */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-[100] px-6 py-4 flex justify-between items-center shadow-sm">
        <Link href="/" className="font-black text-xl italic tracking-tighter text-slate-900">
          T<span className="text-blue-600">P.</span>
        </Link>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center text-white text-xl active:scale-95 transition-transform"
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* --- MOBILE MENU OVERLAY --- */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-[90] pt-24 px-6 flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
           <div className="mb-4 px-2">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Main Menu</p>
           </div>
           {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-4 px-6 py-5 rounded-2xl text-lg font-bold transition-active ${
                  pathname === link.href 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                    : "bg-slate-50 text-slate-900 border border-slate-100" // Yahan text clear black/slate-900 hai
                }`}
              >
                <span className="text-2xl">{link.icon}</span> {link.name}
              </Link>
           ))}
           <button 
              onClick={() => signOut()}
              className="mt-auto mb-10 bg-red-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg shadow-red-100"
            >
              Sign Out Account
            </button>
        </div>
      )}

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 lg:ml-72 pt-20 lg:pt-0 min-h-screen">
        <div className="p-6 md:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}