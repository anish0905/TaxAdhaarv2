import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "TaxAdhaar | Tax & Business Compliance Resources",
    template: "%s | TaxAdhaar",
  },
  icons: {
    icon: "/icon.png", 
  },
  description: "Independent tax and business-compliance resources, tools, and service information for users in India.",
  verification: {
    google: "0PwH2Yg50tfdTY-l3BOQAeRXRNs_9dXpv-_vvSWbX90",
    other: {
      "msvalidate.01": "1E3C84D08C1CE48FBDB6982BC14202D1",
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* ⚡ FIXED: Standard HTML script tag standard execution ke sath. 
            Isse Next.js ka data-nscript inject nahi hoga aur AdSense khush rahega. */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2178056672186074"
          crossOrigin="anonymous"
        />
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
