import { NextResponse,NextRequest } from "next/server";
import connectDB  from "@/lib/db";
import { Blog } from "../../../models/blogs";
import { redis } from "@/lib/redis";
import { Types } from "mongoose";      // 👈 1. यह इम्पोर्ट होना ज़रूरी है!
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




// 📁 src/app/api/blogs/route.ts के अंदर सिर्फ GET फंक्शन का मोंगोडीबी क्वेरी हिस्सा बदलें:




export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const category = url.searchParams.get("category");
    const exclude = url.searchParams.get("exclude");
    const isAdmin = url.searchParams.get("admin") === "true";

    // फ़िल्टर कंडीशन बिल्ड करें
    const filter: any = { isPublished: true };
    if (isAdmin) delete filter.isPublished;

    if (category && category !== "all") {
      filter.category = category;
    }

    // 🔍 इनफ़िनिट स्क्रॉल एक्सक्लूजन ज़ोन (अब सच में एरर फ्री)
    if (exclude) {
      const excludeIds = exclude
        .split(",")
        .filter((id) => Types.ObjectId.isValid(id))
        .map((id) => new Types.ObjectId(id)); // 👈 2. स्ट्रिंग को असली ObjectId में बदलना ज़रूरी है

      if (excludeIds.length > 0) {
        filter._id = { $nin: excludeIds };
      }
    }

    // 🔥 CRITICAL ENGINE: FORCE POPULATE RELATED PARTNERS IN STREAM
    const data = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate({
        path: "category",
        model: "Category",
        select: "name slug"
      })
      .populate({
        path: "relatedPartners",
        model: "Partner" 
      });

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    // 💡 आपके टर्मिनल/कंसोल में असली एरर यहाँ दिखेगा
    console.error("❌ GET ALL BLOGS ROUTE CRASH:", error); 
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// 📝 POST API (अगर तुम्हारी इसी फाइल में नीचे पोस्ट मेथड भी है तो वह भी सेफ रहेगा)
// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const body = await req.json();
    
//     // अगर तुम ऊपर डिस्ट्रक्चरिंग से Category/Partner इम्पोर्ट नहीं करना चाहते तो सीधे string का यूज करो
//     const newBlog = await Blog.create({
//       ...body,
//       category: body.categoryId,
//     });

//     return NextResponse.json({ success: true, data: newBlog }, { status: 201 });
//   } catch (error: any) {
//     return NextResponse.json({ success: false, message: error.message }, { status: 500 });
//   }
// }
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
      showAds,
      relatedPartners 
    } = body;

    // 1. Validation Check
    if (!title || !content || !excerpt || !mainImage || !categoryId) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // 2. Safe Slug Generation with Timestamp suffix
    const generatedSlug = `${generateSafeSlug(title)}-${Date.now().toString().slice(-4)}`;

    // 3. Document Creation inside MongoDB (Fills all SEO fields safely)
    const newBlog = await Blog.create({
      title,
      slug: generatedSlug,
      content,
      excerpt,
      mainImage,
      category: categoryId,
      metaTitle: metaTitle || title,
      metaDesc: metaDesc || excerpt,
      keywords: keywords || "",
      tags: tags || "",
      isPublished: isPublished !== undefined ? isPublished : true,
      showAds: showAds !== undefined ? showAds : true,
      relatedPartners: relatedPartners || [] 
    });

    // ========================================================================
    // CRITICAL ENGINE: REDIS CACHE INVALIDATION
    // ========================================================================
    if (newBlog.isPublished) {
      try {
        const keys = await redis.keys("blogs:stream:*");
        if (keys.length > 0) {
          await redis.del(...keys);
        }
        console.log("⚡ TaxAdhaar Live Cache Cleared Successfully!");
      } catch (redisError) {
        console.error("Cache clear fail alerts:", redisError);
      }
    }

    return NextResponse.json({ success: true, data: newBlog }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}