import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const REFERRAL_REWARDS: { [key: string]: number } = {
  "gst-registration": 200,
  "msme-registration": 100,
  "trademark-filing": 300,
  "company-incorporation": 500,
  "iec-registration": 150,
  "default": 100 
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    // Frontend se 'walletUsed' bhi receive karein
    const { orderId, razorpay_payment_id, status, paymentStatus, walletUsed } = body;

    await connectDB();

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: {
          status: status || "processing", 
          paymentStatus: paymentStatus || "paid",
          razorpayPaymentId: razorpay_payment_id,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!updatedOrder) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    if (paymentStatus === "paid") {
      const currentUser = await User.findById(updatedOrder.clientId);

      if (currentUser) {
        // --- 1. WALLET DEDUCTION LOGIC ---
        // Agar user ne apna balance use kiya hai, toh uske account se kaat lein
        if (walletUsed && walletUsed > 0) {
          await User.findByIdAndUpdate(currentUser._id, {
            $inc: { "referralEarnings.balance": -walletUsed }
          });
        }

        // --- 2. REFERRAL CONVERSION LOGIC ---
        if (currentUser.referredBy) {
          const paidOrdersCount = await Order.countDocuments({
            clientId: currentUser._id,
            paymentStatus: "paid"
          });

          // Reward sirf pehle paid order par milna chahiye
          if (paidOrdersCount === 1) {
            const serviceType = updatedOrder.serviceType; 
            const rewardAmount = REFERRAL_REWARDS[serviceType] || REFERRAL_REWARDS["default"];
            const signupPendingAmount = 100; // Jo signup par mila tha

            await User.findOneAndUpdate(
              { referralCode: currentUser.referredBy.trim() },
              {
                $inc: {
                  "referralEarnings.pending": -signupPendingAmount, 
                  "referralEarnings.balance": rewardAmount 
                }
              }
            );
          }
        }
      }
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    console.error("Update Status Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}