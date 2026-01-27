import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { Order } from "@/models/Order"; 
import { User } from "@/models/User";
import dbConnect from "@/lib/db";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { orderId, useWallet } = await req.json();

    // 1. Fetch real order from DB
    const dbOrder = await Order.findById(orderId);
    if (!dbOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 2. Amount Calculation (Sync with Frontend Logic)
    let finalAmount = dbOrder.billing.totalAmount;
    let discountToApply = 0;

    if (useWallet) {
      // Fetch user to check real balance
      const user = await User.findById(dbOrder.clientId);
      if (user && user.balance > 0) {
        // ₹200 ka cap lagaya hai jaisa frontend mein hai
        discountToApply = Math.min(user.balance, 200); 
        // Ensure amount doesn't go below 0
        discountToApply = Math.min(discountToApply, finalAmount);
        finalAmount = finalAmount - discountToApply;
      }
    }

    // Razorpay 0 amount allow nahi karta
    if (finalAmount <= 0) {
      return NextResponse.json({ error: "Amount must be greater than 0" }, { status: 400 });
    }

    const options = {
      amount: Math.round(finalAmount * 100), // Convert to Paise
      currency: "INR",
      receipt: `rcpt_${orderId}`.slice(0, 40),
      notes: { mongoOrderId: orderId },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // 3. Track discount and save Razorpay ID
    dbOrder.razorpayOrderId = razorpayOrder.id;
    // Schema mein 'walletDiscountApplied' field hona zaroori hai
    dbOrder.billing.walletDiscountApplied = discountToApply; 
    await dbOrder.save();

    return NextResponse.json(razorpayOrder);
  } catch (error: any) {
    console.error("❌ Razorpay Create Error:", error);
    return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
  }
}