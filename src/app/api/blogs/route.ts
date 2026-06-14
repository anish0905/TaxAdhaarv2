import { NextResponse } from "next/server";
import connectDB  from "@/lib/db";
import { Blog } from "../../../models/blogs";
import { redis } from "@/lib/redis";
// Helper function ka naam uniquely badal diya taaki import crash na ho
const generateSafeSlug = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")           // Spaces ko hyphen se badlo
    .replace(/[^\w\-]+/g, "")       // Special characters hatao
    .replace(/\-\-+/g, "-");        // Multiple hyphens ko single karo
};




export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    
    const isAdmin = searchParams.get("admin") === "true";
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const categoryId = searchParams.get("category") || "";
    const excludeString = searchParams.get("exclude") || "";

    // ========================================================================
    // 1. REDIS CACHE KEY GENERATION
    // ========================================================================
    // Ek unique key banayenge unique parameters ke base par
    const cacheKey = `blogs:stream:admin-${isAdmin}:cat-${categoryId}:limit-${limit}:exclude-[${excludeString}]`;

    // Admin queries ko cache nahi karenge taaki draft updates instantly dikhein
    if (!isAdmin) {
      try {
        const cachedBlogs = await redis.get(cacheKey);
        if (cachedBlogs) {
          // Agar Redis me data mil jata hai, toh MongoDB ko chhue bina return kar do (0.1ms)
          return NextResponse.json({ success: true, data: cachedBlogs, fromCache: true });
        }
      } catch (redisError) {
        console.error("Redis Read Error (Falling back to DB):", redisError);
      }
    }

    // ========================================================================
    // 2. MONGO DATABASE QUERY LAYER (Cache Miss)
    // ========================================================================
    let filter: any = isAdmin ? {} : { isPublished: true };

    if (excludeString) {
      const excludeIds = excludeString.split(",").filter((id) => id.trim() !== "");
      if (excludeIds.length > 0) {
        filter._id = { $nin: excludeIds };
      }
    }

    if (categoryId) {
      filter.category = categoryId;
    }

    let blogs = await Blog.find(filter)
      .populate("category")
      .sort({ createdAt: -1 })
      .limit(limit);

    // Fallback Stream Engine
    if (blogs.length === 0 && categoryId) {
      delete filter.category;
      blogs = await Blog.find(filter)
        .populate("category")
        .sort({ createdAt: -1 })
        .limit(limit);
    }

    // ========================================================================
    // 3. WRITE DATA TO REDIS CACHE
    // ========================================================================
    if (!isAdmin && blogs.length > 0) {
      try {
        // Data ko 5 minutes (300 seconds) ke liye cache me set kar rahe hain
        // Puraane '.setex' code ko is standard set configuration se replace kijiye
await redis.set(cacheKey, JSON.stringify(blogs), { ex: 300 });
      } catch (redisWriteError) {
        console.error("Redis Write Error:", redisWriteError);
      }
    }

    return NextResponse.json({ success: true, data: blogs, fromCache: false });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
 // Redis client import kiya
 // Make sure slugify library properly imported ho

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { 
      title, 
      content, 
      excerpt, 
      mainImage, 
      categoryId, 
      metaTitle, 
      metaDesc, 
      keywords, 
      tags, 
      isPublished, 
      showAds 
    } = body;

    // 1. Validation Check
    if (!title || !content || !excerpt || !mainImage || !categoryId) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // 2. Safe Slug Generation with Timestamp suffix
    const generatedSlug = `${generateSafeSlug(title)}-${Date.now().toString().slice(-4)}`;

    // 3. Document Creation inside MongoDB
    const newBlog = await Blog.create({
      title,
      slug: generatedSlug,
      content,
      excerpt,
      mainImage,
      category: categoryId,
      metaTitle: metaTitle || title,
      metaDesc: metaDesc || excerpt,
      keywords: keywords || tags,
      tags,
      isPublished: isPublished !== undefined ? isPublished : true,
      showAds: showAds !== undefined ? showAds : true
    });

    // ========================================================================
    // CRITICAL ENGINE: REDIS CACHE INVALIDATION
    // ========================================================================
    // Jab naya content publish hoga, hum cache pipeline wipeout karenge
    if (newBlog.isPublished) {
      try {
        // Upstash and standard server cluster safe scan & delete mechanism
        const keys = await redis.keys("blogs:stream:*");
        if (keys.length > 0) {
          await redis.del(...keys);
        }
        console.log("⚡ TaxAdhaar Live Cache Cleared Successfully!");
      } catch (redisError) {
        // Log query errors safely behind background execution threads
        console.error("Cache clear fail alerts:", redisError);
      }
    }

    return NextResponse.json({ success: true, data: newBlog }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}