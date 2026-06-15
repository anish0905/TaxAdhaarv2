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

  // ⚡ 3. बिंग 404 परमानेंट फिक्स: पुराने अपराधियों को सीधे होमपेज पर 301 रीडायरेक्ट करें
  async redirects() {
    return [
      {
        source: '/itr',
        destination: '/',
        permanent: true, // बिंग को बताएगा कि ये पेजेस हमेशा के लिए होमपेज पर शिफ्ट हो गए हैं
      },
      {
        source: '/gst',
        destination: '/',
        permanent: true,
      },
      {
        source: '/audit',
        destination: '/',
        permanent: true,
      },
      {
        source: '/setup',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;