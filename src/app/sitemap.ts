import { MetadataRoute } from "next";
import { publicSitePaths, site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = publicSitePaths.map((path) => ({
    url: new URL(path, site.url).toString(),
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/blogs" || path === "/services" ? 0.9 : 0.7,
  }));

  try {
    const response = await fetch(`${site.url}/api/blogs?limit=100`, {
      next: { revalidate: 600 },
    });
    const result = await response.json();
    if (!response.ok || !result.success || !Array.isArray(result.data)) return staticRoutes;

    const blogRoutes: MetadataRoute.Sitemap = result.data.map((blog: { slug: string; updatedAt?: string; createdAt?: string }) => ({
      url: `${site.url}/blogs/${blog.slug}`,
      lastModified: new Date(blog.updatedAt || blog.createdAt || Date.now()),
      changeFrequency: "monthly",
      priority: 0.8,
    }));

    return [...staticRoutes, ...blogRoutes];
  } catch {
    return staticRoutes;
  }
}
