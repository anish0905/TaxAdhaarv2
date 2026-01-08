"use client";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { useSession } from "next-auth/react";

export default function DashboardNavbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      {/* Logo Section */}
      <div className="flex items-center gap-8">
        <Link href="/dashboard" className="text-2xl font-black text-blue-600 tracking-tighter">
          TAX<span className="text-slate-800">PORTAL</span>
        </Link>
        
        {/* Nav Links - Hidden on Mobile */}
        <div className="hidden md:flex gap-6 text-sm font-bold text-slate-500">
          <Link href="/dashboard" className="hover:text-blue-600 transition">My Orders</Link>
          <Link href="/dashboard/documents" className="hover:text-blue-600 transition">Documents</Link>
          <Link href="/dashboard/profile" className="hover:text-blue-600 transition">Profile</Link>
        </div>
      </div>

      {/* Right Side: User Profile & Logout */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col items-end mr-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Client</p>
          <p className="text-sm font-black text-slate-800">{session?.user?.name || "User"}</p>
        </div>
        
        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border border-blue-200">
          {session?.user?.name?.charAt(0) || "U"}
        </div>

        <div className="border-l pl-4 ml-2">
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}