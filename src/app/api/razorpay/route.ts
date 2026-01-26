import { NextResponse } from "next/server";
import Razorpay from "razorpay";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, orderId } = body;

    // 1. Validation
    if (!amount || !orderId) {
      return NextResponse.json({ error: "Missing amount or orderId" }, { status: 400 });
    }

    // 2. Clean Order ID (Removing MongoDB $oid if present)
    const cleanOrderId = typeof orderId === "object" ? String(orderId) : orderId;

    const options = {
      amount: Math.round(Number(amount) * 100), // Convert to Paise and ensure Integer
      currency: "INR",
      receipt: `rcpt_${cleanOrderId}`.slice(0, 40), // Standard format
      payment_capture: 1, // Auto-capture payment
      notes: {
        platform: "TaxAdhaar",
        order_reference: cleanOrderId,
      },
    };

    console.log("🚀 Creating Razorpay Order:", options);

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error("❌ Razorpay Order Error:", error);
    return NextResponse.json(
      { error: error.description || "Internal Server Error" },
      { status: 500 }
    );
  }
}