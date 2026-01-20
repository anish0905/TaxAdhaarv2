"use server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { Order } from "@/models/Order";
import { revalidatePath } from "next/cache";

export async function activateReferralBonus(orderId: string) {
  try {
    await connectDB();

    // 1. Order aur Client ki details nikalna
    const order = await Order.findById(orderId);
    if (!order) return { error: "Order not found" };

    // Check karein kya status 'paid' hai
    if (order.paymentStatus !== "paid") {
      return { error: "Payment not verified yet." };
    }

    const client = await User.findById(order.clientId);
    if (!client || !client.referredBy) {
      return { success: "No referrer found for this client." };
    }

    // 2. Count paid orders
    const paidOrdersCount = await Order.countDocuments({ 
      clientId: client._id, 
      paymentStatus: "paid" 
    });

    // Hum count 1 isliye check kar rahe hain taaki bonus sirf pehle payment par mile
    if (paidOrdersCount === 1) {
      const referrerCode = client.referredBy.trim();

      // 3. Referrer ko dhoond kar update karein
      const referrerUpdate = await User.findOneAndUpdate(
        { referralCode: referrerCode },
        { 
          $inc: { 
            "referralEarnings.pending": -100, 
            "referralEarnings.balance": 100 
          } 
        },
        { new: true }
      );

      if (referrerUpdate) {
        console.log(`✅ Bonus Moved for Referrer: ${referrerCode}`);
        revalidatePath("/dashboard");
        return { success: "Bonus successfully activated!" };
      } else {
        return { error: `Referrer code ${referrerCode} not found in database.` };
      }
    }

    return { success: "Bonus already processed for a previous order." };
  } catch (error: any) {
    console.error("CRITICAL_REFERRAL_ERROR:", error);
    return { error: error.message };
  }
}