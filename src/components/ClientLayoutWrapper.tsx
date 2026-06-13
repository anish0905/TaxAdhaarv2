"use client";

import { usePathname } from "next/navigation";
import PublicNavbar from "@/components/Navbar";
import AuthProvider from "@/components/AuthProvider";
import FloatingChatbot from "@/components/FloatingChatbot";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Navbar सिर्फ होम पेज पर दिखेगा
  const showNavbar = pathname === "/";

  return (
    <AuthProvider>
      {/* Navbar: Top bar के नीचे कंडीशन के हिसाब से */}
      {showNavbar && <PublicNavbar />}
      
      {/* Main Content */}
      <main className="min-h-screen">
        {children}
      </main>

      {/* Floating AI Chatbot */}
      <FloatingChatbot />
    </AuthProvider>
  );
}