import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/db";
import { ToolkitProduct } from "@/models/Toolkit";
import { redis, TOOLKIT_CACHE_KEY } from "@/lib/redis";

// ==========================================
// 💡 1. UPDATE PRODUCT BY ID (PUT)
// ==========================================
export async function PUT(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> } // 🎯 फ़िक्स: TypeScript टाइप को Promise घोषित किया
) {
  try {
    await connectDB();
    
    // 🎯 फ़िक्स: Next.js 15/16 के अनुसार डिस्ट्रक्चर करने से पहले await करना ज़रूरी है
    const { id } = await params; 
    const body = await req.json();

    const updatedProduct = await ToolkitProduct.findByIdAndUpdate(id, body, {
      new: true, // अपडेटेड डेटा रिटर्न करने के लिए
      runValidators: true,
    });

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product protocol not found" }, { status: 404 });
    }

    // 🔥 CACHE INVALIDATION: डेटा बदलते ही Redis कैशे साफ़ करो
    if (redis && typeof redis.del === "function") {
      await redis.del(TOOLKIT_CACHE_KEY);
      console.log(`⚡ Redis cache key '${TOOLKIT_CACHE_KEY}' cleared.`);
    }

    return NextResponse.json({ success: true, data: updatedProduct }, { status: 200 });
  } catch (error: any) {
    console.error("PUT Toolkit Product Error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// ==========================================
// 💡 2. DELETE PRODUCT BY ID (DELETE)
// ==========================================
export async function DELETE(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> } // 🎯 फ़िक्स: यहाँ भी टाइप को Promise किया
) {
  try {
    await connectDB();
    
    // 🎯 फ़िक्स: यहाँ भी params को पहले await कर लो भाई
    const { id } = await params; 

    const deletedProduct = await ToolkitProduct.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product protocol not found" }, { status: 404 });
    }

    // 🔥 CACHE INVALIDATION: डिलीट होते ही कैशे क्लियर करो
    if (redis && typeof redis.del === "function") {
      await redis.del(TOOLKIT_CACHE_KEY);
      console.log(`🗑️ Redis cache key '${TOOLKIT_CACHE_KEY}' flushed.`);
    }

    return NextResponse.json({ success: true, message: "Product flushed from core matrix" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE Toolkit Product Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}