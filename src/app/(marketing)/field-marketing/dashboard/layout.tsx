"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  Bell, Search, Wallet, Menu, X, 
  LayoutDashboard, Users, IndianRupee, 
  BarChart3, LogOut, TrendingUp, Loader2
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
  
  // 1. Session Fetch with status check
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const user = session?.user;

  // 2. Safe Fallback Logic (Prevents undefined crashes)
  const userName = user?.name || "Partner";
  const userRole = (user as any)?.role?.replace("_", " ") || "Field Marketing";
  
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Balance fetch with deep optional chaining
  const userBalance = (user as any)?.referralEarnings?.balance || 0;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
      
      {/* SIDEBAR OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-72 bg-[#020617] transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col p-6
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="mb-12 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black italic text-white shadow-lg shadow-blue-500/20">
              AG
            </div>
            <h1 className="text-xl font-black uppercase tracking-tighter text-white">
              TaxClear <span className="text-blue-500 text-[9px] block font-medium tracking-[0.3em] mt-0.5">Marketing Hub</span>
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
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-blue-400'
                }`}
              >
                <span className={isActive ? 'text-white' : 'group-hover:text-blue-400 transition-colors'}>
                  {item.icon}
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.15em]">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT BUTTON */}
        <div className="mt-auto pt-6 border-t border-white/5">
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all group"
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.15em]">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        
        {/* TOP HEADER */}
        <header className="sticky top-0 z-40 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 lg:px-10 flex items-center justify-between">
          
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 mr-4 text-slate-600 lg:hidden hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Menu size={24} />
          </button>

          <div className="relative w-64 hidden md:block">
            <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
              <Search size={16} />
            </span>
            <input 
              type="text" 
              placeholder="Search data..." 
              className="w-full bg-slate-100/50 border border-slate-200/50 rounded-2xl py-2 pl-11 pr-4 text-[12px] focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all outline-none font-bold"
            />
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            {/* DYNAMIC WALLET */}
            <div className="flex items-center gap-3 bg-blue-50/50 px-4 py-2 rounded-2xl border border-blue-100/50">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-200">
                <Wallet size={14} />
              </div>
              <div className="whitespace-nowrap">
                <p className="text-[8px] font-black text-blue-400 uppercase tracking-tighter">Balance</p>
                <p className="text-sm font-black text-blue-800 leading-none">
                  {isLoading ? <Loader2 size={12} className="animate-spin" /> : `₹${userBalance.toLocaleString()}`}
                </p>
              </div>
            </div>

            {/* PROFILE SECTION */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900 leading-none">
                  {isLoading ? "..." : userName}
                </p>
                <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-1">
                  {userRole}
                </p>
              </div>
              <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-lg border-2 border-white">
                {isLoading ? <Loader2 size={14} className="animate-spin text-white" /> : userInitials}
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 md:p-10 lg:p-14">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}