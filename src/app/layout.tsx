"use client";

import { usePathname } from "next/navigation";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";
import PublicNavbar from "@/components/Navbar";
import Script from "next/script";
import WhatsAppTopBar from "@/components/WhatsAppTopBar"; 
import FloatingChatbot from "@/components/FloatingChatbot"; 

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Navbar sirf home page pe dikhega
  const showNavbar = pathname === "/";

  return (
    <html lang="en">
      <body className="antialiased">
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        
        <AuthProvider>
          {/* 1. WhatsApp Top Bar: Sabse upar dikhega */}
          <WhatsAppTopBar />

          {/* 2. Navbar: Top bar ke niche condition ke hisaab se */}
          {showNavbar && <PublicNavbar />}
          
          {/* 3. Main Content: Page ka saara data yahan load hoga */}
          <main className="min-h-screen">
            {children}
          </main>

          {/* 4. Floating AI Chatbot: Ye screen par fixed rahega (Right Side) */}
          <FloatingChatbot />
        </AuthProvider>
      </body>
    </html>
  );
}