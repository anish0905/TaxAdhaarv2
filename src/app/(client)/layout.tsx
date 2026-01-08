import Link from "next/link";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b bg-white sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold text-blue-600 tracking-tight">
            TAX<span className="text-slate-800">PORTAL</span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <Link href="#services" className="hover:text-blue-600">Income Tax</Link>
            <Link href="#services" className="hover:text-blue-600">GST</Link>
            <Link href="#services" className="hover:text-blue-600">Business Setup</Link>
          </div>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-5 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600">Login</Link>
          <Link href="/login" className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Get Started</Link>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
}