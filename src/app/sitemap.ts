import { MetadataRoute } from 'next';

// ⚡ FIXED: रिटर्न टाइप को Promise<MetadataRoute.Sitemap> कर दिया है
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.taxadhaar.com';

  // 1. स्टेटिक रूट्स (Static Routes)
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/updates`, lastModified: new Date() },
  ];

  // 2. डायनेमिक ब्लॉग रूट्स (Dynamic Mongo Outlets)
  let dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/blogs?limit=100`, {
      next: { revalidate: 600 } // हर 10 मिनट में सैटमैप डेटा रिफ्रेश होगा
    });
    const result = await res.json();

    if (result.success && result.data) {
      dynamicRoutes = result.data.map((blog: any) => ({
        url: `${baseUrl}/updates/${blog.slug}`,
        lastModified: new Date(blog.updatedAt || blog.createdAt),
        changeFrequency: 'daily',
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error("Sitemap compilation error:", error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}