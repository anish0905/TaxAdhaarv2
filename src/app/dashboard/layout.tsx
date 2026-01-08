
import Link from "next/link";
import DashboardNavbar from "./components/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Professional Navbar */}
      <DashboardNavbar/>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
        {children}
      </main>

      {/* Mobile Nav (Optional) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3">
         <Link href="/dashboard" className="text-[10px] font-bold uppercase text-blue-600">Home</Link>
         <Link href="/dashboard/documents" className="text-[10px] font-bold uppercase text-slate-400">Docs</Link>
         <Link href="/dashboard/profile" className="text-[10px] font-bold uppercase text-slate-400">Profile</Link>
      </div>
    </div>
  );
}