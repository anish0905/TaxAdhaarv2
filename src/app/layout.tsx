"use client"; // Hook use karne ke liye ise client component banana hoga

import { usePathname } from "next/navigation";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";
import PublicNavbar from "@/components/Navbar";
import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Sirf Home page ka path '/' hota hai. 
  // Agar user '/' par hai, tabhi navbar dikhega.
  const showNavbar = pathname === "/";
  // Component ke andar return se pehle add karein:
<Script src="https://checkout.razorpay.com/v1/checkout.js" />

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {showNavbar && <PublicNavbar />}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}