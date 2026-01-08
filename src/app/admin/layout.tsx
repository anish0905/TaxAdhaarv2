import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-blue-400">TaxPortal Admin</h2>
        <nav className="flex flex-col gap-4">
          <Link href="/admin" className="hover:text-blue-300">📊 Dashboard Home</Link>
          <Link href="/admin/leads" className="hover:text-blue-300">📁 Upload Leads (Excel)</Link>
          <Link href="/admin/verify" className="hover:text-blue-300">✅ Verify & Pricing</Link>
          <Link href="/admin/assign" className="hover:text-blue-300">🤝 Assign to Staff</Link>
          <Link href="/admin/staff" className="hover:text-blue-300">👥 Add/Manage Staff</Link>
        </nav>
           {/* Logout Button yahan aayega */}
              <div className="pt-6 border-t border-green-800">
                <LogoutButton/>
              </div>
      </aside>

      

      {/* Main Content Area */}
      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
}