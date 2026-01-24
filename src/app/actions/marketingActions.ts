"use server"

import connectDB from "@/lib/db";
import { Withdrawal } from "@/models/Withdrawal";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

/**
 * Agent dwara Withdrawal (Payout) request bhejne ke liye
 */
export async function requestPayoutAction(formData: FormData) {
  try {
    // 1. Check if user is logged in
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access" };
    }

    const userId = session.user.id;
    const amount = Number(formData.get("amount"));
    const upiId = formData.get("upiId");

    // Validation
    if (amount < 500) {
      return { success: false, error: "Minimum withdrawal is ₹500" };
    }

    await connectDB();

    // 2. User ka current balance check karein
    const user = await User.findById(userId);
    if (!user || user.referralEarnings.balance < amount) {
      return { success: false, error: "Insufficient balance in wallet" };
    }

    // 3. Withdrawal Request Create karein (Status: Pending)
    await Withdrawal.create({
      userId,
      amount,
      upiId,
      status: 'pending'
    });

    // 4. Balance ko turant DEDUCT karein taaki double request na ho sake
    // Agar Admin reject karega, toh hum isse wapas add kar denge
    await User.findByIdAndUpdate(userId, {
      $inc: { "referralEarnings.balance": -amount }
    });

    // 5. Dashboard refresh karein taaki naya balance dikhe
    revalidatePath("/dashboard/marketing");
    
    return { success: true };

  } catch (error: any) {
    console.error("Payout Request Error:", error);
    return { success: false, error: "Something went wrong" };
  }
}