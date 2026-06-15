import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

// ⚡ FIXED: Next.js standard के हिसाब से verification object को यहाँ सेट कर दिया है
export const metadata: Metadata = {
  title: "TaxAadhaar | India's Premier Digital Tax Platform",
  description: "Official TaxAadhaar portal for Pan-India ITR filing...",
  verification: {
    google: "0PwH2Yg50tfdTY-l3BOQAeRXRNs_9dXpv-_vvSWbX90",
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* AdSense Code */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2178056672186074"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="antialiased">
        {/* Google Analytics (GA4) Scripts */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-R7JHCV8X1Z"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-R7JHCV8X1Z');
          `}
        </Script>

        {/* Razorpay Script */}
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}