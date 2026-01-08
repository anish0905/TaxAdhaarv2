import Link from "next/link";
import LogoutButton from "@/components/LogoutButton"; // Import karein

export default function SalesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-green-900 text-white p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8 text-green-400">Sales Panel</h2>
        
        <nav className="flex flex-col gap-4 flex-1">
          <Link href="/sales" className="flex items-center gap-2 hover:text-green-300 transition-colors">
            <span>📞</span> Calling Queue
          </Link>
          <Link href="/sales/confirmed" className="flex items-center gap-2 hover:text-green-300 transition-colors">
            <span>✅</span> Confirmed Leads
          </Link>
          <Link href="/sales/reports" className="flex items-center gap-2 hover:text-green-300 transition-colors">
            <span>📈</span> My Performance
          </Link>
        </nav>

        {/* Logout Button yahan aayega */}
        <div className="pt-6 border-t border-green-800">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}