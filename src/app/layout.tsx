import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

// 🚀 एसईओ (SEO) के लिए मेटाडेटा अब प्रॉपर्ली काम करेगा
export const metadata: Metadata = {
  title: "TaxAadhaar | Latest Tax & GST Updates",
  description: "Live Income Tax, GST, and Corporate Law updates instantly",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* 🚨 100% क्रिटिकल फिक्स: अब यह सर्वर से सीधे Raw HTML में रेंडर होगा */}
        <Script 
          id="google-adsense"
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2178056672186074"
          strategy="beforeInteractive" // पेज लोड होने से पहले स्क्रिप्ट इन्जेक्ट करेगा
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">
        {/* Razorpay Script */}
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        
        {/* सारा क्लाइंट-साइड लॉजिक अब यहाँ से हैंडल होगा */}
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}