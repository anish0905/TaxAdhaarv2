"use client";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Bell, LayoutDashboard, Clock, History, Users, FolderPlus, UserPlus, CheckCircle, ShieldCheck } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navLinks = [
    { name: "Dashboard Home", href: "/admin", icon: <LayoutDashboard size={18} /> },
    { name: "Pending Reviews", href: "/admin/dashboard/admin", icon: <Clock size={18} /> },
    { name: "Review History", href: "/admin/dashboard/admin/history", icon: <History size={18} /> },
    { name: "Payment Verification", href: "/admin/dashboard/admin/payments", icon: <CheckCircle size={18} /> },
    { name: "Work Allocation", href: "/admin/dashboard/admin/WorkAllocation", icon: <ShieldCheck size={18} /> },
    { name: "Client Directory", href: "/admin/dashboard/admin/clients", icon: <Users size={18} /> },
    { name: "Upload Leads", href: "/admin/leads", icon: <FolderPlus size={18} /> },
    { name: "Manage & Assign", href: "/admin/manage-leads", icon: <ShieldCheck size={18} /> },
    { name: "Verify & Pricing", href: "/admin/verify", icon: <CheckCircle size={18} /> },
    { name: "Add/Manage Staff", href: "/admin/staff", icon: <UserPlus size={18} /> },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* --- MOBILE OVERLAY --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`
        w-72 bg-[#020617] text-white flex flex-col fixed h-full z-[70] shadow-2xl transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        
        {/* Logo Section */}
        <div className="p-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white">T</div>
            <h2 className="text-xl font-black tracking-tighter italic text-white group-hover:text-blue-400 transition-colors">
              ADMIN<span className="text-blue-600">PANEL</span>
            </h2>
          </Link>
          <button className="lg:hidden text-slate-400" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Navigation Menu - Scrollable Area */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar pb-6">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">Main Menu</p>
          
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" 
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                <span className={isActive ? "text-white" : "text-slate-500"}>{link.icon}</span>
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-6 border-t border-slate-800/50 bg-slate-900/20">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white">
              A
            </div>
            <div>
              <p className="text-xs font-black tracking-tight text-white">System Admin</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Online</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 lg:ml-72 min-h-screen relative flex flex-col">
        
        {/* Top Header Bar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 px-6 lg:px-10 flex items-center justify-between">
           <div className="flex items-center gap-4">
             {/* Mobile Menu Toggle */}
             <button 
                className="lg:hidden p-2 bg-slate-100 rounded-xl text-slate-600"
                onClick={() => setIsSidebarOpen(true)}
             >
               <Menu size={20} />
             </button>
             
             <div className="hidden md:flex items-center gap-2">
               <span className="text-slate-300 font-bold">/</span>
               <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                 {pathname.split("/").filter(Boolean).pop()?.replace("-", " ") || "Dashboard"}
               </span>
             </div>
           </div>
           
           <div className="flex items-center gap-4 lg:gap-6">
              <button className="text-slate-400 hover:text-blue-600 transition-colors relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="h-8 w-[1px] bg-slate-100"></div>
              <p className="hidden sm:block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
              </p>
           </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-8 lg:p-10 flex-1">
          {children}
        </div>
      </main>

      {/* Global CSS for scrollbar inside sidebar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}