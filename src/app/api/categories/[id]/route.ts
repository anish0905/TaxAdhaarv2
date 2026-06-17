import { NextResponse } from "next/server";
import connectDB from "@/lib/db"; 
import { Category } from "@/models/blogs"; 
import { Redis } from "@upstash/redis"; 

// Redis क्लाइंट इनिशियलाइज़ेशन
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

// ==========================================
// ⚙️ 1. PUT ROUTE - UPDATE CATEGORY MATRIX
// ==========================================
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // 👈 यहाँ इसके टाइप को Promise बता दिया
) {
  try {
    // 🎯 फिक्स: params को डिस्ट्रक्चर करने से पहले await करना ज़रूरी है भाई
    const { id } = await params; 
    const body = await request.json();
    const { name, slug, description, images } = body;

    await connectDB();

    // डेटाबेस में कैटेगरी को अपडेट करो
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, slug, description, images },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return NextResponse.json(
        { message: "Category node not found in core registry!" },
        { status: 404 }
      );
    }

    // 🚀 REDIS RE-VALIDATION PIPELINE (कैश क्लियर करो भाई)
    try {
      await redis.del("store:categories");
      await redis.del("store:products"); 
      console.log("⚡ Redis cache node successfully re-validated.");
    } catch (redisErr) {
      console.error("Redis Cache Invalidation Failed:", redisErr);
    }

    return NextResponse.json(
      { message: "Category matrix successfully updated!", data: updatedCategory },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("PUT Category Error:", err);
    return NextResponse.json(
      { message: "Internal Server Error", error: err.message },
      { status: 500 }
    );
  }
}

// ==========================================
// 🗑️ 2. DELETE ROUTE - FLUSH CATEGORY NODE
// ==========================================
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // 👈 यहाँ भी Promise टाइप सेट किया
) {
  try {
    // 🎯 फिक्स: यहाँ भी params को await कर लो
    const { id } = await params; 

    await connectDB();  

    // कैटेगरी को मंगोडीबी से उड़ाओ
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return NextResponse.json(
        { message: "Category node already flushed or missing!" },
        { status: 404 }
      );
    }

    // 🚀 REDIS FLUSH OPERATIONS
    try {
      await redis.del("store:categories");
      await redis.del("store:products");
      console.log("🗑️ Redis cache node flushed successfully.");
    } catch (redisErr) {
      console.error("Redis Purge Failure:", redisErr);
    }

    return NextResponse.json(
      { message: "Category successfully cleared from ecosystem registry!" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("DELETE Category Error:", err);
    return NextResponse.json(
      { message: "Internal Server Error", error: err.message },
      { status: 500 }
    );
  }
}