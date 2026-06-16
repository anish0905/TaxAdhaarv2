import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Blog, Category, Partner } from "../../../../models/blogs"; 
import { Types } from "mongoose";
import { redis } from "@/lib/redis"; // ⚡ कैशे क्लियर करने के लिए इम्पॉर्ट पक्का करें

// 1. GET SINGLE BLOG (Slug या ID दोनों से सेफ़ली फ़ेच करेगा + अफ़िलिएट पॉपुलेट करेगा)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const incomingSlug = resolvedParams.slug; 

    if (!incomingSlug) {
      return NextResponse.json({ success: false, message: "Slug missing" }, { status: 400 });
    }

    const isObjectId = Types.ObjectId.isValid(incomingSlug);
    const queryCondition = isObjectId ? { _id: incomingSlug } : { slug: incomingSlug };

    // ========================================================================
    // 🔥 STRICK OVERRIDE POPULATION ENGINE (100% Full Object Sync)
    // ========================================================================
    // यहाँ हमने मॉडल के वेरिएबल के बजाय मोंगुज़ के रजिस्टर्ड स्ट्रिंग नाम का यूज़ किया है
    const blog = await Blog.findOne(queryCondition)
      .populate({
        path: "category",
        model: "Category", // 🎯 स्ट्रिंग रेफ़रेंस: 'Category' मॉडल से नाम और स्लग खींचेगा
        select: "name slug"
      })
      .populate({
        path: "relatedPartners",
        model: "Partner"   // 🎯 स्ट्रिंग रेफ़रेंस: 'Partner' का पूरा ऑब्जेक्ट (name, link, description) लोड करेगा
      });

    if (!blog) {
      return NextResponse.json({ success: false, message: "समाचार नहीं मिला" }, { status: 404 });
    }

    // व्यू काउंटर बढ़ाएं और सेफ़ली सेव करें
    blog.views = (blog.views || 0) + 1;
    await blog.save();

    // 🔍 डिबगिंग के लिए सर्वर कंसोल में चेक करें कि पार्टनर्स पूरा लोड हुआ या नहीं
    console.log(`🚀 Blog "${blog.title}" fetched with ${blog.relatedPartners?.length || 0} populated partners.`);

    return NextResponse.json({ success: true, data: blog }, { status: 200 });
  } catch (error: any) {
    console.error("❌ CRITICAL DYNAMIC SINGLE GET ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. UPDATE BLOG (PUT) - फ़ील्ड्स मैपिंग + कैशे वाइपआउट इंजन 🚀
// 📁 src/app/api/blogs/[slug]/route.ts के अंदर सिर्फ PUT फंक्शन को इससे रिप्लेस करें:

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const incomingSlug = resolvedParams.slug; 

    const body = await request.json();

    // 📥 इनकमिंग पेलोड को कंसोल में ट्रैक करें
    console.log("📥 Incoming PUT Payload to Save:", body);

    // ========================================================================
    // 🔥 DYNAMIC CONDITIONAL UPDATE ENGINE (डेटा सेफगार्ड)
    // ========================================================================
    // केवल उन्हीं फ़ील्ड्स को चुनेंगे जो खाली नहीं हैं, ताकि पुराना डेटा ओवरराइड न हो
    const updatePayload: any = {};

    if (body.title && body.title.trim() !== "") updatePayload.title = body.title;
    if (body.content && body.content.trim() !== "") updatePayload.content = body.content;
    if (body.excerpt && body.excerpt.trim() !== "") updatePayload.excerpt = body.excerpt;
    if (body.mainImage && body.mainImage.trim() !== "") updatePayload.mainImage = body.mainImage;
    
    // 🎯 SEO फ़ील्ड्स सेफगार्ड: अगर फ्रंटएंड से खाली स्ट्रिंग आए तो पुराना डेटा रिटेन (Keep) करें
    if (body.metaTitle && body.metaTitle.trim() !== "") updatePayload.metaTitle = body.metaTitle;
    if (body.metaDesc && body.metaDesc.trim() !== "") updatePayload.metaDesc = body.metaDesc;
    if (body.keywords && body.keywords.trim() !== "") updatePayload.keywords = body.keywords;
    if (body.tags && body.tags.trim() !== "") updatePayload.tags = body.tags;

    // बूलीयन और एरे कंट्रोल्स
    if (body.isPublished !== undefined) updatePayload.isPublished = body.isPublished;
    if (body.showAds !== undefined) updatePayload.showAds = body.showAds;
    if (body.relatedPartners) updatePayload.relatedPartners = body.relatedPartners;
    if (body.categoryId) updatePayload.category = body.categoryId;

    const queryCondition = Types.ObjectId.isValid(incomingSlug)
      ? { _id: incomingSlug }
      : { slug: incomingSlug };

    // 🚀 $set के साथ केवल चुनिंदा (बदली हुई) फ़ील्ड्स को ही अपडेट करें
    const updatedBlog = await Blog.findOneAndUpdate(
      queryCondition, 
      { $set: updatePayload }, 
      { new: true, runValidators: true }
    )
    .populate("category")
    .populate("relatedPartners");

    if (!updatedBlog) {
      return NextResponse.json({ success: false, message: "ब्लॉग नहीं मिला" }, { status: 404 });
    }

    // Redis Live Cache Wipeout
    try {
      const keys = await redis.keys("blogs:stream:*");
      if (keys.length > 0) await redis.del(...keys);
      console.log("⚡ TaxAdhaar Cache Wiped out successfully on Smart Update!");
    } catch (redisError) {
      console.error("Redis Cache clear fail on PUT:", redisError);
    }

    return NextResponse.json({ success: true, data: updatedBlog }, { status: 200 });
  } catch (error: any) {
    console.error("❌ PUT Route Crash Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 3. DELETE BLOG (DELETE)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const incomingSlug = resolvedParams.slug; 

    const queryCondition = Types.ObjectId.isValid(incomingSlug)
      ? { _id: incomingSlug }
      : { slug: incomingSlug };

    await Blog.findOneAndDelete(queryCondition);
    
    // डिलीट होने पर भी कैशे साफ़ करें
    try {
      const keys = await redis.keys("blogs:stream:*");
      if (keys.length > 0) await redis.del(...keys);
    } catch (e) {}

    return NextResponse.json({ success: true, message: "News deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}