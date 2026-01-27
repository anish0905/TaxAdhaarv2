import { NextResponse } from "next/server";
import crypto from "crypto";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import dbConnect from "@/lib/db";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await req.json();

    // 1. HMAC Signature Verification
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ verified: false }, { status: 400 });
    }

    // 2. Atomic Database Updates
    const order = await Order.findById(orderId);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // Idempotency: Do not process if already paid
    if (order.paymentStatus !== "paid") {
      const walletUsed = order.billing.walletDiscountApplied || 0;

      // Deduct from User Wallet if discount was used
      if (walletUsed > 0) {
        await User.findByIdAndUpdate(order.clientId, {
          $inc: { balance: -walletUsed }
        });
      }

      // Update Order Status
      order.paymentStatus = "paid";
      order.status = "processing"; // Move to processing stage
      order.paymentDate = new Date();
      order.razorpayPaymentId = razorpay_payment_id;
      
      await order.save();
    }

    return NextResponse.json({ verified: true });

  } catch (error: any) {
    console.error("❌ Verification Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}