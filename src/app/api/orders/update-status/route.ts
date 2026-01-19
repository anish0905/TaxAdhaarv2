import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // 1. Security Check: Kya user logged in hai?
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { orderId, razorpay_payment_id, status, paymentStatus } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    await connectDB();

    // 2. Database Update
    // Hum status ko 'completed' aur paymentStatus ko 'paid' kar rahe hain
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: {
          status: status || "completed",
          paymentStatus: paymentStatus || "paid",
          razorpayPaymentId: razorpay_payment_id, // Record ke liye save karein
          updatedAt: new Date(),
        },
      },
      { new: true } // Updated data return karne ke liye
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Order updated successfully",
      order: updatedOrder 
    });

  } catch (error: any) {
    console.error("Status Update Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}