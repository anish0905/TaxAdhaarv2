import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/db";
import { ToolkitProduct } from "@/models/Toolkit";
import { redis, TOOLKIT_CACHE_KEY } from "@/lib/redis";

// ==========================================
// 💡 1. UPDATE PRODUCT BY ID (PUT)
// ==========================================
export async function PUT(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params; 
    const body = await req.json();

    // 🔍 पुरानी स्टेट चेक करो ताकि पुराने स्लग का कैशे भी साफ़ किया जा सके
    const oldProduct = await ToolkitProduct.findById(id);
    if (!oldProduct) {
      return NextResponse.json({ error: "Product protocol not found" }, { status: 404 });
    }

    // ⚙️ AUTOMATED SLUG ENFORCEMENT ON UPDATE
    // अगर बॉडी में नया स्लग भेजा है या टाइटल बदला है, तो स्लग को री-फॉर्मेट और यूआरएल-सेफ करो भाई
    if (body.slug) {
      body.slug = body.slug.toLowerCase().trim();
    } else if (body.title && body.title !== oldProduct.title) {
      body.slug = body.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    const updatedProduct = await ToolkitProduct.findByIdAndUpdate(id, body, {
      new: true, // अपडेटेड डेटा रिटर्न करने के लिए मस्ट है
      runValidators: true,
    });

    // 🔥 DOUBLE-LAYER CACHE INVALIDATION PIPELINE
    if (redis && typeof redis.del === "function") {
      try {
        // 1. पूरी टूलकिट लिस्ट का मुख्य कैशे क्लियर करो
        await redis.del(TOOLKIT_CACHE_KEY);

        // 2. पुराने स्लग का डायनेमिक पेज कैशे साफ़ करो
        await redis.del(`toolkit:product:${oldProduct.slug}`);

        // 3. अगर स्लग बदल गया है, तो नए स्लग का कैशे नोड भी फ्लश मार दो सेफ़ साइड के लिए
        if (updatedProduct && updatedProduct.slug !== oldProduct.slug) {
          await redis.del(`toolkit:product:${updatedProduct.slug}`);
        }
        console.log(`⚡ Core List & Dynamic [slug] Cache nodes cleared seamlessly.`);
      } catch (redisError) {
        console.error("Redis Invalidation Failure Node:", redisError);
        // नोट: कैशे फेल होने पर भी एपीआई रिस्पॉन्स रुकना नहीं चाहिए, इसलिए इसे ट्रैप कर लिया भाई
      }
    }

    return NextResponse.json({ success: true, data: updatedProduct }, { status: 200 });
  } catch (error: any) {
    console.error("PUT Toolkit Product Error:", error);
    if (error.code === 11000) {
      return NextResponse.json({ error: "Slug conflict! Another matrix node is already using this URL." }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// ==========================================
// 💡 2. DELETE PRODUCT BY ID (DELETE)
// ==========================================
export async function DELETE(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params; 

    // 🔍 डिलीट करने से पहले उसका स्लग निकाल लो ताकि कैशे लीक न हो
    const productToDelete = await ToolkitProduct.findById(id);
    if (!productToDelete) {
      return NextResponse.json({ error: "Product protocol not found" }, { status: 404 });
    }

    await ToolkitProduct.findByIdAndDelete(id);

    // 🔥 DOUBLE-LAYER CACHE INVALIDATION PIPELINE
    if (redis && typeof redis.del === "function") {
      try {
        // 1. पूरी टूलकिट लिस्ट का मुख्य कैशे उड़ाओ
        await redis.del(TOOLKIT_CACHE_KEY);

        // 2. इस डिलीट हुए प्रोडक्ट के व्यक्तिगत डायनेमिक पेज का कैशे नोड भी फ्लश करो
        await redis.del(`toolkit:product:${productToDelete.slug}`);
        console.log(`🗑️ Product Matrix and dynamic node '${productToDelete.slug}' completely flushed from Redis.`);
      } catch (redisError) {
        console.error("Redis Delete Invalidation Failure Node:", redisError);
      }
    }

    return NextResponse.json({ success: true, message: "Product flushed from core matrix" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE Toolkit Product Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}