import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/_next',     // Next.js की इंटरनल बिल्ड फाइल्स और चंक्स को छुपाएगा
          '/api',       // सभी बैकएंड API रूट्स और टोकन एंडपॉइंट्स को ब्लॉक करेगा
          '/admin',     // एडमिन पैनल और उसके सभी सब-रूट्स को रोकेगा
          
          // --- ADSENSE LOW VALUE FIX: ऐप्लिकेशन रूट्स ब्लॉक किए गए ---
          '/login',     // लॉगिन पेज (यहाँ क्रॉलर को थिन कंटेंट मिलता है)
          '/register',  // रजिस्ट्रेशन / साइन-अप पेज
          '/dashboard', // यूज़र डैशबोर्ड और रीडायरेक्शन पाथ्स
          '/profile',   // यूज़र प्रोफाइल और सेटिंग्स पेजों को ब्लॉक करने के लिए
        ],
      },
    ],
    sitemap: 'https://www.taxadhaar.com/sitemap.xml',
  };
}