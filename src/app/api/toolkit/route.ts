// app/api/toolkit/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db"; 
import { ToolkitProduct } from "@/models/Toolkit";
import { redis } from "@/lib/redis"; // 👈 तुम्हारा सही पाथ

export const TOOLKIT_CACHE_KEY = "toolkit:products:all";

// 💡 1. GET ALL PRODUCTS (Upstash HTTP REST Cached)
export async function GET() {
  try {
    await connectDB();

    // Upstash REST API से कैशे डेटा गेट करो
    const cachedData = await redis.get(TOOLKIT_CACHE_KEY);
    
    if (cachedData) {
      // Upstash कई बार ऑटोमैटिकली JSON पार्स करके ऑब्जेक्ट लौटाता है, 
      // इसलिए चेक कर लेते हैं कि डेटा स्ट्रिंग है या पहले से ही ऑब्जेक्ट है।
      const responseData = typeof cachedData === "string" ? JSON.parse(cachedData) : cachedData;
      
      return NextResponse.json(responseData, {
        status: 200,
        headers: { "X-Cache": "HIT" },
      });
    }

    // Cache MISS: MongoDB से फ्रेश डेटा लाओ
    const products = await ToolkitProduct.find({ isActive: true })
      .populate("category", "name slug")
      .sort({ displayOrder: 1 });

    // 🔥 UPSTASH SET SYNTAX FIX: यहाँ "EX", 3600 की जगह { ex: 3600 } ऑब्जेक्ट पास होता है
    await redis.set(TOOLKIT_CACHE_KEY, JSON.stringify(products), { ex: 3600 });

    return NextResponse.json(products, {
      status: 200,
      headers: { "X-Cache": "MISS" },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 💡 2. CREATE NEW PRODUCT (Upstash Cache Invalidation)
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const newProduct = await ToolkitProduct.create(body);

    // 🔥 UPSTASH DEL SYNTAX FIX: यह सीधे की (Key) को डिलीट मार देगा
    await redis.del(TOOLKIT_CACHE_KEY);

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}