// app/blogs/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import InfiniteBlogFeed from "./InfiniteBlogFeed";

interface Props {
  params: Promise<{ slug: string }>;
}

// 1. POWERFUL SEO IMPLEMENTATION
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  
  try {
    const res = await fetch(`${siteUrl}/api/blogs/${slug}`, { next: { revalidate: 1800 } });
    const json = await res.json();
    
    if (!json || !json.success || !json.data) return { title: "TaxAdhaar Blog" };
    
    const blog = json.data;
    return {
      title: `${blog.metaTitle || blog.title} | TaxAdhaar`,
      description: blog.metaDesc || blog.excerpt,
      keywords: blog.keywords || "tax updates, gst, income tax news",
      openGraph: {
        title: blog.metaTitle || blog.title,
        description: blog.metaDesc || blog.excerpt,
        url: `${siteUrl}/blogs/${slug}`,
        images: [{ url: blog.mainImage, width: 1200, height: 630, alt: blog.title }],
        type: "article",
        publishedTime: blog.createdAt,
      },
      twitter: {
        card: "summary_large_image",
        title: blog.metaTitle || blog.title,
        description: blog.metaDesc || blog.excerpt,
        images: [blog.mainImage],
      },
    };
  } catch {
    return { title: "TaxAdhaar Updates" };
  }
}

// 2. SERVER CONTROLLER PASSING INITIAL DATA
export default async function BlogPage({ params }: Props) {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Initial blog details on server for first paint performance
  const res = await fetch(`${siteUrl}/api/blogs/${slug}`, { next: { revalidate: 1800 } });
  const json = await res.json();

  if (!json || !json.success || !json.data) {
    notFound();
  }

  return <InfiniteBlogFeed initialBlog={json.data} currentSlug={slug} />;
}