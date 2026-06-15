import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ⚡ 1. Technical SEO फिक्स: Gzip/Brotli कंप्रेशन फ़ोर्सफुली ऑन करें
  compress: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // Cloudinary के सारे इमेजेस अलाउ करने के लिए
      },
      // ⚡ 2. इमेज सेफ्टी फिक्स: AI जेनरेटेड गूगल इमेजेस को रेंडर करने के लिए पैटर्न
      {
        protocol: 'http',
        hostname: 'googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
  
  // 💡 ऑप्शनल: एडसेंस और एसईओ के लिए प्रोडक्शन बिल्ड में कंसोल लॉग्स क्लीन रखें
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;