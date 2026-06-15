import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',       // एडमिन पैनल को क्रॉल होने से रोकें
        '/api/',         // बैकएंड एपीआई रूट्स को ब्लॉक करें
        '/_next/',       // नेक्स्ट के इंटरनल बिल्ड फोल्डर को छुपाएं
      ],
    },
    sitemap: 'https://www.taxadhaar.com/sitemap.xml',
  };
}