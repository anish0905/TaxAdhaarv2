import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',    // बिना स्लैश के भी सुरक्षित है, यह /admin और /admin/dashboard दोनों रोकेगा
          '/api',      // सभी बैकएंड API एंडपॉइंट्स को ब्लॉक करेगा
          '/_next',    // Next.js की इंटरनल बिल्ड फाइल्स को छुपाएगा
        ],
      },
    ],
    sitemap: 'https://www.taxadhaar.com/sitemap.xml',
  };
}