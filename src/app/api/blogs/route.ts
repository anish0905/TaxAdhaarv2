import { NextResponse,NextRequest } from "next/server";
import connectDB  from "@/lib/db";

import { Blog, Category } from "../../../models/blogs";
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
    const limitParam = url.searchParams.get("limit");
    const categoryParam = url.searchParams.get("category"); // फ्रंटएंड से सिलेक्टेड स्लग
    const exclude = url.searchParams.get("exclude");
    const isAdmin = url.searchParams.get("admin") === "true";

    const filter: Record<string, any> = {};
    if (!isAdmin) {
      filter.isPublished = true;
    }

    // 🔍 इनफ़िनिट स्क्रॉल एक्सक्लूजन ज़ोन 
    if (exclude) {
      const excludeIds = exclude
        .split(",")
        .filter((id) => Types.ObjectId.isValid(id))
        .map((id) => new Types.ObjectId(id));

      if (excludeIds.length > 0) {
        filter._id = { $nin: excludeIds };
      }
    }

    // ============================================================================
    // 🛰️ STEP 1: डेटाबेस से रॉ डेटा खींचें (बिना फ़िल्टर के ताकि कोई मिस न हो भाई)
    // ============================================================================
    const rawBlogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .populate({
        path: "relatedPartners",
        model: "Partner"
      })
      .lean(); // .lean() लगाने से मोंगोज़ ऑब्जेक्ट्स जावास्क्रिप्ट के लाइटवेट ऑब्जेक्ट्स बन जाते हैं

    // ============================================================================
    // 🧬 STEP 2: HYBRID NORMALIZER ENGINE (दोनो स्ट्रक्चर्स को एक फ़ॉर्मेट में सिंक करेगा)
    // ============================================================================
    // डेटाबेस में जो श्रेणियाँ पहले से पूरी ऑब्जेक्ट हैं, उन्हें वैसे ही रहने देगा; 
    // जो सिर्फ आईडी हैं, उन्हें कैटेगरी कलेक्शन से रीयल-टाइम डेटा लाकर ऑब्जेक्ट बना देगा!
  // ============================================================================
    // 🧬 STEP 2: HYBRID NORMALIZER ENGINE (दोनो स्ट्रक्चर्स को एक फ़ॉर्मेट में सिंक करेगा)
    // ============================================================================
    const allCategories = await Category.find({}).lean();
    
    // फ़ास्ट मैपिंग के लिए एक डिक्शनरी बना लो भाई
    const categoryMap = new Map();
    allCategories.forEach((cat: any) => {
      categoryMap.set(cat._id.toString(), cat);
    }); // 🎯 यहाँ अब बिल्कुल क्लीन क्लोजिंग है भाई, कोई टैग नहीं!

    const normalizedBlogs = rawBlogs.map((blog: any) => {

      let resolvedCategory = { _id: "", name: "Uncategorized", slug: "uncategorized" };

      if (blog.category) {
        // केस ए: अगर कैटेगरी पहले से ही ऑब्जेक्ट है और उसमें नाम/स्लग है भाई (जैसे क्रिप्टो)
        if (typeof blog.category === "object" && blog.category.slug) {
          resolvedCategory = {
            _id: (blog.category._id?.$oid || blog.category._id || "").toString(),
            name: blog.category.name,
            slug: blog.category.slug
          };
        } else {
          // केस बी: अगर कैटेगरी सिर्फ एक आईडी या $oid के रूप में दबी है (जैसे एडवांस टैक्स)
          const targetId = (blog.category.$oid || blog.category || "").toString();
          const dbCategory = categoryMap.get(targetId);
          if (dbCategory) {
            resolvedCategory = {
              _id: dbCategory._id.toString(),
              name: dbCategory.name,
              slug: dbCategory.slug
            };
          }
        }
      }

      return {
        ...blog,
        category: resolvedCategory // अब फ्रंटएंड को हमेशा क्लीन और सिंक ऑब्जेक्ट मिलेगा!
      };
    });

    // ============================================================================
    // 🎯 STEP 3: ऑन-द-फ्लाई रनटाइम फ़िल्टरिंग (मैंडेटरी रिज़ॉल्यूशन)
    // ============================================================================
    let finalBlogs = normalizedBlogs;
    if (categoryParam && categoryParam !== "all") {
      finalBlogs = normalizedBlogs.filter((blog: any) => {
        return blog.category.slug.toLowerCase().trim() === categoryParam.toLowerCase().trim();
      });
    }

    // 🎯 लिमिट हैंडलर
    if (limitParam) {
      const parsedLimit = parseInt(limitParam, 10);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        finalBlogs = finalBlogs.slice(0, parsedLimit);
      }
    }

    return NextResponse.json({ success: true, data: finalBlogs }, { status: 200 });
  } catch (error: any) {
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