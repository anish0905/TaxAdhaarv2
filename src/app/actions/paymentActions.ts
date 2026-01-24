"use server"
import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { revalidatePath } from "next/cache";
import { User } from "@/models/User"; // <--- YEH LINE MISSING HAI YA GALAT HAI
import { CommissionLog } from "@/models/CommissionLog";

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

// paymentActions.ts (Server Action File)

// src/app/actions/paymentActions.ts

export async function verifyPaymentAction(formData: FormData) {
  try {
    const orderId = formData.get("orderId");
    console.log("Processing Order ID:", orderId);

    await connectDB();

    // 1. Order Fetch WITH Client details
    const order = await Order.findById(orderId).populate("clientId");
    
    if (!order) {
      console.log("Order not found in DB");
      return { success: false, error: "Order not found" };
    }

    console.log("Client Found:", order.clientId?.name);
    console.log("Referred By:", order.clientId?.referredBy);

    const serviceCharge = order.billing?.serviceCharge || 0;
    const client = order.clientId;

    // 2. Status Update
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "paid",
      status: "under_review",
      "billing.paymentDate": new Date()
    });

    // 3. COMMISSION FLOW
    if (client && client.referredBy && client.referredBy !== "N/A") {
      const refCode = client.referredBy.toUpperCase().trim();
      
      // Direct Agent (BANKU)
      const banku = await User.findOne({ referralCode: refCode });

      if (banku) {
        console.log("Agent L1 Found:", banku.name);
        
        if (banku.role === "field_marketing") {
          const commL1 = (serviceCharge * 5) / 100;
          await processCommission(banku._id, orderId, commL1, 5, "direct", order.serviceType, client.name);

          // Parent Agent (ANKU)
          if (banku.referredBy && banku.referredBy !== "N/A") {
            const anku = await User.findOne({ 
              referralCode: banku.referredBy.toUpperCase().trim(),
              role: "field_marketing" 
            });

            if (anku) {
              console.log("Agent L2 Found:", anku.name);
              const commL2 = (serviceCharge * 3) / 100;
              await processCommission(anku._id, orderId, commL2, 3, "level_2", order.serviceType, client.name);
            }
          }
        } else if (banku.role === "client") {
          console.log("Normal Client Referral detected");
          await processCommission(banku._id, orderId, 200, 0, "direct", order.serviceType, client.name);
        }
      } else {
        console.log("Referrer Agent not found in Users collection for code:", refCode);
      }
    }

    revalidatePath("/admin/dashboard/admin/payments");
    return { success: true };

  } catch (error: any) {
    console.error("CRITICAL ERROR in verifyPaymentAction:", error.message);
    return { success: false, error: error.message };
  }
}

async function processCommission(userId: any, orderId: any, amount: number, pct: number, level: string, service: string, fromUser: string) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    // Log Creation
    await CommissionLog.create({
      userId,
      fromOrderId: orderId,
      fromUserName: fromUser,
      amount,
      percentage: pct,
      level,
      serviceType: service
    });

    // Wallet Update
    const currentPending = user.referralEarnings?.pending || 0;
    const deduction = currentPending >= amount ? -amount : -currentPending;

    await User.findByIdAndUpdate(userId, {
      $inc: {
        "referralEarnings.balance": amount,
        "referralEarnings.totalCommissionEarned": amount,
        "referralEarnings.pending": deduction
      }
    });
    console.log(`Commission of ₹${amount} successfully sent to ${user.name}`);
  } catch (err) {
    console.error("Error in processCommission helper:", err);
  }
}


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


// export async function requestPayoutAction(formData: FormData) {
//   const session = await getServerSession(authOptions);
//   if (!session) return { success: false };

//   const amount = Number(formData.get("amount"));
//   const upiId = formData.get("upiId");

//   await connectDB();

//   // Create withdrawal request
//   await Withdrawal.create({
//     userId: session.user.id,
//     amount,
//     upiId,
//     status: 'pending'
//   });

//   // Deduct from balance immediately so they can't request again
//   await User.findByIdAndUpdate(session.user.id, {
//     $inc: { "referralEarnings.balance": -amount }
//   });

//   revalidatePath("/dashboard/marketing");
//   return { success: true };
// }