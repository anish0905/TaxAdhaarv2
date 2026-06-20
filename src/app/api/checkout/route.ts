import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import connectDB from "@/lib/db";
import { DigitalAsset } from "@/models/DigitalAsset";

// क्रेडेंशियल्स के आगे-पीछे का स्पेस साफ़ करने के लिए .trim() लगा दिया भाई
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID?.trim() || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET?.trim() || "",
});

export async function POST(req: NextRequest) {
  try {
    console.log("🛰️ CHECKOUT ROUTE INITIATED...");
    await connectDB();
    
    const body = await req.json();
    const { assetId } = body;
    console.log("📥 RECEIVED ASSET ID:", assetId);

    if (!assetId) {
      return NextResponse.json({ success: false, message: "Asset ID missing in request payload" }, { status: 400 });
    }

    // 1. डेटाबेस से चेक करो भाई
    const asset = await DigitalAsset.findById(assetId);
    if (!asset) {
      console.log("❌ ASSET NOT FOUND IN DB FOR ID:", assetId);
      return NextResponse.json({ success: false, message: "Asset node not found in DB" }, { status: 404 });
    }

    console.log(`📦 FOUND ASSET: "${asset.title}" - PRICE: ₹${asset.price}`);

    // 2. रेज़रपे अमाउंट फॉर्मेटिंग
    const amountInPaise = Math.round(asset.price * 100);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${asset._id.toString().substring(0, 10)}`,
      notes: {
        assetId: asset._id.toString(),
        slug: asset.slug
      }
    };

    console.log("🎲 CREATING RAZORPAY ORDER WITH OPTIONS:", options);

    // 3. रेज़रपे पर ऑर्डर जेनरेट करो
    const order = await razorpay.orders.create(options);
    console.log("🎉 RAZORPAY ORDER CREATED SUCCESSFULLY:", order.id);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID?.trim()
    }, { status: 200 });

  } catch (error: any) {
    // यहाँ हमें टर्मिनल में असली विलेन का नाम और पता चल जाएगा भाई
    console.error("💥 CRITICAL BACKEND CHECKOUT CRASH:");
    console.error("Error Message:", error.message);
    console.error("Full Error Object:", error);

    return NextResponse.json({ 
      success: false, 
      message: "Internal Server Routine Crash", 
      error: error.message 
    }, { status: 500 });
  }
}