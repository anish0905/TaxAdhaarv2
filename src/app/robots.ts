import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/_next/',     // Safeguards Next.js chunks, state manifests, and assets data
          '/api/',       // Restricts backend service routines and authentication end-points
          '/admin/',     // Secures internal administrative panel layouts from parsing bots
          
          // --- ADSENSE COMPLIANCE: Restricts empty application layout scopes ---
          '/login',      // Bypass authentication screen crawl bounds
          '/register',   // Restricts blank sign-up wizard interface crawls
          '/dashboard/', // Blocks internal user console portals and transactional paths
          '/profile/',   // Restricts user metadata workspace configurations from index engine
        ],
      },
    ],
    sitemap: 'https://www.taxadhaar.com/sitemap.xml',
  };
}