"use client";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Navigation Links Helper
  const navLinks = [
    { name: "Dashboard Home", href: "/admin", icon: "📊" },
    { name: "Upload Leads", href: "/admin/leads", icon: "📁" },
    { name: "Manage & Assign", href: "/admin/manage-leads", icon: "🤝" }, // Aapka naya page
    { name: "Verify & Pricing", href: "/admin/verify", icon: "✅" },
    { name: "Add/Manage Staff", href: "/admin/staff", icon: "👥" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-[#020617] text-white flex flex-col fixed h-full z-50 shadow-2xl">
        
        {/* Logo Section */}
        <div className="p-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black">T</div>
            <h2 className="text-xl font-black tracking-tighter italic group-hover:text-blue-400 transition-colors">
              ADMIN<span className="text-blue-600">PANEL</span>
            </h2>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 space-y-2">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">Main Menu</p>
          
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" 
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                <span className={`text-lg ${isActive ? "opacity-100" : "opacity-50"}`}>{link.icon}</span>
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section: User & Logout */}
        <div className="p-6 border-t border-slate-800/50 bg-slate-900/20">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold">
              A
            </div>
            <div>
              <p className="text-xs font-black tracking-tight">System Admin</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Online</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 ml-72 min-h-screen relative">
        {/* Top Header Bar (Optional but looks professional) */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 px-10 flex items-center justify-between">
           <div className="flex items-center gap-2">
             <span className="text-slate-300 font-bold">/</span>
             <span className="text-xs font-black uppercase tracking-widest text-slate-400">
               {pathname.split("/").filter(Boolean).pop()?.replace("-", " ")}
             </span>
           </div>
           
           <div className="flex items-center gap-6">
              <button className="text-slate-400 hover:text-blue-600 transition-colors">🔔</button>
              <div className="h-8 w-[1px] bg-slate-100"></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jan 09, 2026</p>
           </div>
        </header>

        {/* Page Content */}
        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  );
}