"use server"
import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { revalidatePath } from "next/cache";

/**
 * USER SIDE: Manual Screenshot URL save karne ke liye
 * Isse user ka order 'Verification Pending' mode mein chala jata hai.
 */
export async function submitManualPayment(orderId: string, screenshotUrl: string) {
  try {
    if (!orderId || !screenshotUrl) {
      return { success: false, error: "Missing required fields" };
    }

    await connectDB();

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: "verification_pending",
        manualPaymentScreenshot: screenshotUrl, // Cloudinary URL store ho raha hai
      },
      { new: true }
    );

    if (!updatedOrder) {
      return { success: false, error: "Order not found" };
    }

    revalidatePath(`/dashboard/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    console.error("Manual Payment Submit Error:", error);
    return { success: false, error: "Database update failed" };
  }
}

/**
 * ADMIN SIDE: Payment verify karke order activate karne ke liye
 */
export async function verifyPaymentAction(formData: FormData) {
  try {
    const orderId = formData.get("orderId");
    if (!orderId) throw new Error("Order ID is required");

    await connectDB();

    // 1. Pehle Order fetch karein taaki humein Client ki details mil sakein
    const order = await Order.findById(orderId).populate("clientId");
    if (!order) throw new Error("Order not found");

    // 2. Order update karein (Payment Success)
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "paid",
      status: "under_review",
      "billing.paymentDate": new Date()
    });

    // 3. REFERRAL LOGIC: Pending to Balance move karna
    // Hum client ke data se uske referrer (Anish) ko dhundenge
    const client = order.clientId; // Client object from populate

    if (client && client.referredBy) {
      const User = (await import("@/models/User")).User; // Dynamic import if needed

      // Wo user dhundiye jiska referralCode client ke referredBy se match karta ho
      const referrer = await User.findOne({ referralCode: client.referredBy });

      if (referrer && referrer.referralEarnings.pending > 0) {
        const commissionToMove = 200; // Ya fir dynamic amount jo aapne set kiya ho

        await User.findOneAndUpdate(
          { referralCode: client.referredBy },
          {
            $inc: {
              "referralEarnings.balance": commissionToMove,
              "referralEarnings.pending": -commissionToMove,
              "referralEarnings.totalCommissionEarned": commissionToMove
            }
          }
        );
        console.log(`Referral commission moved for ${referrer.name}`);
      }
    }

    revalidatePath("/admin/dashboard/admin/payments");
    revalidatePath(`/dashboard/orders/${orderId}`);
    
    return { success: true };
  } catch (error) {
    console.error("Payment Verification Error:", error);
    return { success: false, error: "Verification failed" };
  }
}

// src/app/actions/paymentActions.ts

// ... existing actions (submitManualPayment, verifyPaymentAction)

/**
 * ADMIN SIDE: Payment reject karne ke liye
 */
export async function rejectPaymentAction(formData: FormData) {
  try {
    const orderId = formData.get("orderId");
    const reason = formData.get("reason") || "Invalid screenshot";

    if (!orderId) throw new Error("Order ID is required");

    await connectDB();

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "unpaid", // Wapas unpaid karo taaki user re-upload kar sake
      manualPaymentScreenshot: null, // Purana screenshot hata do
      "billing.remarks": `Payment Rejected: ${reason}` // User ko wajah batao
    });

    revalidatePath("/admin/dashboard/admin/payments");
    revalidatePath(`/dashboard/orders/${orderId}`);
    
    return { success: true };
  } catch (error) {
    console.error("Payment Rejection Error:", error);
    return { success: false, error: "Rejection failed" };
  }
}