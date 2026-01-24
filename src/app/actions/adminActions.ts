"use server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { Order } from "@/models/Order";
import { Withdrawal } from "@/models/Withdrawal";

import { revalidatePath } from "next/cache";

export async function getClients(page: number = 1, limit: number = 8) {
  try {
    await connectDB();
    const skip = (page - 1) * limit;

    // Yahan humne role: "client" kiya hai aapke data ke hisaab se
    const clients = await User.find({ role: "client" }) 
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalClients = await User.countDocuments({ role: "client" });

    return {
      success: true,
      clients: JSON.parse(JSON.stringify(clients)), // MongoDB object ko plain stringify karna zaroori hai
      totalPages: Math.ceil(totalClients / limit),
      currentPage: page
    };
  } catch (error: any) {
    console.error("Fetch Error:", error);
    return { success: false, error: error.message };
  }
}




export async function getClientDetails(clientId: string) {
  try {
    await connectDB();
    
    // 1. Client find karein
    const client = await User.findById(clientId).lean();
    if (!client) return { success: false, error: "Client not found" };

    // 2. Us client ke orders dhoondein (using email/phone match)
    const orders = await Order.find({ clientPhone: client.email })
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      client: JSON.parse(JSON.stringify(client)),
      orders: JSON.parse(JSON.stringify(orders))
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}





// 1. Approve Payout (Status 'approved' karke finalize karna)
export async function approvePayoutAction(formData: FormData) {
  const reqId = formData.get("reqId");
  await connectDB();
  
  await Withdrawal.findByIdAndUpdate(reqId, { status: "approved" });
  
  revalidatePath("/admin/dashboard/admin/withdrawals");
  return { success: true };
}

// 2. Reject Payout (Paisa wapas balance mein bhej dena)
export async function rejectPayoutAction(formData: FormData) {
  const reqId = formData.get("reqId");
  await connectDB();
  
  const request = await Withdrawal.findById(reqId);
  if (request) {
    // Paisa Agent ke balance mein wapas refund karein
    await User.findByIdAndUpdate(request.userId, {
      $inc: { "referralEarnings.balance": request.amount }
    });
    
    // Request status update
    await Withdrawal.findByIdAndUpdate(reqId, { 
      status: "rejected",
      adminRemarks: "Invalid UPI or verification failed"
    });
  }

  revalidatePath("/admin/dashboard/admin/withdrawals");
  return { success: true };
}