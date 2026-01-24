"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react"; // Session fetch karne ke liye
import { 
  Bell, Search, Wallet, Menu, X, 
  LayoutDashboard, Users, IndianRupee, 
  BarChart3, LogOut, TrendingUp 
} from "lucide-react";

const marketingNav = [
  { name: 'Overview', icon: <LayoutDashboard size={20}/>, href: '/field-marketing/dashboard' },
  { name: 'My Earnings', icon: <IndianRupee size={20}/>, href: '/field-marketing/earnings' },
  { name: 'My Team', icon: <Users size={20}/>, href: '/field-marketing/team' },
  { name: 'Performance', icon: <BarChart3 size={20}/>, href: '/field-marketing/performance' },
  { name: 'Payouts', icon: <Wallet size={20}/>, href: '/field-marketing/payouts' },
];

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  
  // --- DYNAMIC DATA FETCHING ---
  const { data: session, status } = useSession();
  const user = session?.user;

  // Jab tak data load ho raha ho
  const isLoading = status === "loading";

  // Dynamic Name & Initials Logic
  const userName = user?.name || "Partner";
  const userRole = (user as any)?.role?.replace("-", " ") || "Field Member";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Note: Wallet balance ke liye aapko alag se API call karni hogi ya session mein balance store karna hoga
  const userBalance = (user as any)?.referralEarnings?.balance || 0;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      
      {/* 1. SIDEBAR IMPLEMENTATION */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-72 bg-[#020617] transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col p-6
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="mb-12 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black italic text-white shadow-lg">
              AG
            </div>
            <h1 className="text-xl font-black uppercase tracking-tighter text-white">
              TaxClear <span className="text-blue-500 text-[10px] block font-medium tracking-widest">Marketing Hub</span>
            </h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          {marketingNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-blue-400'
                }`}
              >
                <span className={isActive ? 'text-white' : 'group-hover:text-blue-400 transition-colors'}>
                  {item.icon}
                </span>
                <span className="text-[11px] font-black uppercase tracking-[0.1em]">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5 space-y-2">
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all group"
          >
            <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
            <span className="text-[11px] font-black uppercase tracking-[0.1em]">Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        
        <header className="sticky top-0 z-40 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 lg:px-8 flex items-center justify-between">
          
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 mr-4 text-slate-600 lg:hidden hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Menu size={24} />
          </button>

          <div className="relative w-72 hidden md:block text-slate-900">
            <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
              <Search size={18} />
            </span>
            <input 
              type="text" 
              placeholder="Search leads..." 
              className="w-full bg-slate-100/50 border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none font-medium"
            />
          </div>

          <div className="flex items-center gap-3 md:gap-6 ml-auto">
            {/* DYNAMIC WALLET */}
            <div className="flex items-center gap-2 md:gap-3 bg-blue-50 px-3 md:px-4 py-1.5 md:py-2 rounded-2xl border border-blue-100 shadow-sm">
              <div className="w-7 h-7 md:w-8 md:h-8 bg-blue-600 rounded-lg md:rounded-xl flex items-center justify-center text-white">
                <Wallet size={14} />
              </div>
              <div className="whitespace-nowrap">
                <p className="text-[8px] md:text-[10px] font-black text-blue-400 uppercase leading-none tracking-tighter">Earnings</p>
                <p className="text-xs md:text-sm font-black text-blue-700 leading-tight">
                    ₹{isLoading ? "..." : userBalance.toLocaleString()}
                </p>
              </div>
            </div>

            {/* DYNAMIC USER PROFILE */}
            <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-slate-200">
              <div className="text-right hidden xl:block leading-tight">
                <p className="text-sm font-black text-slate-900 capitalize">
                    {isLoading ? "Loading..." : userName}
                </p>
                <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">
                    {userRole}
                </p>
              </div>
              <div className="w-10 h-10 bg-[#020617] rounded-xl flex items-center justify-center text-white shadow-lg font-black text-xs border-2 border-white">
                {isLoading ? "..." : userInitials}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}