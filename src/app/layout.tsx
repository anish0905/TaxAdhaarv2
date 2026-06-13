import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

export const metadata: Metadata = {
  title: "TaxAadhaar | India's Premier Digital Tax Platform",
  description: "Official TaxAadhaar portal for Pan-India ITR filing...",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* 🚨 अल्टीमेट फिक्स: प्योर HTML डेंजरसली इन्जेक्टेड टैग */}
        {/* यह Next.js को कोड बदलने से रोकेगा और Google Bot को सीधा साफ़ कोड दिखेगा */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2178056672186074"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="antialiased">
        {/* Razorpay Script */}
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}