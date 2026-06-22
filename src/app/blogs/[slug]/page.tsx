// app/blogs/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import InfiniteBlogFeed from "./InfiniteBlogFeed";

interface Props {
  params: Promise<{ slug: string }>;
}

// Internal server-side safe path resolution helper
const getSiteUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // Fallback domain selector production server build ke liye
  return "https://taxadhaar.com";
};

// 1. DYNAMIC METADATA GENERATOR (WITH CRASH SAFEGUARDS)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = getSiteUrl();

  try {
    // Cache revalidate runtime optimization layer set kiya hai
    const res = await fetch(`${baseUrl}/api/blogs/${slug}`, { 
      next: { revalidate: 1800 },
      headers: { "Content-Type": "application/json" }
    });
    
    if (!res.ok) return { title: "Tax Update | TaxAdhaar" };
    const json = await res.json();
    
    if (!json || !json.success || !json.data) {
      return { title: "Tax Update | TaxAdhaar" };
    }
    
    const blog = json.data;
    return {
      title: `${blog.metaTitle || blog.title} | TaxAdhaar`,
      description: blog.metaDesc || blog.excerpt,
      keywords: blog.keywords || "tax news, mutual funds 2026",
      openGraph: {
        title: blog.metaTitle || blog.title,
        description: blog.metaDesc || blog.excerpt,
        url: `${baseUrl}/blogs/${slug}`,
        images: [{ url: blog.mainImage, width: 1200, height: 630 }],
        type: "article",
      },
    };
  } catch (err) {
    console.error("Metadata generation crash bypass:", err);
    return { title: "Tax News Bulletin | TaxAdhaar" };
  }
}

// 2. MAIN SERVER COMPONENT CONTROLLER
export default async function BlogPage({ params }: Props) {
  const { slug } = await params;
  const baseUrl = getSiteUrl();
  
  let blogData = null;

  try {
    const res = await fetch(`${baseUrl}/api/blogs/${slug}`, { 
      next: { revalidate: 1800 },
      headers: { "Content-Type": "application/json" }
    });
    
    if (res.ok) {
      const json = await res.json();
      if (json.success) blogData = json.data;
    }
  } catch (err) {
    console.error("Server component context fetch logic crash:", err);
  }

  // Agar database call completely down hai ya blog nahi mila, toh notFound safe trigger karo
  if (!blogData) {
    notFound();
  }

  return <InfiniteBlogFeed initialBlog={blogData} currentSlug={slug} />;
}