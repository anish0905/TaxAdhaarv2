// app/api/toolkit/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db"; 
import { ToolkitProduct } from "@/models/Toolkit";
import { redis } from "@/lib/redis"; // 👈 तुम्हारा सही पाथ

export const TOOLKIT_CACHE_KEY = "toolkit:products:all";

export async function GET() {
  try {
    await connectDB();

    let cachedData = null;
    
    // 🛡️ REDIS SAFETY LAYER: अगर कैशे कनेक्शन फेल भी हो, तो डेटाबेस से डेटा आ जाए
    try {
      cachedData = await redis.get(TOOLKIT_CACHE_KEY);
    } catch (redisError) {
      console.error("Redis Get Error Node:", redisError);
    }
    
    if (cachedData) {
      const responseData = typeof cachedData === "string" ? JSON.parse(cachedData) : cachedData;
      
      return NextResponse.json(responseData, {
        status: 200,
        headers: { "X-Cache": "HIT" },
      });
    }

    // Cache MISS: MongoDB से फ्रेश और इंडेक्स्ड डेटा लाओ
    const products = await ToolkitProduct.find({ isActive: true })
      .populate("category", "name slug")
      .sort({ displayOrder: 1 });

    // 🛡️ REDIS SET SAFETY LAYER
    try {
      await redis.set(TOOLKIT_CACHE_KEY, JSON.stringify(products), { ex: 3600 });
    } catch (redisError) {
      console.error("Redis Set Error Node:", redisError);
    }

    return NextResponse.json(products, {
      status: 200,
      headers: { "X-Cache": "MISS" },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error encounters!" }, { status: 500 });
  }
}
// 💡 2. CREATE NEW PRODUCT (Upstash Cache Invalidation)


export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // ⚙️ AUTOMATED SLUG & DATA CLEANING CONTEXT
    // अगर एडमिन पैनल से स्लग नहीं आया है या खाली है, तो टाइटल से ऑटोमैटिक जनरेट मारो
    if (!body.slug && body.title) {
      body.slug = body.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "") // स्पेशल कैरेक्टर्स साफ करो
        .replace(/[\s_-]+/g, "-") // स्पेस और अंडरस्कोर को हाइफन में बदलो
        .replace(/^-+|-+$/g, ""); // शुरुआत और आखिर के हाइफन हटाओ
    } else if (body.slug) {
      // अगर स्लग भेजा भी है, तो यूआरएल सेफ्टी के लिए उसे लोअरकेस और ट्रिम कर दो
      body.slug = body.slug.toLowerCase().trim();
    }

    // 🚀 DATABASE INSERTION MATRIX
    const newProduct = await ToolkitProduct.create(body);

    // 🔥 CACHE INVALIDATION PIPELINE
    // 1. पूरी टूलकिट लिस्ट का मुख्य कैश डिलीट मारो (Upstash Del Line)
    await redis.del(TOOLKIT_CACHE_KEY);
    
    // 2. भविष्य के लिए सेफ़ साइड: इस स्पेसिफिक प्रोडक्ट के डायनेमिक पेज का कैश भी क्लियर रखो
    await redis.del(`toolkit:product:${newProduct.slug}`);

    return NextResponse.json(
      { success: true, message: "Matrix node deployed successfully!", data: newProduct }, 
      { status: 201 }
    );
  } catch (error: any) {
    // मोंगोज़ डुप्लिकेट की एरर (code 11000) को पकड़ने के लिए ताकि पता चले स्लग पहले से मौजूद है
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Slug conflict! This product URL already exists in the matrix node." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Internal system validation error encounters!" }, 
      { status: 400 }
    );
  }
}