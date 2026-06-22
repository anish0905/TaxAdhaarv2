"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { ShoppingBag, Menu, X, LayoutDashboard, LogIn, LogOut } from "lucide-react";

export default function PublicNavbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isMenuOpen]);

  // 🧰 Navigation Data: टूलकिट को "Finance Tools" नाम से बेहतरीन तरीके से मैप कर दिया भाई
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Blogs", href: "/blogs" },
    { name: "Tax Planner", href: "/calculator" },
    { name: "Finance Tools", href: "/toolkit", isHot: true }, // 👈 तुम्हारा टूलकिट स्टोर नोड
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ${
        scrolled 
        ? "bg-white/95 backdrop-blur-md py-3 shadow-lg border-b border-slate-100" 
        : "bg-white py-4 border-b border-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          
          {/* --- LOGO --- */}
          <Link href="/" className="group flex items-center gap-2">
            <div className="w-9 h-9 bg-[#020617] rounded-xl flex items-center justify-center shadow-md group-hover:bg-blue-600 transition-all">
              <span className="text-white font-black text-lg">T</span>
            </div>
            <span className="text-xl font-black text-[#020617] tracking-tighter uppercase italic">
              Tax<span className="text-blue-600">Adhaar</span>
            </span>
          </Link>

          {/* --- DESKTOP NAVIGATION --- */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((item) => (
              <Link 
                key={item.name} 
                href={item.href} 
                className="text-[11px] font-black uppercase tracking-[0.2em] text-[#020617] hover:text-blue-600 transition-all relative flex items-center gap-1 group"
              >
                {item.name}
                {item.isHot && (
                  <span className="absolute -top-3.5 right-0 bg-blue-600 text-white font-mono font-bold text-[7px] px-1 rounded-sm uppercase tracking-normal animate-bounce whitespace-nowrap">
                    New Store
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* --- MOBILE & DESKTOP ACTIONS --- */}
          <div className="flex items-center gap-2 md:gap-4">
            {!session ? (
           
            <Link 
              href={session ? "/dashboard-redirect" : "/login"} 
              className="bg-[#020617] text-white px-4 py-2.5 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-md flex items-center gap-1.5"
            >
              {session ? <LayoutDashboard size={12} /> : null}
              {session ? <span>Dashboard</span> : <span>Get Started</span>}
            </Link>
            ) : (
              <button 
                onClick={() => signOut()}
                className="hidden lg:block text-[11px] font-black uppercase tracking-[0.2em] text-red-600 hover:bg-red-50 px-5 py-3 rounded-2xl transition-all"
              >
                Logout
              </button>
            )}

            {/* <Link 
              href={session ? "/dashboard-redirect" : "/login"} 
              className="bg-[#020617] text-white px-4 py-2.5 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-md flex items-center gap-1.5"
            >
              {session ? <LayoutDashboard size={12} /> : null}
              {session ? <span>Dashboard</span> : <span>Get Started</span>}
            </Link> */}

            {/* प्रीमियम मोबाइल हैमबर्गर बटन */}
            <button 
              className="lg:hidden w-10 h-10 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-xl text-[#020617] active:scale-95 transition-transform" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
               {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* --- MOBILE MENU OVERLAY --- */}
      <div className={`fixed inset-0 bg-white z-[999] lg:hidden transition-all duration-500 ease-in-out ${
        isMenuOpen ? "opacity-100 pointer-events-auto translate-x-0" : "opacity-0 pointer-events-none translate-x-10"
      }`}>
        <div className="flex flex-col h-full pt-28 px-6 sm:px-8 pb-10 overflow-y-auto">
          <div className="flex flex-col gap-5 text-left">
            {navLinks.map((item) => (
              <Link 
                key={item.name}
                href={item.href} 
                className="text-2xl sm:text-3xl font-black text-[#020617] active:text-blue-600 tracking-tighter flex items-center justify-between group"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>{item.name === "Finance Tools" ? "Tools Store" : item.name}</span>
                {item.isHot && (
                  <span className="bg-blue-600 text-white text-[9px] px-2 py-0.5 rounded font-mono font-black uppercase tracking-widest flex items-center gap-1">
                    <ShoppingBag size={10} /> Active
                  </span>
                )}
              </Link>
            ))}
          </div>
          
          <div className="mt-auto pt-8 space-y-3">
            {!session ? (
              <Link 
                href="/login" 
                className="w-full bg-slate-900 text-white text-center py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg flex items-center justify-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn size={14} /> Sign In to Account
              </Link>
            ) : (
              <button 
                onClick={() => {
                   setIsMenuOpen(false);
                   signOut();
                }}
                className="w-full bg-red-600 text-white text-center py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2"
              >
                <LogOut size={14} /> Logout Account
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}